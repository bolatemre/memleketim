#!/usr/bin/env bash
# Köyden Şehre: Google Play için imzalı AAB ve telefona kurulabilen APK üretir. Çıktı: dist/
set -euo pipefail
BUILD_NUMBER="${BUILD_NUMBER:-1}"
TMP="${RUNNER_TEMP:-/tmp}"

echo "::group::Oyun dosyası ve paketler"
mkdir -p www
test -f index.html || { echo "index.html bulunamadı"; exit 1; }
cp index.html www/index.html
npm install --no-audit --no-fund
python3 -m pip install --quiet pillow 2>/dev/null || python3 -m pip install --quiet --user pillow || python3 -m pip install --quiet --break-system-packages pillow
python3 scripts/make-assets.py
echo "::endgroup::"

echo "::group::Android projesi"
rm -rf android
npx cap add android
npx cap copy android
npx @capacitor/assets generate --android --iconBackgroundColor "#f0a050" --splashBackgroundColor "#f0a050"
G=android/app/build.gradle
sed -i -E "s/versionCode [0-9]+/versionCode ${BUILD_NUMBER}/; s/versionName \"[^\"]*\"/versionName \"1.0.${BUILD_NUMBER}\"/" "$G"
perl -0pi -e 's/<activity(\s)/<activity android:screenOrientation="portrait"$1/' android/app/src/main/AndroidManifest.xml
# AdMob (ödüllü reklam) uygulama kimliği
source scripts/ads.env
perl -0pi -e "s#(<application[^>]*>)#\$1\n        <meta-data android:name=\"com.google.android.gms.ads.APPLICATION_ID\" android:value=\"$ADMOB_ANDROID_APP_ID\"/>#" android/app/src/main/AndroidManifest.xml
grep -n "APPLICATION_ID" android/app/src/main/AndroidManifest.xml
grep -E "versionCode|versionName" "$G"
echo "::endgroup::"

echo "::group::AAB ve APK derle"
cd android
chmod +x gradlew
./gradlew --no-daemon bundleRelease assembleRelease
echo "::endgroup::"

echo "::group::İmzala"
node ../scripts/android-key.js
source "$TMP/android.env"
AAB=app/build/outputs/bundle/release/app-release.aab
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore "$KS" -storepass "$KS_PASS" -keypass "$KS_PASS" "$AAB" "$KS_ALIAS"
jarsigner -verify "$AAB" | tail -1
mkdir -p ../dist
cp "$AAB" "../dist/koyden-sehre-${BUILD_NUMBER}.aab"
# Telefona doğrudan kurulabilen APK (aynı anahtarla imzalı)
BT=$(ls -d "${ANDROID_HOME:-$ANDROID_SDK_ROOT}"/build-tools/* | sort -V | tail -1)
APK_IN=app/build/outputs/apk/release/app-release-unsigned.apk
"$BT/zipalign" -p -f 4 "$APK_IN" "$TMP/aligned.apk"
"$BT/apksigner" sign --ks "$KS" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" --ks-key-alias "$KS_ALIAS" --out "../dist/koyden-sehre-${BUILD_NUMBER}.apk" "$TMP/aligned.apk"
"$BT/apksigner" verify "../dist/koyden-sehre-${BUILD_NUMBER}.apk" && echo "APK imzası doğrulandı"
rm -f "$KS" "$TMP/android.env"
echo "::endgroup::"
echo "✅ Hazır: dist/koyden-sehre-${BUILD_NUMBER}.aab ve .apk"
