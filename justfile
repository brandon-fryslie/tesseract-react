# Tesseract React - Common Tasks

# Default recipe: list available commands
default:
    @just --list

# Development
# -----------

# Start development server
dev:
    pnpm start

# Start development server accessible on network
dev-all:
    pnpm start-all

# Build
# -----

# Production build
build:
    pnpm build

# Development build (no optimization)
build-dev:
    pnpm build-dev

# Testing
# -------

# Run tests
test:
    pnpm test

# Run tests in watch mode
test-watch:
    pnpm test:watch

# Run tests with coverage
test-coverage:
    pnpm test:coverage

# Code Quality
# ------------

# TypeScript type checking
typecheck:
    pnpm typecheck

# Format code with prettier
format:
    pnpm format

# Lint and fix
lint:
    pnpm exec eslint --fix 'src/**/*.{ts,tsx,js,jsx}'

# Run all checks (typecheck + test)
check: typecheck test

# Dependencies
# ------------

# Install dependencies
install:
    pnpm install

# Update dependencies interactively
update:
    pnpm exec npm-check-updates -i

# Clean
# -----

# Clean build artifacts
clean:
    rm -rf build coverage

# Clean everything including node_modules
clean-all: clean
    rm -rf node_modules

# Reinstall from scratch
reinstall: clean-all install

# Git Helpers
# -----------

# Show git status
status:
    git status

# Show recent commits
log:
    git log --oneline -20

# Show diff
diff:
    git diff
