# Stonebridge Trust Banking Website

## Overview
A professional banking website built with React + Vite frontend, Express + TypeScript backend, and PostgreSQL database. Features user registration with email verification, loan products with calculators, housing/mortgage offerings, and a full-featured dashboard.

## Project Architecture

### Frontend (client/)
- **React + Vite** with TypeScript
- **React Router** for navigation
- **Custom CSS** for styling (matching bank branding)
- Location: `client/src/`

Key components:
- `pages/` - Main pages (Home, Login, Register, Dashboard, Loans, Housing)
- `components/` - Reusable components (Navbar, Footer, ProtectedRoute)
- `context/AuthContext.tsx` - Authentication state management

### Backend (server/)
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **JWT** for authentication with HTTP-only cookies
- **bcryptjs** for password hashing
- **Resend** for email verification
- Location: `server/`

Key files:
- `index.ts` - Main server entry
- `db/schema.ts` - Database schema definitions
- `db/seed.ts` - Sample data seeding
- `routes/auth.ts` - Authentication endpoints
- `routes/loans.ts` - Loan products API
- `routes/housing.ts` - Housing offers API

### Database
- PostgreSQL with Drizzle ORM
- Tables: users, bank_accounts, transactions, loans, housing_offers, applications

## Running the Project
```bash
npm run dev          # Start both frontend and backend
npm run dev:server   # Backend only (port 3001)
npm run dev:client   # Frontend only (port 5000)
npm run db:push      # Sync database schema
npm run db:seed      # Seed sample data
```

## Features
1. **User Authentication** - Register, login, email verification
2. **Dashboard** - Account overview, recent transactions, statistics
3. **Loan Products** - 6 loan types with calculators and applications
4. **Housing/Mortgage** - Property listings with mortgage calculators
5. **Responsive Design** - Mobile-friendly interface

## Deployment
- Build command: `npm run build`
- Start command: `npm run start`
- The build compiles both client (Vite) and server (esbuild)
- Production server runs on port 5000 and serves static files from dist/public

## Recent Changes
- January 12, 2026: Fixed deployment configuration with proper build and start scripts
- January 7, 2026: Fixed features array parsing in loan and housing detail pages
- January 7, 2026: Moved vite.config.ts to client folder for proper proxy support
- January 7, 2026: Initial project setup with complete banking functionality

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `JWT_SECRET` - Secret for JWT token signing
- `RESEND_API_KEY` - API key for email service

## Tech Stack
- React 18, Vite 7, TypeScript
- Express.js, Node.js
- PostgreSQL, Drizzle ORM
- Resend (email), bcryptjs, jsonwebtoken
