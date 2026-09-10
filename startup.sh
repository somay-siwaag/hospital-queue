#!/bin/bash

# Update package information
apt-get update -y

# Install Git, Docker and Python
apt-get install -y git docker.io python3

# Start Docker
systemctl enable docker
systemctl start docker

# Get a Google Cloud access token
ACCESS_TOKEN=$(curl -s \
  -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["access_token"])')

# Get the database password from Secret Manager
DB_PASSWORD=$(curl -s \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://secretmanager.googleapis.com/v1/projects/hospital-queue-system-507208/secrets/hospital-db-password/versions/latest:access" \
  | python3 -c 'import sys,json,base64; print(base64.b64decode(json.load(sys.stdin)["payload"]["data"]).decode())')

# Go to /opt
cd /opt

# Download the project from GitHub
git clone https://github.com/somay-siwaag/hospital-queue.git

# Go to the backend folder
cd /opt/hospital-queue/backend

# Build the Docker image
docker build -t hospital-backend .

# Start the backend container
docker run -d \
  --name hospital-backend \
  -p 5000:5000 \
  -e DB_HOST=10.228.96.3 \
  -e DB_PORT=5432 \
  -e DB_NAME=hospital \
  -e DB_USER=hospital-app \
  -e DB_PASSWORD="$DB_PASSWORD" \
  hospital-backend