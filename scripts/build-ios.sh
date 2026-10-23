#!/usr/bin/env bash
# Köyden Şehre: iOS derleme ve TestFlight yükleme. Workflow sadece bu betiği çalıştırır;
# derleme adımlarında değişiklik gerekirse yalnızca bu dosya güncellenir.
set -euo pipefail
TEAM_ID=Z5ZU32M6W4
ASC_KEY_ID=5YXHN38GN5
ASC_ISSUER_ID=ab9b64ae-e251-4e02-b25f-e51f11fccc2d
BUNDLE_ID=com.bolatemre.memleketim
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
npx cap add ios --packagemanager SPM || echo "(pod install uyarısı yok sayıldı)"
test -d ios/App/App.xcodeproj || { echo "Xcode projesi oluşmadı"; exit 1; }
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
KC="$TMP/build.keychain-db";KCPASS="kc$RANDOM$RANDOM"
cleanup(){ rm -rf "$TMP/keys" "$TMP/dist-key.pem" "$TMP/dist.p12"; security delete-keychain "$KC" 2>/dev/null || true; }
trap cleanup EXIT
echo "::endgroup::"

echo "::group::İmzalama (tek, kalıcı dağıtım sertifikası)"
# Her derlemede yeni sertifika üretmek Apple'ın sertifika sınırını dolduruyordu.
# Artık repodaki sabit anahtarla tek sertifika ve tek App Store profili tekrar tekrar kullanılıyor.
node scripts/signing.js
source "$TMP/signing.env"
security create-keychain -p "$KCPASS" "$KC"
security set-keychain-settings -lut 21600 "$KC"
security unlock-keychain -p "$KCPASS" "$KC"
security import "$P12" -k "$KC" -P "$P12_PASS" -A -T /usr/bin/codesign -T /usr/bin/security
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$KCPASS" "$KC" >/dev/null
security list-keychains -d user -s "$KC" $(security list-keychains -d user | tr -d '"')
security find-identity -v -p codesigning "$KC"
echo "::endgroup::"

AUTH=(-authenticationKeyPath "$KEYFILE" -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID")

echo "::group::Arşivle"
cd ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$TMP/App.xcarchive" archive \
  DEVELOPMENT_TEAM="$TEAM_ID" CODE_SIGN_STYLE=Manual \
  CODE_SIGN_IDENTITY="Apple Distribution" "CODE_SIGN_IDENTITY[sdk=iphoneos*]=Apple Distribution" \
  PROVISIONING_PROFILE_SPECIFIER="$PROFILE_NAME" PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" \
  OTHER_CODE_SIGN_FLAGS="--keychain $KC" \
  MARKETING_VERSION=1.0 CURRENT_PROJECT_VERSION="$BUILD_NUMBER"
echo "::endgroup::"

echo "::group::TestFlight'a yükle"
cat > "$TMP/export.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>upload</string>
  <key>teamID</key><string>${TEAM_ID}</string>
  <key>signingStyle</key><string>manual</string>
  <key>signingCertificate</key><string>Apple Distribution</string>
  <key>provisioningProfiles</key><dict><key>${BUNDLE_ID}</key><string>${PROFILE_NAME}</string></dict>
</dict></plist>
PLIST
xcodebuild -exportArchive -archivePath "$TMP/App.xcarchive" \
  -exportOptionsPlist "$TMP/export.plist" -exportPath "$TMP/export" "${AUTH[@]}"
echo "::endgroup::"
echo "✅ TestFlight'a gönderildi (build $BUILD_NUMBER)"
