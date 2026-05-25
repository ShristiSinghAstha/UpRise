#!/bin/bash
set -e

# ==============================================================================
# AWS EC2 Provisioning Script for UpRise Production Environment
# Operating System: Ubuntu 22.04 LTS or 24.04 LTS
# ==============================================================================

echo "======================================================================"
echo "Starting UpRise Production Server Setup..."
echo "======================================================================"

# 1. Update and upgrade system packages
echo ">>> Updating apt packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install essential tools
echo ">>> Installing utility packages..."
sudo apt-get install -y curl git gnupg lsb-release ca-certificates apt-transport-https

# 3. Add Docker's official GPG key and repository
echo ">>> Setting up Docker repository..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine and Docker Compose
echo ">>> Installing Docker & Docker Compose..."
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Configure Docker permissions
echo ">>> Configuring Docker user group permissions..."
sudo usermod -aG docker $USER

# 6. Configure system variables and directories
echo ">>> Creating application directory (/app/uprise)..."
sudo mkdir -p /app/uprise
sudo chown -R $USER:$USER /app/uprise

# 7. Create template environment files
echo ">>> Generating production .env template..."
cat <<EOF > /app/uprise/.env.production
# UpRise production environment configuration
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/UpRise
JWT_SECRET=$(openssl rand -hex 32)
EOF

echo "======================================================================"
echo "Server Setup Completed Successfully!"
echo "======================================================================"
echo "Steps to run the application:"
echo "  1. Log out and log back in to apply Docker group changes (or run 'newgrp docker')."
echo "  2. Clone the repository into /app/uprise:"
echo "     git clone <YOUR_REPO_URL> /app/uprise"
echo "  3. Configure your .env.production file:"
echo "     nano /app/uprise/.env.production"
echo "  4. Deploy using Docker Compose:"
echo "     docker compose -f /app/uprise/docker-compose.yml up -d --build"
echo "======================================================================"
