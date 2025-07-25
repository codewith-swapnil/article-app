# IndiaDaily - Article Publishing Platform

## Overview

IndiaDaily is a modern article publishing platform designed for the Indian market with multi-language support. The application provides a content management system for creating, managing, and displaying articles in multiple Indian languages including English, Hindi, Marathi, and Tamil. It features a clean, responsive design optimized for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state
- **Internationalization**: react-i18next for multi-language support
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API architecture
- **File Uploads**: Multer middleware for image handling
- **Error Handling**: Centralized error middleware with structured responses

### Database Layer
- **Storage**: Memory-based storage for reliable startup in Replit environment
- **ORM**: Drizzle ORM schema definitions for type safety
- **Fallback Support**: MongoDB integration available but uses memory storage for demo
- **Schema**: Shared schema definitions between client and server

## Key Components

### Data Models
1. **Users**: Basic user authentication with username/password
2. **Categories**: Article categorization with slugs for SEO
3. **Articles**: Full article management with rich metadata including:
   - Multi-language support
   - SEO-friendly slugs
   - Featured images
   - Tag system
   - Publishing status
   - Read time estimation

### Frontend Components
- **Hero Section**: Featured article display with engaging visuals
- **Article Cards**: Responsive article previews with metadata
- **Category Filters**: Dynamic filtering by category and sorting
- **Language Switcher**: Seamless language switching with persistence
- **Admin Panel**: Content management interface for CRUD operations
- **Image Upload**: Drag-and-drop image handling with validation

### API Endpoints
- `/api/categories` - Category management
- `/api/articles` - Article CRUD with filtering, search, and pagination
- `/api/articles/featured` - Featured article retrieval
- `/api/articles/stats` - Analytics and statistics
- `/api/upload` - Image upload handling

## Data Flow

1. **Content Creation**: Admin creates articles through the admin panel
2. **Data Storage**: Articles stored in PostgreSQL with Drizzle ORM
3. **Content Retrieval**: React Query fetches data with caching and real-time updates
4. **Rendering**: Server-side rendering in development, static generation for production
5. **User Interaction**: Client-side routing and state management for smooth UX

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **react-i18next**: Internationalization framework
- **wouter**: Lightweight React router

### UI Components
- **@radix-ui**: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **API Server**: Express server with automatic restarts
- **Database**: Neon serverless PostgreSQL
- **Asset Handling**: Local file uploads with multer

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database Migrations**: Drizzle-kit handles schema migrations
- **Environment**: Production-ready Express server serving static files

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between client/server
2. **TypeScript Throughout**: Full type safety across the entire stack
3. **Serverless Database**: Neon for scalable PostgreSQL without infrastructure management
4. **Component-Based UI**: Modular, reusable components with consistent design system
5. **Multi-language First**: Built-in i18n support for Indian language diversity
6. **SEO Optimization**: Slug-based routing and meta tag management
7. **Mobile-First Design**: Responsive design with mobile optimization
8. **Real-time Updates**: React Query for automatic cache invalidation and updates

The architecture prioritizes developer experience, performance, and scalability while maintaining simplicity and focusing on the Indian market's specific needs for multi-language content publishing.