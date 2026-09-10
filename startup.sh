#!/bin/bash

# Update package information
apt-get update -y

# Install Git and Docker
apt-get install -y git docker.io

# Enable Docker
systemctl enable docker
systemctl start docker

# Clone the project
cd /opt
git clone https://github.com/somay-siwaag/hospital-queue.git

# Go to backend
cd /opt/hospital-queue/backend

# Build backend Docker image
docker build -t hospital-backend .

# Start backend container
docker run -d \
  --name hospital-backend \
  -p 5000:5000 \
  hospital-backend
