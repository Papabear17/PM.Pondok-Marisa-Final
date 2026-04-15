@echo off
echo ===========================================
echo    PROSES BUILD APK OTOMATIS - MARISA POS
echo ===========================================

echo [1/3] Menyalin asset web ke Android...
call npx cap copy android

echo [2/3] Sinkronisasi plugin Capacitor...
call npx cap sync android

echo [3/3] Memulai proses Build APK (Gradle)...
cd android
call gradlew.bat assembleDebug

echo ===========================================
echo    PROSES SELESAI!
echo    File APK ada di:
echo    android/app/build/outputs/apk/debug/app-debug.apk
echo ===========================================
pause
