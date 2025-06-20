#!/bin/bash

echo "Running PostgreSQL Migrations..."
psql "$DATABASE_URL" -f ./database/migrations/create_locations_best_time.sql

echo "Running PostgreSQL Seed..."
psql "$DATABASE_URL" -f ./database/seeds/seed_locations_best_time.sql

echo "Starting Node App..."
npm run start
