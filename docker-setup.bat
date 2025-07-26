@echo off
REM VideoTube Docker Setup Script for Windows
REM This script helps you set up VideoTube with Docker on Windows

echo 🎬 VideoTube Docker Setup
echo =========================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create environment file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating environment file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo CORS_ORIGIN=http://localhost:3000
        echo.
        echo # Database
        echo MONGODB_URI=mongodb://mongodb:27017/videotube
        echo.
        echo # JWT Secrets ^(Change these in production!^)
        echo ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
        echo ACCESS_TOKEN_EXPIRY=1d
        echo REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production
        echo REFRESH_TOKEN_EXPIRY=10d
        echo.
        echo # MinIO/S3 Configuration
        echo MINIO_ENDPOINT=minio
        echo MINIO_PORT=9000
        echo MINIO_ACCESS_KEY=minioadmin
        echo MINIO_SECRET_KEY=minioadmin123
        echo MINIO_BUCKET_NAME=videotube
        echo MINIO_USE_SSL=false
    ) > backend\.env
    echo ✅ Environment file created at backend\.env
    echo ⚠️  Please update the JWT secrets in production!
) else (
    echo ✅ Environment file already exists
)

:menu
echo.
echo Select deployment mode:
echo 1^) Production ^(Full stack with Docker^)
echo 2^) Development ^(Backend services only^)
echo 3^) Stop all services
echo 4^) View logs
echo 5^) Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto production
if "%choice%"=="2" goto development
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto exit
echo ❌ Invalid option. Please try again.
goto menu

:production
echo 🚀 Starting VideoTube services...
docker-compose up -d
echo ⏳ Waiting for services to be ready...
timeout /t 10 >nul
echo ✅ VideoTube is running!
echo.
echo 📱 Access your application:
echo    Frontend:     http://localhost:3000
echo    Backend API:  http://localhost:5000
echo    MinIO Console: http://localhost:9001 ^(admin/minioadmin123^)
echo.
echo 📊 View logs: docker-compose logs -f
echo 🛑 Stop services: docker-compose down
pause
goto menu

:development
echo 🔧 Starting VideoTube in development mode...
docker-compose -f docker-compose.dev.yml up -d
echo ⏳ Waiting for services to be ready...
timeout /t 10 >nul
echo ✅ VideoTube development environment is running!
echo.
echo 📱 Access your application:
echo    Backend API:  http://localhost:5000
echo    MinIO Console: http://localhost:7001 ^(admin/minioadmin^)
echo.
echo 💻 Frontend should be started separately with: cd frontend ^&^& npm run dev
pause
goto menu

:stop
echo 🛑 Stopping all services...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo ✅ All services stopped
pause
goto menu

:logs
echo 📊 Showing logs ^(Press Ctrl+C to exit^)...
docker-compose logs -f
goto menu

:exit
echo 👋 Goodbye!
pause
exit /b 0
