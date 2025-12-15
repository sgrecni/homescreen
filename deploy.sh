#!/bin/bash

# ------------------------------------------------------------------
# A simple deployment script for Vite projects.
#
# INSTRUCTIONS:
# 1. Fill in the configuration variables below.
# 2. Make the script executable: chmod +x deploy.sh
# 3. Run the script: ./deploy.sh
#
# REQUIREMENTS:
# - SSH access to the remote server with key-based authentication
#   is highly recommended for security and convenience.
# - `rsync` must be installed on your local machine (it usually is).
# ------------------------------------------------------------------

# --- CONFIGURATION ---

# Set the username for the remote server.
REMOTE_USER="gid"

# Set the IP address or domain name of the remote server.
REMOTE_HOST="paradise.gifpaste.net"

# Set the absolute path to the destination directory on the remote server.
# This is often the web root for your site.
# Example: /var/www/my-awesome-app
REMOTE_DEST_PATH="/home/httpd/gifpaste.net/home"

# --- SCRIPT LOGIC (You shouldn't have to edit below this line) ---

# Exit immediately if a command exits with a non-zero status.
set -e

# Announce the start of the script.
echo "🚀 Starting deployment to ${REMOTE_HOST}..."

# 1. Build the Vite project.
# This command bundles your application into the 'dist' directory.
echo "📦 Step 1/2: Building the Vite project for testing..."
npm run build # Or use 'yarn build' or 'pnpm build'

# 2. Deploy the 'dist' directory to the remote server using rsync.
# rsync is efficient and only transfers changed files.
#
# Flags used:
# -a: Archive mode, preserves permissions, ownership, etc.
# -v: Verbose, shows details of the transfer.
# -z: Compresses file data during the transfer to save bandwidth.
# --delete: Deletes files on the destination that no longer exist in the source ('dist').
#           This ensures a clean deployment without old, unused files.
echo "🚚 Step 2/2: Syncing 'dist' directory with server..."
rsync -avz --delete ./dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_PATH}/"

# Announce completion.
echo "✅ Deployment successful!"
echo "🌐 Your application is now live."
