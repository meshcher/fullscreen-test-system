#!/bin/bash

# Backup script for test results
# Usage: ./backup-results.sh

DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="$HOME/Desktop/test-backups"
DATA_DIR="/Users/omeshcheriak/fullscreen-test-system/data"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if data directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo "Error: Data directory not found at $DATA_DIR"
    exit 1
fi

# Create backup
echo "Creating backup..."
cp -r "$DATA_DIR" "$BACKUP_DIR/backup-$DATE"

# Create a zip file
cd "$BACKUP_DIR"
zip -r "test-results-$DATE.zip" "backup-$DATE"
rm -rf "backup-$DATE"

echo "✅ Backup created: $BACKUP_DIR/test-results-$DATE.zip"
echo ""
echo "Contains:"
echo "  - users.json"
echo "  - sessions.json"
echo "  - results.json"
