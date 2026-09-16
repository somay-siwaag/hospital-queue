#!/bin/bash

# Update package information
apt-get update -y

# Install Git and Nginx
apt-get install -y git nginx

# Remove default Nginx website
rm -rf /var/www/html/*

# Clone the project from GitHub
cd /opt
git clone https://github.com/somay-siwaag/hospital-queue.git

# Copy frontend files to Nginx
cp -r /opt/hospital-queue/frontend/* /var/www/html/

# Configure Nginx
cat > /etc/nginx/sites-available/default <<'EOF'
server {
    listen 80;
    listen [::]:80;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://10.10.0.5;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx