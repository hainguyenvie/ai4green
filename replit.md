# RecyCool: Educational STEM Platform

## Overview

RecyCool is a comprehensive educational platform that transforms waste materials into STEM learning opportunities using artificial intelligence. The platform allows users to scan recyclable materials, receive AI-powered project recommendations, and create personalized educational experiences. Built as a full-stack web application with a React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful APIs with structured error handling
- **Development**: Hot reload with tsx for TypeScript execution

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL 16 (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Strategy**: Currently supports both in-memory storage (development) and PostgreSQL (production)

## Key Components

### Material Scanning System
- AI-powered material identification from images
- Session-based material tracking with unique session IDs
- Support for quantity management and material type categorization
- RESTful endpoints for CRUD operations on scanned materials

### Project Recommendation Engine
- Material-based project filtering and recommendations
- Comprehensive project metadata including difficulty, duration, age range
- Step-by-step instructions with optional images and checklists
- Learning objectives and STEM concept explanations

### Educational Content Management
- Structured lesson plans with objectives, concepts, and assessment questions
- Interactive project execution with timer functionality
- Real-time AI chat assistant for project guidance
- Progress tracking and step completion verification

### Community Features
- Project submission system with photo uploads
- Public sharing capabilities with privacy controls
- Community gallery for showcasing completed projects
- Rating and feedback system for projects

### User Interface Components
- Responsive navigation with mobile-optimized design
- Toast notifications for user feedback
- Loading states and error handling throughout the application
- Accessible UI components following modern design patterns

## Data Flow

### Material Scanning Workflow
1. User uploads images or captures photos through the scanning interface
2. Images are processed by AI scanning service to identify materials
3. Identified materials are stored with session-based tracking
4. Materials can be edited for quantity and type corrections
5. Material data is used to filter and recommend appropriate projects

### Project Discovery and Execution
1. Scanned materials trigger project recommendation algorithm
2. Projects are filtered by available materials and user preferences
3. Selected projects display detailed lesson plans with learning objectives
4. Users execute projects with step-by-step guidance and AI assistance
5. Completed projects can be submitted to the community gallery

### Community Interaction
1. Users submit completed projects with photos and reflections
2. Submissions include difficulty ratings and learning outcome assessments
3. Projects are shared publicly or privately based on user preferences
4. Community members can browse and filter shared projects

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Inter Font**: Modern typography from Google Fonts

### Development Tools
- **Vite**: Fast build tool with HMR support
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and management

### Database and Backend
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **Express.js**: Web application framework
- **Zod**: Runtime type validation and schema definition

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module with automatic provisioning
- **Port Configuration**: Application serves on port 5000 with external port 80
- **Hot Reload**: Automatic restart on file changes with Vite HMR

### Production Build Process
1. Frontend assets built using Vite to `dist/public` directory
2. Backend compiled using ESBuild with external package bundling
3. Static file serving configured for production deployment
4. Environment variables managed through Replit secrets

### Deployment Configuration
- **Target**: Replit Autoscale deployment
- **Build Command**: `npm run build` - builds both frontend and backend
- **Start Command**: `npm run start` - runs production server
- **Database**: Automatic PostgreSQL provisioning with connection string

## Deployment Notes

### Build Process
- Local builds complete successfully with optimized production assets
- Frontend builds to `dist/public` with code-split chunks for performance
- Backend compiles to `dist/index.js` as ESM module
- Build generates warning about chunk sizes >500KB (normal for complex UI)

### Deployment Troubleshooting
- If deployment fails during build phase, this is typically due to timeout constraints in cloud build environment
- The application builds correctly locally, indicating no code issues
- Large chunk sizes may cause build timeouts - this is expected for comprehensive UI libraries

## Changelog

Changelog:
- August 17, 2025. Migration completed from Replit Agent to standard Replit environment
- August 17, 2025. Verified build process and deployment configuration
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.