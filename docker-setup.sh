#!/bin/bash

# VideoTube Docker Setup Script
# This script helps you set up VideoTube with Docker

set -e

echo "🎬 VideoTube Docker Setup"
echo "========================="

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ Docker and Docker Compose are installed"
}

# Function to create environment file
setup_env() {
    if [ ! -f "backend/.env" ]; then
        echo "📝 Creating environment file..."
        cat > backend/.env << EOF
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://mongodb:27017/videotube

# JWT Secrets (Change these in production!)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production
REFRESH_TOKEN_EXPIRY=10d

# MinIO/S3 Configuration
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=videotube
MINIO_USE_SSL=false
EOF
        echo "✅ Environment file created at backend/.env"
        echo "⚠️  Please update the JWT secrets in production!"
    else
        echo "✅ Environment file already exists"
    fi
}

# Function to start services
start_services() {
    echo "🚀 Starting VideoTube services..."
    docker-compose up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "✅ VideoTube is running!"
    echo ""
    echo "📱 Access your application:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Backend API:  http://localhost:5000"
    echo "   MinIO Console: http://localhost:9001 (admin/minioadmin123)"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker-compose down"
}

# Function to start development mode
start_dev() {
    echo "🔧 Starting VideoTube in development mode..."
    docker-compose -f docker-compose.dev.yml up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "✅ VideoTube development environment is running!"
    echo ""
    echo "📱 Access your application:"
    echo "   Backend API:  http://localhost:5000"
    echo "   MinIO Console: http://localhost:7001 (admin/minioadmin)"
    echo ""
    echo "💻 Frontend should be started separately with: cd frontend && npm run dev"
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment mode:"
    echo "1) Production (Full stack with Docker)"
    echo "2) Development (Backend services only)"
    echo "3) Stop all services"
    echo "4) View logs"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            setup_env
            start_services
            ;;
        2)
            setup_env
            start_dev
            ;;
        3)
            echo "🛑 Stopping all services..."
            docker-compose down
            docker-compose -f docker-compose.dev.yml down
            echo "✅ All services stopped"
            ;;
        4)
            echo "📊 Showing logs (Press Ctrl+C to exit)..."
            docker-compose logs -f
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            show_menu
            ;;
    esac
}

# Main execution
main() {
    check_docker
    show_menu
}

# Run the script
main
