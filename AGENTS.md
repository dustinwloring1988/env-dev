# env-dev Project

Local webapp for managing dev builds with app-specific secrets and auth.

## Stack
- **Backend**: Express + TypeScript + Prisma + SQLite
- **Frontend**: React + TypeScript + Vite + Zustand
- **Docker**: Alpine-based containers

## Commands

```bash
# Development (hot reload)
docker compose -f docker-compose.dev.yml up -d

# Frontend dev only (ports 5173 -> 80)
npm run dev --prefix frontend

# Backend dev only
npm run dev --prefix backend

# Production build
docker compose up -d --build
```

## Key Files
- `backend/src/` - Express server, controllers, routes, middleware
- `frontend/src/` - React pages, components, services
- `backend/prisma/schema.prisma` - Database schema

## Ports
- Frontend: http://localhost
- Backend API: http://localhost:3001 (dev), internal:3000

## Database
- SQLite file: `backend/prisma/dev.db`
- Models: User, App, Secret
- Secrets encrypted with AES-256-GCM
