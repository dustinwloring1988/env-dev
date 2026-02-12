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

### Database Migrations (IMPORTANT!)
**After ANY changes to `backend/prisma/schema.prisma`, you MUST run migrations in Docker:**

```bash
# If containers are already running:
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate deploy

# Or restart containers to auto-apply migrations:
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d

# For new migrations (when changing schema):
cd backend
npm run prisma:migrate -- --name your_migration_name
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate deploy
```

**Note:** The Docker container uses a separate SQLite database file than local development. Changes made locally won't apply to the Docker database unless you run migrations inside the container.
