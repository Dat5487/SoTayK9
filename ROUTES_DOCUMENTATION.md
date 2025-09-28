# K9 Management System - Route Documentation

## Overview
This document lists all available routes in the K9 Management System Flask backend.

## Main Application Routes

### Root Routes
- **`/`** → `index.html` (Main application)
- **`/index.html`** → `index.html` (Alternative access to main app)

### Dashboard Routes
- **`/dashboard_complete.html`** → `dashboard_complete.html` (Complete dashboard)
- **`/dashboard_integrated.html`** → `dashboard_integrated.html` (Integrated dashboard)
- **`/dashboard_v5_final.html`** → `dashboard_v5_final.html` (Dashboard v5 final version)
- **`/dashboard_v5.html`** → `dashboard_v5.html` (Dashboard v5)

### Admin Routes
- **`/admin_dashboard.html`** → `templates/admin_dashboard.html` (Main admin dashboard)
- **`/admin_dashboard_mới.html`** → `templates/admin_dashboard_mới.html` (New admin dashboard)
- **`/admin_dashboard_old.html`** → `templates/admin_dashboard_old.html` (Old admin dashboard)
- **`/admin_login.html`** → `templates/admin_login.html` (Admin login page)

### Template Routes
- **`/templates_index.html`** → `templates/index.html` (Templates index page)

## Static File Routes

### CSS and JavaScript
- **`/style.css`** → `style.css` (Main stylesheet)
- **`/script.js`** → `script.js` (Main JavaScript file)

### Static Directory
- **`/static/<path:filename>`** → `static/` directory (All static files)

### Images
- **`/images/<path:filename>`** → `images/` directory (All image files)

### Signatures
- **`/signatures/<path:filename>`** → `signatures/` directory (All signature files)

## API Routes

### Authentication
- **`POST /api/auth/login`** → User authentication

### Users
- **`GET /api/users`** → Get all users
- **`POST /api/users`** → Create new user

### Dogs
- **`GET /api/dogs`** → Get all dogs
- **`POST /api/dogs`** → Create new dog

### Statistics
- **`GET /api/stats/dashboard`** → Get dashboard statistics

## Usage Examples

### Accessing HTML Pages
```bash
# Main application
http://localhost:5000/

# Dashboard
http://localhost:5000/dashboard_complete.html

# Admin dashboard
http://localhost:5000/admin_dashboard.html

# Admin login
http://localhost:5000/admin_login.html
```

### Accessing Static Files
```bash
# CSS file
http://localhost:5000/style.css

# JavaScript file
http://localhost:5000/script.js

# Images
http://localhost:5000/images/logo-haiquan.png.jpg

# Signatures
http://localhost:5000/signatures/hoang_trong_quynh_signature.png

# Static files
http://localhost:5000/static/css/style.css
```

### API Calls
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'

# Get users
curl http://localhost:5000/api/users

# Get dogs
curl http://localhost:5000/api/dogs

# Get dashboard stats
curl http://localhost:5000/api/stats/dashboard
```

## Starting the Server

Run the Flask application:
```bash
python app_backend.py
```

The server will start on `http://localhost:5000` and display all available routes in the console.

## Notes

1. All HTML files are now accessible via direct URLs
2. Static files are served from their respective directories
3. API endpoints follow RESTful conventions
4. Error handling is implemented for missing files
5. CORS is enabled for cross-origin requests

