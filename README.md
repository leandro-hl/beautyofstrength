# Beauty of Strength (BOS)

[![Backend CI](https://github.com/leandro-hl/beautyofstrength/workflows/Backend%20CI/badge.svg)](https://github.com/leandro-hl/beautyofstrength/actions)
[![Frontend CI](https://github.com/leandro-hl/beautyofstrength/workflows/Frontend%20CI/badge.svg)](https://github.com/leandro-hl/beautyofstrength/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)

White label SPA and Progressive Web App (PWA) for the calisthenics and gym industries. A mobile-first platform where instructors (professors) and students collaborate on workout planifications, routines, and training execution.

**Open sourced:** October 14, 2025

## ✨ Features

- 📱 **Mobile-First PWA** - Progressive Web App with offline capabilities
- 🏋️ **Workout Planning** - Complete planification and mesocycle management
- 💪 **Exercise Library** - Comprehensive exercise database with custom exercises
- 📊 **Progress Tracking** - RM (Repetition Maximum) tracking and training history
- 👥 **Multi-User Types** - Professor (Instructor), Student Free, Student Premium
- 🔔 **Push Notifications** - Web Push notifications for training reminders
- 🎨 **White Label** - Customizable branding for different clients
- 🔐 **Google OAuth** - Secure authentication with Google Sign-In
- ☁️ **Cloud Storage** - AWS S3 integration for media files

## 🏗️ Architecture

**Backend:**
- Go 1.20+ (Gorilla Mux, sqlx)
- PostgreSQL 15+ (Database)
- Redis 7+ (Session management)
- AWS S3 (Media storage)

**Frontend:**
- React 17.0.2
- Material-UI (MUI) 5.15
- React Router 5.2
- Axios for API calls

## 🚀 Quick Start

### Prerequisites

- [Go 1.20+](https://golang.org/dl/)
- [Node.js 14+](https://nodejs.org/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL 15+](https://www.postgresql.org/)
- [Redis 7+](https://redis.io/)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/leandro-hl/beautyofstrength.git
   cd beautyofstrength
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL, Redis, Adminer (DB UI), and Redis Commander.

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   # Connect to PostgreSQL
   docker exec -i bos-postgres psql -U bosuser -d beautyofstrength < sql/schema.sql

   # Run migrations (in order)
   for i in {20..50}; do
     [ -f "sql/$i.sql" ] && docker exec -i bos-postgres psql -U bosuser -d beautyofstrength < "sql/$i.sql"
   done
   ```

5. **Run backend**
   ```bash
   cd back/web
   go run .
   ```

6. **Run frontend** (in a new terminal)
   ```bash
   cd ui
   npm install
   npm start
   ```

7. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 🔌 Backend API: http://localhost:3001
   - 🗄️ Database UI (Adminer): http://localhost:8080
   - 🔴 Redis UI: http://localhost:8081

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [API Documentation](docs/api.md) - REST API endpoints (Coming soon)
- [Database Schema](sql/schema.sql) - Database structure
- [Architecture Decisions](docs/adr/) - Design decisions (Coming soon)

## Example configs
### conf.json
```json
{
  "linkSharingExpirationDays": 30,
  "allowedOrigins": [
    "http://localhost:3000"
  ],
  "address": "http://localhost:3001",
  "addressUi": "http://localhost:3000",
  "whiteListedIPs": [
    "127.0.0.1"
  ],
  "serverStaticUI": true,
  "customExercisesPerUserLimit": 100,
  "customExerciseNameCharacterLimit": 60,
  "exercisesPerBlockLimit": 10,
  "studentFreeAccountRoutineBlocksLimit": 3,
  "googlePEMCertsUrl": "https://www.googleapis.com/oauth2/v1/certs",
  "googleTokenValidIssuers": {
    "accounts.google.com": true,
    "https://accounts.google.com": true
  },
  "s3Config": {
    "region": "YOUR_REGION",
    "accessKey": "YOUR_ACCESS_KEY",
    "secretKey": "YOUR_SECRET_KEY",
    "endpoint": "YOUR_ENDPOINT",
    "mainBucketName": "YOUT_BUCKET"
  },
  "useRedisForSessions": true,
  "redisConfig": {
    "address": "localhost:6379",
    "password": "",
    "db": 0,
    "sessionExpirationHours": 720
  }
}
```

### crypto-conf.json
```json
{
  "datasourceName": "YOUR_DATABASE",
  "vapidPublicKey": "NOT_IN_USE",
  "vapidDataKey": "NOT_IN_USE",
  "linkSharingKey": "RANDOMIZED",
  "googleClientId": "YOUR_GOOGLE_CLIENT_ID",
  "googleClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
}
```

## 🔧 Development

### Running Tests

**Backend:**
```bash
go test ./... -v -race -coverprofile=coverage.out
go tool cover -html=coverage.out
```

**Frontend:**
```bash
cd ui
npm test -- --coverage
```

### Code Quality

**Backend Linting:**
```bash
golangci-lint run ./...
```

**Frontend Linting:**
```bash
cd ui
npm run lint
```

### Building for Production

**Backend:**
```bash
cd back/web
go build -o ../../build/backend .
```

**Frontend:**
```bash
cd ui
npm run build
```

**Docker:**
```bash
docker build -t beautyofstrength:latest .
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

See [.env.example](.env.example) for all available configuration options.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

## 🎨 Design & Planning Links
- Value proposal [https://www.figma.com/board/DrQBYbdmfWMNnNup3ngGAd/APP-Value-Proposition?node-id=0-1&t=NE6aIihFiIlOfAqY-1]
- App map [https://www.figma.com/board/DqlgDa97d0QdupkpgNuseM/APP-Map?node-id=0-1&t=FzlzVtoZkyN5CLbW-1] (what can the app currently do)
- Other apps flows [https://www.figma.com/board/guBdQ37JhhK56dfVdnzOMf/bOS---Competitors-Flows?node-id=0-1&t=zBSauaDCVlSqbaur-1]
- Landing proposal [https://www.figma.com/design/TKXa9IFb5yB5NsYLtUUncT/bOS---MUI?node-id=1-10902&t=vvuvNEGxHYXaIRgu-1]
- Onboarding proposal [https://www.figma.com/design/e0nrl6tafLnNzrnckdwt21/bOS-App-Project?node-id=129-150&t=7nqB9h9ihvBnpU0h-1]
- MaterialUI [https://www.figma.com/design/zcCAh6b9l9RCoM6cTQZDxm/MUI-for-Figma-v5.16---Material-UI--Release-?node-id=4662-14&t=5xRKP1FbrFSgcl2C-1]
- Auth flow [https://www.figma.com/board/XGgm9f0pfYg43j5PlcEJGy/bos-auth-flow?node-id=0-1&t=LYa5CY55o63LlK8d-1]
- Onboarding flow [https://www.figma.com/board/kPjIyFyVRS2JlNWipY5F2n/bos-user-flow?node-id=0-1&t=CqRgnzF94bHi4FLe-1]
