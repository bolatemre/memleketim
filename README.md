# Köyden Şehre

Köyünü kur; kasabaya, şehre, teknoloji şehrine büyüt.

- Oyun: kökteki `index.html` (tek dosya, çevrimdışı çalışır).
- `main` dalına `index.html` her yüklendiğinde GitHub Actions iOS sürümünü derler ve **TestFlight**'a gönderir. Actions › TestFlight › *Run workflow* ile elle de başlatılabilir.
- İkon ve açılış ekranı derleme sırasında oyundaki Köy Camii görselinden üretilir.
- App Store Connect anahtarı `secrets/asc-key.enc` içinde **şifreli** durur; şifresi yalnızca `KEY_PASS` adlı GitHub Secret'tadır.
