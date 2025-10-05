from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import hashlib
from datetime import datetime
from database import db

app = Flask(__name__)
CORS(app)

# Audio cache directory
AUDIO_CACHE_DIR = 'audio_cache'
if not os.path.exists(AUDIO_CACHE_DIR):
    os.makedirs(AUDIO_CACHE_DIR)

def initialize_database():
    """Initialize database"""
    try:
        # Check if database is empty
        users = db.get_all_users()
        if not users:
            print("⚠️ Database is empty - no data available")
        else:
            print("✅ Database initialized with existing data")
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

@app.route('/signatures/<filename>')
def serve_signature(filename):
    """Serve signature images"""
    try:
        return send_from_directory('signatures', filename)
    except FileNotFoundError:
        return jsonify({"error": "Signature file not found"}), 404

@app.route('/api/upload-signature', methods=['POST'])
def upload_signature():
    """Upload signature image"""
    try:
        if 'signature' not in request.files:
            return jsonify({"success": False, "error": "No signature file provided"}), 400
        
        file = request.files['signature']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        # Validate file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"success": False, "error": "Invalid file type. Only PNG, JPG, JPEG allowed"}), 400
        
        # Generate unique filename
        import uuid
        import os
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        
        # Save file to signatures directory
        file_path = os.path.join('signatures', unique_filename)
        file.save(file_path)
        
        return jsonify({
            "success": True,
            "filename": unique_filename,
            "message": "Signature uploaded successfully"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

@app.route('/care-plans/<path:filename>')
def serve_care_plans(filename):
    """Serve care plan PDF files"""
    try:
        return send_from_directory('care-plans', filename)
    except:
        return jsonify({'error': 'Care plan file not found'}), 404

@app.route('/api/upload-care-plan', methods=['POST'])
def upload_care_plan():
    """Upload care plan PDF file - Admin only"""
    try:
        # Get user role from request headers or session
        # For now, we'll check if the request includes a role header
        user_role = request.headers.get('X-User-Role', 'GUEST')
        
        # Only allow Admin to upload
        if user_role not in ['ADMIN']:
            return jsonify({"success": False, "error": "Chỉ Admin mới có quyền upload tài liệu"}), 403
        
        if 'care_plan' not in request.files:
            return jsonify({"success": False, "error": "No care plan file provided"}), 400
        
        file = request.files['care_plan']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        # Validate file type - only PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"success": False, "error": "Invalid file type. Only PDF files allowed"}), 400
        
        # Validate file size (max 10MB)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            return jsonify({"success": False, "error": "File too large. Maximum size is 10MB"}), 400
        
        # Create care-plans directory if it doesn't exist
        import os
        care_plans_dir = 'care-plans'
        if not os.path.exists(care_plans_dir):
            os.makedirs(care_plans_dir)
        
        # Use original filename, but handle duplicates
        original_filename = file.filename
        file_path = os.path.join(care_plans_dir, original_filename)
        
        # If file already exists, add a number suffix
        counter = 1
        base_name, extension = os.path.splitext(original_filename)
        while os.path.exists(file_path):
            new_filename = f"{base_name}_{counter}{extension}"
            file_path = os.path.join(care_plans_dir, new_filename)
            counter += 1
        
        # Get the final filename (in case it was modified due to duplicates)
        final_filename = os.path.basename(file_path)
        
        # Save file to care-plans directory
        file.save(file_path)
        
        # Store metadata about the file
        metadata_file = os.path.join(care_plans_dir, 'metadata.json')
        metadata = {}
        
        # Load existing metadata if it exists
        if os.path.exists(metadata_file):
            try:
                import json
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
            except:
                metadata = {}
        
        # Add new file metadata
        metadata[final_filename] = {
            "original_name": file.filename,
            "upload_date": datetime.now().isoformat(),
            "size": file_size
        }
        
        # Save updated metadata
        try:
            import json
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Warning: Could not save metadata: {e}")
        
        return jsonify({
            "success": True,
            "filename": final_filename,
            "original_name": file.filename,
            "size": file_size,
            "message": "Care plan uploaded successfully"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/care-plans', methods=['GET'])
def get_care_plans():
    """Get list of uploaded care plan files"""
    try:
        import os
        care_plans_dir = 'care-plans'
        
        if not os.path.exists(care_plans_dir):
            return jsonify({
                "success": True,
                "data": [],
                "total": 0
            })
        
        files = []
        metadata_file = os.path.join(care_plans_dir, 'metadata.json')
        metadata = {}
        
        # Load metadata if it exists
        if os.path.exists(metadata_file):
            try:
                import json
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
            except:
                metadata = {}
        
        for filename in os.listdir(care_plans_dir):
            if filename.lower().endswith('.pdf') and filename != 'metadata.json':
                file_path = os.path.join(care_plans_dir, filename)
                file_stat = os.stat(file_path)
                
                # Get original name from metadata, fallback to filename
                original_name = metadata.get(filename, {}).get('original_name', filename)
                
                files.append({
                    "filename": filename,
                    "original_name": original_name,
                    "size": file_stat.st_size,
                    "upload_date": metadata.get(filename, {}).get('upload_date', datetime.fromtimestamp(file_stat.st_ctime).isoformat()),
                    "modified_date": datetime.fromtimestamp(file_stat.st_mtime).isoformat()
                })
        
        # Sort by upload date (newest first)
        files.sort(key=lambda x: x['upload_date'], reverse=True)
        
        return jsonify({
            "success": True,
            "data": files,
            "total": len(files)
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/care-plans/<filename>', methods=['DELETE'])
def delete_care_plan(filename):
    """Delete care plan file - Admin only"""
    try:
        # Get user role from request headers or session
        user_role = request.headers.get('X-User-Role', 'GUEST')
        
        # Only allow Admin to delete
        if user_role not in ['ADMIN']:
            return jsonify({"success": False, "error": "Chỉ Admin mới có quyền xóa tài liệu"}), 403
        
        import os
        care_plans_dir = 'care-plans'
        file_path = os.path.join(care_plans_dir, filename)
        
        if not os.path.exists(file_path):
            return jsonify({"success": False, "error": "File not found"}), 404
        
        # Validate filename to prevent directory traversal
        if '..' in filename or '/' in filename or '\\' in filename:
            return jsonify({"success": False, "error": "Invalid filename"}), 400
        
        os.remove(file_path)
        
        # Remove metadata for this file
        metadata_file = os.path.join(care_plans_dir, 'metadata.json')
        if os.path.exists(metadata_file):
            try:
                import json
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                
                # Remove the file entry from metadata
                if filename in metadata:
                    del metadata[filename]
                
                # Save updated metadata
                with open(metadata_file, 'w', encoding='utf-8') as f:
                    json.dump(metadata, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Warning: Could not update metadata: {e}")
        
        return jsonify({
            "success": True,
            "message": "Care plan deleted successfully"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify logging works"""
    print("TEST ENDPOINT CALLED!")
    return jsonify({"success": True, "message": "Test endpoint working"})

@app.route('/api/journals', methods=['POST'])
def create_training_journal():
    """Create training journal entry"""
    # Log to file for debugging with UTF-8 encoding
    with open('debug.log', 'a', encoding='utf-8') as f:
        f.write("=" * 50 + "\n")
        f.write("JOURNAL CREATION REQUEST RECEIVED!\n")
        f.write("=" * 50 + "\n")
        f.flush()
    
    print("=" * 50)
    print("JOURNAL CREATION REQUEST RECEIVED!")
    print("=" * 50)
    import sys
    sys.stdout.flush()
    
    try:
        data = request.get_json()
        
        # Log to file
        with open('debug.log', 'a', encoding='utf-8') as f:
            f.write(f"Received journal data: {data}\n")
            f.flush()
        
        print(f"Received journal data: {data}")
        
        required_fields = ['dog_id', 'trainer_id', 'journal_date']
        for field in required_fields:
            if field not in data:
                error_msg = f"Missing required field: {field}"
                with open('debug.log', 'a', encoding='utf-8') as f:
                    f.write(error_msg + "\n")
                    f.flush()
                print(error_msg)
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        success_msg = "All required fields present"
        with open('debug.log', 'a', encoding='utf-8') as f:
            f.write(success_msg + "\n")
            f.flush()
        print(success_msg)
        
        journal = db.create_training_journal(data)
        
        db_result_msg = f"Database returned: {journal}"
        with open('debug.log', 'a', encoding='utf-8') as f:
            f.write(db_result_msg + "\n")
            f.flush()
        print(db_result_msg)
        
        if journal is None:
            error_msg = "Database function returned None!"
            with open('debug.log', 'a', encoding='utf-8') as f:
                f.write(error_msg + "\n")
                f.flush()
            print(error_msg)
            return jsonify({"success": False, "error": "Database operation failed - no data returned"}), 500
        
        response = {"success": True, "data": journal}
        response_msg = f"Sending response: {response}"
        with open('debug.log', 'a', encoding='utf-8') as f:
            f.write(response_msg + "\n")
            f.flush()
        print(response_msg)
        return jsonify(response)
        
    except Exception as e:
        error_msg = f"Exception in create_training_journal: {e}"
        with open('debug.log', 'a', encoding='utf-8') as f:
            f.write(error_msg + "\n")
            f.flush()
        print(error_msg)
        import traceback
        traceback.print_exc()
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
        
        # Get signature data
        leader_signature = data.get('leader_signature')
        leader_signature_timestamp = data.get('leader_signature_timestamp')
        
        print(f"🔍 Received approval data: approver_id={approver_id}, approved={approved}")
        print(f"🔍 Signature data: leader_signature={leader_signature[:100] if leader_signature else None}..., timestamp={leader_signature_timestamp}")
        
        if not approver_id:
            return jsonify({"success": False, "error": "Approver ID is required"}), 400
        
        journal = db.approve_training_journal(journal_id, approver_id, approved, rejection_reason, 
                                            leader_signature, leader_signature_timestamp)
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

@app.route('/api/journals/by-dog/<dog_name>', methods=['GET'])
def get_journals_by_dog_name(dog_name):
    """Get all journals for a specific dog by name"""
    try:
        # First get the dog by name
        dogs = db.get_all_dogs()
        dog = next((d for d in dogs if d['name'] == dog_name), None)
        
        if not dog:
            return jsonify({"success": False, "error": "Dog not found"}), 404
        
        journals = db.get_training_journals_by_dog(dog['id'])
        return jsonify({
            "success": True,
            "data": journals,
            "total": len(journals)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/journals/by-dog-date/<dog_name>/<journal_date>', methods=['GET'])
def get_journal_by_dog_date(dog_name, journal_date):
    """Get a specific journal by dog name and date"""
    try:
        # First get the dog by name
        dogs = db.get_all_dogs()
        dog = next((d for d in dogs if d['name'] == dog_name), None)
        
        if not dog:
            return jsonify({"success": False, "error": "Dog not found"}), 404
        
        # Get all journals for this dog and find the one with matching date
        # Return the journal with the most complete data (most content)
        journals = db.get_training_journals_by_dog(dog['id'])
        matching_journals = [j for j in journals if j['journal_date'] == journal_date]
        
        if not matching_journals:
            return jsonify({"success": False, "error": "Journal not found"}), 404
        
        # Find the journal with the most complete data
        # Priority: has training data > has care data > has operation data > most recent
        def journal_completeness_score(j):
            score = 0
            if j.get('training_activities') and len(j['training_activities']) > 10:
                score += 100
            if j.get('care_activities') and len(j['care_activities']) > 10:
                score += 50
            if j.get('operation_activities') and len(j['operation_activities']) > 10:
                score += 25
            # Add timestamp-based score for tie-breaking
            if j.get('updated_at'):
                score += 1
            return score
        
        journal = max(matching_journals, key=journal_completeness_score)
        
        # Merge signature data from other journals for the same dog and date
        for other_journal in matching_journals:
            if other_journal['id'] != journal['id']:
                # Merge signature data if it exists in other journal but not in main journal
                if other_journal.get('hlv_signature') and not journal.get('hlv_signature'):
                    journal['hlv_signature'] = other_journal['hlv_signature']
                    journal['hlv_signature_timestamp'] = other_journal.get('hlv_signature_timestamp')
                if other_journal.get('leader_signature') and not journal.get('leader_signature'):
                    journal['leader_signature'] = other_journal['leader_signature']
                    journal['leader_signature_timestamp'] = other_journal.get('leader_signature_timestamp')
                if other_journal.get('substitute_signature') and not journal.get('substitute_signature'):
                    journal['substitute_signature'] = other_journal['substitute_signature']
                    journal['substitute_signature_timestamp'] = other_journal.get('substitute_signature_timestamp')
        
        return jsonify({
            "success": True,
            "data": journal
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
# MIGRATION STATUS API ROUTES
# =============================================================================

@app.route('/api/migration/status', methods=['GET'])
def get_migration_status():
    """Get migration status"""
    try:
        # For now, return default status
        # In a full implementation, this would be stored in database
        status = {
            "users": False,
            "dogs": False,
            "journals": False,
            "sessions": False,
            "notifications": False
        }
        return jsonify({"success": True, "data": status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/migration/status', methods=['POST'])
def update_migration_status():
    """Update migration status"""
    try:
        data = request.get_json()
        component = data.get('component')
        status = data.get('status')
        
        # For now, just log the status update
        # In a full implementation, this would be stored in database
        print(f"Migration status updated: {component} = {status}")
        
        return jsonify({"success": True, "message": "Status updated"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# =============================================================================
# TEXT-TO-SPEECH ENDPOINTS
# =============================================================================

@app.route('/api/tts/speak', methods=['POST'])
def text_to_speech():
    """Convert text to speech using gTTS"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        lang = data.get('lang', 'vi')  # Default to Vietnamese
        
        if not text:
            return jsonify({"success": False, "error": "No text provided"}), 400
        
        # Import gTTS here to avoid import errors if not installed
        try:
            from gtts import gTTS
            import tempfile
            import base64
            import io
        except ImportError:
            return jsonify({"success": False, "error": "gTTS not installed. Please install with: pip install gTTS"}), 500
        
        # Create gTTS object
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Generate audio in memory
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Convert to base64 for JSON response
        audio_base64 = base64.b64encode(audio_buffer.getvalue()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "audio": audio_base64,
            "text": text,
            "lang": lang,
            "size": len(audio_buffer.getvalue())
        })
        
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tts/speak/file', methods=['POST'])
def text_to_speech_file():
    """Convert text to speech and save as file"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        lang = data.get('lang', 'vi')  # Default to Vietnamese
        
        if not text:
            return jsonify({"success": False, "error": "No text provided"}), 400
        
        # Import gTTS here to avoid import errors if not installed
        try:
            from gtts import gTTS
            import tempfile
            import os
        except ImportError:
            return jsonify({"success": False, "error": "gTTS not installed. Please install with: pip install gTTS"}), 500
        
        # Create hash for filename based on content (UTF-8 safe, same as frontend)
        cleaned_content = text.replace('\s+', ' ').strip()
        content_hash = hashlib.md5(cleaned_content.encode('utf-8')).hexdigest()[:16]
        audio_filename = f"{content_hash}.mp3"
        audio_path = os.path.join(AUDIO_CACHE_DIR, audio_filename)
        
        # Check if audio already exists
        if os.path.exists(audio_path):
            file_size = os.path.getsize(audio_path)
            return jsonify({
                "success": True,
                "filename": audio_filename,
                "full_path": audio_path,
                "text": text,
                "lang": lang,
                "size": file_size,
                "cached": True
            })
        
        # Create gTTS object and save to file
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(audio_path)
        
        # Get file size
        file_size = os.path.getsize(audio_path)
        
        return jsonify({
            "success": True,
            "filename": audio_filename,
            "full_path": audio_path,
            "text": text,
            "lang": lang,
            "size": file_size,
            "cached": False
        })
        
    except Exception as e:
        print(f"❌ TTS File Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tts/preload', methods=['POST'])
def preload_audio():
    """Pre-generate and cache audio for text content"""
    try:
        data = request.get_json()
        content_sections = data.get('sections', [])
        
        if not content_sections:
            return jsonify({"success": False, "error": "No content sections provided"}), 400
        
        # Import gTTS here to avoid import errors if not installed
        try:
            from gtts import gTTS
        except ImportError:
            return jsonify({"success": False, "error": "gTTS not installed. Please install with: pip install gTTS"}), 500
        
        generated_files = []
        
        for section in content_sections:
            title = section.get('title', '')
            content = section.get('content', '')
            
            if not content.strip():
                continue
            
            # Create hash for filename based on content (UTF-8 safe, same as frontend)
            cleaned_content = content.replace('\s+', ' ').strip()
            content_hash = hashlib.md5(cleaned_content.encode('utf-8')).hexdigest()[:16]
            audio_filename = f"{content_hash}.mp3"
            audio_path = os.path.join(AUDIO_CACHE_DIR, audio_filename)
            
            # Check if audio already exists
            if os.path.exists(audio_path):
                generated_files.append({
                    "title": title,
                    "filename": audio_filename,
                    "cached": True
                })
                continue
            
            # Generate audio
            try:
                tts = gTTS(text=content, lang='vi', slow=False)
                tts.save(audio_path)
                
                file_size = os.path.getsize(audio_path)
                
                generated_files.append({
                    "title": title,
                    "filename": audio_filename,
                    "size": file_size,
                    "cached": False
                })
                
                print(f"✅ Generated audio for '{title}': {audio_filename} ({file_size} bytes)")
                
            except Exception as e:
                print(f"❌ Error generating audio for '{title}': {e}")
                continue
        
        return jsonify({
            "success": True,
            "generated": generated_files,
            "total_files": len(generated_files)
        })
        
    except Exception as e:
        print(f"❌ Preload Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tts/get/<filename>')
def get_cached_audio(filename):
    """Serve cached audio file"""
    try:
        # Security check - only allow .mp3 files
        if not filename.endswith('.mp3'):
            return jsonify({"success": False, "error": "Invalid file type"}), 400
        
        audio_path = os.path.join(AUDIO_CACHE_DIR, filename)
        
        if not os.path.exists(audio_path):
            return jsonify({"success": False, "error": "Audio file not found"}), 404
        
        return send_from_directory(AUDIO_CACHE_DIR, filename, as_attachment=False, mimetype='audio/mpeg')
        
    except Exception as e:
        print(f"❌ Audio serve error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tts/cache/status')
def get_cache_status():
    """Get status of audio cache"""
    try:
        cache_files = []
        total_size = 0
        
        if os.path.exists(AUDIO_CACHE_DIR):
            for filename in os.listdir(AUDIO_CACHE_DIR):
                if filename.endswith('.mp3'):
                    file_path = os.path.join(AUDIO_CACHE_DIR, filename)
                    file_size = os.path.getsize(file_path)
                    total_size += file_size
                    
                    cache_files.append({
                        "filename": filename,
                        "size": file_size
                    })
        
        return jsonify({
            "success": True,
            "cache_dir": AUDIO_CACHE_DIR,
            "file_count": len(cache_files),
            "total_size": total_size,
            "files": cache_files
        })
        
    except Exception as e:
        print(f"❌ Cache status error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tts/cache/clear', methods=['POST'])
def clear_audio_cache():
    """Clear all cached audio files"""
    try:
        cleared_count = 0
        total_size = 0
        
        if os.path.exists(AUDIO_CACHE_DIR):
            for filename in os.listdir(AUDIO_CACHE_DIR):
                if filename.endswith('.mp3'):
                    file_path = os.path.join(AUDIO_CACHE_DIR, filename)
                    file_size = os.path.getsize(file_path)
                    total_size += file_size
                    
                    os.remove(file_path)
                    cleared_count += 1
        
        return jsonify({
            "success": True,
            "cleared_files": cleared_count,
            "freed_space": total_size
        })
        
    except Exception as e:
        print(f"❌ Cache clear error: {e}")
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