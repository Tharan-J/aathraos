#!/bin/bash
# Render deployment start script

# Disable YOLO update checks and analytics which can hang cloud worker instances
export YOLO_CONFIG_DIR="/tmp/Ultralytics"
export YOLO_VERBOSE="False"
export YOLO_UPDATE_CHECK="False"
export YOLO_VERSION_CHECK="False"
export ULTRALYTICS_ENV="True"

# Use the PORT provided by Render, or default to 10000
PORT=${PORT:-10000}

echo "Starting Fake Backend API on port $PORT..."
python3 fake_api.py
