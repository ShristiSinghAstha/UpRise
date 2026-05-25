#!/bin/bash
# ==============================================================================
# Zero-Downtime Deployment & Rollback Script for UpRise
# Uses Docker Compose rolling scaling to update services without downtime
# ==============================================================================
set -e

echo "========================================================= "
echo "Starting Zero-Downtime Deployment for UpRise..."
echo "========================================================= "

# Step 1: Pull new images (or build them)
echo ">>> Pulling/building latest container images..."
docker compose build --pull backend

# Step 2: Scale backend up to 2 instances
# This spins up a new backend container running the new code
echo ">>> Scaling backend to 2 instances (1 old, 1 new)..."
docker compose up -d --scale backend=2 --no-recreate

# Step 3: Wait for new backend container to become healthy
echo ">>> Verifying health of the new container..."
NEW_CONTAINER_ID=$(docker ps --filter "name=uprise-backend" --format "{{.ID}}" | head -n 1)

# Check health of the newly launched container
RETRIES=15
HEALTHY=false
for ((i=1; i<=RETRIES; i++)); do
  STATUS=$(docker inspect -f '{{.State.Health.Status}}' "$NEW_CONTAINER_ID" 2>/dev/null || echo "starting")
  echo "Checking container $NEW_CONTAINER_ID health: $STATUS (Attempt $i/$RETRIES)..."
  if [ "$STATUS" == "healthy" ]; then
    HEALTHY=true
    break
  fi
  sleep 4
done

# Step 4: Handle failure and Rollback if not healthy
if [ "$HEALTHY" = false ]; then
  echo "!!! Error: New container failed health checks. Rolling back..."
  # Scale backend back down to 1 instance and kill the bad container
  docker compose up -d --scale backend=1
  docker rm -f "$NEW_CONTAINER_ID"
  echo ">>> Rollback completed. Old container remains active."
  exit 1
fi

# Step 5: Stop the older container
echo ">>> New container is healthy! Removing the old container..."
# Find the older container ID (the one that is not NEW_CONTAINER_ID)
ALL_CONTAINERS=$(docker ps --filter "name=uprise-backend" --format "{{.ID}}")
for ID in $ALL_CONTAINERS; do
  if [ "$ID" != "$NEW_CONTAINER_ID" ]; then
    echo "Stopping and removing old container: $ID"
    docker stop "$ID"
    docker rm "$ID"
  fi
done

# Reset scale to 1 (which will now point to the new container only)
docker compose up -d --scale backend=1 --no-recreate

# Step 6: Reload Nginx proxy cache & upstream
echo ">>> Reloading Nginx router configuration..."
docker exec uprise-nginx-router nginx -s reload

echo "========================================================= "
echo "Deployment successful with zero downtime!"
echo "========================================================= "
