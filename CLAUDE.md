# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "PEAI" that appears to be an AI-focused dashboard application with authentication. The project uses React 19, TypeScript, and Tailwind CSS with shadcn/ui components.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster development)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture & Structure

### UI Framework
- Built with **shadcn/ui** components using the "new-york" style
- Components use Radix UI primitives and Tailwind CSS
- Custom theme with CSS variables and neutral base color
- Lucide React for icons

### Key Routes
- `/` - Landing page with Next.js starter content
- `/login` - Authentication page with social login options
- `/dashboard` - Main application dashboard with sidebar navigation

### Component Architecture
- **App Sidebar** (`components/app-sidebar.tsx`): Main navigation with teams, nav items, and user profile
- **Login Form** (`components/login-form.tsx`): Authentication form with email/password and social providers
- **UI Components** (`components/ui/`): shadcn/ui component library
- **Navigation Components**: Modular nav components (nav-main, nav-projects, nav-user, team-switcher)

### State Management & Hooks
- **useIsMobile** (`hooks/use-mobile.ts`): Responsive breakpoint detection (768px)
- Uses React client components where needed ("use client" directive)

### Styling System
- **Tailwind CSS** with custom configuration
- **CSS Variables** for theming in `app/globals.css`
- **shadcn/ui** component system with variants
- **Utility function** `cn()` in `lib/utils.ts` for conditional class merging

### Path Aliases
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/components/ui` → `./components/ui`

## Development Notes

- The application uses **Turbopack** for faster development builds
- TypeScript configuration includes strict mode and path aliases
- ESLint is configured with Next.js and TypeScript rules
- The dashboard currently shows placeholder content and sample data
- Social authentication providers (Apple, Google, Meta) are set up in the login form but not functional