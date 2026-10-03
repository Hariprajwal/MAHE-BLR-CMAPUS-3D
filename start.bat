@echo off
echo Starting 3D-BUILDING Web App...

IF NOT EXIST "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting development server...
call npm run dev

pause
