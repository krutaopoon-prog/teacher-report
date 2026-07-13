@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo กำลังสแกนรูปภาพและสร้าง manifest...
python build-manifest.py
if errorlevel 1 (
  echo.
  echo ไม่พบ python — ลองใช้คำสั่ง  py build-manifest.py  แทน
  py build-manifest.py
)
echo.
pause
