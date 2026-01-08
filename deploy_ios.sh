#!/bin/bash

# Load Environment Variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Configuration
APP_JSON="frontend/app.json"
APPLE_ID="himaschal@gmail.com" # Replace if different
PROJECT_ROOT=$(pwd)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper Functions
log() { echo -e "${green}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Parse Arguments
mode="local"
upload=true

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --cloud) mode="cloud" ;;
        --local) mode="local" ;;
        --no-upload) upload=false ;;
        *) error "Unknown parameter: $1" ;;
    esac
    shift
done

log "🚀 Starting Deployment Workflow ($mode)"

# 1. Increment Build Number
current_build=$(grep -A 5 '"ios":' $APP_JSON | grep '"buildNumber":' | sed 's/[^0-9]*//g')
new_build=$((current_build + 1))

log "Current Build: $current_build"
log "Bumping to: $new_build"

# Use sed to update file (Mac compatible)
sed -i '' "s/\"buildNumber\": \"$current_build\"/\"buildNumber\": \"$new_build\"/" $APP_JSON

# Verify
check_build=$(grep -A 5 '"ios":' $APP_JSON | grep '"buildNumber":' | sed 's/[^0-9]*//g')
if [ "$check_build" != "$new_build" ]; then
    error "Failed to update build number in app.json"
fi

# 2. Build
cd frontend
log "Starting EAS Build..."

if [ "$mode" == "local" ]; then
    eas build -p ios --profile production --local --non-interactive --output "./build-$new_build.ipa"
    build_status=$?
    ipa_path="./build-$new_build.ipa"
else
    eas build -p ios --profile production --auto-submit
    # Cloud build with auto-submit handles upload itself
    exit 0
fi

if [ $build_status -ne 0 ]; then
    error "Build failed."
fi

log "✅ Build Complete: $ipa_path"

# 3. Upload (Local Only)
if [ "$upload" = true ] && [ "$mode" == "local" ]; then
    log "Preparing to upload to TestFlight..."
    
    # Check for credentials
    if [ -z "$APP_SPECIFIC_PASSWORD" ]; then
        warn "APP_SPECIFIC_PASSWORD env var not found."
        echo "Please enter your App-Specific Password (from appleid.apple.com):"
        read -s password
    else
        password=$APP_SPECIFIC_PASSWORD
    fi

    log "Uploading via xcrun altool... (This takes 5-10 mins)"
    
    xcrun altool --upload-app -f "$ipa_path" -t ios -u "$APPLE_ID" -p "$password"
    
    if [ $? -eq 0 ]; then
        log "✅ Upload Successful!"
        osascript -e 'display notification "Build '$new_build' Uploaded!" with title "Deployment Complete"'
    else
        error "Upload failed."
    fi
else
    log "Skipping upload. IPA is at frontend/$ipa_path"
    open . # Open Finder to show the file
fi
