#!/usr/bin/env python3
"""
K9 Management System - Database Initialization Script
This script initializes the SQLite database
"""

import os
import sys
from database import DatabaseManager

def main():
    """Initialize database"""
    print("🚀 K9 Management System - Database Initialization")
    print("=" * 50)
    
    try:
        # Initialize database manager
        db = DatabaseManager()
        print("✅ Database connection established")
        
        # Check if database is empty
        users = db.get_all_users()
        if users:
            print(f"📊 Database contains {len(users)} users")
        else:
            print("⚠️ Database is empty - no data available")
        
        # Display current data
        users = db.get_all_users()
        dogs = db.get_all_dogs()
        
        print("\n📊 Current Database Status:")
        print(f"  👥 Users: {len(users)}")
        print(f"  🐶 Dogs: {len(dogs)}")
        
        if users:
            print("\n👥 Users in database:")
            for user in users:
                print(f"  - {user['name']} ({user['username']}) - {user['role']}")
        
        if dogs:
            print("\n🐶 Dogs in database:")
            for dog in dogs:
                trainer_name = dog.get('trainer_name', 'Unassigned')
                print(f"  - {dog['name']} ({dog['chip_id']}) - {dog['breed']} - Trainer: {trainer_name}")
        
        print("\n🎉 Database initialization completed successfully!")
        print("💡 You can now start the Flask server with: python app_backend.py")
        
    except Exception as e:
        print(f"❌ Error during database initialization: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

