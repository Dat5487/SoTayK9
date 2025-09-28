"""
K9 Management System - Database Module
SQLite database setup and operations for users, dogs, and journals
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Optional, Any

class DatabaseManager:
    def __init__(self, db_path: str = "k9_management.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection with timeout and better settings"""
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        # Enable WAL mode for better concurrency
        conn.execute("PRAGMA journal_mode=WAL")
        # Set busy timeout
        conn.execute("PRAGMA busy_timeout=30000")
        return conn
    
    def init_database(self):
        """Initialize database with tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'TRAINER')),
                    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
                    email TEXT,
                    phone TEXT,
                    department TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Dogs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS dogs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    chip_id TEXT UNIQUE NOT NULL,
                    breed TEXT NOT NULL,
                    trainer_id INTEGER,
                    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'TRAINING', 'INACTIVE', 'RETIRED')),
                    birth_date DATE,
                    birth_place TEXT,
                    gender TEXT,
                    features TEXT,
                    fur_color TEXT,
                    value TEXT,
                    father_name TEXT,
                    father_birth DATE,
                    father_place TEXT,
                    father_breed TEXT,
                    father_features TEXT,
                    hlv_ten TEXT,
                    hlv_ngaysinh DATE,
                    hlv_capbac TEXT,
                    hlv_chucvu TEXT,
                    hlv_donvi TEXT,
                    hlv_daotao TEXT,
                    acquisition_date DATE,
                    health_status TEXT DEFAULT 'GOOD' CHECK (health_status IN ('GOOD', 'FAIR', 'POOR', 'CRITICAL')),
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (trainer_id) REFERENCES users (id)
                )
            ''')
            
            # User-Dog assignments table (many-to-many relationship)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_dog_assignments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    dog_id INTEGER NOT NULL,
                    assignment_type TEXT DEFAULT 'TRAINER' CHECK (assignment_type IN ('TRAINER', 'MANAGER', 'CARETAKER')),
                    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (dog_id) REFERENCES dogs (id),
                    UNIQUE(user_id, dog_id, assignment_type)
                )
            ''')
            
            # Training journals table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS training_journals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dog_id INTEGER NOT NULL,
                    trainer_id INTEGER NOT NULL,
                    journal_date DATE NOT NULL,
                    training_activities TEXT,
                    care_activities TEXT,
                    operation_activities TEXT,
                    health_status TEXT CHECK (health_status IN ('Tốt', 'Khá', 'Trung bình', 'Kém')),
                    behavior_notes TEXT,
                    weather_conditions TEXT,
                    training_duration INTEGER, -- in minutes
                    success_rate INTEGER, -- percentage
                    challenges TEXT,
                    next_goals TEXT,
                    approval_status TEXT DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
                    approved_by INTEGER,
                    approved_at TIMESTAMP,
                    rejection_reason TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (dog_id) REFERENCES dogs (id),
                    FOREIGN KEY (trainer_id) REFERENCES users (id),
                    FOREIGN KEY (approved_by) REFERENCES users (id)
                )
            ''')
            
            # Training sessions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS training_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dog_id INTEGER NOT NULL,
                    trainer_id INTEGER NOT NULL,
                    session_date DATE NOT NULL,
                    session_type TEXT NOT NULL CHECK (session_type IN ('BASIC_OBEDIENCE', 'DETECTION', 'PATROL', 'SEARCH', 'OTHER')),
                    duration_minutes INTEGER,
                    location TEXT,
                    weather TEXT,
                    objectives TEXT,
                    activities TEXT,
                    results TEXT,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (dog_id) REFERENCES dogs (id),
                    FOREIGN KEY (trainer_id) REFERENCES users (id)
                )
            ''')
            
            # Health records table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS health_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dog_id INTEGER NOT NULL,
                    record_date DATE NOT NULL,
                    record_type TEXT NOT NULL CHECK (record_type IN ('VACCINATION', 'CHECKUP', 'TREATMENT', 'INJURY', 'OTHER')),
                    description TEXT,
                    veterinarian TEXT,
                    medications TEXT,
                    next_appointment DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (dog_id) REFERENCES dogs (id)
                )
            ''')
            
            # System logs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS system_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    action TEXT NOT NULL,
                    table_name TEXT,
                    record_id INTEGER,
                    old_values TEXT, -- JSON
                    new_values TEXT, -- JSON
                    ip_address TEXT,
                    user_agent TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            
            # User sessions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_token TEXT UNIQUE NOT NULL,
                    ip_address TEXT,
                    user_agent TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            
            # Create indexes for better performance
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_dogs_chip_id ON dogs(chip_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_dogs_trainer_id ON dogs(trainer_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_journals_dog_id ON training_journals(dog_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_journals_date ON training_journals(journal_date)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_assignments_user_dog ON user_dog_assignments(user_id, dog_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at)')
            
            conn.commit()
            print("✅ Database initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing database: {e}")
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def hash_password(self, password: str) -> str:
        """Return password as-is (no encryption)"""
        return password
    
    def verify_password(self, password: str, stored: str) -> bool:
        """Verify password against stored value (plain text comparison)"""
        return password == stored
    
    # =============================================================================
    # USER OPERATIONS
    # =============================================================================
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Handle assignedDogs separately
            assigned_dogs = user_data.pop('assignedDogs', [])
            
            # Store password as plain text
            password = user_data['password']
            
            cursor.execute('''
                INSERT INTO users (name, username, password, role, status, email, phone, department, signature)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_data['name'],
                user_data['username'],
                password,
                user_data['role'],
                user_data.get('status', 'ACTIVE'),
                user_data.get('email'),
                user_data.get('phone'),
                user_data.get('department'),
                user_data.get('signature')
            ))
            
            user_id = cursor.lastrowid
            
            # Handle dog assignments if provided using the same cursor
            if assigned_dogs:
                self.update_user_dog_assignments_with_connection(cursor, user_id, assigned_dogs)
            
            conn.commit()
            
            # Return user without password but with assigned dogs
            return self.get_user_by_id_with_dogs(user_id)
            
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                raise ValueError("Username already exists")
            raise
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            
            if row:
                user = dict(row)
                del user['password']  # Remove password from response
                return user
            return None
            
        finally:
            conn.close()
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            row = cursor.fetchone()
            
            if row:
                return dict(row)
            return None
            
        finally:
            conn.close()
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users with assigned dogs"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
            rows = cursor.fetchall()
            
            users = []
            for row in rows:
                user = dict(row)
                del user['password']  # Remove password from response
                
                # Get assigned dogs for this user
                assigned_dog_names = self.get_user_assigned_dog_names(user['id'])
                user['assignedDogs'] = assigned_dog_names
                
                users.append(user)
            
            return users
            
        finally:
            conn.close()
    
    def update_user(self, user_id: int, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Handle assignedDogs separately
            assigned_dogs = user_data.pop('assignedDogs', None)
            
            # Build update query dynamically
            update_fields = []
            values = []
            
            for field, value in user_data.items():
                if field != 'id':
                    update_fields.append(f"{field} = ?")
                    values.append(value)
            
            # Update user basic info if there are fields to update
            if update_fields:
                values.append(user_id)
                query = f"UPDATE users SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
                cursor.execute(query, values)
            
            # Handle dog assignments using the same cursor
            if assigned_dogs is not None:
                self.update_user_dog_assignments_with_connection(cursor, user_id, assigned_dogs)
            
            conn.commit()
            
            # Return updated user with assigned dogs
            return self.get_user_by_id_with_dogs(user_id)
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_user_by_id_with_dogs(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID with assigned dogs"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            
            if row:
                user = dict(row)
                del user['password']  # Remove password from response
                
                # Get assigned dogs for this user
                assigned_dog_names = self.get_user_assigned_dog_names(user['id'])
                user['assignedDogs'] = assigned_dog_names
                
                return user
            return None
            
        finally:
            conn.close()
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
            conn.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user"""
        user = self.get_user_by_username(username)
        if user and password == user['password']:  # Plain text comparison
            del user['password']  # Remove password from response
            
            # Get assigned dogs for this user
            assigned_dog_names = self.get_user_assigned_dog_names(user['id'])
            user['assignedDogs'] = assigned_dog_names
            
            return user
        return None
    
    # =============================================================================
    # DOG OPERATIONS
    # =============================================================================
    
    def create_dog(self, dog_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new dog"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO dogs (
                    name, chip_id, breed, trainer_id, status, birth_date, birth_place,
                    gender, features, fur_color, value, father_name, father_birth,
                    father_place, father_breed, father_features, hlv_ten, hlv_ngaysinh,
                    hlv_capbac, hlv_chucvu, hlv_donvi, hlv_daotao, acquisition_date,
                    health_status, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                dog_data['name'],
                dog_data['chip_id'],
                dog_data['breed'],
                dog_data.get('trainer_id'),
                dog_data.get('status', 'ACTIVE'),
                dog_data.get('birth_date'),
                dog_data.get('birth_place'),
                dog_data.get('gender'),
                dog_data.get('features'),
                dog_data.get('fur_color'),
                dog_data.get('value'),
                dog_data.get('father_name'),
                dog_data.get('father_birth'),
                dog_data.get('father_place'),
                dog_data.get('father_breed'),
                dog_data.get('father_features'),
                dog_data.get('hlv_ten'),
                dog_data.get('hlv_ngaysinh'),
                dog_data.get('hlv_capbac'),
                dog_data.get('hlv_chucvu'),
                dog_data.get('hlv_donvi'),
                dog_data.get('hlv_daotao'),
                dog_data.get('acquisition_date'),
                dog_data.get('health_status', 'GOOD'),
                dog_data.get('notes')
            ))
            
            dog_id = cursor.lastrowid
            conn.commit()
            
            return self.get_dog_by_id(dog_id)
            
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                raise ValueError("Chip ID already exists")
            raise
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_dog_by_id(self, dog_id: int) -> Optional[Dict[str, Any]]:
        """Get dog by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT d.*, u.name as trainer_name, u.username as trainer_username
                FROM dogs d
                LEFT JOIN users u ON d.trainer_id = u.id
                WHERE d.id = ?
            ''', (dog_id,))
            
            row = cursor.fetchone()
            return dict(row) if row else None
            
        finally:
            conn.close()
    
    def get_all_dogs(self) -> List[Dict[str, Any]]:
        """Get all dogs with trainer information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT d.*, u.name as trainer_name, u.username as trainer_username
                FROM dogs d
                LEFT JOIN users u ON d.trainer_id = u.id
                ORDER BY d.created_at DESC
            ''')
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def update_dog(self, dog_id: int, dog_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update dog"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Build update query dynamically
            update_fields = []
            values = []
            
            for field, value in dog_data.items():
                if field != 'id':
                    update_fields.append(f"{field} = ?")
                    values.append(value)
            
            if not update_fields:
                return self.get_dog_by_id(dog_id)
            
            values.append(dog_id)
            query = f"UPDATE dogs SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            
            cursor.execute(query, values)
            conn.commit()
            
            return self.get_dog_by_id(dog_id)
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def delete_dog(self, dog_id: int) -> bool:
        """Delete dog"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM dogs WHERE id = ?', (dog_id,))
            conn.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    # =============================================================================
    # USER-DOG ASSIGNMENT OPERATIONS
    # =============================================================================
    
    def assign_dog_to_user(self, user_id: int, dog_id: int, assignment_type: str = 'TRAINER') -> bool:
        """Assign dog to user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO user_dog_assignments (user_id, dog_id, assignment_type, status)
                VALUES (?, ?, ?, 'ACTIVE')
            ''', (user_id, dog_id, assignment_type))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_user_assigned_dogs(self, user_id: int) -> List[Dict[str, Any]]:
        """Get dogs assigned to user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT d.*, uda.assignment_type, uda.assigned_at
                FROM dogs d
                JOIN user_dog_assignments uda ON d.id = uda.dog_id
                WHERE uda.user_id = ? AND uda.status = 'ACTIVE'
                ORDER BY uda.assigned_at DESC
            ''', (user_id,))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def get_user_assigned_dog_names(self, user_id: int) -> List[str]:
        """Get dog names assigned to user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT d.name
                FROM dogs d
                JOIN user_dog_assignments uda ON d.id = uda.dog_id
                WHERE uda.user_id = ? AND uda.status = 'ACTIVE'
                ORDER BY d.name
            ''', (user_id,))
            
            rows = cursor.fetchall()
            return [row[0] for row in rows]
            
        finally:
            conn.close()
    
    def update_user_dog_assignments(self, user_id: int, dog_names: List[str]) -> bool:
        """Update user dog assignments based on dog names"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # First, remove all existing assignments for this user
            cursor.execute('''
                UPDATE user_dog_assignments 
                SET status = 'INACTIVE' 
                WHERE user_id = ?
            ''', (user_id,))
            
            # Then add new assignments
            for dog_name in dog_names:
                # Get dog_id from dog name
                cursor.execute('SELECT id FROM dogs WHERE name = ?', (dog_name,))
                dog_result = cursor.fetchone()
                
                if dog_result:
                    dog_id = dog_result[0]
                    # Insert or update assignment
                    cursor.execute('''
                        INSERT OR REPLACE INTO user_dog_assignments 
                        (user_id, dog_id, assignment_type, status, assigned_at)
                        VALUES (?, ?, 'TRAINER', 'ACTIVE', CURRENT_TIMESTAMP)
                    ''', (user_id, dog_id))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def update_user_dog_assignments_with_connection(self, cursor, user_id: int, dog_names: List[str]) -> bool:
        """Update user dog assignments using existing cursor (for use within transactions)"""
        try:
            # First, remove all existing assignments for this user
            cursor.execute('''
                UPDATE user_dog_assignments 
                SET status = 'INACTIVE' 
                WHERE user_id = ?
            ''', (user_id,))
            
            # Then add new assignments
            for dog_name in dog_names:
                # Get dog_id from dog name
                cursor.execute('SELECT id FROM dogs WHERE name = ?', (dog_name,))
                dog_result = cursor.fetchone()
                
                if dog_result:
                    dog_id = dog_result[0]
                    # Insert or update assignment
                    cursor.execute('''
                        INSERT OR REPLACE INTO user_dog_assignments 
                        (user_id, dog_id, assignment_type, status, assigned_at)
                        VALUES (?, ?, 'TRAINER', 'ACTIVE', CURRENT_TIMESTAMP)
                    ''', (user_id, dog_id))
            
            return True
            
        except Exception as e:
            raise
    
    def unassign_dog_from_user(self, user_id: int, dog_id: int) -> bool:
        """Unassign dog from user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE user_dog_assignments 
                SET status = 'INACTIVE' 
                WHERE user_id = ? AND dog_id = ?
            ''', (user_id, dog_id))
            
            conn.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    # =============================================================================
    # TRAINING JOURNAL OPERATIONS
    # =============================================================================
    
    def create_training_journal(self, journal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create training journal entry"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO training_journals (
                    dog_id, trainer_id, journal_date, training_activities, care_activities,
                    operation_activities, health_status, behavior_notes, weather_conditions,
                    training_duration, success_rate, challenges, next_goals
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                journal_data['dog_id'],
                journal_data['trainer_id'],
                journal_data['journal_date'],
                journal_data.get('training_activities'),
                journal_data.get('care_activities'),
                journal_data.get('operation_activities'),
                journal_data.get('health_status'),
                journal_data.get('behavior_notes'),
                journal_data.get('weather_conditions'),
                journal_data.get('training_duration'),
                journal_data.get('success_rate'),
                journal_data.get('challenges'),
                journal_data.get('next_goals')
            ))
            
            journal_id = cursor.lastrowid
            conn.commit()
            
            return self.get_training_journal_by_id(journal_id)
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_training_journal_by_id(self, journal_id: int) -> Optional[Dict[str, Any]]:
        """Get training journal by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                WHERE tj.id = ?
            ''', (journal_id,))
            
            row = cursor.fetchone()
            return dict(row) if row else None
            
        finally:
            conn.close()
    
    def get_training_journals_by_dog(self, dog_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Get training journals for a specific dog"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                WHERE tj.dog_id = ?
                ORDER BY tj.journal_date DESC, tj.created_at DESC
                LIMIT ?
            ''', (dog_id, limit))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def get_all_training_journals(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all training journals"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                ORDER BY tj.journal_date DESC, tj.created_at DESC
                LIMIT ?
            ''', (limit,))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def update_training_journal(self, journal_id: int, journal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update training journal"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Build update query dynamically
            update_fields = []
            values = []
            
            for field, value in journal_data.items():
                if field not in ['id', 'created_at']:
                    update_fields.append(f"{field} = ?")
                    values.append(value)
            
            if not update_fields:
                return self.get_training_journal_by_id(journal_id)
            
            values.append(journal_id)
            query = f"UPDATE training_journals SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            
            cursor.execute(query, values)
            conn.commit()
            
            return self.get_training_journal_by_id(journal_id)
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def approve_training_journal(self, journal_id: int, approver_id: int, approved: bool = True, rejection_reason: str = None) -> Dict[str, Any]:
        """Approve or reject training journal"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            approval_status = 'APPROVED' if approved else 'REJECTED'
            
            cursor.execute('''
                UPDATE training_journals 
                SET approval_status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, 
                    rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (approval_status, approver_id, rejection_reason, journal_id))
            
            conn.commit()
            return self.get_training_journal_by_id(journal_id)
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def delete_training_journal(self, journal_id: int) -> bool:
        """Delete training journal"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM training_journals WHERE id = ?', (journal_id,))
            conn.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def get_training_journals_by_trainer(self, trainer_id: int) -> List[Dict[str, Any]]:
        """Get training journals for a specific trainer"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                WHERE tj.trainer_id = ?
                ORDER BY tj.journal_date DESC, tj.created_at DESC
            ''', (trainer_id,))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def get_pending_journals(self) -> List[Dict[str, Any]]:
        """Get all journals pending approval"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                WHERE tj.approval_status = 'PENDING'
                ORDER BY tj.journal_date DESC, tj.created_at DESC
            ''')
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    def get_approved_journals(self) -> List[Dict[str, Any]]:
        """Get all approved journals"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT tj.*, d.name as dog_name, d.chip_id, 
                       t.name as trainer_name, a.name as approver_name
                FROM training_journals tj
                JOIN dogs d ON tj.dog_id = d.id
                JOIN users t ON tj.trainer_id = t.id
                LEFT JOIN users a ON tj.approved_by = a.id
                WHERE tj.approval_status = 'APPROVED'
                ORDER BY tj.journal_date DESC, tj.created_at DESC
            ''')
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
            
        finally:
            conn.close()
    
    # =============================================================================
    # SESSION MANAGEMENT
    # =============================================================================
    
    def create_session(self, user_id: int, ip_address: str = None, user_agent: str = None) -> str:
        """Create a new user session"""
        import secrets
        import time
        from datetime import datetime, timedelta
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Generate secure session token
            session_token = secrets.token_urlsafe(32)
            
            # Set session expiration (7 days from now)
            expires_at = datetime.now() + timedelta(days=7)
            
            cursor.execute('''
                INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, session_token, ip_address, user_agent, expires_at))
            
            conn.commit()
            return session_token
            
        except Exception as e:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def validate_session(self, session_token: str) -> Optional[Dict[str, Any]]:
        """Validate session token and return user info"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT us.*, u.name, u.username, u.role, u.status, u.email, u.phone, u.department
                FROM user_sessions us
                JOIN users u ON us.user_id = u.id
                WHERE us.session_token = ? 
                AND us.is_active = 1 
                AND us.expires_at > CURRENT_TIMESTAMP
                AND u.status = 'ACTIVE'
            ''', (session_token,))
            
            row = cursor.fetchone()
            
            if row:
                # Update last accessed time
                cursor.execute('''
                    UPDATE user_sessions 
                    SET last_accessed = CURRENT_TIMESTAMP 
                    WHERE session_token = ?
                ''', (session_token,))
                conn.commit()
                
                # Return user info without password
                session_data = dict(row)
                if 'password' in session_data:
                    del session_data['password']
                return session_data
            
            return None
            
        finally:
            conn.close()
    
    def invalidate_session(self, session_token: str) -> bool:
        """Invalidate a session token"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE session_token = ?
            ''', (session_token,))
            
            conn.commit()
            return cursor.rowcount > 0
            
        finally:
            conn.close()
    
    def invalidate_user_sessions(self, user_id: int) -> bool:
        """Invalidate all sessions for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE user_id = ?
            ''', (user_id,))
            
            conn.commit()
            return cursor.rowcount > 0
            
        finally:
            conn.close()
    
    def cleanup_expired_sessions(self) -> int:
        """Remove expired sessions"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                DELETE FROM user_sessions 
                WHERE expires_at < CURRENT_TIMESTAMP OR is_active = 0
            ''')
            
            deleted_count = cursor.rowcount
            conn.commit()
            return deleted_count
            
        finally:
            conn.close()
    
    # =============================================================================
    # STATISTICS AND REPORTS
    # =============================================================================
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get dashboard statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            stats = {}
            
            # User statistics
            cursor.execute('SELECT COUNT(*) as total FROM users WHERE status = "ACTIVE"')
            stats['total_users'] = cursor.fetchone()['total']
            
            cursor.execute('SELECT role, COUNT(*) as count FROM users WHERE status = "ACTIVE" GROUP BY role')
            stats['user_roles'] = {row['role']: row['count'] for row in cursor.fetchall()}
            
            # Dog statistics
            cursor.execute('SELECT COUNT(*) as total FROM dogs')
            stats['total_dogs'] = cursor.fetchone()['total']
            
            cursor.execute('SELECT status, COUNT(*) as count FROM dogs GROUP BY status')
            stats['dog_status'] = {row['status']: row['count'] for row in cursor.fetchall()}
            
            # Journal statistics
            cursor.execute('SELECT COUNT(*) as total FROM training_journals')
            stats['total_journals'] = cursor.fetchone()['total']
            
            cursor.execute('SELECT approval_status, COUNT(*) as count FROM training_journals GROUP BY approval_status')
            stats['journal_approval_status'] = {row['approval_status']: row['count'] for row in cursor.fetchall()}
            
            # Recent activity
            cursor.execute('''
                SELECT COUNT(*) as count FROM training_journals 
                WHERE journal_date >= date('now', '-7 days')
            ''')
            stats['recent_journals'] = cursor.fetchone()['count']
            
            return stats
            
        finally:
            conn.close()
    
    # =============================================================================
    # DATA MIGRATION FROM JSON
    # =============================================================================
    

# Global database instance
db = DatabaseManager()

if __name__ == "__main__":
    # Initialize database
    print("🎉 Database setup completed!")
