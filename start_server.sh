#!/bin/bash

echo "========================================"
echo "   K9 Management System - WiFi Server"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python3 from your package manager"
    exit 1
fi

# Check if required packages are installed
echo "Checking Python packages..."
python3 -c "import flask, flask_cors" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required packages..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install packages"
        exit 1
    fi
fi

# Get local IP address
echo
echo "Getting your local IP address..."
if command -v ip &> /dev/null; then
    # Modern Linux systems
    ip=$(ip route get 1.1.1.1 | awk '{print $7; exit}')
elif command -v ifconfig &> /dev/null; then
    # Older systems
    ip=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
else
    ip="YOUR_IP_ADDRESS"
fi

echo
echo "========================================"
echo "   Server Starting..."
echo "========================================"
echo
echo "Your server will be available at:"
echo "  Local:    http://localhost:5000"
echo "  Network:  http://$ip:5000"
echo
echo "To access from other devices on your WiFi:"
echo "  1. Make sure they're on the same WiFi network"
echo "  2. Open browser and go to: http://$ip:5000"
echo
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo

# Start the Flask server
python3 app_backend.py

