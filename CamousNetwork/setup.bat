@echo off
REM Campus Network Setup Script for Windows

echo ================================
echo Campus Network - Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo OK: Node.js %NODE_VERSION% found

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo OK: npm %NPM_VERSION% found

echo.
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo OK: Dependencies installed successfully

echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo OK: .env file created. Please edit it with your settings.
) else (
    echo OK: .env file already exists
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Edit .env file with your MongoDB connection:
echo    MONGODB_URI=mongodb://localhost:27017/campus_network
echo.
echo 2. Start MongoDB:
echo    mongod
echo.
echo 3. (Optional) Seed database:
echo    node seed.js
echo.
echo 4. Start the application:
echo    npm run dev
echo.
echo 5. Open your browser:
echo    http://localhost:3000
echo.
echo For detailed documentation, see README.md
echo.
pause
