#!/bin/bash

# execute with
# chmod +x install_packages.sh
# ./install_packages.sh

# Update and upgrade the system
sudo apt update && sudo apt upgrade -y

sudo apt install -y docker-compose-v2
sudo apt install -y traceroute

# Verify installations
echo "Verifying installations..."
echo "docker version: $(docker compose version)"
echo "traceroute version: $(traceroute --version)"

echo "All installations are complete."