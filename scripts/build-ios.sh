#!/usr/bin/env bash
# Köyden Şehre: iOS derleme ve TestFlight yükleme. Workflow sadece bu betiği çalıştırır;
# derleme adımlarında değişiklik gerekirse yalnızca bu dosya güncellenir.
set -euo pipefail
TEAM_ID=Z5ZU32M6W4
ASC_KEY_ID=5YXHN38GN5
ASC_ISSUER_ID=ab9b64ae-e251-4e02-b25f-e51f11fccc2d
BUILD_NUMBER="${BUILD_NUMBER:-1}"
TMP="${RUNNER_TEMP:-/tmp}"

echo "::group::Xcode 26 seç (App Store iOS 26 SDK istiyor)"
XC=$(ls -d /Applications/Xcode_26*.app 2>/dev/null | sort -V | tail -1 || true)
if [ -z "$XC" ]; then
  echo "Bu sunucuda Xcode 26 yok. Kurulu olanlar:"; ls -d /Applications/Xcode*.app || true
  echo "::error::Xcode 26 bulunamadı. Workflow'da 'runs-on: macos-15' yerine 'runs-on: macos-26' yaz."
  exit 1
fi
sudo xcode-select -s "$XC/Contents/Developer"
xcodebuild -version
xcrun --sdk iphoneos --show-sdk-version
echo "::endgroup::"

echo "::group::Oyun dosyası"
mkdir -p www
test -f index.html || { echo "index.html bulunamadı: oyun dosyasını reponun ana dizinine yükle"; exit 1; }
cp index.html www/index.html
echo "::endgroup::"

echo "::group::Paketler"
npm install --no-audit --no-fund
python3 -m pip install --quiet --break-system-packages pillow 2>/dev/null || python3 -m pip install --quiet --user pillow
echo "::endgroup::"

echo "::group::İkon ve açılış görselleri"
python3 scripts/make-assets.py
echo "::endgroup::"

echo "::group::iOS projesi (Swift Package Manager)"
rm -rf ios
# Capacitor SPM şablonunda Podfile yok; CLI yine de 'pod install' denemeye çalışıp hata verebiliyor.
# Proje dosyaları bu hatadan önce oluştuğu için hatayı yok sayıyoruz ve sonucu kontrol ediyoruz.
npx cap add ios --packagemanager SPM || echo "(pod install uyarısı yok sayıldı)"
test -d ios/App/App.xcodeproj || { echo "Xcode projesi oluşmadı"; exit 1; }
ls ios/App
npx cap copy ios
npx @capacitor/assets generate --ios --iconBackgroundColor "#f0a050" --splashBackgroundColor "#f0a050"
echo "::endgroup::"

echo "::group::Info.plist"
P=ios/App/App/Info.plist
/usr/libexec/PlistBuddy -c "Delete :UISupportedInterfaceOrientations" "$P" || true
/usr/libexec/PlistBuddy -c "Add :UISupportedInterfaceOrientations array" "$P"
/usr/libexec/PlistBuddy -c "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait" "$P"
/usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$P" || /usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" "$P"
echo "::endgroup::"

echo "::group::App Store Connect anahtarı"
mkdir -p "$TMP/keys"
KEYFILE="$TMP/keys/AuthKey_${ASC_KEY_ID}.p8"
node scripts/decrypt-key.js > "$KEYFILE"
trap 'rm -rf "$TMP/keys"' EXIT
echo "::endgroup::"

AUTH=(-allowProvisioningUpdates -authenticationKeyPath "$KEYFILE" -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID")

echo "::group::Arşivle"
cd ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$TMP/App.xcarchive" archive \
  DEVELOPMENT_TEAM="$TEAM_ID" CODE_SIGN_STYLE=Automatic \
  MARKETING_VERSION=1.0 CURRENT_PROJECT_VERSION="$BUILD_NUMBER" \
  "${AUTH[@]}"
echo "::endgroup::"

echo "::group::TestFlight'a yükle"
cat > "$TMP/export.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>upload</string>
  <key>teamID</key><string>${TEAM_ID}</string>
  <key>signingStyle</key><string>automatic</string>
</dict></plist>
PLIST
xcodebuild -exportArchive -archivePath "$TMP/App.xcarchive" \
  -exportOptionsPlist "$TMP/export.plist" -exportPath "$TMP/export" "${AUTH[@]}"
echo "::endgroup::"
echo "✅ TestFlight'a gönderildi (build $BUILD_NUMBER)"
