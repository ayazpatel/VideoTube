# VideoTube Frontend

A modern, production-ready React frontend for the VideoTube video sharing platform, built with Redux Toolkit, Bootstrap, and following best practices.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, hooks, and functional components
- **State Management**: Redux Toolkit for efficient and scalable state management
- **UI Framework**: Bootstrap 5 with React Bootstrap components for responsive design
- **Authentication**: Complete JWT-based authentication with token refresh
- **File Uploads**: Support for video, image, and document uploads with progress tracking
- **Video Player**: Integrated video player with controls and metadata
- **Responsive Design**: Mobile-first approach with Bootstrap's responsive grid
- **Dark/Light Theme**: Theme toggle with persistent user preference
- **Error Handling**: Comprehensive error boundaries and user feedback
- **SEO Optimized**: React Helmet for dynamic meta tags and SEO
- **Testing Ready**: Jest and React Testing Library setup
- **Production Ready**: Optimized builds with code splitting

## 🛠️ Tech Stack

### Core
- **React 18** - Modern React with hooks and concurrent features
- **Redux Toolkit** - Official Redux toolset for efficient state management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors for API calls

### UI & Styling
- **Bootstrap 5** - CSS framework for responsive design
- **React Bootstrap** - Bootstrap components for React
- **React Icons** - Popular icons as React components

### Forms & Validation
- **React Hook Form** - Performant forms with easy validation
- **React Hot Toast** - Beautiful notifications and toasts

### Media & Files
- **React Player** - Media player for videos
- **React Infinite Scroll** - Infinite scrolling for video lists

### SEO & Meta
- **React Helmet Async** - Dynamic document head management

### Development
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Footer, etc.)
│   ├── UI/             # Generic UI components (Buttons, Modals, etc.)
│   └── Video/          # Video-specific components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Video/          # Video-related pages
│   ├── Profile/        # User profile pages
│   ├── Dashboard/      # Creator dashboard
│   └── Errors/         # Error pages (404, 403, etc.)
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for different features
├── services/           # API service functions
├── routes/             # Routing configuration
├── utils/              # Utility functions and helpers
└── assets/             # Static assets (images, icons, etc.)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- VideoTube backend server running

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Update `.env` with your backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=VideoTube
   VITE_APP_DESCRIPTION=Professional Video Sharing Platform
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## 🔐 Authentication Flow

1. **Login/Register**: Users can create accounts or sign in
2. **Token Management**: JWT tokens are stored in HTTP-only cookies
3. **Auto Refresh**: Access tokens are automatically refreshed when expired
4. **Protected Routes**: Certain pages require authentication
5. **Logout**: Secure logout clears tokens and redirects

## 🎨 Theming

The application supports both light and dark themes with Bootstrap integration.

## 📱 Responsive Design

Mobile-first design using Bootstrap's responsive breakpoints and grid system.

## 🚀 Production Deployment

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider (Vercel, Netlify, AWS S3, etc.).
