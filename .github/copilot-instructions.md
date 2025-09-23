# AI Portfolio Generator - Copilot Instructions

## 🎯 Project Overview

This is a **Next.js 15 + Supabase** portfolio generation app with sophisticated authentication and debugging capabilities. The app helps students create AI-generated portfolios with social profile integration and data persistence.

## 🏗️ Architecture & Key Patterns

### Core Stack
- **Next.js 15** with App Router and **Turbopack** (dev/build with `--turbopack` flag) 
- **Supabase** for auth/database with comprehensive RLS policies
- **TypeScript** with strict typing for auth flows and database schemas
- **TailwindCSS 4** for styling
- **React Context** for global auth and toast state management

### Authentication Architecture
The auth system uses **graceful degradation** with database-first validation:

- **AuthProvider** (`lib/auth-context.tsx`) - Global auth state with auto-redirect logic
- **ProtectedRoute** (`lib/auth-guard.tsx`) - Component-level route protection  
- **AuthUtils** (`lib/auth-utils.ts`) - Centralized auth utilities with network error handling
- **AuthDebugger** (`components/ui/AuthDebugger.tsx`) - Real-time diagnostics accessible via red button
- **Supabase client** (`lib/supabase.ts`) - Type-safe database interface with timeout configs

### Database Schema Pattern
Multi-table relational design with automatic profile creation:
- `auth.users` (Supabase built-in) for authentication
- `user_profiles` (custom) with all signup data via triggers/manual fallback
- `portfolios` + related tables (`skills`, `experiences`, `education`, `projects`) for portfolio data
- Schema deployment via `supabase/schema.sql` in Supabase SQL Editor

## 🛠️ Development Workflows

### Essential Commands
```bash
npm run dev      # Start dev server with Turbopack (always use --turbopack flag)
npm run build    # Build with Turbopack optimization
npm run lint     # ESLint validation
```

### Database Setup Workflow (Critical for New Setups)
1. **Deploy schema**: Copy/paste entire `supabase/schema.sql` into Supabase SQL Editor and run
2. **Guided setup**: Visit `/database-setup` page for step-by-step instructions
3. **Verify setup**: Use AuthDebugger (red "Debug Auth" button on protected pages)
4. **Test flow**: Signup → verify profile creation in Supabase dashboard

### Error Recovery Pattern
The app gracefully degrades when database isn't set up:
- Users can still sign up (creates Supabase auth account)
- Clear error messages guide toward database setup
- AuthDebugger shows specific missing components

### Environment Configuration
Critical env vars in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon public key
EMAIL_USER=                        # Gmail for password reset emails  
EMAIL_APP_PASSWORD=                # Gmail app password (not regular password)
```

## 🔍 Debugging & Testing

### Built-in Debug Tools
- **AuthDebugger** component - Comprehensive auth diagnostics accessible via red button on protected pages
- **ConnectionTest** component - Database connectivity validation  
- **Database-setup page** - Guided schema deployment at `/database-setup`

### Error Handling Patterns
- **Graceful degradation** - Users can sign up even if database tables don't exist
- **Detailed logging** - Console outputs for auth state changes and database operations
- **User-friendly messages** - Clear guidance on how to fix configuration issues
- **Database validation** - System checks table existence before operations

### Common Issues & Solutions
- **"No account found"** → Database schema not deployed (run `supabase/schema.sql`)
- **"Failed to fetch"** → Network/Supabase connection issue (check URL/keys)
- **Profile creation fails** → Missing RLS policies or table permissions
- **Red Debug button missing** → Page not wrapped in `ProtectedRoute`

## 📁 File Organization Conventions

### Component Structure
```
components/
├── ui/              # Reusable UI components (Button, Card, etc.)
├── landing/         # Landing page sections (Hero, Features, etc.)
└── [Feature].tsx    # Feature-specific components
```

### Authentication Flow Files
```
app/auth/           # Auth UI pages (login, signup, etc.)
app/api/auth/       # API routes for auth operations
lib/auth-*.tsx      # Auth context, guards, and utilities
```

### Database Integration
```
supabase/           # SQL schema files (run schema.sql in Supabase SQL Editor)
lib/database-*.ts   # Database utilities and type definitions
lib/supabase*.ts    # Supabase client configurations
lib/portfolio-service.ts  # Portfolio CRUD operations with typed interfaces
```

## 🔐 Security & Best Practices

### Route Protection Pattern
Use `ProtectedRoute` wrapper for auth-required pages:
```tsx
// In page components
export default function GeneratePage() {
  return (
    <ProtectedRoute>
      {/* Protected content */}
    </ProtectedRoute>
  );
}
```

### Database Access Pattern
- All database operations use **read-only transactions** for safety
- **RLS policies** enforce row-level security via `auth.uid() = id/user_id`
- **Database validation** before operations via DatabaseUtils
- Portfolio data structured with typed interfaces in `PortfolioService`

### Error Recovery
- **Network failures** during auth don't break UX (graceful fallbacks)
- **Missing database tables** show setup guidance instead of crashes
- **Environment issues** are caught early with detailed error messages

## 🎨 UI/UX Patterns

### Toast Notifications
Global toast system via `ToastProvider` - use for user feedback on auth actions.

### Responsive Design
TailwindCSS mobile-first approach with dark theme support built-in.

### Portfolio Templates
Two main template systems:
- `SamplePortfolioTemplate` - Preview with sample data
- `ModernPortfolioTemplate` - Live templates with user data
- Template switching via URL params (`?template=aesthetic-portfolio`)

## 📊 Integration Points

### External Services
- **Supabase Auth** - Complete user management with email confirmation
- **Nodemailer + Gmail** - Password reset email delivery
- **GitHub/LinkedIn** - Profile URL validation and integration

### Cross-Component Communication
- **Auth state** - Global via AuthContext, triggers UI updates across app
- **Toast messages** - Global via ToastContext for user feedback
- **URL parameters** - Handle auth callbacks, template selection, and portfolio data passing

### Portfolio Data Flow
1. User inputs data in forms (name, email, LinkedIn, GitHub, etc.)
2. Data flows through URL params to `/generating` page
3. `PortfolioService` handles CRUD operations with typed interfaces
4. Templates consume data via props with fallback to sample data

### Critical Development Patterns
- **Database first approach**: Always check table existence before operations
- **Sample data patterns**: Use `lib/sample-portfolio-data.ts` for consistent mock data structure
- **URL-based state**: Portfolio generation and template selection via searchParams
- **Typed database interfaces**: All portfolio models defined in `PortfolioService`

When working on this codebase, always test auth flows using the built-in debugger tools and ensure database connectivity before implementing new features.