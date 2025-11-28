# Next.js Authentication & Dashboard Application

A modern, production-ready Next.js application featuring Laravel Sanctum authentication, a beautiful dashboard with sidebar navigation, and a comprehensive UI component library.

## Tech Stack

### Core Framework
- **Next.js 16.0.4** - React framework with App Router
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library
- **Geist Font** - Modern font family from Vercel

### Development Tools
- **Biome 2.2.0** - Fast linter and formatter (ESLint + Prettier alternative)
- **Bun** - Fast package manager and runtime

### API & Authentication
- **Axios** - HTTP client with interceptors
- **Laravel Sanctum** - Cookie-based SPA authentication
- **CSRF Protection** - Built-in XSRF token handling

## Project Structure

```
next-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   └── dashboard/         # Protected dashboard
│   │       ├── page.tsx       # Dashboard with sidebar
│   │       ├── loading.tsx    # Loading UI
│   │       └── error.tsx      # Error boundary
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── app-sidebar.tsx    # Collapsible sidebar
│   │   ├── login-form.tsx     # Authentication form
│   │   ├── protected-route.tsx # Route protection HOC
│   │   └── nav-*.tsx          # Navigation components
│   ├── contexts/
│   │   └── auth-context.tsx   # Global auth state management
│   ├── lib/
│   │   ├── auth.ts            # Authentication logic
│   │   ├── api.ts             # Axios instance with interceptors
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   ├── hooks/
│   │   └── use-mobile.ts      # Responsive design hook
│   └── middleware.ts          # Security headers middleware
├── public/                     # Static assets
├── biome.json                 # Biome configuration
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Key Features

### Authentication System
- **Laravel Sanctum Integration** - Cookie-based SPA authentication
- **Context API State Management** - Global auth state with React Context
- **Protected Routes** - Client-side route protection with loading states
- **CSRF Protection** - Automatic XSRF token handling
- **Session Management** - Persistent authentication across page reloads

### Dashboard & Navigation
- **Collapsible Sidebar** - Responsive sidebar that collapses to icon view
- **Breadcrumb Navigation** - Context-aware breadcrumbs
- **Team Switcher** - Multi-organization support UI
- **User Menu** - Profile dropdown with logout functionality
- **Nested Navigation** - Expandable menu items with sub-routes

### UI Components
All components are built with accessibility in mind using Radix UI primitives:
- Avatar, Button, Card, Input, Label
- Dropdown Menu, Tooltip, Sheet
- Sidebar (collapsible, responsive)
- Breadcrumb, Separator
- Skeleton loaders
- Custom Field component for forms

### Performance & Optimization
- **React 19 Compiler Ready** - Automatic memoization support
- **Image Optimization** - AVIF and WebP format support
- **Font Optimization** - Automatic font loading with `next/font`
- **Turbopack** - Fast bundler (default in Next.js 16)
- **Tree Shaking** - Optimized package imports for lucide-react and Radix UI

### Security
- **Security Headers** - HSTS, X-Frame-Options, CSP, etc.
- **CSRF Protection** - Token-based request validation
- **XSS Protection** - Content Security Policy headers
- **Cookie Security** - HTTP-only, secure cookies for auth

### Developer Experience
- **TypeScript** - Full type safety across the application
- **Biome** - Fast linting and formatting (replaces ESLint + Prettier)
- **Path Aliases** - Clean imports with `@/` prefix
- **Error Boundaries** - Graceful error handling
- **Loading States** - Consistent loading UI with Suspense
- **Hot Module Replacement** - Fast refresh during development

## Getting Started

### Prerequisites
- Node.js 20+ or Bun
- A Laravel backend with Sanctum configured (or modify `NEXT_PUBLIC_API_URL`)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd next-ui
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Development Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build           # Production build
npm run build:production # Production build with NODE_ENV=production
npm run start           # Start production server

# Code Quality
npm run lint            # Run Biome linter
npm run format          # Format code with Biome

# Analysis
npm run analyze         # Bundle size analysis
```

Built with Next.js, React, and TypeScript
