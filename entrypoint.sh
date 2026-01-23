#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for database to be ready..."
# Use nc (netcat) to wait for the db port to be open
until nc -z db 5432; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - executing migrations"
# Push schema transitions to the database
npm run db:push

# Optional: Seed the database if it's the first time or if you always want to ensure base data
# You can add a check here if needed, but for now we'll run it to ensure admin exists.
echo "Seeding database..."
npm run db:seed || echo "Seeding skipped or failed (might already exist)"

echo "Starting application..."
# Start the production server
exec tsx server.ts
