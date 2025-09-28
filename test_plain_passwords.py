#!/usr/bin/env python3
"""
Test script to verify plain text password authentication works
"""

import requests
import json

def test_authentication():
    """Test authentication with plain text passwords"""
    base_url = "http://localhost:5000/api"
    
    # Test users and their plain text passwords
    test_users = [
        {"username": "admin", "password": "admin"},
        {"username": "trainer1", "password": "trainer"},
        {"username": "manager1", "password": "manager"},
        {"username": "Kien123", "password": "123456"}
    ]
    
    print("🧪 Testing plain text password authentication...")
    print("=" * 50)
    
    for user in test_users:
        try:
            response = requests.post(f"{base_url}/auth/login", json=user)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    user_info = data.get('data', {})
                    print(f"✅ {user['username']}: Login successful - Role: {user_info.get('role')}")
                else:
                    print(f"❌ {user['username']}: Login failed - {data.get('error')}")
            else:
                print(f"❌ {user['username']}: HTTP {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to server. Make sure the Flask server is running.")
            break
        except Exception as e:
            print(f"❌ {user['username']}: Error - {e}")
    
    print("\n🔍 Testing invalid credentials...")
    try:
        response = requests.post(f"{base_url}/auth/login", json={
            "username": "admin", 
            "password": "wrongpassword"
        })
        
        if response.status_code == 401:
            print("✅ Invalid credentials correctly rejected")
        else:
            print(f"❌ Invalid credentials not properly handled - Status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing invalid credentials: {e}")

if __name__ == "__main__":
    test_authentication()

