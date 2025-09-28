from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
from database import db

app = Flask(__name__)
CORS(app)

def initialize_database():
    """Initialize database and migrate data if needed"""
    try:
        # Check if database is empty
        users = db.get_all_users()
        if not users:
            print("🔄 Database is empty, migrating from JSON files...")
            db.migrate_from_json()
        else:
            print("✅ Database already initialized")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise

# =============================================================================
# STATIC FILE ROUTES
# =============================================================================

@app.route('/')
def index():
    """Serve main web app"""
    return send_from_directory('.', 'index.html')

# Root level HTML files
@app.route('/index.html')
def web_app():
    """Serve web app"""
    return send_from_directory('.', 'index.html')

@app.route('/dashboard_complete.html')
def dashboard_complete():
    """Serve complete dashboard"""
    return send_from_directory('.', 'dashboard_complete.html')

@app.route('/dashboard_integrated.html')
def dashboard_integrated():
    """Serve integrated dashboard"""
    return send_from_directory('.', 'dashboard_integrated.html')

@app.route('/dashboard_v5_final.html')
def dashboard_v5_final():
    """Serve dashboard v5 final"""
    return send_from_directory('.', 'dashboard_v5_final.html')

@app.route('/dashboard_v5.html')
def dashboard_v5():
    """Serve dashboard v5"""
    return send_from_directory('.', 'dashboard_v5.html')

# Templates directory HTML files
@app.route('/admin_dashboard_mới.html')
def admin_dashboard_new():
    """Serve new admin dashboard"""
    return send_from_directory('templates', 'admin_dashboard_mới.html')

@app.route('/admin_dashboard_old.html')
def admin_dashboard_old():
    """Serve old admin dashboard"""
    return send_from_directory('templates', 'admin_dashboard_old.html')

@app.route('/admin_dashboard.html')
def admin_dashboard():
    """Serve admin dashboard"""
    return send_from_directory('templates', 'admin_dashboard.html')

@app.route('/admin_login.html')
def admin_login():
    """Serve admin login page"""
    return send_from_directory('templates', 'admin_login.html')

@app.route('/templates_index.html')
def templates_index():
    """Serve templates index page"""
    return send_from_directory('templates', 'index.html')

# Static files
@app.route('/style.css')
def serve_css():
    """Serve CSS file"""
    return send_from_directory('.', 'style.css')

@app.route('/script.js')
def serve_js():
    """Serve JavaScript file"""
    return send_from_directory('.', 'script.js')

@app.route('/journal_db_manager.js')
def serve_journal_db_manager():
    """Serve Journal Database Manager JavaScript file"""
    return send_from_directory('.', 'journal_db_manager.js')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files from static directory"""
    try:
        return send_from_directory('static', filename)
    except:
        return jsonify({'error': 'Static file not found'}), 404

@app.route('/images/<path:filename>')
def serve_images(filename):
    """Serve image files"""
    try:
        return send_from_directory('images', filename)
    except:
        return jsonify({'error': 'Image not found'}), 404

@app.route('/signatures/<path:filename>')
def serve_signatures(filename):
    """Serve signature files"""
    try:
        return send_from_directory('signatures', filename)
    except:
        return jsonify({'error': 'Signature file not found'}), 404

# =============================================================================
# API ROUTES
# =============================================================================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = db.get_all_users()
        return jsonify({
            "success": True,
            "data": users,
            "total": len(users)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'username', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        # Validate role
        if data['role'] not in ['ADMIN', 'MANAGER', 'TRAINER']:
            return jsonify({"success": False, "error": "Invalid role. Must be ADMIN, MANAGER, or TRAINER"}), 400
        
        new_user = db.create_user(data)
        return jsonify({"success": True, "data": new_user})
            
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        user = db.get_user_by_id(user_id)
        if user:
            return jsonify({"success": True, "data": user})
        else:
            return jsonify({"success": False, "error": "User not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user"""
    try:
        data = request.get_json()
        updated_user = db.update_user(user_id, data)
        return jsonify({"success": True, "data": updated_user})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user"""
    try:
        success = db.delete_user(user_id)
        if success:
            return jsonify({"success": True, "message": "User deleted successfully"})
        else:
            return jsonify({"success": False, "error": "User not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dogs', methods=['GET'])
def get_dogs():
    """Get all dogs"""
    try:
        dogs = db.get_all_dogs()
        return jsonify({
            "success": True,
            "data": dogs,
            "total": len(dogs)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dogs', methods=['POST'])
def create_dog():
    """Create new dog"""
    try:
        data = request.get_json()
        
        # Handle both chipId and chip_id for backward compatibility
        if 'chipId' in data and 'chip_id' not in data:
            data['chip_id'] = data.pop('chipId')
        
        required_fields = ['name', 'chip_id', 'breed']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        # Handle trainerId to trainer_id conversion
        if 'trainerId' in data and 'trainer_id' not in data:
            data['trainer_id'] = data.pop('trainerId')
        
        new_dog = db.create_dog(data)
        return jsonify({"success": True, "data": new_dog})
            
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dogs/<int:dog_id>', methods=['GET'])
def get_dog(dog_id):
    """Get dog by ID"""
    try:
        dog = db.get_dog_by_id(dog_id)
        if dog:
            return jsonify({"success": True, "data": dog})
        else:
            return jsonify({"success": False, "error": "Dog not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dogs/<int:dog_id>', methods=['PUT'])
def update_dog(dog_id):
    """Update dog"""
    try:
        data = request.get_json()
        
        # Handle field name conversions
        if 'chipId' in data and 'chip_id' not in data:
            data['chip_id'] = data.pop('chipId')
        if 'trainerId' in data and 'trainer_id' not in data:
            data['trainer_id'] = data.pop('trainerId')
        
        updated_dog = db.update_dog(dog_id, data)
        return jsonify({"success": True, "data": updated_dog})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dogs/<int:dog_id>', methods=['DELETE'])
def delete_dog(dog_id):
    """Delete dog"""
    try:
        success = db.delete_dog(dog_id)
        if success:
            return jsonify({"success": True, "message": "Dog deleted successfully"})
        else:
            return jsonify({"success": False, "error": "Dog not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User authentication with session creation"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        remember_me = data.get('remember_me', False)
        
        if not username or not password:
            return jsonify({"success": False, "error": "Missing username or password"}), 400
        
        user = db.authenticate_user(username, password)
        
        if user:
            # Create session if remember_me is true
            session_token = None
            if remember_me:
                ip_address = request.remote_addr
                user_agent = request.headers.get('User-Agent')
                session_token = db.create_session(user['id'], ip_address, user_agent)
            
            response_data = {
                "success": True, 
                "data": user,
                "session_token": session_token,
                "remember_me": remember_me
            }
            
            return jsonify(response_data)
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/auth/validate-session', methods=['POST'])
def validate_session():
    """Validate session token"""
    try:
        data = request.get_json()
        session_token = data.get('session_token')
        
        if not session_token:
            return jsonify({"success": False, "error": "Missing session token"}), 400
        
        session_data = db.validate_session(session_token)
        
        if session_data:
            # Get assigned dogs for the user
            assigned_dog_names = db.get_user_assigned_dog_names(session_data['user_id'])
            session_data['assignedDogs'] = assigned_dog_names
            
            return jsonify({"success": True, "data": session_data})
        else:
            return jsonify({"success": False, "error": "Invalid or expired session"}), 401
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout and invalidate session"""
    try:
        data = request.get_json()
        session_token = data.get('session_token')
        
        if session_token:
            db.invalidate_session(session_token)
        
        return jsonify({"success": True, "message": "Logged out successfully"})
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/stats/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = db.get_dashboard_stats()
        return jsonify({"success": True, "data": stats})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/dashboard/init', methods=['POST'])
def initialize_dashboard_data():
    """Initialize dashboard with default data if database is empty"""
    try:
        # Check if database has data
        users = db.get_all_users()
        dogs = db.get_all_dogs()
        
        if len(users) == 0 or len(dogs) == 0:
            # Initialize with default data
            db.migrate_from_json()
            return jsonify({
                "success": True, 
                "message": "Dashboard initialized with default data",
                "initialized": True
            })
        else:
            return jsonify({
                "success": True, 
                "message": "Dashboard already has data",
                "initialized": False
            })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# =============================================================================
# TRAINING JOURNAL API ROUTES
# =============================================================================

@app.route('/api/journals', methods=['GET'])
def get_training_journals():
    """Get all training journals"""
    try:
        limit = request.args.get('limit', 100, type=int)
        dog_id = request.args.get('dog_id', type=int)
        
        if dog_id:
            journals = db.get_training_journals_by_dog(dog_id, limit)
        else:
            journals = db.get_all_training_journals(limit)
        
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals', methods=['POST'])
def create_training_journal():
    """Create training journal entry"""
    try:
        data = request.get_json()
        
        required_fields = ['dog_id', 'trainer_id', 'journal_date']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        journal = db.create_training_journal(data)
        return jsonify({"success": True, "data": journal})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/<int:journal_id>', methods=['GET'])
def get_training_journal(journal_id):
    """Get training journal by ID"""
    try:
        journal = db.get_training_journal_by_id(journal_id)
        if journal:
            return jsonify({"success": True, "data": journal})
        else:
            return jsonify({"success": False, "error": "Journal not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/<int:journal_id>', methods=['PUT'])
def update_training_journal(journal_id):
    """Update training journal"""
    try:
        data = request.get_json()
        updated_journal = db.update_training_journal(journal_id, data)
        return jsonify({"success": True, "data": updated_journal})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/<int:journal_id>/approve', methods=['POST'])
def approve_training_journal(journal_id):
    """Approve or reject training journal"""
    try:
        data = request.get_json()
        approver_id = data.get('approver_id')
        approved = data.get('approved', True)
        rejection_reason = data.get('rejection_reason')
        
        if not approver_id:
            return jsonify({"success": False, "error": "Approver ID is required"}), 400
        
        journal = db.approve_training_journal(journal_id, approver_id, approved, rejection_reason)
        return jsonify({"success": True, "data": journal})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/<int:journal_id>', methods=['DELETE'])
def delete_training_journal(journal_id):
    """Delete training journal"""
    try:
        success = db.delete_training_journal(journal_id)
        if success:
            return jsonify({"success": True, "message": "Journal deleted successfully"})
        else:
            return jsonify({"success": False, "error": "Journal not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/by-dog/<int:dog_id>', methods=['GET'])
def get_journals_by_dog(dog_id):
    """Get all journals for a specific dog"""
    try:
        journals = db.get_training_journals_by_dog(dog_id)
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/by-trainer/<int:trainer_id>', methods=['GET'])
def get_journals_by_trainer(trainer_id):
    """Get all journals for a specific trainer"""
    try:
        journals = db.get_training_journals_by_trainer(trainer_id)
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/pending', methods=['GET'])
def get_pending_journals():
    """Get all journals pending approval"""
    try:
        journals = db.get_pending_journals()
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/approved', methods=['GET'])
def get_approved_journals():
    """Get all approved journals"""
    try:
        journals = db.get_approved_journals()
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/migrate-from-localstorage', methods=['POST'])
def migrate_journals_from_localstorage():
    """Migrate journals from localStorage to database"""
    try:
        data = request.get_json()
        journals_data = data.get('journals', [])
        
        migrated_count = 0
        errors = []
        
        for journal_data in journals_data:
            try:
                # Convert localStorage journal format to database format
                db_journal_data = convert_localstorage_to_db_format(journal_data)
                journal = db.create_training_journal(db_journal_data)
                migrated_count += 1
            except Exception as e:
                errors.append(f"Failed to migrate journal {journal_data.get('key', 'unknown')}: {str(e)}")
        
        return jsonify({
            "success": True,
            "migrated_count": migrated_count,
            "total_journals": len(journals_data),
            "errors": errors
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def convert_localstorage_to_db_format(localstorage_data):
    """Convert localStorage journal format to database format"""
    general_info = localstorage_data.get('generalInfo', {})
    approval = localstorage_data.get('approval', {})
    
    # Extract dog and trainer information
    dog_name = general_info.get('dogName', '')
    trainer_name = general_info.get('hlv', '')
    
    # Find dog and trainer IDs from database
    dogs = db.get_all_dogs()
    users = db.get_all_users()
    
    dog_id = None
    trainer_id = None
    
    for dog in dogs:
        if dog['name'] == dog_name:
            dog_id = dog['id']
            break
    
    for user in users:
        if user['name'] == trainer_name:
            trainer_id = user['id']
            break
    
    if not dog_id or not trainer_id:
        raise ValueError(f"Could not find dog '{dog_name}' or trainer '{trainer_name}' in database")
    
    # Convert training blocks to training activities
    training_blocks = localstorage_data.get('trainingBlocks', [])
    training_activities = []
    for block in training_blocks:
        if block.get('content'):
            training_activities.append(block['content'])
    
    # Convert operation blocks to operation activities
    operation_blocks = localstorage_data.get('operationBlocks', [])
    operation_activities = []
    for block in operation_blocks:
        if block.get('content'):
            operation_activities.append(block['content'])
    
    # Convert care data
    care_data = localstorage_data.get('care', {})
    care_activities = []
    if care_data.get('morning'):
        care_activities.append(f"Sáng: {care_data['morning']}")
    if care_data.get('afternoon'):
        care_activities.append(f"Chiều: {care_data['afternoon']}")
    if care_data.get('evening'):
        care_activities.append(f"Tối: {care_data['evening']}")
    
    # Determine approval status
    approval_status = 'PENDING'
    if approval.get('leaderStatus') and 'Đã duyệt' in approval['leaderStatus']:
        approval_status = 'APPROVED'
    elif approval.get('leaderStatus') and 'Từ chối' in approval['leaderStatus']:
        approval_status = 'REJECTED'
    
    return {
        'dog_id': dog_id,
        'trainer_id': trainer_id,
        'journal_date': general_info.get('date', ''),
        'training_activities': '; '.join(training_activities),
        'care_activities': '; '.join(care_activities),
        'operation_activities': '; '.join(operation_activities),
        'health_status': localstorage_data.get('health', {}).get('status', 'Tốt'),
        'behavior_notes': localstorage_data.get('hlvComment', ''),
        'weather_conditions': localstorage_data.get('health', {}).get('weather', ''),
        'challenges': localstorage_data.get('otherIssues', ''),
        'approval_status': approval_status,
        'approved_by': None,  # Will be set when approved
        'approved_at': None,
        'rejection_reason': approval.get('leaderComment', '') if approval_status == 'REJECTED' else None
    }

# =============================================================================
# USER-DOG ASSIGNMENT API ROUTES
# =============================================================================

@app.route('/api/users/<int:user_id>/dogs', methods=['GET'])
def get_user_assigned_dogs(user_id):
    """Get dogs assigned to user"""
    try:
        dogs = db.get_user_assigned_dogs(user_id)
        return jsonify({
            "success": True,
            "data": dogs,
            "total": len(dogs)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<int:user_id>/dogs/<int:dog_id>', methods=['POST'])
def assign_dog_to_user(user_id, dog_id):
    """Assign dog to user"""
    try:
        data = request.get_json()
        assignment_type = data.get('assignment_type', 'TRAINER')
        
        success = db.assign_dog_to_user(user_id, dog_id, assignment_type)
        if success:
            return jsonify({"success": True, "message": "Dog assigned successfully"})
        else:
            return jsonify({"success": False, "error": "Failed to assign dog"}), 500
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<int:user_id>/dogs/<int:dog_id>', methods=['DELETE'])
def unassign_dog_from_user(user_id, dog_id):
    """Unassign dog from user"""
    try:
        success = db.unassign_dog_from_user(user_id, dog_id)
        if success:
            return jsonify({"success": True, "message": "Dog unassigned successfully"})
        else:
            return jsonify({"success": False, "error": "Assignment not found"}), 404
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error"}), 500

# =============================================================================
# MAIN
# =============================================================================

if __name__ == '__main__':
    initialize_database()
    print("🚀 K9 Management Backend API Server Starting...")
    print("\n📋 Available Routes:")
    print("🌐 Main App: http://localhost:5000/")
    # print("📊 Dashboard Complete: http://localhost:5000/dashboard_complete.html")
    # print("📊 Dashboard Integrated: http://localhost:5000/dashboard_integrated.html")
    # print("📊 Dashboard V5 Final: http://localhost:5000/dashboard_v5_final.html")
    # print("📊 Dashboard V5: http://localhost:5000/dashboard_v5.html")
    # print("🔐 Admin Dashboard: http://localhost:5000/admin_dashboard.html")
    # print("🔐 Admin Dashboard (New): http://localhost:5000/admin_dashboard_mới.html")
    # print("🔐 Admin Dashboard (Old): http://localhost:5000/admin_dashboard_old.html")
    # print("🔐 Admin Login: http://localhost:5000/admin_login.html")
    # print("📄 Templates Index: http://localhost:5000/templates_index.html")
    # print("\n🔧 API Endpoints:")
    # print("  📝 Users: GET/POST /api/users")
    # print("  🐶 Dogs: GET/POST /api/dogs")
    # print("  📖 Journals: GET/POST /api/journals")
    # print("  🔐 Auth: POST /api/auth/login")
    # print("  📊 Stats: GET /api/stats/dashboard")
    # print("\n📁 Static Files: http://localhost:5000/static/")
    # print("🖼️ Images: http://localhost:5000/images/")
    # print("✍️ Signatures: http://localhost:5000/signatures/")
    # print("\n💾 Database: SQLite (k9_management.db)")
    app.run(debug=True, host='0.0.0.0', port=5000)