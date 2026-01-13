#!/bin/bash

# ECS Server Form Unit Test Runner
# This script runs all unit tests for the ECS server creation form

set -e

echo "=========================================="
echo "ECS Server Form Unit Tests"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo ""
fi

# Check if vitest is installed
if ! npm list vitest > /dev/null 2>&1; then
  echo "Installing test dependencies..."
  npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/coverage-v8 @vitejs/plugin-react
  echo ""
fi

echo "Running unit tests..."
echo ""

# Run tests with coverage
npm run test:coverage

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "To run tests in watch mode: npm run test:watch"
echo "To run tests once: npm run test"
echo ""

