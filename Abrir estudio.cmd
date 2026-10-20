@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  call npm ci
  if errorlevel 1 exit /b 1
)
echo Abre http://127.0.0.1:3000 en tu navegador.
echo Para cerrar el estudio, presiona Ctrl+C en esta ventana.
call npm run dev
