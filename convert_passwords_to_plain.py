#!/usr/bin/env python3
"""
Convert hashed passwords in database to plain text
This script will update existing users to use plain text passwords
"""

import sqlite3
import os

def convert_passwords():
    """Convert hashed passwords to plain text"""
    db_path = "k9_management.db"
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get all users
        cursor.execute('SELECT id, username, password FROM users')
        users = cursor.fetchall()
        
        print(f"🔄 Found {len(users)} users to convert...")
        
        # Default passwords for existing users
        default_passwords = {
            'admin': 'admin',
            'trainer1': 'trainer',
            'manager1': 'manager',
            'Kien123': '123456'
        }
        
        for user_id, username, current_password in users:
            # Use default password if available, otherwise keep current
            new_password = default_passwords.get(username, current_password)
            
            # Update password to plain text
            cursor.execute('UPDATE users SET password = ? WHERE id = ?', (new_password, user_id))
            print(f"✅ Updated user '{username}' password to plain text")
        
        conn.commit()
        print("🎉 Password conversion completed successfully!")
        
        # Verify the changes
        print("\n📊 Current users and passwords:")
        cursor.execute('SELECT username, password FROM users')
        for username, password in cursor.fetchall():
            print(f"  - {username}: {password}")
            
    except Exception as e:
        print(f"❌ Error converting passwords: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    convert_passwords()

