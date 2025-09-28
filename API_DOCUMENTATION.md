# K9 Management System - API Documentation

## Overview
This document describes the REST API endpoints for the K9 Management System. The system uses SQLite database for data persistence and provides comprehensive CRUD operations for users, dogs, and training journals.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The system uses username/password authentication. Passwords are stored in plain text.

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "data": {...},
  "error": "error message",
  "total": number
}
```

## API Endpoints

### 1. Authentication

#### POST /api/auth/login
Authenticate user and return user information.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Quản trị viên",
    "username": "admin",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2025-01-01T00:00:00"
  }
}
```

### 2. Users Management

#### GET /api/users
Get all users.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Quản trị viên",
      "username": "admin",
      "role": "ADMIN",
      "status": "ACTIVE",
      "email": null,
      "phone": null,
      "department": null,
      "created_at": "2025-01-01T00:00:00"
    }
  ],
  "total": 1
}
```

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "password": "password123",
  "role": "TRAINER",
  "email": "john@example.com",
  "phone": "0123456789",
  "department": "Training Department"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "John Doe",
    "username": "johndoe",
    "role": "TRAINER",
    "status": "ACTIVE",
    "email": "john@example.com",
    "phone": "0123456789",
    "department": "Training Department",
    "created_at": "2025-01-01T00:00:00"
  }
}
```

#### GET /api/users/{user_id}
Get user by ID.

#### PUT /api/users/{user_id}
Update user information.

#### DELETE /api/users/{user_id}
Delete user.

### 3. Dogs Management

#### GET /api/dogs
Get all dogs with trainer information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "CNV BI",
      "chip_id": "CHIP001",
      "breed": "German Shepherd",
      "trainer_id": 2,
      "trainer_name": "Trần Đức Kiên",
      "trainer_username": "trainer1",
      "status": "ACTIVE",
      "birth_date": null,
      "acquisition_date": null,
      "health_status": "GOOD",
      "notes": null,
      "created_at": "2025-01-01T00:00:00"
    }
  ],
  "total": 1
}
```

#### POST /api/dogs
Create a new dog.

**Request Body:**
```json
{
  "name": "CNV NEW",
  "chip_id": "CHIP006",
  "breed": "Belgian Malinois",
  "trainer_id": 2,
  "status": "ACTIVE",
  "birth_date": "2020-01-01",
  "acquisition_date": "2020-06-01",
  "health_status": "GOOD",
  "notes": "New dog for training"
}
```

#### GET /api/dogs/{dog_id}
Get dog by ID.

#### PUT /api/dogs/{dog_id}
Update dog information.

#### DELETE /api/dogs/{dog_id}
Delete dog.

### 4. Training Journals

#### GET /api/journals
Get all training journals.

**Query Parameters:**
- `limit` (optional): Number of journals to return (default: 100)
- `dog_id` (optional): Filter by specific dog ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dog_id": 1,
      "trainer_id": 2,
      "journal_date": "2025-01-01",
      "training_activities": "Basic obedience training",
      "care_activities": "Fed twice, walked for 30 minutes",
      "operation_activities": "Patrol duty at border",
      "health_status": "Tốt",
      "behavior_notes": "Good behavior, responsive to commands",
      "weather_conditions": "Sunny",
      "training_duration": 60,
      "success_rate": 85,
      "challenges": "None",
      "next_goals": "Advanced detection training",
      "approval_status": "PENDING",
      "dog_name": "CNV BI",
      "chip_id": "CHIP001",
      "trainer_name": "Trần Đức Kiên",
      "approver_name": null,
      "created_at": "2025-01-01T00:00:00"
    }
  ],
  "total": 1
}
```

#### POST /api/journals
Create a new training journal entry.

**Request Body:**
```json
{
  "dog_id": 1,
  "trainer_id": 2,
  "journal_date": "2025-01-01",
  "training_activities": "Basic obedience training",
  "care_activities": "Fed twice, walked for 30 minutes",
  "operation_activities": "Patrol duty at border",
  "health_status": "Tốt",
  "behavior_notes": "Good behavior, responsive to commands",
  "weather_conditions": "Sunny",
  "training_duration": 60,
  "success_rate": 85,
  "challenges": "None",
  "next_goals": "Advanced detection training"
}
```

#### GET /api/journals/{journal_id}
Get training journal by ID.

#### PUT /api/journals/{journal_id}
Update training journal.

#### POST /api/journals/{journal_id}/approve
Approve or reject training journal.

**Request Body:**
```json
{
  "approver_id": 1,
  "approved": true,
  "rejection_reason": null
}
```

### 5. User-Dog Assignments

#### GET /api/users/{user_id}/dogs
Get dogs assigned to a specific user.

#### POST /api/users/{user_id}/dogs/{dog_id}
Assign dog to user.

**Request Body:**
```json
{
  "assignment_type": "TRAINER"
}
```

#### DELETE /api/users/{user_id}/dogs/{dog_id}
Unassign dog from user.

### 6. Statistics

#### GET /api/stats/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 4,
    "total_dogs": 5,
    "total_journals": 10,
    "user_roles": {
      "ADMIN": 1,
      "MANAGER": 1,
      "TRAINER": 2
    },
    "dog_status": {
      "ACTIVE": 4,
      "TRAINING": 1,
      "INACTIVE": 0
    },
    "journal_approval_status": {
      "PENDING": 5,
      "APPROVED": 4,
      "REJECTED": 1
    },
    "recent_journals": 3
  }
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Data Validation

### User Roles
- `ADMIN` - Full system access
- `MANAGER` - Management and approval access
- `TRAINER` - Training and journal access

### Dog Status
- `ACTIVE` - Available for operations
- `TRAINING` - Currently in training
- `INACTIVE` - Not available
- `RETIRED` - Retired from service

### Health Status
- `GOOD` - Excellent health
- `FAIR` - Good health with minor issues
- `POOR` - Health concerns
- `CRITICAL` - Serious health issues

### Journal Approval Status
- `PENDING` - Awaiting approval
- `APPROVED` - Approved by manager
- `REJECTED` - Rejected with reason

## Database Schema

### Users Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `username` (TEXT, UNIQUE, NOT NULL)
- `password` (TEXT, NOT NULL) - Plain text
- `role` (TEXT, NOT NULL) - ADMIN, MANAGER, TRAINER
- `status` (TEXT, DEFAULT 'ACTIVE')
- `email` (TEXT)
- `phone` (TEXT)
- `department` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Dogs Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `chip_id` (TEXT, UNIQUE, NOT NULL)
- `breed` (TEXT, NOT NULL)
- `trainer_id` (INTEGER, FOREIGN KEY)
- `status` (TEXT, DEFAULT 'ACTIVE')
- `birth_date` (DATE)
- `acquisition_date` (DATE)
- `health_status` (TEXT, DEFAULT 'GOOD')
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Training Journals Table
- `id` (INTEGER, PRIMARY KEY)
- `dog_id` (INTEGER, FOREIGN KEY, NOT NULL)
- `trainer_id` (INTEGER, FOREIGN KEY, NOT NULL)
- `journal_date` (DATE, NOT NULL)
- `training_activities` (TEXT)
- `care_activities` (TEXT)
- `operation_activities` (TEXT)
- `health_status` (TEXT)
- `behavior_notes` (TEXT)
- `weather_conditions` (TEXT)
- `training_duration` (INTEGER) - in minutes
- `success_rate` (INTEGER) - percentage
- `challenges` (TEXT)
- `next_goals` (TEXT)
- `approval_status` (TEXT, DEFAULT 'PENDING')
- `approved_by` (INTEGER, FOREIGN KEY)
- `approved_at` (TIMESTAMP)
- `rejection_reason` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Usage Examples

### Create a new user
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "password": "password123",
    "role": "TRAINER",
    "email": "john@example.com"
  }'
```

### Create a new dog
```bash
curl -X POST http://localhost:5000/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CNV NEW",
    "chip_id": "CHIP006",
    "breed": "Belgian Malinois",
    "trainer_id": 2
  }'
```

### Create a training journal
```bash
curl -X POST http://localhost:5000/api/journals \
  -H "Content-Type: application/json" \
  -d '{
    "dog_id": 1,
    "trainer_id": 2,
    "journal_date": "2025-01-01",
    "training_activities": "Basic obedience training",
    "care_activities": "Fed twice, walked for 30 minutes"
  }'
```

### Get dashboard statistics
```bash
curl http://localhost:5000/api/stats/dashboard
```
