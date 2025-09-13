# AI Code Generation Platform

## Overview

This is an AI-powered code generation platform that allows users to input prompts and receive generated code using different AI models. The application features a modern dark-themed interface with two operational modes: Normal and Advanced, each utilizing different AI models for code generation. Built as a full-stack web application with React frontend and Express backend, it provides real-time code generation with syntax highlighting and copy functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme configuration
- **State Management**: React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Code Display**: React Syntax Highlighter with Prism for syntax highlighting

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with single `/api/generate-code` endpoint
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot module replacement via Vite integration in development

### AI Integration Strategy
The application implements a dual-mode AI system:
- **Normal Mode**: Uses NVIDIA Nemotron-4-340B-Instruct model for standard code generation
- **Advanced Mode**: Uses DeepSeek Chat model for more sophisticated code generation
- **API Gateway**: OpenRouter service for unified AI model access
- **Fallback Logic**: Built-in responses for specific queries about the application's creation

### Data Flow and State Management
- **Client-Server Communication**: Fetch API with JSON payloads
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Real-time loading indicators during code generation
- **Copy Functionality**: Native clipboard API integration with toast notifications

### Styling and Theme System
- **Design System**: Custom dark theme with developer-tool-inspired aesthetics
- **Color Palette**: Pure black backgrounds with blue accent colors
- **Typography**: Inter font family with JetBrains Mono for code display
- **Component Variants**: Class variance authority for consistent component styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development Server**: Hot reload with error overlay integration
- **Type Safety**: Strict TypeScript configuration across frontend and backend
- **Code Organization**: Modular component structure with shared utilities

## External Dependencies

### AI Services
- **OpenRouter API**: Primary AI service provider with two distinct API keys for different operational modes
- **Model Selection**: NVIDIA Nemotron-4-340B-Instruct (normal) and DeepSeek Chat (advanced)

### Database Infrastructure
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Centralized schema definitions with migration support
- **Note**: Database configured but not actively used for code generation functionality

### UI and Component Libraries
- **Radix UI**: Comprehensive primitive components for accessibility
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form handling with validation
- **React Syntax Highlighter**: Code syntax highlighting and formatting

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling and compilation
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TypeScript**: Type safety across the entire application stack

### Utility Libraries
- **Tailwind Merge**: CSS class conflict resolution
- **Class Variance Authority**: Type-safe component variant management
- **Date-fns**: Date manipulation utilities
- **Nanoid**: Unique identifier generation