# WiFi Network Setup Guide for K9 Management System

## Overview
Your K9 Management System is already configured to run on WiFi networks! The Flask backend is set to `host='0.0.0.0'` which means it accepts connections from any device on your local network.

## Quick Start

### Windows Users
1. Double-click `start_server.bat`
2. The script will automatically:
   - Check Python installation
   - Install required packages
   - Show your local IP address
   - Start the server

### Linux/Mac Users
1. Open terminal in the project directory
2. Run: `chmod +x start_server.sh && ./start_server.sh`
3. The script will automatically:
   - Check Python installation
   - Install required packages
   - Show your local IP address
   - Start the server

## Manual Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python app_backend.py
```

### 3. Access the Application

#### From the same computer:
- Open browser and go to: `http://localhost:5000`

#### From other devices on your WiFi:
- Find your computer's IP address (see below)
- Open browser and go to: `http://YOUR_IP_ADDRESS:5000`

## Finding Your IP Address

### Windows
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your WiFi adapter
4. Example: `192.168.1.100`

### Linux/Mac
1. Open Terminal
2. Type: `ifconfig` (Linux) or `ifconfig` (Mac)
3. Look for your WiFi interface (usually `wlan0` or `en0`)
4. Find the `inet` address
5. Example: `192.168.1.100`

### Alternative Method (All Platforms)
1. Open browser and go to: `https://whatismyipaddress.com/`
2. Look for "Local IP" or "Private IP"

## Network Requirements

### Firewall Settings
Make sure your firewall allows connections on port 5000:

#### Windows Firewall
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings" → "Allow another app"
4. Browse to your Python installation
5. Check both "Private" and "Public" networks

#### Linux (ufw)
```bash
sudo ufw allow 5000
```

#### Mac
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Add Python and allow incoming connections

### Router Settings
- No special router configuration needed
- Make sure all devices are on the same WiFi network
- Some corporate networks may block device-to-device communication

## Troubleshooting

### "Connection Refused" Error
1. Check if the server is running (`python app_backend.py`)
2. Verify the IP address is correct
3. Check firewall settings
4. Ensure devices are on the same network

### "Site Can't Be Reached" Error
1. Check if the server is running
2. Verify the IP address and port (5000)
3. Try accessing from the same computer first (`localhost:5000`)

### Server Won't Start
1. Check Python installation: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Check for port conflicts (another app using port 5000)

### Mobile Devices Can't Connect
1. Ensure mobile device is on the same WiFi
2. Try disabling mobile data
3. Check if your router has "AP Isolation" enabled (disable it)

## Security Notes

### For Production Use
- Change the default port if needed
- Consider adding authentication
- Use HTTPS in production
- Restrict access to trusted networks only

### Current Configuration
- Server runs on all interfaces (`0.0.0.0`)
- No authentication required for basic access
- Debug mode enabled (shows detailed errors)

## Advanced Configuration

### Change Port
Edit `app_backend.py` line 1142:
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Change 5000 to 8080
```

### Run in Background (Linux/Mac)
```bash
nohup python app_backend.py > server.log 2>&1 &
```

### Run as Service (Linux)
Create a systemd service file for automatic startup.

## Support
If you encounter issues:
1. Check the console output for error messages
2. Verify all devices are on the same network
3. Test with `localhost:5000` first
4. Check firewall and router settings

