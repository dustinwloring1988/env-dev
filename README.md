# env-dev

A local webapp for managing development builds with app-specific secrets and authentication.

## Features

- User authentication (email/password with JWT)
- Create and manage multiple apps
- Each app has a unique API key
- Encrypted secret storage (AES-256-GCM)
- Local deployment with Docker

## Tech Stack

- **Backend**: Express + TypeScript + Prisma + SQLite
- **Frontend**: React + TypeScript + Vite + Zustand
- **Database**: SQLite (easy local development)
- **Docker**: Development and production configurations

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)

### Development with Docker

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000/api
```

### Local Development

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Production with Docker

```bash
# Build and start
docker-compose up -d --build

# Access the app at http://localhost
```

## Project Structure

```
env-dev/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helpers, encryption
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Database schema
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API client
│   │   ├── context/        # State management
│   │   └── App.tsx
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Apps
- `GET /api/apps` - List apps
- `POST /api/apps` - Create app
- `GET /api/apps/:id` - Get app details
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app
- `POST /api/apps/:id/regenerate-key` - Regenerate API key

### Secrets
- `GET /api/apps/:id/secrets` - List secrets
- `POST /api/apps/:id/secrets` - Add secret
- `GET /api/apps/:id/secrets/:key` - Get secret
- `PUT /api/apps/:id/secrets/:key` - Update secret
- `DELETE /api/apps/:id/secrets/:key` - Delete secret

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
ENCRYPTION_KEY=your-32-byte-encryption-key
PORT=3000
```

## License

MIT
