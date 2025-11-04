.PHONY: help build test lint clean run docker-up docker-down

# Default target
help:
	@echo "Beauty of Strength - Makefile Commands"
	@echo ""
	@echo "  make build           - Build backend and frontend"
	@echo "  make test            - Run all tests"
	@echo "  make lint            - Run linters"
	@echo "  make run-backend     - Run backend server"
	@echo "  make run-frontend    - Run frontend dev server"
	@echo "  make docker-up       - Start Docker services"
	@echo "  make docker-down     - Stop Docker services"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make db-init         - Initialize database"
	@echo "  make db-migrate      - Run database migrations"
	@echo ""

# Build targets
build: build-backend build-frontend

build-backend:
	@echo "Building backend..."
	cd back/web && go build -o ../../build/backend .

build-frontend:
	@echo "Building frontend..."
	cd ui && npm run build

# Test targets
test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	go test ./... -v -race -coverprofile=coverage.out

test-frontend:
	@echo "Running frontend tests..."
	cd ui && npm test -- --coverage --watchAll=false

# Lint targets
lint: lint-backend lint-frontend

lint-backend:
	@echo "Linting backend..."
	golangci-lint run ./... --timeout=5m

lint-frontend:
	@echo "Linting frontend..."
	cd ui && npm run lint

# Run targets
run-backend:
	@echo "Starting backend server..."
	cd back/web && go run .

run-frontend:
	@echo "Starting frontend dev server..."
	cd ui && npm start

# Docker targets
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d
	@echo "Services started:"
	@echo "  - PostgreSQL: localhost:5432"
	@echo "  - Redis: localhost:6379"
	@echo "  - Adminer: http://localhost:8080"
	@echo "  - Redis Commander: http://localhost:8081"

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	docker-compose logs -f

# Database targets
db-init:
	@echo "Initializing database..."
	docker exec -i bos-postgres psql -U bosuser -d beautyofstrength < sql/schema.sql
	@echo "Database initialized!"

db-migrate:
	@echo "Running database migrations..."
	@for i in $$(seq 20 50); do \
		if [ -f "sql/$$i.sql" ]; then \
			echo "Running migration $$i.sql..."; \
			docker exec -i bos-postgres psql -U bosuser -d beautyofstrength < "sql/$$i.sql"; \
		fi; \
	done
	@echo "Migrations complete!"

# Clean targets
clean:
	@echo "Cleaning build artifacts..."
	rm -rf build/
	rm -rf ui/build/
	rm -f coverage.out
	@echo "Clean complete!"

# Development setup
setup: docker-up
	@echo "Installing backend dependencies..."
	go mod download
	@echo "Installing frontend dependencies..."
	cd ui && npm install
	@echo "Setup complete! Run 'make db-init' and 'make db-migrate' to initialize the database."

# Install tools
install-tools:
	@echo "Installing development tools..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.55.2
	@echo "Tools installed!"
