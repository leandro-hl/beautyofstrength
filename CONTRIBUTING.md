# Contributing to Beauty of Strength

Thank you for your interest in contributing to Beauty of Strength! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions professional

## Getting Started

### Prerequisites

- **Go 1.20+** for backend development
- **Node.js 14+** for frontend development
- **PostgreSQL 15+** for database
- **Redis 7+** for session management
- **Docker** and **Docker Compose** (optional but recommended)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/leandro-hl/beautyofstrength.git
   cd beautyofstrength
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Import schema and migrations
   psql -h localhost -U bosuser -d beautyofstrength -f sql/schema.sql

   # Run migrations in order
   for file in sql/*.sql; do
     psql -h localhost -U bosuser -d beautyofstrength -f "$file"
   done
   ```

5. **Set up backend**
   ```bash
   cd back/web
   cp conf.json.example conf.json
   cp crypto-conf.json.example crypto-conf.json
   # Edit configuration files with your settings

   # Install dependencies
   go mod download

   # Run backend
   go run .
   ```

6. **Set up frontend**
   ```bash
   cd ui
   npm install
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database UI (Adminer): http://localhost:8080
   - Redis UI: http://localhost:8081

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/doc-name` - Documentation updates

### Feature Development

1. Create a new branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards

3. Write tests for your changes

4. Ensure all tests pass
   ```bash
   # Backend tests
   cd back && go test ./...

   # Frontend tests
   cd ui && npm test
   ```

5. Commit your changes with clear messages

6. Push your branch and create a pull request

## Coding Standards

### Go Backend

- Follow [Effective Go](https://golang.org/doc/effective_go.html) guidelines
- Use `gofmt` for formatting
- Run `go vet` and `golint` before committing
- Use structured logging (zerolog) instead of `fmt.Println`
- Handle errors explicitly, avoid panic except in truly exceptional cases
- Write godoc comments for exported functions

**Example:**
```go
// GetUserByID retrieves a user by their ID
func GetUserByID(ctx context.Context, id int64) (*User, error) {
    logger.Info("Fetching user", map[string]interface{}{
        "user_id": id,
    })

    user, err := db.GetUser(ctx, id)
    if err != nil {
        logger.Error("Failed to fetch user", err, map[string]interface{}{
            "user_id": id,
        })
        return nil, fmt.Errorf("get user: %w", err)
    }

    return user, nil
}
```

### React Frontend

- Use functional components with hooks
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint for linting
- Use Prettier for formatting
- Write PropTypes or TypeScript interfaces for component props
- Keep components small and focused (< 200 lines)

**Example:**
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ExerciseCard = ({ exercise, onSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onSelect(exercise.id);
  };

  return (
    <div className={`exercise-card ${isSelected ? 'selected' : ''}`}>
      <h3>{exercise.name}</h3>
      <button onClick={handleClick}>
        {isSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
};

ExerciseCard.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ExerciseCard;
```

### Database

- Always use migrations for schema changes
- Name migrations sequentially: `51.sql`, `52.sql`, etc.
- Include both up and down migrations when possible
- Never modify existing migrations
- Use transactions for multi-step migrations
- Document complex queries

## Testing Guidelines

### Backend Testing

- Write unit tests for all business logic
- Use table-driven tests when appropriate
- Mock external dependencies
- Aim for > 70% code coverage

**Example:**
```go
func TestGetUserByID(t *testing.T) {
    tests := []struct {
        name    string
        userID  int64
        want    *User
        wantErr bool
    }{
        {
            name:   "valid user",
            userID: 1,
            want:   &User{ID: 1, Email: "test@example.com"},
            wantErr: false,
        },
        {
            name:    "user not found",
            userID:  999,
            want:    nil,
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := GetUserByID(context.Background(), tt.userID)
            if (err != nil) != tt.wantErr {
                t.Errorf("GetUserByID() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("GetUserByID() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### Frontend Testing

- Write tests for all components
- Test user interactions
- Test edge cases
- Use React Testing Library

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCard from './ExerciseCard';

describe('ExerciseCard', () => {
  const mockExercise = {
    id: 1,
    name: 'Push-ups',
  };

  it('renders exercise name', () => {
    render(<ExerciseCard exercise={mockExercise} onSelect={() => {}} />);
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<ExerciseCard exercise={mockExercise} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Select'));
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });
});
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add Google OAuth authentication

Implements Google OAuth flow for user authentication.
Includes token validation and session management.

Closes #123

---

fix(exercise): correct RM calculation formula

The previous formula was not accounting for rest periods.
Updated to use the standard Epley formula.

Fixes #456

---

docs(api): add OpenAPI specification

Added comprehensive API documentation using OpenAPI 3.0.
Includes all endpoints with request/response schemas.
```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Update API documentation
   - Add inline code comments

2. **Ensure Tests Pass**
   - All existing tests pass
   - New tests added for new features
   - Code coverage maintained or improved

3. **Code Review**
   - Request review from at least one maintainer
   - Address all review comments
   - Keep discussions focused and professional

4. **PR Description**
   - Describe what changes were made
   - Explain why the changes were necessary
   - Link to related issues
   - Include screenshots for UI changes

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings

## Screenshots (if applicable)
Add screenshots here
```

## Questions or Issues?

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Contact maintainers for clarification

Thank you for contributing to Beauty of Strength! 💪
