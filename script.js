// Log to confirm script loads and executes
console.log("script.js loaded and running - FIXED DIGITAL SIGNATURE & PDF VIEW VERSION");

// ===== THÊM PHẦN QUẢN LÝ CHỮ KÝ THỰC =====

// Hệ thống quản lý chữ ký - lưu trong localStorage hoặc kết nối thư mục
const SIGNATURE_STORAGE_KEY = 'k9_signatures_database';

// Khởi tạo database chữ ký mặc định
function initializeSignatureDatabase() {
    const existingSignatures = JSON.parse(localStorage.getItem(SIGNATURE_STORAGE_KEY)) || [];
    
    if (existingSignatures.length === 0) {
        const defaultSignatures = [
            {
                userId: 'admin',
                userName: 'Quản trị viên',
                role: 'ADMIN',
                signatureImage: 'signatures/admin_signature.png',
                signatureText: 'Quản trị viên',
                createdDate: new Date().toISOString()
            },
            {
                userId: 'Kien123',
                userName: 'Trần Đức Kiên',
                role: 'TRAINER',
                signatureImage: 'signatures/tran_duc_kien_signature.png',
                signatureText: 'Trần Đức Kiên',
                createdDate: new Date().toISOString()
            },
            {
                userId: 'Tuan123',
                userName: 'Nguyễn Văn Tuấn',
                role: 'TRAINER',
                signatureImage: 'signatures/nguyen_van_tuan_signature.png',
                signatureText: 'Nguyễn Văn Tuấn',
                createdDate: new Date().toISOString()
            },
            {
                userId: 'Quynh',
                userName: 'Hoàng Trọng Quỳnh', // SỬA: Đúng tên đăng nhập
                role: 'MANAGER',
                signatureImage: 'signatures/hoang_trong_quynh_signature.png', // SỬA: Đường dẫn đúng
                signatureText: 'Hoàng Trọng Quỳnh',
                createdDate: new Date().toISOString()
            },
            {
                userId: 'Quang',
                userName: 'Lê Văn Quang',
                role: 'TRAINER',
                signatureImage: 'signatures/le_van_quang_signature.png',
                signatureText: 'Lê Văn Quang',
                createdDate: new Date().toISOString()
            },
            {
                userId: 'Kien456',
                userName: 'Trần Kiên 456',
                role: 'ADMIN',
                signatureImage: 'signatures/tran_kien_456_signature.png',
                signatureText: 'Trần Kiên 456',
                createdDate: new Date().toISOString()
            }
        ];
        
        localStorage.setItem(SIGNATURE_STORAGE_KEY, JSON.stringify(defaultSignatures));
        console.log('✅ Initialized signature database');
    }
}

// Function lấy chữ ký của user - SỬA: FIX USER MAPPING HOÀNG TRỌNG QUỲNH
function getUserSignature(userName, role) {
    console.log('🔍 Getting signature for:', userName, role);
    
    const signatures = JSON.parse(localStorage.getItem(SIGNATURE_STORAGE_KEY)) || [];
    console.log('📋 Available signatures:', signatures.map(s => s.userName));
    
    // SỬA: Tìm theo tên chính xác trước, bỏ qua role nếu cần
    let signature = signatures.find(sig => sig.userName === userName);
    
    if (!signature) {
        // Tìm theo userId từ dashboard users
        const dashboardUsers = JSON.parse(localStorage.getItem('k9_users')) || [];
        console.log('👥 Dashboard users:', dashboardUsers.map(u => u.name + ' (' + u.username + ')'));
        
        const user = dashboardUsers.find(u => u.name === userName || u.username === userName);
        console.log('🎯 Found user match:', user);
        
        if (user) {
            signature = signatures.find(sig => sig.userId === user.username || sig.userName === user.name);
            console.log('🔗 Found signature via userId:', signature);
        }
    }
    
    // SỬA: Nếu vẫn không tìm thấy, tạo chữ ký tạm thời với user name chính xác
    if (!signature) {
        // SỬA: Mapping tên chính xác theo username - FIX HOÀNG TRỌNG QUỲNH
        let correctName = userName;
        if (userName === 'Quynh' || userName === 'Hoàng Trọng Quỳnh') {
            correctName = 'Hoàng Trọng Quỳnh'; // SỬA: Tên chính xác
        }
        
        signature = {
            userId: 'temp_' + Date.now(),
            userName: correctName, // SỬA: Sử dụng tên chính xác
            role: role,
            signatureImage: 'signatures/' + correctName.toLowerCase().replace(/\s/g, '_').replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e').replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o').replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd') + '_signature.png',
            signatureText: correctName,
            createdDate: new Date().toISOString()
        };
        
        // Lưu chữ ký tạm thời vào database
        signatures.push(signature);
        localStorage.setItem(SIGNATURE_STORAGE_KEY, JSON.stringify(signatures));
        console.log('📝 Created temporary signature for:', correctName, signature.signatureImage);
    }
    
    console.log('✅ Final signature:', signature);
    return signature;
}

// Function kiểm tra file chữ ký có tồn tại không - SỬA: FORCE HIỂN THỊ CHỮ KÝ
function checkSignatureImageExists(imagePath) {
    return new Promise((resolve) => {
        console.log('🔍 Checking signature image:', imagePath);
        const img = new Image();
        img.onload = () => {
            console.log('✅ Image loaded successfully:', imagePath);
            resolve(true);
        };
        img.onerror = () => {
            console.warn('❌ Image failed to load, will use text fallback:', imagePath);
            resolve(false); // SỬA: Return false để sử dụng text fallback
        };
        // Set timeout để tránh hang
        setTimeout(() => {
            console.warn('⏰ Image check timeout:', imagePath);
            resolve(false); // SỬA: Return false để sử dụng text fallback
        }, 3000);
        img.src = imagePath;
    });
}

// Function tạo HTML hiển thị chữ ký thực - SỬA: CẢI THIỆN HIỂN THỊ CHỮ KÝ
async function generateSignatureHTML(signatureData, timestamp) {
    console.log('🎨 Generating signature HTML for:', signatureData.userName, signatureData.signatureImage);
    
    // Kiểm tra xem ảnh chữ ký có tồn tại không
    const imageExists = await checkSignatureImageExists(signatureData.signatureImage);
    
    let signatureImageHTML = '';
    if (imageExists) {
        // Hiển thị ảnh chữ ký
        signatureImageHTML = `<div style="margin: 15px 0; text-align: center; position: relative;">
            <img src="${signatureData.signatureImage}" alt="Chữ ký ${signatureData.userName}" 
                 style="max-width: 300px; max-height: 120px; border: 2px solid #2196F3; padding: 10px;
                        background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display: none; margin-top: 10px; padding: 20px; border: 3px solid #2196F3;
                        background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;
                        font-size: 24px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                ${signatureData.signatureText}
            </div>
        </div>`;
        console.log('✅ Generated image HTML for signature');
    } else {
        // Fallback to text signature
        signatureImageHTML = `<div style="margin: 15px 0; padding: 20px; border: 3px solid #2196F3;
            background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;
            font-size: 24px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            ${signatureData.signatureText}
        </div>`;
        console.log('✅ Generated text fallback for signature');
    }
    
    const signatureId = 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const digitalSig = generateDigitalSignature(signatureData.userName, signatureData.role, timestamp);
    
    return `<div class="signature-display" style="border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <span style="font-size: 24px; margin-right: 10px;">✅</span>
            <strong style="font-size: 18px; color: #2e7d32;">${signatureData.userName}</strong>
        </div>
        ${signatureImageHTML}
        <div style="margin-top: 15px; padding: 12px; background: #e8f5e8; border-left: 4px solid #4caf50; border-radius: 4px;">
            <div style="font-size: 14px; color: #2e7d32; margin-bottom: 8px;">
                <strong>📅 Ký ngày:</strong> ${new Date(timestamp).toLocaleString('vi-VN')}
            </div>
            <div style="font-size: 14px; color: #2e7d32; margin-bottom: 8px;">
                <strong>🆔 ID:</strong> ${signatureId}
            </div>
            <div style="font-size: 12px; color: #666; font-family: monospace; word-break: break-all;">
                <strong>📝 Chữ ký số:</strong> ${digitalSig}
            </div>
        </div>
    </div>`;
}

// ===== THÊM PHẦN PHÂN QUYỀN VÀ DASHBOARD CONNECTION =====

let currentUserRole = 'GUEST'; // TRAINER, MANAGER, ADMIN
let currentUserName = '';
let currentUserAssignedDogs = [];
let isDashboardConnected = false;

// SỬA: Khởi tạo users mặc định để đảm bảo luôn có data - FIX HOÀNG TRỌNG QUỲNH
function initializeDefaultUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('k9_users')) || [];
    
    if (existingUsers.length === 0) {
        const defaultUsers = [
            {
                id: 1,
                name: 'Quản trị viên',
                username: 'admin',
                password: 'admin',
                role: 'ADMIN',
                assignedDogs: ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'],
                status: 'ACTIVE'
            },
            {
                id: 2,
                name: 'Trần Đức Kiên',
                username: 'trainer1',
                password: 'trainer',
                role: 'TRAINER',
                assignedDogs: ['CNV BI'],
                status: 'ACTIVE'
            },
            {
                id: 3,
                name: 'Vũ Văn Hào',  // SỬA: Từ "Nguyễn Văn Manager" → "Vũ Văn Hào"
                username: 'manager1',
                password: 'manager',
                role: 'MANAGER',
                assignedDogs: ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'],
                status: 'ACTIVE'
            },
            {
                id: 4,
                name: 'Trần Đức Kiên (Kien123)',
                username: 'Kien123',
                password: '123456',
                role: 'TRAINER',
                assignedDogs: ['CNV BI', 'CNV LU'],
                status: 'ACTIVE'
            },
            {
                id: 5,
                name: 'Nguyễn Văn Tuấn',
                username: 'Tuan123',
                password: '123456',
                role: 'TRAINER',
                assignedDogs: ['CNV RẾCH'],
                status: 'ACTIVE'
            },
            {
                id: 6,
                name: 'Hoàng Trọng Quỳnh',
                username: 'Quynh',
                password: '123456',
                role: 'MANAGER',
                assignedDogs: ['CNV KY', 'CNV REX'],
                status: 'ACTIVE'
            },
            {
                id: 7,
                name: 'Lê Văn Quang',
                username: 'Quang',
                password: '123456',
                role: 'TRAINER',
                assignedDogs: ['CNV KY'],
                status: 'ACTIVE'
            },
            {
                id: 8,
                name: 'Trần Kiên 456',
                username: 'Kien456',
                password: '123456',
                role: 'ADMIN',
                assignedDogs: ['CNV BI', 'CNV LU', 'CNV RËCH', 'CNV KY', 'CNV REX'],
                status: 'ACTIVE'
            }
        ];
        
        localStorage.setItem('k9_users', JSON.stringify(defaultUsers));
        console.log('✅ Initialized default users in localStorage');
    }
}

// Xử lý URL parameters khi mở từ Dashboard
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    const role = urlParams.get('role');
    const assignedDogs = urlParams.get('dogs');
    const journalKey = urlParams.get('journalKey');
    const viewMode = urlParams.get('view');
    
    // XỬ LÝ XEM JOURNAL TỪ DASHBOARD
    if (journalKey && viewMode === 'journal') {
        // Auto login as admin để xem journal
        currentUserRole = 'ADMIN';
        currentUserName = 'Dashboard Viewer';
        currentUserAssignedDogs = ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'];
        isDashboardConnected = true;
        autoLogin();
        setTimeout(() => {
            showA4JournalViewFromKey(journalKey);
        }, 500);
        return true;
    }
    
    if (user && role) {
        currentUserName = decodeURIComponent(user);
        currentUserRole = role.toUpperCase();
        currentUserAssignedDogs = assignedDogs ? decodeURIComponent(assignedDogs).split(',') : [];
        isDashboardConnected = true;
        autoLogin();
        return true;
    }
    
    return false;
}

// Auto login khi được mở từ Dashboard
function autoLogin() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showDashboardBanner();
    applyRoleBasedRestrictions();
    refreshDynamicMenus();
    showDefaultImage();
    updateUserDisplay();
}

// ===== SỬA LỖI LOGOUT - ĐÓNG TẤT CẢ DROPDOWN VÀ RESET UI =====
function closeAllDropdowns() {
    // Đóng user dropdown
    const userDropdown = document.getElementById('dynamicUserDropdown');
    if (userDropdown) {
        userDropdown.remove();
    }
    
    // Đóng tất cả custom dropdowns
    document.querySelectorAll('.custom-dropdown-options').forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
    
    // Đóng food dropdowns
    document.querySelectorAll('.custom-food-select-wrapper .custom-dropdown-options').forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
    
    console.log('✅ Closed all dropdowns');
}

// ===== GIẢI PHÁP CUỐI CÙNG - THAY THẾ HÀM updateUserDisplay() - SỬA: FIX TÊN HIỂN THỊ HOÀNG TRỌNG QUỲNH =====
function updateUserDisplay() {
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    const userInitials = document.getElementById('userInitials');
    
    if (currentUserName && currentUserRole !== 'GUEST') {
        if (!userInfoDisplay || !userInitials) {
            console.warn('User display elements not found');
            return;
        }
        
        // SỬA: Đảm bảo tên hiển thị đúng theo mapping - HOÀNG TRỌNG QUỲNH
        let displayName = currentUserName;
        
        // Fix mapping tên chính xác
        const dashboardUsers = JSON.parse(localStorage.getItem('k9_users')) || [];
        const currentUser = dashboardUsers.find(u => u.username === 'Quynh' || u.name === currentUserName);
        
        if (currentUser) {
            displayName = currentUser.name; // Sử dụng tên từ database
            console.log('🔄 Updated display name from dashboard:', displayName);
        }
        
        // SỬA: Override cho user Quynh - ĐẢM BẢO TÊN CHÍNH XÁC
        if (currentUserName === 'Quynh' || currentUserName.includes('Quỳnh') || currentUserName === 'Hoàng Trọng Quỳnh') {
            displayName = 'Hoàng Trọng Quỳnh'; // SỬA: Tên chính xác
        }
        
        // Hiển thị tên đầy đủ trong khung ô màu xanh
        userInitials.textContent = displayName;
        userInitials.style.cssText = 'background: #4CAF50; color: white; cursor: pointer; padding: 8px 15px; border-radius: 5px; font-size: 14px; font-weight: bold; border: none; outline: none; white-space: nowrap; min-width: 150px; text-align: center; display: block;';
        
        // XÓA dropdown cũ nếu có
        const oldDropdown = document.getElementById('userDropdown');
        if (oldDropdown) {
            oldDropdown.remove();
        }
        
        // TÍNH TOÁN VỊ TRÍ CHÍNH XÁC CỦA NÚT USER
        userInitials.onclick = function(e) {
            e.stopPropagation();
            
            // Xóa dropdown cũ
            const existingDropdown = document.getElementById('dynamicUserDropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            // TÍNH TOÁN VỊ TRÍ THỰC CỦA NÚT USER BUTTON
            const rect = userInitials.getBoundingClientRect();
            const dropdownTop = rect.bottom + 8; // Ngay dưới nút user + 8px
            const dropdownRight = window.innerWidth - rect.right; // Căn phải theo nút user
            
            // Tạo dropdown mới với vị trí chính xác và z-index cao
            const dropdown = document.createElement('div');
            dropdown.id = 'dynamicUserDropdown';
            dropdown.style.cssText = 'position: fixed; top: ' + dropdownTop + 'px; right: ' + dropdownRight + 'px; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); padding: 0; min-width: 280px; z-index: 999999; font-family: Arial, sans-serif;';
            
            dropdown.innerHTML = '<div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;"><div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">' + displayName + '</div><div style="font-size: 14px; opacity: 0.9;">HLV - Hải quan cửa khẩu quốc tế Móng Cái</div></div><div style="padding: 15px;"><div class="dropdown-item" onclick="showDashboardConnection()" style="display: flex; align-items: center; gap: 10px; padding: 12px; cursor: pointer; border-radius: 6px; transition: background 0.2s;"><span>📊</span><span>Dashboard</span></div><div class="dropdown-item" onclick="logout()" style="display: flex; align-items: center; gap: 10px; padding: 12px; cursor: pointer; border-radius: 6px; transition: background 0.2s; color: #f44336; border-top: 1px solid #eee; margin-top: 10px;"><span>🚪</span><span>Đăng xuất</span></div></div>';
            
            // Thêm hover effects
            const items = dropdown.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#f8f9fa';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                });
            });
            
            // Thêm vào body
            document.body.appendChild(dropdown);
            
            // Đóng dropdown khi click bên ngoài
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target)) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        };
        
        userInfoDisplay.style.display = 'inline-block';
        userInfoDisplay.style.position = 'relative';
        
        // SỬA: Cập nhật currentUserName với tên chính xác - HOÀNG TRỌNG QUỲNH
        currentUserName = displayName;
        
        console.log('✅ Updated user display: ' + displayName + ' (' + currentUserRole + ')');
    } else {
        if (userInfoDisplay) {
            userInfoDisplay.style.display = 'none';
        }
    }
}

// SỬA: Function toggle user dropdown
function toggleUserDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Close dropdown khi click outside - SỬA: Thêm cleanup cho tất cả dropdowns
document.addEventListener('click', (e) => {
    // Close user dropdown
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && !e.target.closest('#userInfoDisplay')) {
        dropdown.classList.add('hidden');
    }
    
    // Close dynamic user dropdown
    const dynamicDropdown = document.getElementById('dynamicUserDropdown');
    if (dynamicDropdown && !e.target.closest('#userInitials')) {
        dynamicDropdown.remove();
    }
    
    // Close all custom dropdowns
    if (!e.target.closest('.custom-dropdown-trigger')) {
        document.querySelectorAll('.custom-dropdown-options').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    }
});

// Hiển thị banner kết nối Dashboard
function showDashboardBanner() {
    const banner = document.getElementById('dashboardBanner');
    const connectedUser = document.getElementById('connectedUser');
    const userRole = document.getElementById('userRole');
    const mainApp = document.getElementById('mainApp');
    
    if (banner && connectedUser && userRole) {
        banner.style.display = 'block';
        connectedUser.textContent = currentUserName;
        userRole.textContent = currentUserRole;
        userRole.className = 'role-indicator role-' + currentUserRole.toLowerCase();
        mainApp.classList.add('with-banner');
        
        // Thêm nút refresh dashboard
        if (!document.getElementById('refreshDashboardBtn')) {
            const refreshBtn = document.createElement('button');
            refreshBtn.id = 'refreshDashboardBtn';
            refreshBtn.innerHTML = '🔄 Cập nhật Dashboard';
            refreshBtn.style.cssText = 'background: #2196F3; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 10px;';
            refreshBtn.onclick = refreshDashboardData;
            banner.appendChild(refreshBtn);
        }
    }
}

// Function refresh dashboard data
function refreshDashboardData() {
    if (confirm('Cập nhật dữ liệu với Dashboard?')) {
        if (window.opener) {
            window.opener.postMessage({
                type: 'REFRESH_DASHBOARD'
            }, '*');
        }
        refreshDynamicMenus();
        localStorage.setItem('dashboard_refresh_trigger', Date.now().toString());
        alert('Đã cập nhật dữ liệu thành công!');
    }
}

// Áp dụng phân quyền theo role với đồng bộ dashboard
function applyRoleBasedRestrictions() {
    if (currentUserRole === 'TRAINER') {
        filterDogMenuForTrainer();
        restrictTrainerAccess();
    } else if (currentUserRole === 'MANAGER') {
        setupManagerView();
        restrictManagerAccess();
    }
    refreshDynamicMenus();
}

// Hạn chế Manager - chỉ duyệt nhật ký
function restrictManagerAccess() {
    const createJournalButtons = document.querySelectorAll('.btn-create-new-journal');
    createJournalButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    const journalSubMenu = document.getElementById('journal-sub-menu');
    if (journalSubMenu) {
        journalSubMenu.innerHTML = '<li class="sub-item manager-notice" style="color: orange; font-style: italic; padding: 10px;">👁️ Chế độ duyệt - Bạn chỉ có thể xem và duyệt nhật ký</li>';
    }
    
    console.log('✅ Manager access restricted - approval only mode');
}

// Function refreshDynamicMenus để đồng bộ với dashboard
function refreshDynamicMenus() {
    const dashboardUsers = JSON.parse(localStorage.getItem('k9_users')) || [];
    const dashboardDogs = JSON.parse(localStorage.getItem('k9_dogs')) || [];
    
    let currentUser = null;
    const loginUsername = document.getElementById('username')?.value;
    
    if (loginUsername) {
        currentUser = dashboardUsers.find(u => u.username === loginUsername);
    }
    
    if (!currentUser && currentUserName) {
        currentUser = dashboardUsers.find(u => u.name === currentUserName || u.username === currentUserName);
    }
    
    if (currentUser) {
        currentUserAssignedDogs = currentUser.assignedDogs || [];
        console.log('✅ Updated assigned dogs for ' + currentUser.name + ':', currentUserAssignedDogs);
    }
    
    updateDogSubMenu(dashboardDogs);
    
    if (currentUserRole !== 'MANAGER') {
        updateJournalSubMenu(dashboardDogs);
    }
}

// Function cập nhật dog sub-menu động THEO DASHBOARD DATA
function updateDogSubMenu(dashboardDogs) {
    const dogMenu = document.getElementById('dog-sub-menu');
    if (!dogMenu) return;
    
    dogMenu.querySelectorAll('.sub-item').forEach(item => {
        if (!item.textContent.includes('➕')) {
            item.remove();
        }
    });
    
    const addNewButton = dogMenu.querySelector('.sub-item:last-child');
    
    dashboardDogs.forEach(dog => {
        if (currentUserRole === 'TRAINER' && !currentUserAssignedDogs.includes(dog.name)) {
            return;
        }
        
        const li = document.createElement('li');
        li.className = 'sub-item';
        li.innerHTML = '🐶' + dog.name;
        li.onclick = () => showDogProfileForm(dog.name);
        dogMenu.insertBefore(li, addNewButton);
    });
    
    console.log('✅ Updated dog sub-menu with ' + dashboardDogs.length + ' dogs from dashboard');
}

// Function cập nhật journal sub-menu động THEO DASHBOARD DATA - SỬA: MANAGER WORKFLOW
function updateJournalSubMenu(dashboardDogs) {
    const journalMenu = document.getElementById('journal-sub-menu');
    if (!journalMenu) return;
    
    console.log('🔄 Updating journal sub-menu for role:', currentUserRole);
    console.log('🔍 Current user name:', currentUserName);
    
    if (currentUserRole === 'MANAGER') {
        // SỬA: Manager menu với kiểm tra pending journals
        const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
        let actualPendingCount = 0;
        
        // Đếm số journal thực sự cần duyệt
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('journal_')) {
                try {
                    const journalData = JSON.parse(localStorage.getItem(key));
                    if (journalData?.approval?.hvlSignature && !journalData?.approval?.leaderSignature) {
                        actualPendingCount++;
                    }
                } catch (e) {
                    console.error('Error checking journal:', key, e);
                }
            }
        }
        
        console.log('📊 Pending journals count:', actualPendingCount);
        
        journalMenu.innerHTML = `<li class="sub-item manager-approval" onclick="showAllPendingJournalsForManager()" style="color: #ff9800; font-weight: bold; cursor: pointer; padding: 12px; border-radius: 5px; background: linear-gradient(135deg, #fff3e0, #ffe0b2); border: 1px solid #ff9800; margin: 5px 0;">📋 Duyệt nhật ký chờ phê duyệt (${actualPendingCount})</li><li class="sub-item manager-stats" onclick="showManagerStatistics()" style="color: #9c27b0; cursor: pointer; padding: 10px; border-radius: 5px; background: #f3e5f5; border: 1px solid #9c27b0; margin: 5px 0;">📊 Thống kê tổng quan</li><li class="sub-item debug-btn" onclick="debugManagerSystem()" style="color: #f44336; cursor: pointer; padding: 10px; border-radius: 5px; background: #ffebee; border: 1px solid #f44336; margin: 5px 0;">🔧 DEBUG - Kiểm tra hệ thống</li>`;
        
        console.log('✅ Set manager-specific journal menu with pending count:', actualPendingCount);
        return;
    }
    
    // Cho TRAINER và ADMIN: hiển thị menu tạo nhật ký theo chó
    journalMenu.innerHTML = '';
    
    dashboardDogs.forEach(dog => {
        if (currentUserRole === 'TRAINER' && !currentUserAssignedDogs.includes(dog.name)) {
            return; // Skip dogs not assigned to trainer
        }
        
        const li = document.createElement('li');
        li.className = 'sub-item';
        li.textContent = dog.name;
        li.onclick = () => showJournalEditForm(dog.name);
        journalMenu.appendChild(li);
    });
    
    console.log('✅ Updated journal sub-menu for role ' + currentUserRole + ' with dashboard data');
}

// Lọc menu chó cho Trainer
function filterDogMenuForTrainer() {
    const dogMenu = document.getElementById('dog-sub-menu');
    const journalMenu = document.getElementById('journal-sub-menu');
    
    if (currentUserAssignedDogs.length > 0) {
        if (dogMenu) {
            dogMenu.querySelectorAll('.sub-item').forEach(item => {
                const dogName = item.textContent.replace('🐶', '').replace('➕ Thêm chó mới', '').trim();
                if (!currentUserAssignedDogs.includes(dogName) && !item.textContent.includes('➕')) {
                    item.style.display = 'none';
                }
            });
        }
        
        if (journalMenu) {
            journalMenu.querySelectorAll('.sub-item').forEach(item => {
                const dogName = item.textContent.trim();
                if (!currentUserAssignedDogs.includes(dogName)) {
                    item.style.display = 'none';
                }
            });
        }
    }
}

// Hạn chế quyền truy cập cho Trainer
function restrictTrainerAccess() {
    const restrictedSections = document.querySelectorAll('[onclick*="Thêm chó mới"]');
    restrictedSections.forEach(section => {
        section.classList.add('trainer-restricted');
    });
}

// Thiết lập view cho Manager
function setupManagerView() {
    // Manager tập trung vào việc duyệt nhật ký
}

// Hàm mở Dashboard connection
function showDashboardConnection() {
    if (isDashboardConnected) {
        returnToDashboard();
    } else {
        window.open('dashboard_complete.html', '_blank');
    }
}

// Trở về Dashboard
function returnToDashboard() {
    if (confirm('Bạn có muốn quay về Dashboard không?')) {
        if (window.opener) {
            window.close();
        } else {
            window.location.href = 'dashboard_complete.html';
        }
    }
}

// Global variable to track the currently selected dog for the journal
let currentDogForJournal = '';
let blockCounter = 0;
let trainingSessionCounter = 0;
let operationSessionCounter = 0;

// Dummy data for Trainer (HLV) and Dogs
const HLV_INFO_KEY = 'hvl_current_user_info';
let hlvInfo = JSON.parse(localStorage.getItem(HLV_INFO_KEY)) || {
    name: 'Trần Đức Kiên',
    id: 'HLV001',
    image: 'images/hlv_tran_duc_kien.jpg'
};

if (!localStorage.getItem(HLV_INFO_KEY)) {
    localStorage.setItem(HLV_INFO_KEY, JSON.stringify(hlvInfo));
}

// Dog profiles data
const DOG_PROFILES_KEY = 'dog_profiles_data';
let dogProfiles = JSON.parse(localStorage.getItem(DOG_PROFILES_KEY)) || {
    'CNV BI': { name: 'CNV BI', image: 'images/dog_bi.jpg' },
    'CNV LU': { name: 'CNV LU', image: 'images/dog_lu.jpg' },
    'CNV RẾCH': { name: 'CNV RẾCH', image: 'images/dog_rech.jpg' },
    'CNV KY': { name: 'CNV KY', image: 'images/dog_ky.jpg' },
    'CNV REX': { name: 'CNV REX', image: 'images/dog_rex.jpg' }
};

if (!localStorage.getItem(DOG_PROFILES_KEY)) {
    localStorage.setItem(DOG_PROFILES_KEY, JSON.stringify(dogProfiles));
}

// Define drug types, food types, health manifestations, operation locations
const DRUG_TYPES = ['Cần sa', 'Heroin', 'Cocain', 'MDMA', 'Methamfetamin', 'Khác'];
const HEALTH_MANIFESTATIONS = ['Cào', 'Sủa', 'Nắm', 'Ngồi', 'Khác'];
const FOOD_TYPES = ['Cơm', 'Thịt', 'Rau', 'Trứng', 'Sữa', 'Hạt', 'Khác'];
const OPERATION_LOCATIONS = ['CỬA KHẨU BẮC LUÂN I', 'BÃI KIỂM TRA HÀNG HÓA BẮC LUÂN II', 'CẢNG ICD THÀNH ĐẠT KM 3+4'];

// Function to hide all main content sections
function hideAllContentSections() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
}

// Function to show the login page
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    if (userInfoDisplay) {
        userInfoDisplay.style.display = 'none';
    }
}

// SỬA QUAN TRỌNG: Function to handle login - FIX AUTHENTICATION HOÀN TOÀN - HOÀNG TRỌNG QUỲNH
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('🔑 Attempting login: ' + username);
    
    // SỬA: Đảm bảo có data users trong localStorage
    initializeDefaultUsers();
    
    // Load users from localStorage (từ Dashboard)
    const dashboardUsers = JSON.parse(localStorage.getItem('k9_users')) || [];
    console.log('📋 Found ' + dashboardUsers.length + ' users in localStorage:', dashboardUsers.map(u => u.username));
    
    // SỬA: Tìm user trong dashboard users trước
    const dashboardUser = dashboardUsers.find(u => u.username === username && u.password === password);
    
    if (dashboardUser) {
        console.log('✅ Found dashboard user: ' + dashboardUser.name + ' (' + dashboardUser.role + ')');
        
        currentUserRole = dashboardUser.role;
        currentUserName = dashboardUser.name;
        currentUserAssignedDogs = dashboardUser.assignedDogs || [];
        
        // SỬA: Cập nhật hlvInfo với tên user thật - HOÀNG TRỌNG QUỲNH
        hlvInfo.name = dashboardUser.name;
        localStorage.setItem(HLV_INFO_KEY, JSON.stringify(hlvInfo));
        
        showMainApp();
        return;
    }
    
    // SỬA: Enhanced fallback accounts với debugging - FIX HOÀNG TRỌNG QUỲNH
    const fallbackAccounts = [
        { username: 'admin', password: 'admin', role: 'ADMIN', name: 'Administrator', dogs: ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'] },
        { username: 'Kien123', password: '123456', role: 'TRAINER', name: 'Trần Đức Kiên', dogs: ['CNV BI', 'CNV LU'] },
        { username: 'Tuan123', password: '123456', role: 'TRAINER', name: 'Nguyễn Văn Tuấn', dogs: ['CNV RẾCH'] },
        { username: 'Quynh', password: '123456', role: 'MANAGER', name: 'Hoàng Trọng Quỳnh', dogs: ['CNV KY', 'CNV REX'] }, // SỬA: Tên chính xác
        { username: 'Quang', password: '123456', role: 'TRAINER', name: 'Lê Văn Quang', dogs: ['CNV KY'] },
        { username: 'Kien456', password: '123456', role: 'ADMIN', name: 'Trần Kiên 456', dogs: ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'] },
        { username: 'trainer', password: 'trainer', role: 'TRAINER', name: 'Huấn luyện viên', dogs: ['CNV BI'] },
        { username: 'manager', password: 'manager', role: 'MANAGER', name: 'Quản lý', dogs: ['CNV BI', 'CNV LU', 'CNV RẾCH', 'CNV KY', 'CNV REX'] }
    ];
    
    const fallbackUser = fallbackAccounts.find(u => u.username === username && u.password === password);
    
    if (fallbackUser) {
        console.log('✅ Found fallback user: ' + fallbackUser.name + ' (' + fallbackUser.role + ')');
        
        currentUserRole = fallbackUser.role;
        currentUserName = fallbackUser.name;
        currentUserAssignedDogs = fallbackUser.dogs;
        
        hlvInfo.name = fallbackUser.name;
        
        showMainApp();
        return;
    }
    
    console.log('❌ Login failed for: ' + username);
    console.log('Available usernames:', [...dashboardUsers.map(u => u.username), ...fallbackAccounts.map(u => u.username)]);
    alert('Tên người dùng hoặc mật khẩu không đúng.\n\nCác tài khoản có sẵn:\n- admin/admin\n- Kien123/123456\n- Tuan123/123456\n- Quynh/123456 (Hoàng Trọng Quỳnh)\n- Quang/123456\n- Kien456/123456');
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleSpan = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleSpan.innerText = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleSpan.innerText = '👁️';
    }
}

// Function to show the main application
function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    setTimeout(() => {
        applyRoleBasedRestrictions();
        refreshDynamicMenus();
        updateUserDisplay();
        
        // SỬA: Force update journal menu cho Manager
        if (currentUserRole === 'MANAGER') {
            updateJournalSubMenuForManager();
        }
    }, 100);
    
    showDefaultImage();
}

// SỬA LỖI LOGOUT: Function to handle logout - ĐÓNG TẤT CẢ DROPDOWN VÀ RESET HOÀN TOÀN
function logout() {
    console.log('🔓 Logout initiated');
    
    // SỬA: Đóng tất cả dropdown trước khi logout
    closeAllDropdowns();
    
    const banner = document.getElementById('dashboardBanner');
    if (banner && banner.style.display !== 'none') {
        if (confirm('Bạn có muốn trở về Dashboard không?')) {
            returnToDashboard();
            return;
        }
    }
    
    // SỬA: Reset tất cả biến global
    currentUserRole = 'GUEST';
    currentUserName = '';
    currentUserAssignedDogs = [];
    isDashboardConnected = false;
    
    // SỬA: Ẩn banner dashboard
    if (document.getElementById('dashboardBanner')) {
        document.getElementById('dashboardBanner').style.display = 'none';
    }
    
    // SỬA: Reset CSS class của mainApp
    const mainApp = document.getElementById('mainApp');
    if (mainApp) {
        mainApp.classList.remove('with-banner');
    }
    
    // SỬA: Ẩn hoàn toàn user info display
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    if (userInfoDisplay) {
        userInfoDisplay.style.display = 'none';
    }
    
    // SỬA: Reset user initials
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        userInitials.textContent = '';
        userInitials.onclick = null; // Remove click handler
        userInitials.style.display = 'none';
    }
    
    // SỬA: Clear input fields
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    if (usernameField) usernameField.value = '';
    if (passwordField) passwordField.value = '';
    
    console.log('✅ Logout completed - all UI reset');
    
    showLoginPage();
}

// Function to display a default image
function showDefaultImage() {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'none';
    
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    
    title.innerText = 'SỔ TAY CHÓ NGHIỆP VỤ';
    content.style.display = 'flex';
    content.style.justifyContent = 'center';
    content.style.alignItems = 'center';
    content.style.height = 'calc(100vh - 100px)';
    
    content.innerHTML = '<img src="images/my_welcome_image.jpg" alt="Chào mừng đến với Sổ tay Chó nghiệp vụ" style="max-width: 100%; max-height: 100%; object-fit: fill;">';
}

// Function showA4JournalViewFromKey để xem journal từ Dashboard - SỬA: FORCE PDF VIEW
function showA4JournalViewFromKey(journalKey) {
    try {
        const journalData = JSON.parse(localStorage.getItem(journalKey));
        if (journalData) {
            const dogName = journalData.generalInfo.dogName;
            const date = journalData.generalInfo.date;
            currentDogForJournal = dogName;
            
            // SỬA: FORCE chuyển sang pure PDF view ngay lập tức
            setTimeout(() => {
                showPureA4JournalView(dogName, date);
            }, 200);
        } else {
            alert('Không tìm thấy nhật ký!');
        }
    } catch (error) {
        console.error('Error loading journal:', error);
        alert('Có lỗi khi tải nhật ký!');
    }
}

// SỬA: Khởi tạo khi DOM load xong với enhanced debugging
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing K9 Management System');
    
    // SỬA: Khởi tạo users và signatures ngay khi load trang
    initializeDefaultUsers();
    initializeSignatureDatabase();
    
    // SỬA: Ẩn nút Dashboard bên ngoài navigation nếu có
    hideDashboardButtonFromNavigation();
    
    // Kiểm tra URL parameters trước
    if (!handleURLParameters()) {
        showLoginPage();
    }
    
    // Add event listeners for "Enter" key press
    document.getElementById('username').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    });
    
    document.getElementById('password').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    });
    
    // Refresh menu khi focus window
    window.addEventListener('focus', () => {
        if (currentUserRole !== 'GUEST') {
            refreshDynamicMenus();
            console.log('✅ Refreshed menus on window focus');
        }
    });
    
    // Listen cho dashboard refresh trigger
    window.addEventListener('storage', (e) => {
        if (e.key === 'dashboard_refresh_trigger') {
            if (currentUserRole !== 'GUEST') {
                refreshDynamicMenus();
                console.log('✅ Refreshed menus from dashboard trigger');
            }
        }
    });
    
    console.log('✅ K9 Management System initialized successfully!');
});

// Function để ẩn nút Dashboard bên ngoài navigation
function hideDashboardButtonFromNavigation() {
    // Tìm và ẩn nút Dashboard standalone nếu có
    const dashboardButton = document.querySelector('button[onclick*="showDashboardConnection"], .dashboard-btn, #dashboardButton');
    if (dashboardButton && !dashboardButton.closest('#userDropdown')) {
        dashboardButton.style.display = 'none';
    }
    
    // Ẩn tất cả các nút có text "Dashboard" không nằm trong dropdown
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (btn.textContent.includes('Dashboard') && !btn.closest('#userDropdown')) {
            btn.style.display = 'none';
        }
    });
}

// SỬA Z-INDEX: Function to display main content với z-index thấp hơn navigation
function showContent(type) {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';
    
    const content = document.getElementById('content');
    content.style.display = "block";
    content.style.justifyContent = 'flex-start';
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto';
    // SỬA: Đảm bảo content không đè lên navigation
    content.style.position = 'relative';
    content.style.zIndex = '1';
    
    const title = document.getElementById('title');
    
    // Hide submenus when navigating to other sections
    document.getElementById('dog-sub-menu').classList.remove('open');
    document.getElementById('journal-sub-menu').classList.remove('open');
    
    // Remove dynamic dog sub-items if any
    document.querySelectorAll('.sub-item-dynamic').forEach(el => el.remove());
    
    if (type === 'TỔNG QUAN') {
        title.innerText = 'TỔNG QUAN';
        content.innerHTML = '<p>Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm.</p><p>Chó nghiệp vụ không chỉ là một phương tiện kỹ thuật đặc biệt mà còn là một lực lượng hỗ trợ trực tiếp cho cán bộ công chức Hải quan tại các cửa khẩu, sân bay, bến cảng, nơi có nguy cơ cao về buôn lậu và vận chuyển trái phép. Việc huấn luyện, nuôi dưỡng, sử dụng hiệu quả chó nghiệp vụ đòi hỏi sự đầu tư bài bản, khoa học, và đội ngũ cán bộ huấn luyện viên chuyên trách có chuyên môn sâu và tâm huyết.</p><p>Nhằm hệ thống hóa các quy định, quy trình, nghiệp vụ liên quan đến công tác quản lý và sử dụng chó nghiệp vụ trong ngành Hải quan, Tổng cục Hải quan biên soạn cuốn Sổ tay quản lý và sử dụng chó nghiệp vụ Hải quan. Cuốn sổ tay gồm các nội dung: giới thiệu chức năng, nhiệm vụ của tổ chức quản lý chó nghiệp vụ; quy trình chăm sóc, nuôi dưỡng, huấn luyện chó; phương pháp khai thác sử dụng trong thực tế; hồ sơ quản lý từng cá thể chó; công tác kiểm tra, đánh giá chất lượng; và những lưu ý trong phối hợp với các đơn vị liên quan.</p><p>Tổng cục Hải quan ghi nhận và đánh giá cao những đóng góp tâm huyết của các đơn vị, cán bộ, huấn luyện viên chó nghiệp vụ đã và đang trực tiếp tham gia xây dựng lực lượng này ngày càng chính quy, hiện đại và hiệu quả. Đồng thời, chúng tôi mong muốn tiếp tục nhận được các ý kiến đóng góp từ các chuyên gia, cán bộ trong và ngoài ngành nhằm hoàn thiện hơn nữa hệ thống tài liệu phục vụ công tác này.</p><p>Sổ tay là tài liệu nghiệp vụ nội bộ, phục vụ cho công chức, huấn luyện viên và các đơn vị liên quan trong ngành Hải quan. Trong trường hợp các văn bản pháp lý có thay đổi, các nội dung trong sổ tay sẽ được cập nhật và điều chỉnh cho phù hợp.</p><p><strong>Xin trân trọng cảm ơn!</strong></p>';
    } else if (type === 'HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ') {
        title.innerText = 'HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ';
        content.innerHTML = '<p>Vui lòng chọn từng chó nghiệp vụ ở menu bên trái.</p><p>Đây là HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ:</p><ul><li>Hồ sơ CNV BI</li><li>Hồ sơ CNV LU</li><li>Hồ sơ CNV RẾCH</li><li>Hồ sơ CNV KY</li><li>Hồ sơ CNV REX</li></ul>';
    } else if (type === 'QUY TRÌNH CHĂM SÓC') {
        title.innerText = 'QUY TRÌNH CHĂM SÓC';
        content.innerHTML = '<h3>Điều 12. Nguyên tắc chăm sóc, huấn luyện chó nghiệp vụ</h3><p>1. Việc chăm sóc, huấn luyện CNV là công việc phải thực hiện hằng ngày. Huấn luyện viên chịu trách nhiệm hoàn toàn việc chăm sóc sức khỏe và huấn luyện CNV do mình quản lý.</p><p>2. Huấn luyện thường xuyên, liên tục trong suốt quá trình sử dụng CNV.</p><p>3. Coi trọng cả ba nội dung: huấn luyện thể lực - kỹ luật, huấn luyện củng cố và huấn luyện nâng cao năng lực.</p><p>4. Huấn luyện sát thực tế địa bàn nơi công tác của huấn luyện viên và môi trường tác nghiệp của CNV.</p><p>5. Quy định này không áp dụng đối với huấn luyện viên, CNV đang tập huấn tại các cơ sở sơ huấn luyện CNV.</p><p>6. Mọi trường hợp CNV bị bệnh, suy giảm sức khỏe, hoặc bị chết bởi yếu tố chủ quan, thiếu trách nhiệm; CNV bị suy giảm năng lực tác nghiệp, hoặc không được huấn luyện và sử dụng theo quy định đều phải kiểm điểm, xem xét trách nhiệm huấn luyện viên, các đơn vị liên quan và đơn vị quản lý. Nếu có vi phạm các quy định do lỗi chủ quan thì bị bắt đưa, xem xét kỷ luật.</p>';
    } else {
        title.innerText = type;
        content.innerHTML = '<p>Đây là nội dung của mục "' + type + '". Bạn có thể cập nhật nội dung sau.</p>';
    }
    
    document.getElementById("searchResults").style.display = "none";
}

// Function hiển thị dog profile từ DASHBOARD DATA với tên đúng HLV
function showDogProfileForm(dogName) {
    // Kiểm tra quyền của Trainer
    if (currentUserRole === 'TRAINER' && !currentUserAssignedDogs.includes(dogName)) {
        alert('Bạn chỉ có thể xem hồ sơ chó được phân công!');
        return;
    }
    
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';
    
    const content = document.getElementById('content');
    content.style.display = "block";
    content.style.justifyContent = 'flex-start';
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto';
    // SỬA: Đảm bảo content không đè lên navigation
    content.style.position = 'relative';
    content.style.zIndex = '1';
    
    const title = document.getElementById('title');
    title.innerText = dogName;
    
    // Lấy data từ dashboard thay vì hardcode
    const dashboardDogs = JSON.parse(localStorage.getItem('k9_dogs')) || [];
    const currentDog = dashboardDogs.find(d => d.name === dogName);
    
    // READ-ONLY cho Trainer
    const isReadOnly = currentUserRole === 'TRAINER';
    const readOnlyAttr = isReadOnly ? 'readonly' : '';
    const saveButtonDisplay = isReadOnly ? 'style="display: none;"' : '';
    
    // Enhanced dog profile display with better styling
    content.innerHTML = `
        <div class="dog-profile-container">
            ${isReadOnly ? '<div class="read-only-banner">CHẾ ĐỘ XEM - Không thể chỉnh sửa</div>' : ''}
            
            <div class="dog-profile-header">
                <img id="dog_profile_image" src="${dogProfiles[dogName]?.image || 'images/default_dog.jpg'}" alt="Ảnh CNV" class="profile-dog-image">
                <div>
                    <h3>SƠ YẾU LÝ LỊCH</h3>
                    <div class="status-indicator status-active">HOẠT ĐỘNG</div>
                </div>
            </div>

            <div class="profile-section">
                <h3>Thông tin cơ bản</h3>
                <div class="profile-field">
                    <label>1. Tên CNV:</label>
                    <input type="text" id="syll_name" value="${currentDog?.name || dogName}" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>2. Số hiệu:</label>
                    <input type="text" id="syll_sohieu" value="${currentDog?.chipId || ''}" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>3. Ngày sinh:</label>
                    <input type="date" id="syll_ngaysinh" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>4. Nơi sinh:</label>
                    <input type="text" id="syll_noisinh" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>5. Giống CNV:</label>
                    <input type="text" id="syll_giong" value="${currentDog?.breed || ''}" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>6. Tính biệt:</label>
                    <input type="text" id="syll_tinhbiet" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>7. Đặc điểm ngoại hình:</label>
                    <input type="text" id="syll_dacdiem" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>8. Màu lông:</label>
                    <input type="text" id="syll_maulong" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>9. Số giá trị:</label>
                    <input type="text" id="syll_giatri" ${readOnlyAttr}>
                </div>
            </div>

            <div class="profile-section">
                <h3>Dòng họ</h3>
                <div class="profile-field">
                    <label>1. Tên bố:</label>
                    <input type="text" id="dongho_ba" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>2. Ngày sinh:</label>
                    <input type="date" id="dongho_ngaysinh" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>3. Nơi sinh:</label>
                    <input type="text" id="dongho_noisinh" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>4. Giống:</label>
                    <input type="text" id="dongho_giong" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>5. Đặc điểm ngoại hình:</label>
                    <input type="text" id="dongho_dacdiem" ${readOnlyAttr}>
                </div>
            </div>

            <div class="profile-section">
                <div class="hlv-profile-header">
                    <img id="hlv_profile_image" src="${hlvInfo.image || 'images/default_hvl.jpg'}" alt="Ảnh HLV" class="profile-hlv-image">
                    <h3>HUẤN LUYỆN VIÊN QUẢN LÝ</h3>
                </div>
                <div class="profile-field">
                    <label>1. Họ và tên HLV:</label>
                    <input type="text" id="hlv_ten" value="${currentUserName || hlvInfo.name}" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>2. Ngày tháng năm sinh HLV:</label>
                    <input type="date" id="hlv_ngaysinh" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>3. Cấp bậc:</label>
                    <input type="text" id="hlv_capbac" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>4. Chức vụ:</label>
                    <input type="text" id="hlv_chucvu" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>5. Đơn vị:</label>
                    <input type="text" id="hlv_donvi" ${readOnlyAttr}>
                </div>
                <div class="profile-field">
                    <label>6. Qua trường đào tạo:</label>
                    <input type="text" id="hlv_daotao" ${readOnlyAttr}>
                </div>
            </div>

            <div class="profile-actions">
                <button onclick="saveDogProfile('${dogName}')" class="profile-btn profile-btn-success" ${saveButtonDisplay}>
                    💾 Lưu hồ sơ
                </button>
                <button onclick="exportDogProfile('${dogName}')" class="profile-btn profile-btn-primary">
                    📄 Xuất PDF
                </button>
                <button onclick="printDogProfile('${dogName}')" class="profile-btn profile-btn-secondary">
                    🖨️ In hồ sơ
                </button>
            </div>
        </div>
    `;
    
    loadDogProfile(dogName);
}

// Function to save dog profile
function saveDogProfile(dogName) {
    if (currentUserRole === 'TRAINER') {
        alert('Bạn không có quyền chỉnh sửa hồ sơ!');
        return;
    }
    
    const data = {
        name: document.getElementById('syll_name').value,
        sohieu: document.getElementById('syll_sohieu').value,
        ngaysinh: document.getElementById('syll_ngaysinh').value,
        noisinh: document.getElementById('syll_noisinh').value,
        giong: document.getElementById('syll_giong').value,
        tinhbiet: document.getElementById('syll_tinhbiet').value,
        dacdiem: document.getElementById('syll_dacdiem').value,
        maulong: document.getElementById('syll_maulong').value,
        giatri: document.getElementById('syll_giatri').value,
        dongho_ba: document.getElementById('dongho_ba').value,
        dongho_ngaysinh: document.getElementById('dongho_ngaysinh').value,
        dongho_noisinh: document.getElementById('dongho_noisinh').value,
        dongho_giong: document.getElementById('dongho_giong').value,
        dongho_dacdiem: document.getElementById('dongho_dacdiem').value,
        hlv_ten: document.getElementById('hlv_ten').value,
        hlv_ngaysinh: document.getElementById('hlv_ngaysinh').value,
        hlv_capbac: document.getElementById('hlv_capbac').value,
        hlv_chucvu: document.getElementById('hlv_chucvu').value,
        hlv_donvi: document.getElementById('hlv_donvi').value,
        hlv_daotao: document.getElementById('hlv_daotao').value
    };
    
    localStorage.setItem('profile_' + dogName, JSON.stringify(data));
    console.log('Hồ sơ ' + dogName + ' đã được lưu!');
}

// Function to load dog profile
function loadDogProfile(dogName) {
    const data = localStorage.getItem('profile_' + dogName);
    if (data) {
        const profile = JSON.parse(data);
        document.getElementById('syll_name').value = profile.name || '';
        document.getElementById('syll_sohieu').value = profile.sohieu || '';
        document.getElementById('syll_ngaysinh').value = profile.ngaysinh || '';
        document.getElementById('syll_noisinh').value = profile.noisinh || '';
        document.getElementById('syll_giong').value = profile.giong || '';
        document.getElementById('syll_tinhbiet').value = profile.tinhbiet || '';
        document.getElementById('syll_dacdiem').value = profile.dacdiem || '';
        document.getElementById('syll_maulong').value = profile.maulong || '';
        document.getElementById('syll_giatri').value = profile.giatri || '';
        document.getElementById('dongho_ba').value = profile.dongho_ba || '';
        document.getElementById('dongho_ngaysinh').value = profile.dongho_ngaysinh || '';
        document.getElementById('dongho_noisinh').value = profile.noisinh || '';
        document.getElementById('dongho_giong').value = profile.dongho_giong || '';
        document.getElementById('dongho_dacdiem').value = profile.dongho_dacdiem || '';
        document.getElementById('hlv_ten').value = profile.hlv_ten || currentUserName || hlvInfo.name;
        document.getElementById('hlv_ngaysinh').value = profile.hlv_ngaysinh || '';
        document.getElementById('hlv_capbac').value = profile.hlv_capbac || '';
        document.getElementById('hlv_chucvu').value = profile.hlv_chucvu || '';
        document.getElementById('hlv_donvi').value = profile.hlv_donvi || '';
        document.getElementById('hlv_daotao').value = profile.hlv_daotao || '';
    } else {
        document.getElementById('hlv_ten').value = currentUserName || hlvInfo.name;
    }
}

// Function to export dog profile to PDF
function exportDogProfile(dogName) {
    const profileContainer = document.querySelector('.dog-profile-container');
    if (!profileContainer) {
        alert('Không tìm thấy hồ sơ để xuất PDF!');
        return;
    }

    // Hide action buttons for PDF export
    const actionButtons = profileContainer.querySelector('.profile-actions');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }

    // Generate PDF
    html2canvas(profileContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Ho_so_${dogName}_${new Date().toISOString().split('T')[0]}.pdf`);
        
        // Show action buttons again
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        
        alert('✅ Hồ sơ đã được xuất PDF thành công!');
    }).catch(error => {
        console.error('Lỗi khi xuất PDF:', error);
        alert('❌ Có lỗi khi xuất PDF. Vui lòng thử lại!');
        
        // Show action buttons again
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
    });
}

// Function to print dog profile
function printDogProfile(dogName) {
    const profileContainer = document.querySelector('.dog-profile-container');
    if (!profileContainer) {
        alert('Không tìm thấy hồ sơ để in!');
        return;
    }

    // Hide action buttons for printing
    const actionButtons = profileContainer.querySelector('.profile-actions');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Hồ sơ ${dogName}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        color: #333;
                    }
                    .dog-profile-container { 
                        max-width: 100%; 
                        margin: 0 auto; 
                    }
                    .dog-profile-header { 
                        background: #007bff; 
                        color: white; 
                        padding: 20px; 
                        border-radius: 10px; 
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }
                    .profile-dog-image { 
                        width: 80px; 
                        height: 80px; 
                        border-radius: 50%; 
                        border: 3px solid white;
                    }
                    .profile-section { 
                        background: #f8f9fa; 
                        padding: 20px; 
                        margin: 15px 0; 
                        border-radius: 8px; 
                        border-left: 4px solid #007bff;
                    }
                    .profile-section h3 { 
                        color: #007bff; 
                        margin-bottom: 15px; 
                        border-bottom: 2px solid #dee2e6; 
                        padding-bottom: 10px;
                    }
                    .profile-field { 
                        display: flex; 
                        margin: 10px 0; 
                        padding: 10px; 
                        background: white; 
                        border-radius: 5px;
                    }
                    .profile-field label { 
                        font-weight: bold; 
                        min-width: 200px; 
                        margin-right: 15px;
                    }
                    .profile-field input { 
                        flex: 1; 
                        border: none; 
                        background: transparent; 
                        font-size: 14px;
                    }
                    .hlv-profile-header { 
                        background: #28a745; 
                        color: white; 
                        padding: 15px; 
                        border-radius: 8px; 
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    .profile-hlv-image { 
                        width: 60px; 
                        height: 60px; 
                        border-radius: 50%; 
                        border: 2px solid white;
                    }
                    @media print {
                        body { margin: 0; }
                        .dog-profile-container { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                ${profileContainer.outerHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
        
        // Show action buttons again
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
    }, 500);
}

// Function to perform search
function performSearch() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    const contentDiv = document.getElementById("content");
    const searchDiv = document.getElementById("searchResults");
    
    if (keyword === "") {
        console.log("Vui lòng nhập từ khóa!");
        return;
    }
    
    let found = false;
    
    sidebarItems.forEach(item => {
        item.style.backgroundColor = '';
    });
    
    sidebarItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(keyword)) {
            item.style.backgroundColor = '#4e8cff';
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            if (item.onclick) {
                item.click();
            } else if (item.querySelector('.sub-menu')) {
                const submenu = item.querySelector('.sub-menu');
                if (submenu) {
                    submenu.classList.toggle('open');
                }
            } else if (item.closest('.sub-menu')) {
                const parentLi = item.closest('.sub-menu').previousElementSibling;
                if (parentLi && parentLi.querySelector('.sub-menu')) {
                    parentLi.querySelector('.sub-menu').classList.add('open');
                    item.click();
                }
            } else {
                const contentName = item.innerText.replace(/🐶|➕|🔧|🧠/g, '').trim();
                if (contentName === 'TỔNG QUAN' || contentName === 'QUY TRÌNH CHĂM SÓC' || contentName === 'QUY TRÌNH SỬ DỤNG' || contentName === 'QUY TRÌNH HUẤN LUYỆN' || contentName === 'VIDEO HƯỚNG DẪN') {
                    showContent(contentName);
                }
            }
            found = true;
        }
    });
    
    if (!found) {
        const currentContentHtml = contentDiv.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentContentHtml;
        const allParagraphs = tempDiv.querySelectorAll("p, h1, h2, h3, h4, li");
        
        let resultHTML = "";
        let contentFound = false;
        
        allParagraphs.forEach(el => {
            const text = el.innerText.toLowerCase();
            if (text.includes(keyword)) {
                const regex = new RegExp('(' + keyword + ')', 'gi');
                const highlighted = el.innerHTML.replace(regex, '<mark>$1</mark>');
                resultHTML += '<p>' + highlighted + '</p>';
                contentFound = true;
            }
        });
        
        if (contentFound) {
            contentDiv.style.display = 'none';
            searchDiv.style.display = 'block';
            searchDiv.innerHTML = '<h3>Kết quả tìm kiếm cho "' + keyword + '":</h3><div class="search-results-content">' + resultHTML + '</div><button onclick="backToMainContent()">Quay lại</button>';
            found = true;
        }
    }
    
    if (!found) {
        console.log('Không tìm thấy từ khóa "' + keyword + '"!');
    }
}

// Function to go back to main content
function backToMainContent() {
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("content").style.display = "block";
    showContent(document.getElementById('title').innerText);
}

let isSpeaking = false;
let currentUtterance = null;

// Function to toggle speech
function toggleSpeech() {
    const contentText = document.getElementById('content').innerText;
    const toggleButton = document.getElementById('toggleReadButton');
    
    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        toggleButton.innerText = '🔊 Đọc nội dung';
    } else {
        currentUtterance = new SpeechSynthesisUtterance(contentText);
        const voices = speechSynthesis.getVoices();
        const vietnameseVoice = voices.find(v => v.lang === 'vi-VN');
        
        if (vietnameseVoice) {
            currentUtterance.voice = vietnameseVoice;
        } else {
            console.warn("Không tìm thấy giọng tiếng Việt. Đang dùng giọng mặc định.");
        }
        
        currentUtterance.onend = () => {
            isSpeaking = false;
            toggleButton.innerText = '🔊 Đọc nội dung';
        };
        
        currentUtterance.onerror = (event) => {
            console.error('Lỗi khi đọc:', event.error);
            isSpeaking = false;
            toggleButton.innerText = '🔊 Đọc nội dung';
        };
        
        speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
        toggleButton.innerText = '⏹️ Dừng đọc';
    }
}

// Function to toggle "HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ" submenu
function toggleSubMenu() {
    const submenu = document.getElementById('dog-sub-menu');
    const journalSubmenu = document.getElementById('journal-sub-menu');
    
    // Đóng journal submenu nếu đang mở
    journalSubmenu.classList.remove('open');
    
    // Toggle dog submenu
    submenu.classList.toggle('open');
}

// Function to toggle "SỔ NHẬT KÝ HUẤN LUYỆN" submenu
function toggleJournalMenu() {
    const submenu = document.getElementById('journal-sub-menu');
    const dogSubmenu = document.getElementById('dog-sub-menu');
    
    // Đóng dog submenu nếu đang mở
    dogSubmenu.classList.remove('open');
    
    // SỬA: Force update journal menu cho Manager trước khi toggle
    if (currentUserRole === 'MANAGER') {
        console.log('🔄 Force updating journal menu for Manager');
        updateJournalSubMenuForManager();
    }
    
    // Toggle journal submenu
    submenu.classList.toggle('open');
}

// Function showJournalEditForm - SỬA: MANAGER TỰ ĐỘNG VÀO CHẾ ĐỘ DUYỆT
function showJournalEditForm(dogName, date = null) {
    // SỬA: Manager tự động chuyển sang chế độ duyệt nhật ký
    if (currentUserRole === 'MANAGER') {
        console.log('🏢 Manager detected - redirecting to approval mode');
        showAllPendingJournalsForManager();
        return;
    }
    
    // Kiểm tra quyền của Trainer
    if (currentUserRole === 'TRAINER' && !currentUserAssignedDogs.includes(dogName)) {
        alert('Bạn chỉ có thể viết nhật ký cho chó được phân công!');
        return;
    }
    
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';
    
    const content = document.getElementById('content');
    content.style.display = 'block';
    content.style.justifyContent = 'flex-start';
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto';
    // SỬA: Đảm bảo form không đè lên navigation
    content.style.position = 'relative';
    content.style.zIndex = '1';
    
    const title = document.getElementById('title');
    currentDogForJournal = dogName;
    title.innerText = 'SỔ NHẬT KÝ HUẤN LUYỆN - CNV ' + dogName;
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = yyyy + '-' + mm + '-' + dd;
    
    // Kiểm tra role để hiển thị form tương ứng
    const roleInfo = currentUserRole === 'TRAINER' ? '<p style="color: blue; font-weight: bold;">🎯 TRAINER MODE - Chỉ viết nhật ký cho ' + dogName + '</p>' : '';
    
    // Ẩn "Lãnh đạo đơn vị duyệt" cho TRAINER
    const leaderApprovalSection = currentUserRole === 'TRAINER' ? '' : '<div class="approval-box leader-approval"><h3>Lãnh đạo đơn vị duyệt</h3><div class="signature-area"><label for="leader_comment">Ý kiến:</label><textarea id="leader_comment" rows="3"></textarea><p>Trạng thái: <span class="approval-status">[Chưa duyệt]</span></p><div id="leader-signature-display"></div><button class="btn-approve" onclick="approveJournal()">Ký</button></div></div>';
    
    const foodTypesOptions1 = FOOD_TYPES.map(food => '<label><input type="checkbox" data-food-value="' + food + '" onchange="updateFoodDisplay(\'lunchFoodDisplayBox\', \'lunchFoodOptions\', \'lunchFoodOther\')">' + food + '</label>').join('');
    
    const foodTypesOptions2 = FOOD_TYPES.map(food => '<label><input type="checkbox" data-food-value="' + food + '" onchange="updateFoodDisplay(\'dinnerFoodDisplayBox\', \'dinnerFoodOptions\', \'dinnerFoodOther\')">' + food + '</label>').join('');
    
    content.innerHTML = roleInfo + '<div class="journal-header-actions"><button class="btn-create-new-journal" onclick="createNewJournal()">Nhật ký mới +</button><button class="btn-view-old-journals" onclick="viewOldJournals()">Xem nhật ký cũ</button></div><div class="journal-section info-general"><h2>I. THÔNG TIN CHUNG</h2><div class="info-general-grid"><div class="info-item-group journal-date-field"><label for="journal_date">Ngày ghi:</label><input type="date" id="journal_date" value="' + (date || defaultDate) + '" required></div><div class="info-item-group"><label for="journal_hlv">Huấn luyện viên:</label><input type="text" id="journal_hlv" value="' + (currentUserName || hlvInfo.name) + ' (Số hiệu: ' + hlvInfo.id + ')" readonly></div><div class="info-item-group"><label for="journal_dog_name">Tên CNV:</label><input type="text" id="journal_dog_name" value="' + dogName + '" readonly></div></div></div><div class="journal-section training-activity"><h2>II. HOẠT ĐỘNG HUẤN LUYỆN</h2><div id="training-blocks-container"><!-- Training blocks will be dynamically added here --></div><div class="training-activity-buttons"><button class="add-block add-training-block" onclick="addTrainingBlock()">Thêm Ca +</button><button class="remove-block remove-training-block" onclick="removeLastTrainingBlock()">Xóa Ca HL</button></div><div class="textarea-block"><label for="journal_hlv_comment">Đánh giá chung của Huấn luyện viên:</label><textarea id="journal_hlv_comment" rows="4"></textarea></div></div><div class="journal-section care-block"><h2>III. CHĂM SÓC & NUÔI DƯỠNG</h2><!-- Care and feeding section content --><div class="meal-row"><div class="meal-part"><div class="meal-header-time"><h3>Bữa trưa:</h3><label for="lunchTime">Thời gian:</label><input type="time" id="lunchTime" value="11:00"></div><div class="meal-food-details-row"><div class="meal-item"><label for="lunchAmount">Sức ăn:</label><select id="lunchAmount" class="appetite-select"><option value="Ăn hết">Ăn hết</option><option value="Ăn ít">Ăn ít</option><option value="Không ăn">Không ăn</option></select></div><div class="meal-item food-selection-group"><label>Thức ăn:</label><div class="custom-food-select-wrapper"><div class="custom-dropdown-trigger" onclick="toggleFoodDropdown(\'lunchFoodOptions\')"><span class="selected-text" id="lunchFoodTriggerText">Chọn thức ăn</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="lunchFoodOptions">' + foodTypesOptions1 + '</div></div><span class="food-selected-display-box" id="lunchFoodDisplayBox">Chưa chọn</span><input type="text" id="lunchFoodOther" class="hidden" placeholder="Thức ăn khác" onchange="updateFoodDisplay(\'lunchFoodDisplayBox\', \'lunchFoodOptions\', \'lunchFoodOther\')"></div></div></div><div class="meal-part"><div class="meal-header-time"><h3>Bữa chiều:</h3><label for="dinnerTime">Thời gian:</label><input type="time" id="dinnerTime" value="17:00"></div><div class="meal-food-details-row"><div class="meal-item"><label for="dinnerAmount">Sức ăn:</label><select id="dinnerAmount" class="appetite-select"><option value="Ăn hết">Ăn hết</option><option value="Ăn ít">Ăn ít</option><option value="Không ăn">Không ăn</option></select></div><div class="meal-item food-selection-group"><label>Thức ăn:</label><div class="custom-food-select-wrapper"><div class="custom-dropdown-trigger" onclick="toggleFoodDropdown(\'dinnerFoodOptions\')"><span class="selected-text" id="dinnerFoodTriggerText">Chọn thức ăn</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="dinnerFoodOptions">' + foodTypesOptions2 + '</div></div><span class="food-selected-display-box" id="dinnerFoodDisplayBox">Chưa chọn</span><input type="text" id="dinnerFoodOther" class="hidden" placeholder="Thức ăn khác" onchange="updateFoodDisplay(\'dinnerFoodDisplayBox\', \'dinnerFoodOptions\', \'dinnerFoodOther\')"></div></div></div></div><div class="care-checks"><label><input type="checkbox" id="care_bath"> Tắm rửa</label><label><input type="checkbox" id="care_brush"> Chải lông</label><label><input type="checkbox" id="care_wipe"> Lau lông</label></div><div class="health-status"><label><input type="radio" name="health_status" value="Bình thường" checked> Bình thường</label><label><input type="radio" name="health_status" value="Có dấu hiệu bất thường" data-health-type="abnormal"> Có dấu hiệu bất thường</label><label><input type="radio" name="health_status" value="Bị ốm/Chấn thương" data-health-type="sick"> Bị ốm/Chấn thương</label><input type="text" id="health_other_text" class="health-other-input hidden" placeholder="Ghi rõ tình trạng"></div><div class="textarea-block"><label for="journal_other_issues" class="other-issues-label">Vấn đề khác (nếu có):</label><textarea id="journal_other_issues" rows="3"></textarea></div></div><div class="journal-section operation-activity"><h2>IV. HOẠT ĐỘNG TÁC NGHIỆP</h2><div id="operation-blocks-container"><!-- Operation blocks will be dynamically added here --></div><div class="operation-activity-buttons"><button class="add-block add-operation-block" onclick="addOperationBlock()">Thêm Ca Tác Nghiệp</button><button class="remove-block remove-operation-block" onclick="removeLastOperationBlock()">Xóa Ca Tác Nghiệp</button></div></div><div class="journal-section approval-section"><h2>DUYỆT & KÝ</h2><div class="approval-flex-container">' + leaderApprovalSection + '<div class="approval-box hvl-submission"><h3>Huấn luyện viên xác nhận</h3><div class="signature-area"><p>Họ và tên: <span id="hvl_name_display">' + (currentUserName || hlvInfo.name) + '</span></p><p>Trạng thái: <span class="submission-status">(Chưa gửi duyệt)</span></p><div id="hvl-signature-display"></div><button class="btn-submit-hvl" onclick="submitHvlSignature()">Ký</button></div></div><div class="approval-box substitute-hvl-section"><h3>HLV trực thay (nếu có)</h3><div class="signature-area"><label for="substitute_hvl_name">Họ và tên:</label><input type="text" id="substitute_hvl_name"><label for="substitute_hvl_comment">Ý kiến:</label><textarea id="substitute_hvl_comment" rows="3"></textarea><p>Trạng thái: <span class="substitute-hvl-status">[Chưa ký]</span></p><div id="substitute-signature-display"></div><button class="btn-substitute-hvl-approve" onclick="substituteHvlApprove()">Ký</button></div></div></div></div><div class="journal-action-buttons"><button class="save-journal" onclick="saveJournalData()">Lưu Nhật Ký</button><button class="export-pdf" onclick="exportJournalToPDF(\'' + dogName + '\', document.getElementById(\'journal_date\').value)">Xuất PDF</button></div>';
    
    // Reset counters khi tạo form mới
    trainingSessionCounter = 0;
    operationSessionCounter = 0;
    blockCounter = 0;
    
    loadJournalData(dogName, date || defaultDate, true);
    initializeHiddenInputs();
    setupFormEventListeners();
}

// SỬA: Function showAllPendingJournalsForManager - TÌM TẤT CẢ JOURNAL ĐÃ KÝ CHƯA DUYỆT - FIX MANAGER WORKFLOW
function showAllPendingJournalsForManager() {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';
    
    const content = document.getElementById('content');
    content.style.display = 'block';
    content.style.position = 'relative';
    content.style.zIndex = '1';
    
    const title = document.getElementById('title');
    title.innerText = 'DUYỆT NHẬT KÝ - CHẾ ĐỘ MANAGER';
    
    console.log('🔍 Manager checking for journals requiring approval...');
    
    // SỬA: TÌM JOURNALS TỪNG CẢ localStorage VÀ pending_manager_approvals
    const allPendingJournals = [];
    const pendingList = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
    
    console.log('📋 Pending journals list:', pendingList.length);
    
    // Kiểm tra từng journal trong danh sách pending
    pendingList.forEach(pendingEntry => {
        try {
            const journalData = JSON.parse(localStorage.getItem(pendingEntry.key));
            if (journalData && journalData.approval?.hvlSignature && !journalData.approval?.leaderSignature) {
                allPendingJournals.push({
                    key: pendingEntry.key,
                    date: journalData.generalInfo.date,
                    dogName: journalData.generalInfo.dogName,
                    trainer: journalData.generalInfo.hlv,
                    submittedAt: pendingEntry.submittedAt,
                    data: journalData
                });
            }
        } catch (e) {
            console.error('Error loading pending journal:', pendingEntry.key, e);
        }
    });
    
    // SỬA: BACKUP SEARCH - Tìm thêm trong localStorage nếu có journal missed
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_')) {
            try {
                const journalData = JSON.parse(localStorage.getItem(key));
                if (journalData?.approval?.hvlSignature && !journalData?.approval?.leaderSignature) {
                    // Kiểm tra xem đã có trong danh sách chưa
                    const exists = allPendingJournals.find(j => j.key === key);
                    if (!exists) {
                        allPendingJournals.push({
                            key: key,
                            date: journalData.generalInfo.date,
                            dogName: journalData.generalInfo.dogName,
                            trainer: journalData.generalInfo.hlv,
                            submittedAt: journalData.approval.submittedAt || new Date().toISOString(),
                            data: journalData
                        });
                        console.log('📌 Found missed journal:', key);
                    }
                }
            } catch (e) {
                console.error('Error checking journal:', key, e);
            }
        }
    }
    
    console.log('📊 Total journals requiring manager approval:', allPendingJournals.length);
    
    if (allPendingJournals.length === 0) {
        content.innerHTML = `<div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="color: #2196F3; margin-bottom: 20px;">📋 CHẾ ĐỘ MANAGER - DUYỆT NHẬT KÝ</h3>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px;">
                <h4 style="color: #155724; margin-top: 0;">✅ Không có nhật ký nào cần duyệt</h4>
                <p style="color: #155724;">Tất cả nhật ký đã được xử lý hoặc chưa có nhật ký nào được gửi duyệt.</p>
            </div>
            <button onclick="refreshManagerView()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 20px;">🔄 Làm mới</button>
        </div>`;
        return;
    }
    
    // Sắp xếp theo ngày gửi mới nhất
    allPendingJournals.sort((a, b) => new Date(b.submittedAt || b.date) - new Date(a.submittedAt || a.date));
    
    // SỬA: HIỂN THI DANH SÁCH VỚI NOTIFICATION VÀ URGENCY
    let html = `<div style="background: white; border-radius: 10px; margin: 20px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 20px; margin-bottom: 25px; border-radius: 8px; text-align: center;">
            <h3 style="color: #1976d2; margin-top: 0;">🚨 CHẾ ĐỘ MANAGER - DUYỆT NHẬT KÝ</h3>
            <p style="color: #1976d2; font-size: 18px; font-weight: bold;">Bạn có ${allPendingJournals.length} nhật ký CẦN DUYỆT NGAY từ các huấn luyện viên</p>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-top: 15px;">
                <strong>⚠️ LƯU Ý:</strong> Các nhật ký này đã được HLV ký và đang chờ bạn duyệt
            </div>
        </div>
        <div class="pending-journals-list">
            <h4 style="color: #333; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">📋 Danh sách nhật ký chờ duyệt:</h4>`;
    
    allPendingJournals.forEach((journal, index) => {
        const isUrgent = journal.submittedAt && (new Date() - new Date(journal.submittedAt)) < 24 * 60 * 60 * 1000; // Urgent nếu gửi trong 24h
        const urgentBadge = isUrgent ? '<div style="position: absolute; top: 15px; right: 15px; background: #ff4444; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; animation: blink 1s infinite;">🚨 MỚI</div>' : '';
        
        const signatureDate = journal.data.approval?.hvlSignature?.timestamp ? 
            new Date(journal.data.approval.hvlSignature.timestamp).toLocaleDateString('vi-VN') : 'N/A';
        
        html += `<div style="background: white; border: 2px solid ${isUrgent ? '#ff4444' : '#e3f2fd'}; padding: 20px; margin: 15px 0; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; position: relative;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
    ${urgentBadge}
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px; margin-right: 10px;">📅</span>
                <strong style="color: #1976d2; font-size: 18px;">Ngày: ${journal.date}</strong>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 20px; margin-right: 10px;">🐕</span>
                <strong style="color: #2e7d32;">CNV: ${journal.dogName}</strong>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 20px; margin-right: 10px;">👨‍💼</span>
                <span style="color: #666;">HLV: ${journal.trainer}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 20px; margin-right: 10px;">🖊️</span>
                <span style="color: #2e7d32;">✅ HLV đã ký ngày: ${signatureDate}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; margin-right: 10px;">⏰</span>
                <span style="color: #666; font-size: 14px;">Gửi lúc: ${new Date(journal.submittedAt || journal.date).toLocaleString('vi-VN')}</span>
            </div>
            <!-- SỬA: THÊM Ô NHẬN XÉT CHO MANAGER -->
            <div style="margin-top: 15px;">
                <label style="font-weight: bold; color: #1976d2; display: block; margin-bottom: 8px;">💬 Nhận xét của Manager:</label>
                <textarea id="managerComment_${journal.key}" rows="3" style="width: 100%; border: 1px solid #ddd; border-radius: 5px; padding: 8px; font-size: 14px; resize: vertical;" placeholder="Nhập nhận xét trước khi ký duyệt..."></textarea>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; min-width: 200px; align-items: flex-end;">
            <button class="btn-info" onclick="viewJournalForManagerApproval('${journal.key}')" style="background: #2196F3; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background 0.3s;" onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196F3'">👀 Xem nhật ký</button>
            <button class="btn-success" onclick="approveJournalWithComment('${journal.key}')" style="background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background 0.3s;" onmouseover="this.style.background='#388e3c'" onmouseout="this.style.background='#4CAF50'">✅ Ký duyệt</button>
        </div>
    </div>
</div>`;
    });
    
    html += `</div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e3f2fd;">
            <button onclick="refreshManagerView()" style="background: #ff9800; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 15px;">🔄 Làm mới danh sách</button>
            <button onclick="showManagerStatistics()" style="background: #9c27b0; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">📊 Xem thống kê</button>
        </div>
    </div>
    <style>
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
        }
    </style>`;
    
    content.innerHTML = html;
    
    // SỬA: MARK NOTIFICATIONS AS READ
    markManagerNotificationsAsRead();
    
    // Auto refresh mỗi 30 giây
    setTimeout(() => {
        if (currentUserRole === 'MANAGER' && document.getElementById('title').innerText.includes('MANAGER')) {
            console.log('🔄 Auto-refreshing manager view...');
            showAllPendingJournalsForManager();
        }
    }, 30000);
}

// SỬA: Function MARK NOTIFICATIONS AS READ
function markManagerNotificationsAsRead() {
    const notifications = JSON.parse(localStorage.getItem('manager_notifications')) || [];
    const updatedNotifications = notifications.map(notif => ({
        ...notif,
        read: true
    }));
    localStorage.setItem('manager_notifications', JSON.stringify(updatedNotifications));
}

// SỬA: Function XEM JOURNAL CHO MANAGER APPROVAL
// SỬA: Function XEM JOURNAL CHO MANAGER APPROVAL
function viewJournalForManagerApproval(journalKey) {
    console.log('👀 Manager viewing journal for approval:', journalKey);
    
    // SỬA: Lưu trạng thái trước khi chuyển sang PDF view
    window.previousManagerView = 'PENDING_JOURNALS';
    
    // Chuyển sang PDF view để Manager có thể xem chi tiết
    showA4JournalViewFromKey(journalKey);
}

// Function hỗ trợ Manager
function refreshManagerView() {
    console.log('🔄 Manual refresh requested by Manager');
    showAllPendingJournalsForManager();
}

function showManagerStatistics() {
    // Thống kê tổng quan cho Manager
    let totalJournals = 0;
    let approvedJournals = 0;
    let pendingJournals = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_')) {
            totalJournals++;
            try {
                const journalData = JSON.parse(localStorage.getItem(key));
                if (journalData.approval?.leaderSignature) {
                    approvedJournals++;
                } else if (journalData.approval?.hvlSignature) {
                    pendingJournals++;
                }
            } catch (e) {
                console.error('Error parsing journal stats:', e);
            }
        }
    }
    
    alert('📊 THỐNG KÊ QUẢN LÝ NHẬT KÝ\n\n' +
          '📋 Tổng số nhật ký: ' + totalJournals + '\n' +
          '✅ Đã duyệt: ' + approvedJournals + '\n' +
          '⏳ Chờ duyệt: ' + pendingJournals + '\n' +
          '📝 Chưa hoàn thành: ' + (totalJournals - approvedJournals - pendingJournals));
}

// Function to initialize AI chat interface (placeholder) - KO GIỚI HẠN ROLE
function chatWithAI() {
    alert('🤖 Chức năng Tra cứu AI:\n\n✅ Tất cả vai trò đều có thể truy cập\n✅ Tra cứu toàn bộ knowledge base\n✅ Không bị giới hạn theo phân quyền\n\n🚧 Đang được phát triển...');
}

// ===== JOURNAL FUNCTIONALITY - KHÔI PHỤC TỪ FILE CŨ =====

// Generic function to handle "Other" input visibility for checkboxes
function handleCheckboxOther(checkboxElement, otherInputElement) {
    if (checkboxElement && otherInputElement) {
        const toggleOtherInput = () => {
            if (checkboxElement.checked) {
                otherInputElement.classList.remove('hidden');
            } else {
                otherInputElement.classList.add('hidden');
                otherInputElement.value = '';
            }
        };
        checkboxElement.addEventListener('change', toggleOtherInput);
        toggleOtherInput();
    }
}

// Function to initialize visibility for "Other" inputs
function initializeHiddenInputs(container = document) {
    // "Other" in Training Activity
    container.querySelectorAll('.training-block .training-other-input').forEach(input => {
        const relatedCheckbox = input.closest('.field-group')?.querySelector('.training-checkbox[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });
    
    // Training Location "Other"
    container.querySelectorAll('input[name^="training-location-group-"]').forEach(radio => {
        const otherInput = radio.closest('.field-group')?.querySelector('.location-other-input');
        if (otherInput) {
            radio.addEventListener('change', () => {
                if (radio.value === 'Khác' && radio.checked) {
                    otherInput.classList.remove('hidden');
                } else {
                    otherInput.classList.add('hidden');
                    otherInput.value = '';
                }
            });
            if (radio.value === 'Khác' && radio.checked) {
                otherInput.classList.remove('hidden');
            }
        }
    });
    
    // Health Status "Abnormal" or "Sick/Injured"
    container.querySelectorAll('input[name="health_status"]').forEach(radio => {
        const healthOtherTextInput = document.getElementById('health_other_text');
        if (healthOtherTextInput) {
            radio.addEventListener('change', () => {
                if (radio.checked && (radio.dataset.healthType === 'abnormal' || radio.dataset.healthType === 'sick')) {
                    healthOtherTextInput.classList.remove('hidden');
                } else {
                    healthOtherTextInput.classList.add('hidden');
                    healthOtherTextInput.value = '';
                }
            });
            if (radio.checked && (radio.dataset.healthType === 'abnormal' || radio.dataset.healthType === 'sick')) {
                healthOtherTextInput.classList.remove('hidden');
            }
        }
    });
    
    // "Other" in Operation Activity
    container.querySelectorAll('.operation-activity-row-1 .operation-other-input-1').forEach(input => {
        const relatedCheckbox = input.closest('.operation-activity-row-1')?.querySelector('.operation-checkbox-1[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });
    
    container.querySelectorAll('.operation-activity-row-2 .operation-other-input-2').forEach(input => {
        const relatedCheckbox = input.closest('.operation-activity-row-2')?.querySelector('.operation-checkbox-2[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });
}

// Function toggleFoodDropdown
function toggleFoodDropdown(optionsId) {
    const dropdown = document.getElementById(optionsId);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        // Đóng các dropdown khác
        document.querySelectorAll('.custom-dropdown-options').forEach(other => {
            if (other.id !== optionsId) {
                other.classList.add('hidden');
            }
        });
    }
}

// Function updateFoodDisplay
function updateFoodDisplay(displayBoxId, optionsListId, otherFoodInputId) {
    const optionsList = document.getElementById(optionsListId);
    const displayBox = document.getElementById(displayBoxId);
    const otherFoodInput = document.getElementById(otherFoodInputId);
    
    if (!optionsList || !displayBox || !otherFoodInput) {
        console.warn('Missing elements for updateFoodDisplay: displayBoxId=' + displayBoxId + ', optionsListId=' + optionsListId + ', otherFoodInputId=' + otherFoodInputId);
        return;
    }
    
    const selectedFoods = [];
    let hasOtherSelected = false;
    
    optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.dataset.foodValue === 'Khác') {
                hasOtherSelected = true;
            } else {
                selectedFoods.push(checkbox.dataset.foodValue);
            }
        }
    });
    
    if (hasOtherSelected) {
        otherFoodInput.classList.remove('hidden');
    } else {
        otherFoodInput.classList.add('hidden');
        otherFoodInput.value = '';
    }
    
    let displayText = selectedFoods.join(', ');
    if (hasOtherSelected && otherFoodInput.value.trim() !== '') {
        if (displayText !== '') {
            displayText += ', ' + otherFoodInput.value.trim();
        } else {
            displayText = otherFoodInput.value.trim();
        }
    } else if (hasOtherSelected && otherFoodInput.value.trim() === '') {
        if (displayText === '') {
            displayText = 'Khác';
        } else {
            displayText += ', Khác';
        }
    }
    
    displayBox.innerText = displayText || 'Chưa chọn';
    
    const triggerText = optionsList.closest('.custom-food-select-wrapper').querySelector('.selected-text');
    if (triggerText) {
        triggerText.textContent = displayText || 'Chọn thức ăn';
    }
}

// Function to add a new training block
function addTrainingBlock(data = {}) {
    const container = document.getElementById('training-blocks-container');
    if (!container) {
        console.error("Error: 'training-blocks-container' not found in DOM.");
        return;
    }
    
    trainingSessionCounter++;
    const trainingNumber = trainingSessionCounter;
    blockCounter++;
    const currentBlockId = blockCounter;
    
    const newBlock = document.createElement('div');
    newBlock.classList.add('training-block');
    newBlock.setAttribute('data-block-id', currentBlockId);
    
    const drugOptionsHtml = DRUG_TYPES.map(drug => '<label><input type="checkbox" data-drug-value="' + drug + '" onchange="updateDrugDisplay(' + currentBlockId + ', 1)">' + drug + '</label>').join('');
    
    const drugOptionsHtml2 = DRUG_TYPES.map(drug => '<label><input type="checkbox" data-drug-value="' + drug + '" onchange="updateDrugDisplay(' + currentBlockId + ', 2)">' + drug + '</label>').join('');
    
    const drugOptionsHtml3 = DRUG_TYPES.map(drug => '<label><input type="checkbox" data-drug-value="' + drug + '" onchange="updateDrugDisplay(' + currentBlockId + ', 3)">' + drug + '</label>').join('');
    
    const healthManifestationsHtml1 = HEALTH_MANIFESTATIONS.map(manifest => '<label><input type="checkbox" data-manifestation-type="' + manifest.toLowerCase().replace(/\s/g, '-') + '" value="' + manifest + '" ' + (data.drugDetection && data.drugDetection[0] && data.drugDetection[0].manifestation?.includes(manifest) ? 'checked' : '') + '> ' + manifest + '</label>').join('');
    
    const healthManifestationsHtml2 = HEALTH_MANIFESTATIONS.map(manifest => '<label><input type="checkbox" data-manifestation-type="' + manifest.toLowerCase().replace(/\s/g, '-') + '" value="' + manifest + '" ' + (data.drugDetection && data.drugDetection[1] && data.drugDetection[1].manifestation?.includes(manifest) ? 'checked' : '') + '> ' + manifest + '</label>').join('');
    
    const healthManifestationsHtml3 = HEALTH_MANIFESTATIONS.map(manifest => '<label><input type="checkbox" data-manifestation-type="' + manifest.toLowerCase().replace(/\s/g, '-') + '" value="' + manifest + '" ' + (data.drugDetection && data.drugDetection[2] && data.drugDetection[2].manifestation?.includes(manifest) ? 'checked' : '') + '> ' + manifest + '</label>').join('');
    
    newBlock.innerHTML = '<div class="training-first-row"><h3>Ca ' + trainingNumber + ':</h3><div class="field-group"><label for="trainingFromTime-' + currentBlockId + '">Thời gian:</label><input type="time" id="trainingFromTime-' + currentBlockId + '" value="' + (data.fromTime || '08:00') + '"></div><div class="field-group"><label for="trainingToTime-' + currentBlockId + '">Đến:</label><input type="time" id="trainingToTime-' + currentBlockId + '" value="' + (data.toTime || '09:00') + '"></div><div class="field-group"><label>Địa điểm:</label><label><input type="radio" name="training-location-group-' + currentBlockId + '" value="Sân tập" ' + (data.locationType === 'Sân tập' ? 'checked' : '') + ' onchange="updateLocationVisibility(' + currentBlockId + ')"> Sân tập</label><label><input type="radio" name="training-location-group-' + currentBlockId + '" value="Khác" data-location-type="khac" ' + (data.locationType === 'Khác' ? 'checked' : '') + ' onchange="updateLocationVisibility(' + currentBlockId + ')"> Khác</label><input type="text" class="location-other-input ' + (data.locationType !== 'Khác' ? 'hidden' : '') + '" id="trainingLocationOther-' + currentBlockId + '" placeholder="Ghi địa điểm khác" value="' + (data.locationOther || '') + '"></div></div><div class="training-second-row"><div class="field-group"><label>Nội dung:</label><div class="training-content-checkboxes"><label><input type="checkbox" class="training-checkbox" id="hlNangCaoCheckbox-' + currentBlockId + '" value="HL nâng cao" ' + (data.advancedTraining ? 'checked' : '') + '> HL nâng cao</label><label><input type="checkbox" class="training-checkbox" id="hlCoBanCheckbox-' + currentBlockId + '" value="HL động tác cơ bản" ' + (data.basicTraining ? 'checked' : '') + '> HL động tác cơ bản</label><label><input type="checkbox" class="training-checkbox" id="hlTheLucCheckbox-' + currentBlockId + '" value="HL thể lực" ' + (data.physicalTraining ? 'checked' : '') + '> HL thể lực</label><label><input type="checkbox" class="training-checkbox" id="hlKhacCheckbox-' + currentBlockId + '" value="Khác" ' + (data.otherTraining ? 'checked' : '') + ' onchange="toggleOtherTrainingInput(' + currentBlockId + ')"> Khác</label><input type="text" class="training-other-input ' + (!data.otherTraining ? 'hidden' : '') + '" id="hlKhacText-' + currentBlockId + '" placeholder="Ghi nội dung khác" value="' + (data.otherTraining || '') + '"></div></div></div><div class="drug-detection-section"><h4>HL phát hiện nguồn hơi ma túy:</h4><div class="drug-detection-row"><label>Lần 1:</label><div class="custom-location-select-wrapper drug-select-wrapper-' + currentBlockId + '-1"><div class="custom-dropdown-trigger" onclick="toggleDrugDropdown(\'drugTypeOptions-' + currentBlockId + '-1\')"><span class="selected-text" id="drugTypeTriggerText-' + currentBlockId + '-1">Chọn loại ma túy</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="drugTypeOptions-' + currentBlockId + '-1">' + drugOptionsHtml + '</div></div><span class="location-selected-display-box" id="drugTypeDisplayBox-' + currentBlockId + '-1">Chưa chọn</span><input type="text" class="location-other-input hidden" id="drugTypeOther-' + currentBlockId + '-1" placeholder="Loại ma túy khác" value="' + (data.drugDetection && data.drugDetection[0] ? (data.drugDetection[0].drugTypeOther || '') : '') + '" onchange="updateDrugDisplay(' + currentBlockId + ', 1)"><label>Biểu hiện:</label><div class="detection-manifestation-checkboxes detection-manifestation-1">' + healthManifestationsHtml1 + '</div><input type="text" class="detection-manifestation-other-1 hidden" id="manifestationOther-' + currentBlockId + '-1" placeholder="Biểu hiện khác" value="' + (data.drugDetection && data.drugDetection[0] ? (data.drugDetection[0].manifestationOther || '') : '') + '"></div><div class="drug-detection-row"><label>Lần 2:</label><div class="custom-location-select-wrapper drug-select-wrapper-' + currentBlockId + '-2"><div class="custom-dropdown-trigger" onclick="toggleDrugDropdown(\'drugTypeOptions-' + currentBlockId + '-2\')"><span class="selected-text" id="drugTypeTriggerText-' + currentBlockId + '-2">Chọn loại ma túy</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="drugTypeOptions-' + currentBlockId + '-2">' + drugOptionsHtml2 + '</div></div><span class="location-selected-display-box" id="drugTypeDisplayBox-' + currentBlockId + '-2">Chưa chọn</span><input type="text" class="location-other-input hidden" id="drugTypeOther-' + currentBlockId + '-2" placeholder="Loại ma túy khác" value="' + (data.drugDetection && data.drugDetection[1] ? (data.drugDetection[1].drugTypeOther || '') : '') + '" onchange="updateDrugDisplay(' + currentBlockId + ', 2)"><label>Biểu hiện:</label><div class="detection-manifestation-checkboxes detection-manifestation-2">' + healthManifestationsHtml2 + '</div><input type="text" class="detection-manifestation-other-2 hidden" id="manifestationOther-' + currentBlockId + '-2" placeholder="Biểu hiện khác" value="' + (data.drugDetection && data.drugDetection[1] ? (data.drugDetection[1].manifestationOther || '') : '') + '"></div><div class="drug-detection-row"><label>Lần 3:</label><div class="custom-location-select-wrapper drug-select-wrapper-' + currentBlockId + '-3"><div class="custom-dropdown-trigger" onclick="toggleDrugDropdown(\'drugTypeOptions-' + currentBlockId + '-3\')"><span class="selected-text" id="drugTypeTriggerText-' + currentBlockId + '-3">Chọn loại ma túy</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="drugTypeOptions-' + currentBlockId + '-3">' + drugOptionsHtml3 + '</div></div><span class="location-selected-display-box" id="drugTypeDisplayBox-' + currentBlockId + '-3">Chưa chọn</span><input type="text" class="location-other-input hidden" id="drugTypeOther-' + currentBlockId + '-3" placeholder="Loại ma túy khác" value="' + (data.drugDetection && data.drugDetection[2] ? (data.drugDetection[2].drugTypeOther || '') : '') + '" onchange="updateDrugDisplay(' + currentBlockId + ', 3)"><label>Biểu hiện:</label><div class="detection-manifestation-checkboxes detection-manifestation-3">' + healthManifestationsHtml3 + '</div><input type="text" class="detection-manifestation-other-3 hidden" id="manifestationOther-' + currentBlockId + '-3" placeholder="Biểu hiện khác" value="' + (data.drugDetection && data.drugDetection[2] ? (data.drugDetection[2].manifestationOther || '') : '') + '"></div></div>';
    
    container.appendChild(newBlock);
    
    // Initialize drug displays for all attempts
    for (let i = 1; i <= 3; i++) {
        if (data.drugDetection && data.drugDetection[i-1] && data.drugDetection[i-1].selectedDrugs) {
            const optionsList = document.getElementById('drugTypeOptions-' + currentBlockId + '-' + i);
            if (optionsList) {
                optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = data.drugDetection[i-1].selectedDrugs.includes(checkbox.dataset.drugValue);
                });
            }
        }
        updateDrugDisplay(currentBlockId, i);
    }
}

// Functions để handle interactions trong training block
function updateLocationVisibility(blockId) {
    const otherRadio = document.querySelector('input[name="training-location-group-' + blockId + '"][value="Khác"]');
    const otherInput = document.getElementById('trainingLocationOther-' + blockId);
    
    if (otherRadio && otherInput) {
        if (otherRadio.checked) {
            otherInput.classList.remove('hidden');
        } else {
            otherInput.classList.add('hidden');
            otherInput.value = '';
        }
    }
}

function toggleOtherTrainingInput(blockId) {
    const checkbox = document.getElementById('hlKhacCheckbox-' + blockId);
    const input = document.getElementById('hlKhacText-' + blockId);
    
    if (checkbox && input) {
        if (checkbox.checked) {
            input.classList.remove('hidden');
        } else {
            input.classList.add('hidden');
            input.value = '';
        }
    }
}

function toggleDrugDropdown(optionsId) {
    const dropdown = document.getElementById(optionsId);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        // Đóng các dropdown khác
        document.querySelectorAll('.custom-dropdown-options').forEach(other => {
            if (other.id !== optionsId) {
                other.classList.add('hidden');
            }
        });
    }
}

// Function to add a new operation block
function addOperationBlock(data = {}) {
    const container = document.getElementById('operation-blocks-container');
    if (!container) {
        console.error("Error: 'operation-blocks-container' not found in DOM.");
        return;
    }
    
    operationSessionCounter++;
    const operationNumber = operationSessionCounter;
    blockCounter++;
    const currentBlockId = blockCounter;
    
    const newBlock = document.createElement('div');
    newBlock.classList.add('operation-block');
    newBlock.setAttribute('data-block-id', currentBlockId);
    
    const locationOptionsHtml = OPERATION_LOCATIONS.map(loc => '<label><input type="checkbox" data-location-value="' + loc + '" ' + (data.selectedLocations?.includes(loc) ? 'checked' : '') + ' onchange="updateOperationLocationDisplay(' + currentBlockId + ')">' + loc + '</label>').join('');
    
    newBlock.innerHTML = '<div class="operation-header-line" style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 10px;"><h3 style="margin: 0;">Ca ' + operationNumber + '</h3><div style="display: flex; align-items: center; gap: 8px;"><label for="operationFromTime-' + currentBlockId + '">Thời gian:</label><input type="time" id="operationFromTime-' + currentBlockId + '" value="' + (data.fromTime || '09:00') + '"></div><div style="display: flex; align-items: center; gap: 8px;"><span>Đến:</span><input type="time" id="operationToTime-' + currentBlockId + '" value="' + (data.toTime || '10:00') + '"></div></div><div class="operation-location-line"><label>Địa điểm:</label><div class="custom-location-select-wrapper"><div class="custom-dropdown-trigger" onclick="toggleOperationLocationDropdown(\'operationLocationOptions-' + currentBlockId + '\')"><span class="selected-text" id="operationLocationTriggerText-' + currentBlockId + '">Chọn địa điểm</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="operationLocationOptions-' + currentBlockId + '">' + locationOptionsHtml + '<label><input type="checkbox" data-location-value="KHO NGOẠI QUAN" ' + (data.selectedLocations?.includes('KHO NGOẠI QUAN') ? 'checked' : '') + ' onchange="updateOperationLocationDisplay(' + currentBlockId + ')"> KHO NGOẠI QUAN</label><label><input type="checkbox" data-location-value="Khac" ' + (data.selectedLocations?.includes('Khac') ? 'checked' : '') + ' onchange="updateOperationLocationDisplay(' + currentBlockId + ')"> Khác</label></div></div><span class="location-selected-display-box" id="operationLocationDisplayBox-' + currentBlockId + '">Chưa chọn</span><input type="text" class="location-kho-input hidden" id="operationLocationKho-' + currentBlockId + '" placeholder="Ghi số Kho" value="' + (data.locationKhoText || '') + '" onchange="updateOperationLocationDisplay(' + currentBlockId + ')"><input type="text" class="location-other-input hidden" id="operationLocationOther-' + currentBlockId + '" placeholder="Ghi địa điểm khác" value="' + (data.locationOtherText || '') + '" onchange="updateOperationLocationDisplay(' + currentBlockId + ')"></div><div class="operation-activity-row-1"><label>Nội dung:</label><label><input type="checkbox" class="operation-checkbox-1" id="checkGoods-' + currentBlockId + '" value="Kiểm tra hàng hóa XNK" ' + (data.checkGoods ? 'checked' : '') + '> Kiểm tra hàng hóa XNK</label><label><input type="checkbox" class="operation-checkbox-1" id="checkLuggage-' + currentBlockId + '" value="Kiểm tra hành lý, phương tiện XNC" ' + (data.checkLuggage ? 'checked' : '') + '> Kiểm tra hành lý, phương tiện XNC</label><label><input type="checkbox" class="operation-checkbox-1" id="opKhacCheckbox1-' + currentBlockId + '" value="Khác" ' + (data.otherOperation1 ? 'checked' : '') + ' onchange="toggleOperationOtherInput(' + currentBlockId + ', 1)"> Khác</label><input type="text" class="operation-other-input-1 ' + (!data.otherOperation1 ? 'hidden' : '') + '" id="opKhacText1-' + currentBlockId + '" placeholder="Ghi nội dung khác" value="' + (data.otherOperation1 || '') + '"></div><div class="operation-activity-row-2"><label><input type="checkbox" class="operation-checkbox-2" id="fieldTraining-' + currentBlockId + '" value="HL nâng cao tại hiện trường" ' + (data.fieldTraining ? 'checked' : '') + '> HL nâng cao tại hiện trường</label><label><input type="checkbox" class="operation-checkbox-2" id="patrol-' + currentBlockId + '" value="Tuần tra kiểm soát" ' + (data.patrol ? 'checked' : '') + '> Tuần tra kiểm soát</label><label><input type="checkbox" class="operation-checkbox-2" id="opKhacCheckbox2-' + currentBlockId + '" value="Khác" ' + (data.otherOperation2 ? 'checked' : '') + ' onchange="toggleOperationOtherInput(' + currentBlockId + ', 2)"> Khác</label><input type="text" class="operation-other-input-2 ' + (!data.otherOperation2 ? 'hidden' : '') + '" id="opKhacText2-' + currentBlockId + '" placeholder="Ghi nội dung khác" value="' + (data.otherOperation2 || '') + '"></div><div class="textarea-block operation-issues-block"><label for="operation_other_issues_' + currentBlockId + '">Vấn đề khác:</label><textarea id="operation_other_issues_' + currentBlockId + '" rows="3">' + (data.otherIssues || '') + '</textarea></div>';
    
    container.appendChild(newBlock);
    updateOperationLocationDisplay(currentBlockId);
}

// Functions để handle operation block interactions
function toggleOperationLocationDropdown(optionsId) {
    const dropdown = document.getElementById(optionsId);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        document.querySelectorAll('.custom-dropdown-options').forEach(other => {
            if (other.id !== optionsId) {
                other.classList.add('hidden');
            }
        });
    }
}

function toggleOperationOtherInput(blockId, rowNumber) {
    const checkbox = document.getElementById('opKhacCheckbox' + rowNumber + '-' + blockId);
    const input = document.getElementById('opKhacText' + rowNumber + '-' + blockId);
    
    if (checkbox && input) {
        if (checkbox.checked) {
            input.classList.remove('hidden');
        } else {
            input.classList.add('hidden');
            input.value = '';
        }
    }
}

// Function: Update drug type display for detection attempts
function updateDrugDisplay(blockId, attemptNumber) {
    console.log('Updating drug display for block ' + blockId + ', attempt ' + attemptNumber);
    
    const optionsList = document.getElementById('drugTypeOptions-' + blockId + '-' + attemptNumber);
    const displayBox = document.getElementById('drugTypeDisplayBox-' + blockId + '-' + attemptNumber);
    const otherInput = document.getElementById('drugTypeOther-' + blockId + '-' + attemptNumber);
    
    if (!optionsList || !displayBox || !otherInput) {
        console.warn('Missing elements for updateDrugDisplay for block ' + blockId + ', attempt ' + attemptNumber + '.');
        return;
    }
    
    const selectedDrugs = [];
    let isKhacSelected = false;
    
    optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.dataset.drugValue === 'Khác') {
                isKhacSelected = true;
            } else {
                selectedDrugs.push(checkbox.dataset.drugValue);
            }
        }
    });
    
    // Toggle visibility of other input
    if (isKhacSelected) {
        otherInput.classList.remove('hidden');
    } else {
        otherInput.classList.add('hidden');
        otherInput.value = '';
    }
    
    // Construct the display text
    let displayTextParts = [];
    selectedDrugs.forEach(drug => displayTextParts.push(drug));
    
    if (isKhacSelected) {
        displayTextParts.push(otherInput.value.trim() !== '' ? otherInput.value.trim() : 'Khác');
    }
    
    const finalText = displayTextParts.join(', ') || 'Chưa chọn';
    displayBox.innerText = finalText;
    
    // Update the trigger text
    const triggerTextElement = document.getElementById('drugTypeTriggerText-' + blockId + '-' + attemptNumber);
    if (triggerTextElement) {
        triggerTextElement.innerText = displayTextParts.length > 0 ? displayTextParts.join(', ') : 'Chọn loại ma túy';
    }
}

// Function to update the displayed selected location for operation blocks
function updateOperationLocationDisplay(blockId) {
    const optionsList = document.getElementById('operationLocationOptions-' + blockId);
    const displayBox = document.getElementById('operationLocationDisplayBox-' + blockId);
    const khoInput = document.getElementById('operationLocationKho-' + blockId);
    const otherInput = document.getElementById('operationLocationOther-' + blockId);
    
    if (!optionsList || !displayBox || !khoInput || !otherInput) {
        console.warn('Missing elements for updateOperationLocationDisplay for block ' + blockId + '.');
        return;
    }
    
    const selectedLocations = [];
    let isKhoSelected = false;
    let isKhacSelected = false;
    
    optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.dataset.locationValue === 'KHO NGOẠI QUAN') {
                isKhoSelected = true;
                selectedLocations.push('KHO NGOẠI QUAN');
            } else if (checkbox.dataset.locationValue === 'Khac') {
                isKhacSelected = true;
            } else {
                selectedLocations.push(checkbox.dataset.locationValue);
            }
        }
    });
    
    // Toggle visibility of inputs
    if (isKhoSelected) {
        khoInput.classList.remove('hidden');
    } else {
        khoInput.classList.add('hidden');
        khoInput.value = '';
    }
    
    if (isKhacSelected) {
        otherInput.classList.remove('hidden');
    } else {
        otherInput.classList.add('hidden');
        otherInput.value = '';
    }
    
    // Construct display text
    let displayTextParts = [...selectedLocations];
    
    if (isKhoSelected && khoInput.value.trim() !== '') {
        displayTextParts.push('KHO ' + khoInput.value.trim());
    } else if (isKhoSelected) {
        displayTextParts.push('KHO NGOẠI QUAN');
    }
    
    if (isKhacSelected && otherInput.value.trim() !== '') {
        displayTextParts.push(otherInput.value.trim());
    } else if (isKhacSelected) {
        displayTextParts.push('Khác');
    }
    
    const finalText = displayTextParts.join(', ') || 'Chưa chọn';
    displayBox.innerText = finalText;
    
    // Update trigger text
    const triggerTextElement = document.getElementById('operationLocationTriggerText-' + blockId);
    if (triggerTextElement) {
        triggerTextElement.innerText = displayTextParts.length > 0 ? displayTextParts.join(', ') : 'Chọn địa điểm';
    }
}

// SỬA: Function to show pure A4 journal view - CHỈ PDF, KHÔNG WEB CONTROLS - ĐẢM BẢO HIỂN THỊ PDF ĐÚNG CÁCH
function showPureA4JournalView(dogName, date) {
    console.log('🎯 STARTING PURE A4 PDF VIEW MODE');
    
    // SỬA: FORCE ẨN TẤT CẢ web navigation elements NGAY LẬP TỨC
    hideAllContentSections();
    
    // SỬA: Ẩn HOÀN TOÀN tất cả navigation elements
    const elementsToHide = [
        'toggleReadButton',
        '.header',
        '.sidebar',
        '#loginPage',
        '#dashboardBanner',
        '.journal-header-actions',
        '.journal-action-buttons'
    ];
    
    elementsToHide.forEach(selector => {
        const element = selector.startsWith('.') || selector.startsWith('#') 
            ? document.querySelector(selector) 
            : document.getElementById(selector);
        if (element) {
            element.style.display = 'none';
            console.log('✅ Đã ẩn: ' + selector);
        }
    });
    
    const content = document.getElementById('content');
    const title = document.getElementById('title');
    
    // SỬA: FORCE thiết lập chế độ pure PDF view
    content.style.cssText = 'display: block !important; margin: 0 !important; padding: 0 !important; width: 100vw !important; max-width: none !important; height: 100vh !important; overflow-y: auto !important; background: #f5f5f5 !important; position: relative !important; z-index: 1 !important;';
    
    // Ẩn title web
    title.style.display = 'none';
    
    // SỬA: Load journal data với error handling tốt hơn
    const journalKey = 'journal_' + dogName + '_' + date;
    const journalData = JSON.parse(localStorage.getItem(journalKey));
    
    if (!journalData) {
        content.innerHTML = '<div style="text-align: center; padding: 50px; background: white;"><h3>❌ KHÔNG TÌM THẤY NHẬT KÝ</h3><p>Không có nhật ký cho CNV ' + dogName + ' ngày ' + date + '</p></div>';
        return;
    }
    
    // SỬA: Hiển thị pure A4 PDF view hoàn chỉnh
 content.innerHTML = '<div class="a4-journal-view" style="background: white; max-width: 210mm; margin: 20px auto; padding: 20mm; font-family: \'Times New Roman\', serif; font-size: 14px; line-height: 1.4; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm;"><div class="a4-header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;"><h1 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">TỔNG CỤC HẢI QUAN</h1><h2 style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">SỔ NHẬT KÝ HUẤN LUYỆN CHÓ NGHIỆP VỤ</h2><div style="display: flex; justify-content: space-between; margin-top: 20px;"><div><strong>CNV:</strong> ' + journalData.generalInfo.dogName + '</div><div><strong>Ngày:</strong> ' + journalData.generalInfo.date + '</div></div><div style="margin-top: 10px;"><strong>Huấn luyện viên:</strong> ' + journalData.generalInfo.hlv + '</div></div><div class="a4-section" style="margin-bottom: 30px;"><h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">I. HOẠT ĐỘNG HUẤN LUYỆN</h3>' + renderTrainingBlocks(journalData.trainingBlocks || []) + '<div style="margin-top: 20px;"><strong>Đánh giá chung của Huấn luyện viên:</strong><br><div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; min-height: 60px;">' + (journalData.hlvComment || 'Chưa có đánh giá') + '</div></div></div><div class="a4-section" style="margin-bottom: 30px;"><h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">II. CHĂM SÓC & NUÔI DƯỠNG</h3><table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"><tr><td style="border: 1px solid #000; padding: 8px; width: 15%;"><strong>Bữa trưa:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + (journalData.meals?.lunch?.time || '') + ' - ' + (journalData.meals?.lunch?.amount || '') + '</td></tr><tr><td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn trưa:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + (journalData.meals?.lunch?.food || 'Chưa ghi') + '</td></tr><tr><td style="border: 1px solid #000; padding: 8px;"><strong>Bữa chiều:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + (journalData.meals?.dinner?.time || '') + ' - ' + (journalData.meals?.dinner?.amount || '') + '</td></tr><tr><td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn chiều:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + (journalData.meals?.dinner?.food || 'Chưa ghi') + '</td></tr><tr><td style="border: 1px solid #000; padding: 8px;"><strong>Chăm sóc:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + renderCareActivities(journalData.care || {}) + '</td></tr><tr><td style="border: 1px solid #000; padding: 8px;"><strong>Sức khỏe:</strong></td><td style="border: 1px solid #000; padding: 8px;">' + (journalData.health?.status || 'Bình thường') + '</td></tr></table>' + (journalData.health?.other ? '<p><strong>Ghi chú sức khỏe:</strong> ' + journalData.health.other + '</p>' : '') + '</div><div class="a4-section" style="margin-bottom: 30px;"><h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">III. HOẠT ĐỘNG TÁC NGHIỆP</h3>' + renderOperationBlocks(journalData.operationBlocks || []) + '</div><div class="a4-section" style="margin-bottom: 30px; page-break-inside: avoid;"><h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">IV. DUYỆT & KÝ</h3><div style="display: flex; justify-content: space-between; margin-top: 30px;"><div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 120px;"><strong>HUẤN LUYỆN VIÊN</strong><br><br>' + (journalData.approval?.hvlSignature ? '<div style="text-align: left;">✓ <strong>' + journalData.approval.hvlSignature.name + '</strong><br>Ký ngày: ' + new Date(journalData.approval.hvlSignature.timestamp).toLocaleString('vi-VN') + '<br>ID: ' + journalData.approval.hvlSignature.id + '</div>' : '<span style="color: red;">Chưa ký</span>') + '</div><div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 120px;"><strong>LÃNH ĐẠO ĐƠN VỊ</strong><br><br>' + (journalData.approval?.leaderSignature ? '<div style="text-align: left;">✓ <strong>' + journalData.approval.leaderSignature.name + '</strong><br>Ký ngày: ' + new Date(journalData.approval.leaderSignature.timestamp).toLocaleString('vi-VN') + '<br>Nhận xét: ' + (journalData.approval.leaderComment || 'Đã duyệt') + '<br>Chữ ký số: ' + journalData.approval.leaderSignature.digitalSignature + '<br>ID: ' + journalData.approval.leaderSignature.id + '</div>' : '<span style="color: orange;">Chờ duyệt</span>') + '</div></div>' + (journalData.approval?.substituteSignature ? '<div style="width: 100%; text-align: center; border: 1px solid #000; padding: 20px; margin-top: 20px; min-height: 80px;"><strong>HLV TRỰC THAY</strong><br><br><div style="text-align: left;">✓ <strong>' + journalData.approval.substituteSignature.name + '</strong><br>Ký ngày: ' + new Date(journalData.approval.substituteSignature.timestamp).toLocaleString('vi-VN') + '<br>Ý kiến: ' + journalData.approval.substituteSignature.comment + '<br>ID: ' + journalData.approval.substituteSignature.id + '</div></div>' : '') + '</div></div><div style="text-align: center; margin: 20px 0; background: white; padding: 20px;" class="no-print"><button onclick="window.print()" style="background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">🖨️ In nhật ký</button><button onclick="returnToManagerView()" style="background: #2196F3; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">📋 Quay lại danh sách</button><button onclick="window.close()" style="background: #f44336; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">❌ Đóng</button></div>' +
'<style>@media print { .no-print { display: none !important; } body { margin: 0; padding: 0; } .a4-journal-view { max-width: none !important; margin: 0 !important; padding: 15mm !important; box-shadow: none !important; font-size: 12px !important; } } @media screen { .a4-journal-view { background: white; max-width: 210mm; margin: 20px auto; padding: 20mm; font-family: "Times New Roman", serif; font-size: 14px; line-height: 1.4; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm; } }</style>';
    console.log('✅ PURE A4 PDF VIEW MODE COMPLETED');
}

// SỬA: Helper function để quay lại journal list
// SỬA: Helper function để quay lại journal list
function returnToJournalList() {
    console.log('🔄 Returning to journal list...');
    
    // SỬA: Khôi phục lại tất cả web navigation elements
    const elementsToShow = [
        'toggleReadButton',
        '.header', 
        '.sidebar'
    ];
    
    elementsToShow.forEach(selector => {
        const element = selector.startsWith('.') || selector.startsWith('#')
            ? document.querySelector(selector)
            : document.getElementById(selector);
        if (element) {
            element.style.display = '';
            console.log('✅ Restored:', selector);
        }
    });
    
    // SỬA: Reset content container về trạng thái bình thường
    const content = document.getElementById('content');
    if (content) {
        content.style.cssText = 'display: block; margin: 0; padding: 20px; width: auto; max-width: none; height: auto; overflow-y: auto; background: white; position: relative; z-index: 1;';
    }
    
    // SỬA: Reset title
    const title = document.getElementById('title');
    if (title) {
        title.style.display = 'block';
    }
    
    // SỬA: Quay về manager view thay vì journal edit form
    if (currentUserRole === 'MANAGER') {
        console.log('🏢 Returning to manager pending journals view');
        showAllPendingJournalsForManager();
    } else {
        // Cho TRAINER/ADMIN quay về journal edit form
        showJournalEditForm(currentDogForJournal);
    }
    
    console.log('✅ Successfully returned to journal list');
}

// Helper functions for rendering journal sections
function renderTrainingBlocks(blocks) {
    if (!blocks || blocks.length === 0) return '<p>Không có hoạt động huấn luyện.</p>';
    
    return blocks.map((block, index) => '<div class="training-block-display" style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;"><p><strong>Ca ' + (index + 1) + ':</strong> ' + (block.fromTime || '') + ' - ' + (block.toTime || '') + '</p><p><strong>Địa điểm:</strong> ' + (block.location || 'Sân tập') + '</p><p><strong>Nội dung:</strong> ' + renderTrainingContent(block) + '</p>' + (block.drugDetection ? '<p><strong>Phát hiện ma túy:</strong> ' + renderDrugDetection(block.drugDetection) + '</p>' : '') + '</div>').join('');
}

function renderTrainingContent(block) {
    const content = [];
    if (block.advancedTraining) content.push('HL nâng cao');
    if (block.basicTraining) content.push('HL động tác cơ bản');
    if (block.physicalTraining) content.push('HL thể lực');
    if (block.otherTraining) content.push(block.otherTraining);
    return content.join(', ') || 'Chưa ghi';
}

function renderDrugDetection(detection) {
    if (!detection || detection.length === 0) return 'Không có';
    return detection.map((attempt, index) => 'Lần ' + (index + 1) + ': ' + (attempt.selectedDrugs?.join(', ') || 'Chưa ghi') + ' - ' + (attempt.manifestation?.join(', ') || 'Chưa ghi')).join('; ');
}

function renderCareActivities(care) {
    const activities = [];
    if (care.bath) activities.push('Tắm rửa');
    if (care.brush) activities.push('Chải lông');
    if (care.wipe) activities.push('Lau lông');
    return activities.join(', ') || 'Chưa có hoạt động chăm sóc';
}

function renderOperationBlocks(blocks) {
    if (!blocks || blocks.length === 0) return '<p>Không có hoạt động tác nghiệp.</p>';
    
    return blocks.map((block, index) => '<div class="operation-block-display" style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;"><p><strong>Ca ' + (index + 1) + ':</strong> ' + (block.fromTime || '') + ' - ' + (block.toTime || '') + '</p><p><strong>Địa điểm:</strong> ' + (block.selectedLocations?.join(', ') || 'Chưa ghi') + '</p><p><strong>Nội dung:</strong> ' + renderOperationContent(block) + '</p>' + (block.otherIssues ? '<p><strong>Vấn đề khác:</strong> ' + block.otherIssues + '</p>' : '') + '</div>').join('');
}

function renderOperationContent(block) {
    const content = [];
    if (block.checkGoods) content.push('Kiểm tra hàng hóa XNK');
    if (block.checkLuggage) content.push('Kiểm tra hành lý, phương tiện XNC');
    if (block.fieldTraining) content.push('HL nâng cao tại hiện trường');
    if (block.patrol) content.push('Tuần tra kiểm soát');
    if (block.otherOperation1) content.push(block.otherOperation1);
    if (block.otherOperation2) content.push(block.otherOperation2);
    return content.join(', ') || 'Chưa ghi';
}

// Function to load journal data - UPDATED TO USE DATABASE
async function loadJournalData(dogName, date, createNew = false) {
    try {
        // Use the database manager
        const journalData = await window.journalDBManager.loadJournalData(dogName, date, createNew);
        
        if (journalData) {
            // Convert database format to localStorage format for compatibility
            const localStorageFormat = convertDatabaseToLocalStorageFormat(journalData);
            populateJournalForm(localStorageFormat);
        } else {
            // No journal found, create new
            addTrainingBlock();
            addOperationBlock();
        }
    } catch (error) {
        console.error('Error loading journal data:', error);
        // Fallback to localStorage if database fails
    const journalKey = 'journal_' + dogName + '_' + date;
    const existingData = localStorage.getItem(journalKey);
    
    if (existingData && !createNew) {
        const data = JSON.parse(existingData);
        populateJournalForm(data);
    } else {
        addTrainingBlock();
        addOperationBlock();
        }
    }
}

// Function to convert database journal format to localStorage format
function convertDatabaseToLocalStorageFormat(dbJournal) {
    return {
        generalInfo: {
            dogName: dbJournal.dog_name,
            date: dbJournal.journal_date,
            hlv: dbJournal.trainer_name
        },
        trainingBlocks: dbJournal.training_activities ? 
            dbJournal.training_activities.split(';').map(activity => ({ content: activity.trim() })) : [],
        operationBlocks: dbJournal.operation_activities ? 
            dbJournal.operation_activities.split(';').map(activity => ({ content: activity.trim() })) : [],
        care: convertCareActivitiesToLocalStorage(dbJournal.care_activities),
        health: {
            status: dbJournal.health_status || 'Tốt',
            weather: dbJournal.weather_conditions || ''
        },
        hlvComment: dbJournal.behavior_notes || '',
        otherIssues: dbJournal.challenges || '',
        approval: {
            status: dbJournal.approval_status,
            leaderStatus: dbJournal.approval_status === 'APPROVED' ? 'Đã duyệt' : 
                         dbJournal.approval_status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt',
            leaderComment: dbJournal.rejection_reason || '',
            approvedBy: dbJournal.approver_name || '',
            approvedAt: dbJournal.approved_at || ''
        },
        lastModified: dbJournal.updated_at || dbJournal.created_at
    };
}

// Function to convert care activities from database format to localStorage format
function convertCareActivitiesToLocalStorage(careActivities) {
    const care = { morning: '', afternoon: '', evening: '' };
    
    if (careActivities) {
        const activities = careActivities.split(';').filter(a => a.trim());
        
        activities.forEach(activity => {
            if (activity.includes('Sáng:')) {
                care.morning = activity.replace('Sáng:', '').trim();
            } else if (activity.includes('Chiều:')) {
                care.afternoon = activity.replace('Chiều:', '').trim();
            } else if (activity.includes('Tối:')) {
                care.evening = activity.replace('Tối:', '').trim();
            }
        });
    }
    
    return care;
}

// Function to populate journal form with existing data
function populateJournalForm(data) {
    // Populate general info
    if (data.generalInfo) {
        const dateField = document.getElementById('journal_date');
        const hlvField = document.getElementById('journal_hlv');
        const dogField = document.getElementById('journal_dog_name');
        
        if (dateField) dateField.value = data.generalInfo.date || '';
        if (hlvField) hlvField.value = data.generalInfo.hlv || '';
        if (dogField) dogField.value = data.generalInfo.dogName || '';
    }
    
    // Populate training blocks
    if (data.trainingBlocks && data.trainingBlocks.length > 0) {
        data.trainingBlocks.forEach(blockData => {
            addTrainingBlock(blockData);
        });
    } else {
        addTrainingBlock();
    }
    
    // Populate operation blocks
    if (data.operationBlocks && data.operationBlocks.length > 0) {
        data.operationBlocks.forEach(blockData => {
            addOperationBlock(blockData);
        });
    } else {
        addOperationBlock();
    }
    
    // Populate meals, care, health data
    if (data.meals) populateMealData(data.meals);
    if (data.care) populateCareData(data.care);
    if (data.health) populateHealthData(data.health);
    
    // Populate comments
    const hlvCommentField = document.getElementById('journal_hlv_comment');
    const otherIssuesField = document.getElementById('journal_other_issues');
    
    if (hlvCommentField) hlvCommentField.value = data.hlvComment || '';
    if (otherIssuesField) otherIssuesField.value = data.otherIssues || '';
    
    // Load approval and signature data
    if (data.approval) {
        loadApprovalData(data.approval);
    }
}

// Helper functions for populating form data
function populateMealData(meals) {
    if (meals.lunch) {
        const lunchTimeField = document.getElementById('lunchTime');
        const lunchAmountField = document.getElementById('lunchAmount');
        const lunchFoodOtherField = document.getElementById('lunchFoodOther');
        
        if (lunchTimeField) lunchTimeField.value = meals.lunch.time || '11:00';
        if (lunchAmountField) lunchAmountField.value = meals.lunch.amount || 'Ăn hết';
        if (lunchFoodOtherField) lunchFoodOtherField.value = meals.lunch.foodOther || '';
    }
    
    if (meals.dinner) {
        const dinnerTimeField = document.getElementById('dinnerTime');
        const dinnerAmountField = document.getElementById('dinnerAmount');
        const dinnerFoodOtherField = document.getElementById('dinnerFoodOther');
        
        if (dinnerTimeField) dinnerTimeField.value = meals.dinner.time || '17:00';
        if (dinnerAmountField) dinnerAmountField.value = meals.dinner.amount || 'Ăn hết';
        if (dinnerFoodOtherField) dinnerFoodOtherField.value = meals.dinner.foodOther || '';
    }
}

function populateCareData(care) {
    const bathField = document.getElementById('care_bath');
    const brushField = document.getElementById('care_brush');
    const wipeField = document.getElementById('care_wipe');
    
    if (bathField) bathField.checked = care.bath || false;
    if (brushField) brushField.checked = care.brush || false;
    if (wipeField) wipeField.checked = care.wipe || false;
}

function populateHealthData(health) {
    const healthRadios = document.querySelectorAll('input[name="health_status"]');
    const healthOtherField = document.getElementById('health_other_text');
    
    healthRadios.forEach(radio => {
        if (radio.value === health.status) {
            radio.checked = true;
        }
    });
    
    if (healthOtherField) healthOtherField.value = health.other || '';
}

// Function to setup form event listeners
function setupFormEventListeners() {
    // Health status change listener
    document.querySelectorAll('input[name="health_status"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const healthOtherField = document.getElementById('health_other_text');
            if (healthOtherField) {
                if (radio.checked && (radio.dataset.healthType === 'abnormal' || radio.dataset.healthType === 'sick')) {
                    healthOtherField.classList.remove('hidden');
                } else {
                    healthOtherField.classList.add('hidden');
                    healthOtherField.value = '';
                }
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown-trigger')) {
            document.querySelectorAll('.custom-dropdown-options').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        }
    });
}

// SỬA CHỮ KÝ THỰC: Electronic signature functions - SỬA HOÀN TOÀN VỚI CHỮ KÝ THỰC VÀ WORKFLOW MANAGER
async function submitHvlSignature() {
    console.log('🖊️ HLV Signature function called');
    
    const hvlSignatureDisplay = document.getElementById('hvl-signature-display');
    const submissionStatus = document.querySelector('.submission-status');
    const submitBtn = document.querySelector('.btn-submit-hvl');
    
    if (!hvlSignatureDisplay || !submissionStatus) {
        console.error('❌ Required elements not found for HLV signature');
        console.log('Available elements:', {
            hvlDisplay: !!hvlSignatureDisplay,
            status: !!submissionStatus,
            allStatusElements: document.querySelectorAll('.submission-status').length
        });
        alert('Lỗi: Không tìm thấy phần tử hiển thị chữ ký! Vui lòng thử lại.');
        return;
    }
    
    if (confirm('Bạn có chắc muốn ký nhật ký này? Sau khi ký, nhật ký sẽ được chuyển cho Manager duyệt.')) {
        try {
            const currentTime = new Date().toISOString();
            const signerName = currentUserName || hlvInfo.name;
            const signerRole = currentUserRole || 'TRAINER';
            
            console.log('🔑 Signing with:', { signerName, signerRole });
            
            // Lấy chữ ký thực từ database chữ ký
            const signatureData = getUserSignature(signerName, signerRole);
            console.log('📋 Retrieved signature data:', signatureData);
            
            // Tạo hash an toàn với Unicode
            let hashString = '';
            try {
                hashString = btoa(unescape(encodeURIComponent(signerName + '_HLV_' + currentTime)));
            } catch (error) {
                console.warn('Hash encoding error, using fallback:', error);
                hashString = 'HASH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            const fullSignatureData = {
                name: signerName,
                role: signerRole,
                timestamp: currentTime,
                id: 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                hash: hashString,
                verified: true,
                digitalSignature: generateDigitalSignature(signerName, signerRole, currentTime)
            };
            
            console.log('💾 Full signature data prepared:', fullSignatureData);
            
            // Update UI NGAY LẬP TỨC với chữ ký thực
            const signatureHTML = await generateSignatureHTML(signatureData, currentTime);
            console.log('🎨 Generated signature HTML');
            
            hvlSignatureDisplay.innerHTML = signatureHTML;
            submissionStatus.innerHTML = '<strong style="color: green;">✅ Đã ký thành công</strong>';
            
            // Ẩn nút ký sau khi đã ký
            if (submitBtn) {
                submitBtn.style.display = 'none';
            }
            
            console.log('✅ HLV signature UI updated successfully');
            
            // SỬA: LƯU CHỮ KÝ VÀ CHUYỂN CHO MANAGER - WORKFLOW HOÀN CHỈNH
            saveSignatureToJournal('hvlSignature', fullSignatureData);
            
            // SỬA: THÊM VÀO DANH SÁCH CHỜ DUYỆT CỦA MANAGER
            addJournalToPendingManagerApproval();
            
            // Notify dashboard về journal update
            notifyDashboardUpdate();
            
            // SỬA: THÔNG BÁO CHUYỂN CHO MANAGER
            alert('🎉 Đã ký nhật ký thành công!\n\n' +
                  '📋 Nhật ký đã được chuyển cho Manager duyệt\n' +
                  '⏳ Manager sẽ nhận được thông báo\n' +
                  '👀 Bạn có thể theo dõi trạng thái trong "Xem nhật ký cũ"');
            
            console.log('✅ HLV signature completed successfully and sent to Manager');
            
        } catch (error) {
            console.error('❌ Error in submitHvlSignature:', error);
            alert('Có lỗi khi ký nhật ký: ' + error.message);
        }
    }
}

// SỬA: Function THÊM VÀO DANH SÁCH CHỜ DUYỆT CỦA MANAGER
function addJournalToPendingManagerApproval() {
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    console.log('📝 Adding journal to pending manager approval:', journalKey);
    
    // SỬA: CẬP NHẬT JOURNAL STATUS
    let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
    if (!journalData.approval) {
        journalData.approval = {};
    }
    
    // Set trạng thái chờ duyệt
    journalData.approval.status = 'PENDING_MANAGER_APPROVAL';
    journalData.approval.submittedAt = new Date().toISOString();
    journalData.approval.submittedBy = currentUserName;
    journalData.approval.requiresManagerApproval = true; // SỬA: THÊM FLAG ĐẶC BIỆT
    
    localStorage.setItem(journalKey, JSON.stringify(journalData));
    console.log('✅ Updated journal status to PENDING_MANAGER_APPROVAL');
    
    // SỬA: THÊM VÀO DANH SÁCH PENDING JOURNALS RIÊNG
    const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
    
    // Kiểm tra nếu journal đã có trong danh sách chờ duyệt
    const existingIndex = pendingJournals.findIndex(j => j.key === journalKey);
    
    const journalEntry = {
        key: journalKey,
        dogName: dogName,
        date: date,
        trainer: currentUserName,
        submittedAt: new Date().toISOString(),
        status: 'PENDING',
        requiresAction: true // SỬA: FLAG MANAGER CẦN XỬ LÝ
    };
    
    if (existingIndex === -1) {
        pendingJournals.push(journalEntry);
        console.log('✅ Added new journal to pending manager approvals');
    } else {
        pendingJournals[existingIndex] = journalEntry;
        console.log('✅ Updated existing journal in pending manager approvals');
    }
    
    localStorage.setItem('pending_manager_approvals', JSON.stringify(pendingJournals));
    
    // SỬA: TẠO NOTIFICATION CHO MANAGER
    createManagerNotification(journalEntry);
    
    console.log('📊 Current pending journals for manager:', pendingJournals.length);
}

// SỬA: Function TẠO NOTIFICATION CHO MANAGER
function createManagerNotification(journalEntry) {
    const notifications = JSON.parse(localStorage.getItem('manager_notifications')) || [];
    
    const notification = {
        id: 'notif_' + Date.now(),
        type: 'JOURNAL_APPROVAL_REQUIRED',
        title: 'Nhật ký mới cần duyệt',
        message: `HLV ${journalEntry.trainer} đã gửi nhật ký CNV ${journalEntry.dogName} (${journalEntry.date}) để duyệt`,
        journalKey: journalEntry.key,
        createdAt: new Date().toISOString(),
        read: false,
        urgent: true
    };
    
    notifications.unshift(notification); // Thêm vào đầu danh sách
    
    // Giới hạn số notification (giữ lại 50 notification gần nhất)
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    
    localStorage.setItem('manager_notifications', JSON.stringify(notifications));
    console.log('📢 Created manager notification:', notification.id);
}

// SỬA: Function đặt trạng thái nhật ký chờ Manager duyệt
function setJournalPendingForManagerApproval() {
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
    
    if (!journalData.approval) {
        journalData.approval = {};
    }
    
    // Set trạng thái chờ duyệt
    journalData.approval.status = 'PENDING_MANAGER_APPROVAL';
    journalData.approval.submittedAt = new Date().toISOString();
    journalData.approval.submittedBy = currentUserName;
    
    localStorage.setItem(journalKey, JSON.stringify(journalData));
    console.log('✅ Set journal pending for manager approval:', journalKey);
    
    // Thêm vào danh sách journals chờ duyệt
    const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
    const existingIndex = pendingJournals.findIndex(j => j.key === journalKey);
    
    if (existingIndex === -1) {
        pendingJournals.push({
            key: journalKey,
            dogName: dogName,
            date: date,
            trainer: currentUserName,
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem('pending_manager_approvals', JSON.stringify(pendingJournals));
        console.log('✅ Added journal to pending manager approvals');
    }
}

async function approveJournal() {
    console.log('🖊️ Leader approval function called');
    
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'MANAGER') {
        alert('Bạn không có quyền duyệt nhật ký!');
        return;
    }
    
    const leaderSignatureDisplay = document.getElementById('leader-signature-display');
    const approvalStatus = document.querySelector('.approval-status');
    const approveBtn = document.querySelector('.btn-approve');
    
    if (!leaderSignatureDisplay || !approvalStatus) {
        console.error('❌ Required elements not found for leader approval');
        console.log('Available elements:', {
            leaderDisplay: !!leaderSignatureDisplay,
            status: !!approvalStatus
        });
        alert('Lỗi: Không tìm thấy phần tử hiển thị chữ ký lãnh đạo! Vui lòng thử lại.');
        return;
    }
    
    if (confirm('Bạn có chắc muốn duyệt nhật ký này?')) {
        try {
            const currentTime = new Date().toISOString();
            
            console.log('🔑 Manager approving with:', currentUserName, currentUserRole);
            
            // SỬA: Lấy chữ ký thực từ database chữ ký cho Manager
            const signatureData = getUserSignature(currentUserName, currentUserRole);
            console.log('📋 Retrieved manager signature data:', signatureData);
            
            // SỬA: Tạo hash an toàn với Unicode
            let hashString = '';
            try {
                hashString = btoa(unescape(encodeURIComponent(currentUserName + '_LEADER_' + currentTime)));
            } catch (error) {
                console.warn('Hash encoding error, using fallback:', error);
                hashString = 'HASH_LEADER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            const fullSignatureData = {
                name: currentUserName,
                role: currentUserRole,
                timestamp: currentTime,
                id: 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                hash: hashString,
                verified: true,
                digitalSignature: generateDigitalSignature(currentUserName, currentUserRole, currentTime)
            };
            
            // SỬA: Update UI NGAY LẬP TỨC với chữ ký thực
            const signatureHTML = await generateSignatureHTML(signatureData, currentTime);
            leaderSignatureDisplay.innerHTML = signatureHTML;
            approvalStatus.innerHTML = '<strong style="color: green;">✅ Đã duyệt</strong>';
            
            // Ẩn nút duyệt sau khi đã duyệt
            if (approveBtn) {
                approveBtn.style.display = 'none';
            }
            
            console.log('✅ Leader approval UI updated successfully');
            
            // Save signature and approval status
            const leaderComment = document.getElementById('leader_comment').value;
            saveSignatureToJournal('leaderSignature', fullSignatureData);
            saveApprovalData({
                leaderComment: leaderComment,
                leaderStatus: 'Đã duyệt',
                leaderApprovalTime: currentTime,
                status: 'APPROVED'
            });
            
            // SỬA: Remove từ danh sách chờ duyệt
            removeFromPendingApprovals();
            
            // Notify dashboard về journal approval
            notifyDashboardUpdate();
            
            alert('Đã duyệt nhật ký thành công!\nChữ ký Manager đã được lưu trữ.\nNhật ký đã hoàn thành quy trình.');
            
            console.log('✅ Leader approval completed successfully');
            
        } catch (error) {
            console.error('❌ Error in approveJournal:', error);
            alert('Có lỗi khi duyệt nhật ký: ' + error.message);
        }
    }
}

// Function remove journal từ pending approvals
function removeFromPendingApprovals() {
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
    const filteredJournals = pendingJournals.filter(j => j.key !== journalKey);
    
    localStorage.setItem('pending_manager_approvals', JSON.stringify(filteredJournals));
    console.log('✅ Removed journal from pending approvals');
}

// Function tạo chữ ký số - SỬA: Hỗ trợ Unicode (tiếng Việt)
function generateDigitalSignature(userName, role, timestamp) {
    // Tạo một chuỗi dữ liệu để ký
    const dataToSign = userName + '|' + role + '|' + timestamp + '|' + Date.now();
    
    // Tạo hash từ dữ liệu (giả lập thuật toán băm)
    let hash = 0;
    for (let i = 0; i < dataToSign.length; i++) {
        const char = dataToSign.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // SỬA: Sử dụng encodeURIComponent để hỗ trợ Unicode
    const safeString = 'DS_' + Math.abs(hash) + '_' + encodeURIComponent(userName.replace(/\s/g, '')) + '_' + role + '_' + new Date().getTime();
    
    try {
        // Encode an toàn cho Unicode
        const signature = btoa(unescape(encodeURIComponent(safeString)));
        // Rút gọn chữ ký để hiển thị
        return signature.substring(0, 32) + '...';
    } catch (error) {
        console.warn('btoa encoding error, using fallback:', error);
        // Fallback: chỉ dùng hash số
        return 'DS_' + Math.abs(hash).toString().substring(0, 16) + '...';
    }
}

async function substituteHvlApprove() {
    console.log('🖊️ Substitute HLV signature function called');
    
    const substituteName = document.getElementById('substitute_hvl_name').value;
    const substituteComment = document.getElementById('substitute_hvl_comment').value;
    
    if (!substituteName.trim()) {
        alert('Vui lòng nhập họ tên HLV trực thay!');
        return;
    }
    
    const substituteSignatureDisplay = document.getElementById('substitute-signature-display');
    const substituteStatus = document.querySelector('.substitute-hvl-status');
    const substituteBtn = document.querySelector('.btn-substitute-hvl-approve');
    
    if (!substituteSignatureDisplay || !substituteStatus) {
        console.error('❌ Required elements not found for substitute signature');
        console.log('Available elements:', {
            substituteDisplay: !!substituteSignatureDisplay,
            status: !!substituteStatus
        });
        alert('Lỗi: Không tìm thấy phần tử hiển thị chữ ký HLV trực thay! Vui lòng thử lại.');
        return;
    }
    
    if (confirm('Bạn có chắc muốn ký thay với tên "' + substituteName + '"?')) {
        try {
            const currentTime = new Date().toISOString();
            
            // SỬA: Lấy chữ ký thực cho HLV trực thay
            const signatureData = getUserSignature(substituteName, 'TRAINER');
            
            // SỬA: Tạo hash an toàn với Unicode
            let hashString = '';
            try {
                hashString = btoa(unescape(encodeURIComponent(substituteName + '_SUBSTITUTE_' + currentTime)));
            } catch (error) {
                console.warn('Hash encoding error, using fallback:', error);
                hashString = 'HASH_SUBSTITUTE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            const fullSignatureData = {
                name: substituteName,
                role: 'SUBSTITUTE_HLV',
                timestamp: currentTime,
                id: 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                hash: hashString,
                verified: true,
                comment: substituteComment,
                digitalSignature: generateDigitalSignature(substituteName, 'SUBSTITUTE_HLV', currentTime)
            };
            
            // SỬA: Update UI NGAY LẬP TỨC với chữ ký thực
            const signatureHTML = await generateSignatureHTML(signatureData, currentTime);
            substituteSignatureDisplay.innerHTML = signatureHTML;
            substituteStatus.innerHTML = '<strong style="color: green;">✅ Đã ký</strong>';
            
            // Ẩn nút ký sau khi đã ký
            if (substituteBtn) {
                substituteBtn.style.display = 'none';
            }
            
            console.log('✅ Substitute HLV signature UI updated successfully');
            
            // Save signature
            saveSignatureToJournal('substituteSignature', fullSignatureData);
            
            // Notify dashboard về substitute signature
            notifyDashboardUpdate();
            
            alert('HLV trực thay đã ký thành công!\nChữ ký đã được lưu trữ.');
            
            console.log('✅ Substitute HLV signature completed successfully');
            
        } catch (error) {
            console.error('❌ Error in substituteHvlApprove:', error);
            alert('Có lỗi khi ký thay: ' + error.message);
        }
    }
}

// Function notify dashboard update
function notifyDashboardUpdate() {
    // Notify dashboard về changes
    if (window.opener) {
        window.opener.postMessage({
            type: 'JOURNAL_SIGNATURE_UPDATE',
            timestamp: new Date().toISOString()
        }, '*');
    }
    
    // Trigger storage event để đồng bộ
    localStorage.setItem('dashboard_refresh_trigger', Date.now().toString());
}

// UPDATED: Function to save signature to journal data - NOW USES DATABASE
async function saveSignatureToJournal(signatureType, signatureData) {
    try {
        // Save to database if journal exists
        if (window.journalDBManager.currentJournalId) {
            // Update journal with signature data
            const updateData = {
                [`${signatureType}_signature`]: JSON.stringify(signatureData),
                [`${signatureType}_timestamp`]: new Date().toISOString()
            };
            
            await window.journalDBManager.updateJournal(window.journalDBManager.currentJournalId, updateData);
            console.log('✅ Saved ' + signatureType + ' signature to database');
        }
        
        // Also save to localStorage for backup
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
    
    if (!journalData.approval) {
        journalData.approval = {};
    }
    
    journalData.approval[signatureType] = signatureData;
    localStorage.setItem(journalKey, JSON.stringify(journalData));
    
        console.log('✅ Saved ' + signatureType + ' signature to localStorage backup');
        
    } catch (error) {
        console.error('Error saving signature:', error);
        
        // Fallback to localStorage only
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const journalKey = 'journal_' + dogName + '_' + date;
        
        let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
        
        if (!journalData.approval) {
            journalData.approval = {};
        }
        
        journalData.approval[signatureType] = signatureData;
        localStorage.setItem(journalKey, JSON.stringify(journalData));
        
        console.log('✅ Saved ' + signatureType + ' signature to localStorage fallback');
    }
}

// UPDATED: Function to save approval data - NOW USES DATABASE
async function saveApprovalData(approvalData) {
    try {
        // Save to database if journal exists
        if (window.journalDBManager.currentJournalId) {
            const updateData = {
                approval_status: approvalData.status || 'PENDING',
                approved_by: approvalData.approverId || null,
                approved_at: approvalData.approvedAt || null,
                rejection_reason: approvalData.rejectionReason || null
            };
            
            await window.journalDBManager.updateJournal(window.journalDBManager.currentJournalId, updateData);
            console.log('✅ Saved approval data to database');
        }
        
        // Also save to localStorage for backup
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
    
    if (!journalData.approval) {
        journalData.approval = {};
    }
    
    Object.assign(journalData.approval, approvalData);
    localStorage.setItem(journalKey, JSON.stringify(journalData));
    
        console.log('✅ Saved approval data to localStorage backup');
        
    } catch (error) {
        console.error('Error saving approval data:', error);
        
        // Fallback to localStorage only
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const journalKey = 'journal_' + dogName + '_' + date;
        
        let journalData = JSON.parse(localStorage.getItem(journalKey)) || {};
        
        if (!journalData.approval) {
            journalData.approval = {};
        }
        
        Object.assign(journalData.approval, approvalData);
        localStorage.setItem(journalKey, JSON.stringify(journalData));
        
        console.log('✅ Saved approval data to localStorage fallback');
    }
}

// Functions to remove blocks
function removeLastTrainingBlock() {
    const container = document.getElementById('training-blocks-container');
    const blocks = container.querySelectorAll('.training-block');
    
    if (blocks.length > 1) {
        container.removeChild(blocks[blocks.length - 1]);
        trainingSessionCounter--;
    } else {
        alert('Phải có ít nhất 1 ca huấn luyện!');
    }
}

function removeLastOperationBlock() {
    const container = document.getElementById('operation-blocks-container');
    const blocks = container.querySelectorAll('.operation-block');
    
    if (blocks.length > 0) {
        container.removeChild(blocks[blocks.length - 1]);
        operationSessionCounter--;
    }
}

// UPDATED: Function to save journal data - NOW USES DATABASE
async function saveJournalData() {
    try {
        // Use the database manager to save
        await window.journalDBManager.saveJournalData();
        
        // Also save to localStorage for backup/compatibility
    const dogName = document.getElementById('journal_dog_name').value;
    const date = document.getElementById('journal_date').value;
    const journalKey = 'journal_' + dogName + '_' + date;
    
    const journalData = {
        generalInfo: {
            dogName: dogName,
            date: date,
            hlv: document.getElementById('journal_hlv').value
        },
        trainingBlocks: collectTrainingBlocksData(),
        operationBlocks: collectOperationBlocksData(),
        meals: collectMealsData(),
        care: collectCareData(),
        health: collectHealthData(),
        hlvComment: document.getElementById('journal_hlv_comment').value,
        otherIssues: document.getElementById('journal_other_issues').value,
        lastModified: new Date().toISOString()
    };
    
    // Preserve existing approval data
    const existingData = localStorage.getItem(journalKey);
    if (existingData) {
        const existing = JSON.parse(existingData);
        if (existing.approval) {
            journalData.approval = existing.approval;
        }
    }
    
        // Check if journal has HLV signature for manager approval
    if (journalData.approval?.hvlSignature && !journalData.approval?.leaderSignature) {
        journalData.approval.status = 'PENDING_MANAGER_APPROVAL';
        console.log('✅ Journal has HLV signature, set for manager approval');
    }
    
    localStorage.setItem(journalKey, JSON.stringify(journalData));
    
        // Notify dashboard about journal save
    notifyDashboardUpdate();
    
        console.log('✅ Journal saved successfully to both database and localStorage:', journalKey);
        
    } catch (error) {
        console.error('Error saving journal:', error);
        
        // Fallback to localStorage only if database fails
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const journalKey = 'journal_' + dogName + '_' + date;
        
        const journalData = {
            generalInfo: {
                dogName: dogName,
                date: date,
                hlv: document.getElementById('journal_hlv').value
            },
            trainingBlocks: collectTrainingBlocksData(),
            operationBlocks: collectOperationBlocksData(),
            meals: collectMealsData(),
            care: collectCareData(),
            health: collectHealthData(),
            hlvComment: document.getElementById('journal_hlv_comment').value,
            otherIssues: document.getElementById('journal_other_issues').value,
            lastModified: new Date().toISOString()
        };
        
        // Preserve existing approval data
        const existingData = localStorage.getItem(journalKey);
        if (existingData) {
            const existing = JSON.parse(existingData);
            if (existing.approval) {
                journalData.approval = existing.approval;
            }
        }
        
        localStorage.setItem(journalKey, JSON.stringify(journalData));
        notifyDashboardUpdate();
        
        alert('Nhật ký đã được lưu vào localStorage (database không khả dụng). ' + 
              'Vui lòng kiểm tra kết nối và thử lại.');
        
        console.log('✅ Journal saved to localStorage as fallback:', journalKey);
    }
}

// Data collection functions
function collectTrainingBlocksData() {
    const blocks = [];
    const trainingBlocks = document.querySelectorAll('.training-block');
    
    trainingBlocks.forEach((block, index) => {
        const blockId = block.getAttribute('data-block-id');
        
        const blockData = {
            fromTime: document.getElementById('trainingFromTime-' + blockId).value,
            toTime: document.getElementById('trainingToTime-' + blockId).value,
            locationType: getSelectedRadioValue('training-location-group-' + blockId),
            locationOther: document.getElementById('trainingLocationOther-' + blockId).value,
            advancedTraining: document.getElementById('hlNangCaoCheckbox-' + blockId).checked,
            basicTraining: document.getElementById('hlCoBanCheckbox-' + blockId).checked,
            physicalTraining: document.getElementById('hlTheLucCheckbox-' + blockId).checked,
            otherTraining: document.getElementById('hlKhacCheckbox-' + blockId).checked ? 
                          document.getElementById('hlKhacText-' + blockId).value : null,
            drugDetection: []
        };
        
        // Collect drug detection data for 3 attempts
        for (let i = 1; i <= 3; i++) {
            const selectedDrugs = getSelectedCheckboxValues('drugTypeOptions-' + blockId + '-' + i, 'data-drug-value');
            const manifestation = getSelectedCheckboxValues('.detection-manifestation-' + i, 'value');
            const drugTypeOther = document.getElementById('drugTypeOther-' + blockId + '-' + i).value;
            const manifestationOther = document.getElementById('manifestationOther-' + blockId + '-' + i).value;
            
            blockData.drugDetection.push({
                selectedDrugs: selectedDrugs,
                drugTypeOther: drugTypeOther,
                manifestation: manifestation,
                manifestationOther: manifestationOther
            });
        }
        
        blocks.push(blockData);
    });
    
    return blocks;
}

function collectOperationBlocksData() {
    const blocks = [];
    const operationBlocks = document.querySelectorAll('.operation-block');
    
    operationBlocks.forEach((block, index) => {
        const blockId = block.getAttribute('data-block-id');
        
        const blockData = {
            fromTime: document.getElementById('operationFromTime-' + blockId).value,
            toTime: document.getElementById('operationToTime-' + blockId).value,
            selectedLocations: getSelectedCheckboxValues('operationLocationOptions-' + blockId, 'data-location-value'),
            locationKhoText: document.getElementById('operationLocationKho-' + blockId).value,
            locationOtherText: document.getElementById('operationLocationOther-' + blockId).value,
            checkGoods: document.getElementById('checkGoods-' + blockId).checked,
            checkLuggage: document.getElementById('checkLuggage-' + blockId).checked,
            fieldTraining: document.getElementById('fieldTraining-' + blockId).checked,
            patrol: document.getElementById('patrol-' + blockId).checked,
            otherOperation1: document.getElementById('opKhacCheckbox1-' + blockId).checked ? 
                           document.getElementById('opKhacText1-' + blockId).value : null,
            otherOperation2: document.getElementById('opKhacCheckbox2-' + blockId).checked ? 
                           document.getElementById('opKhacText2-' + blockId).value : null,
            otherIssues: document.getElementById('operation_other_issues_' + blockId).value
        };
        
        blocks.push(blockData);
    });
    
    return blocks;
}

function collectMealsData() {
    return {
        lunch: {
            time: document.getElementById('lunchTime').value,
            amount: document.getElementById('lunchAmount').value,
            food: getSelectedCheckboxValues('lunchFoodOptions', 'data-food-value').join(', '),
            foodOther: document.getElementById('lunchFoodOther').value
        },
        dinner: {
            time: document.getElementById('dinnerTime').value,
            amount: document.getElementById('dinnerAmount').value,
            food: getSelectedCheckboxValues('dinnerFoodOptions', 'data-food-value').join(', '),
            foodOther: document.getElementById('dinnerFoodOther').value
        }
    };
}

function collectCareData() {
    return {
        bath: document.getElementById('care_bath').checked,
        brush: document.getElementById('care_brush').checked,
        wipe: document.getElementById('care_wipe').checked
    };
}

function collectHealthData() {
    return {
        status: getSelectedRadioValue('health_status'),
        other: document.getElementById('health_other_text').value
    };
}

// Helper functions for data collection
function getSelectedRadioValue(name) {
    const radio = document.querySelector('input[name="' + name + '"]:checked');
    return radio ? radio.value : '';
}

function getSelectedCheckboxValues(containerId, attribute) {
    const container = document.getElementById(containerId) || document.querySelector(containerId);
    if (!container) return [];
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute(attribute) || cb.value);
}

// Helper functions cho journal actions
function createNewJournal() {
    if (confirm('Tạo nhật ký mới? Dữ liệu hiện tại sẽ bị xóa.')) {
        showJournalEditForm(currentDogForJournal);
    }
}

// SỬA: Function viewOldJournals - CHUYỂN SANG PDF VIEW ĐÚNG CÁCH
function viewOldJournals() {
    // Tìm tất cả journal của chó hiện tại
    const dogJournals = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_' + currentDogForJournal + '_')) {
            try {
                const journalData = JSON.parse(localStorage.getItem(key));
                if (journalData && journalData.generalInfo) {
                    dogJournals.push({
                        key: key,
                        date: journalData.generalInfo.date,
                        data: journalData
                    });
                }
            } catch (e) {
                console.error('Error parsing journal:', e);
            }
        }
    }
    
    if (dogJournals.length === 0) {
        alert('Không có nhật ký cũ nào cho CNV ' + currentDogForJournal);
        return;
    }
    
    // Sắp xếp theo ngày giảm dần
    dogJournals.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Tạo danh sách chọn ngày
    let dateOptions = '<option value="">Chọn ngày xem nhật ký</option>';
    dogJournals.forEach(journal => {
        dateOptions += '<option value="' + journal.date + '">' + journal.date + '</option>';
    });
    
    // Hiển thị modal chọn ngày để xem A4 PDF
    const modalHtml = '<div id="viewOldJournalModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;"><div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;"><h3 style="margin-top: 0;">📋 XEM NHẬT KÝ CŨ - CNV ' + currentDogForJournal + '</h3><p>Tìm thấy ' + dogJournals.length + ' nhật ký. Chọn ngày để xem bản PDF A4:</p><select id="oldJournalDateSelect" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">' + dateOptions + '</select><div style="text-align: right; margin-top: 20px;"><button onclick="closeOldJournalModal()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Hủy</button><button onclick="viewSelectedOldJournal()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">📄 Xem PDF A4</button></div></div></div>';
    
    // Thêm modal vào DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Helper functions cho view old journals
function closeOldJournalModal() {
    const modal = document.getElementById('viewOldJournalModal');
    if (modal) {
        modal.remove();
    }
}

function viewSelectedOldJournal() {
    const selectedDate = document.getElementById('oldJournalDateSelect').value;
    if (!selectedDate) {
        alert('Vui lòng chọn ngày để xem nhật ký!');
        return;
    }
    
    // Đóng modal
    closeOldJournalModal();
    
    // SỬA: CHUYỂN TRỰC TIẾP SANG PDF VIEW TRONG CÙNG TAB
    showPureA4JournalView(currentDogForJournal, selectedDate);
}

function resetJournal() {
    if (confirm('Bạn có chắc muốn tải lại form? Tất cả dữ liệu chưa lưu sẽ bị mất.')) {
        showJournalEditForm(currentDogForJournal);
    }
}

// Function to export journal to PDF
function exportJournalToPDF(dogName, date) {
    alert('🚧 Chức năng xuất PDF đang được phát triển...\n\nHiện tại bạn có thể sử dụng chức năng In (Ctrl+P) để lưu thành PDF.');
}

// Functions for viewing journal for approval (Manager mode) - SỬA: FIX MANAGER WORKFLOW
function viewJournalForApproval(journalKey) {
    console.log('👀 Manager viewing journal for approval:', journalKey);
    
    // SỬA: Chuyển sang PDF view để Manager có thể xem và duyệt
    showA4JournalViewFromKey(journalKey);
}

function approveJournalAsManager(journalKey) {
    if (confirm('Bạn có chắc muốn duyệt nhật ký này?\n\nSau khi duyệt, nhật ký sẽ được đánh dấu hoàn thành và HLV sẽ nhận được thông báo.')) {
        try {
            const journalData = JSON.parse(localStorage.getItem(journalKey));
            
            if (journalData) {
                const currentTime = new Date().toISOString();
                
                if (!journalData.approval) journalData.approval = {};
                
                // SỬA: THÊM CHỮ KÝ MANAGER VỚI CHỮ KÝ THỰC
                const signatureData = getUserSignature(currentUserName, currentUserRole);
                
                journalData.approval.leaderComment = 'Đã duyệt bởi ' + currentUserName;
                journalData.approval.leaderStatus = 'Đã duyệt';
                journalData.approval.leaderApprovalTime = currentTime;
                journalData.approval.status = 'APPROVED';
                journalData.approval.approvedBy = currentUserName;
                
                // Add manager signature với chữ ký thực
                journalData.approval.leaderSignature = {
                    name: currentUserName,
                    role: currentUserRole,
                    timestamp: currentTime,
                    id: 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    hash: btoa(unescape(encodeURIComponent(currentUserName + '_MANAGER_' + currentTime))),
                    verified: true,
                    digitalSignature: generateDigitalSignature(currentUserName, currentUserRole, currentTime)
                };
                
                localStorage.setItem(journalKey, JSON.stringify(journalData));
                
                // SỬA: REMOVE TỪ PENDING APPROVALS
                const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
                const filteredJournals = pendingJournals.filter(j => j.key !== journalKey);
                localStorage.setItem('pending_manager_approvals', JSON.stringify(filteredJournals));
                
                // SỬA: TẠO NOTIFICATION CHO HLV
                createTrainerNotification(journalData, 'APPROVED');
                
                // Notify dashboard về manager approval
                notifyDashboardUpdate();
                
                alert('🎉 Nhật ký đã được duyệt thành công!\n\n' +
                      '✅ Chữ ký Manager đã được lưu trữ\n' +
                      '📢 HLV đã nhận được thông báo\n' +
                      '📊 Dashboard sẽ được cập nhật tự động');
                
                console.log('✅ Manager approval completed for:', journalKey);
                
                // Refresh manager view
                showAllPendingJournalsForManager();
            }
        } catch (error) {
            console.error('❌ Error in approveJournalAsManager:', error);
            alert('Có lỗi khi duyệt nhật ký: ' + error.message);
        }
    }
}

// SỬA: Function TẠO NOTIFICATION CHO TRAINER
function createTrainerNotification(journalData, action) {
    const trainerNotifications = JSON.parse(localStorage.getItem('trainer_notifications')) || [];
    
    const notification = {
        id: 'notif_trainer_' + Date.now(),
        type: 'JOURNAL_STATUS_UPDATE',
        title: action === 'APPROVED' ? 'Nhật ký đã được duyệt' : 'Nhật ký bị từ chối',
        message: `Nhật ký CNV ${journalData.generalInfo.dogName} (${journalData.generalInfo.date}) đã được ${action === 'APPROVED' ? 'duyệt' : 'từ chối'} bởi Manager`,
        journalKey: 'journal_' + journalData.generalInfo.dogName + '_' + journalData.generalInfo.date,
        action: action,
        approver: currentUserName,
        createdAt: new Date().toISOString(),
        read: false,
        forTrainer: journalData.generalInfo.hlv
    };
    
    trainerNotifications.unshift(notification);
    
    // Giới hạn số notification
    if (trainerNotifications.length > 100) {
        trainerNotifications.splice(100);
    }
    
    localStorage.setItem('trainer_notifications', JSON.stringify(trainerNotifications));
    console.log('📢 Created trainer notification:', notification.id);
}

// SỬA CHỮ KÝ THỰC: Load approval data - SỬA: Hiển thị chữ ký thực khi load lại
function loadApprovalData(approval) {
    // Load HLV signature
    if (approval.hvlSignature) {
        // SỬA: ĐỢI DOM READY TRƯỚC KHI THAO TÁC
        setTimeout(async () => {
            const hvlSignatureDisplay = document.getElementById('hvl-signature-display');
            const submissionStatus = document.querySelector('.submission-status');
            
            if (hvlSignatureDisplay) {
                // SỬA: Sử dụng chữ ký thực từ thư mục signatures
                const signatureData = getUserSignature(approval.hvlSignature.name, approval.hvlSignature.role);
                const signatureHTML = await generateSignatureHTML(signatureData, approval.hvlSignature.timestamp);
                hvlSignatureDisplay.innerHTML = signatureHTML;
            }
            
            if (submissionStatus) {
                submissionStatus.textContent = '✅ Đã ký';
                submissionStatus.style.color = 'green';
            }
        }, 300);
    }
    
    // Load leader signature
    if (approval.leaderSignature) {
        setTimeout(async () => {
            const leaderSignatureDisplay = document.getElementById('leader-signature-display');
            const approvalStatus = document.querySelector('.approval-status');
            
            if (leaderSignatureDisplay) {
                // SỬA: Sử dụng chữ ký thực từ thư mục signatures
                const signatureData = getUserSignature(approval.leaderSignature.name, approval.leaderSignature.role);
                const signatureHTML = await generateSignatureHTML(signatureData, approval.leaderSignature.timestamp);
                leaderSignatureDisplay.innerHTML = signatureHTML;
            }
            
            if (approvalStatus) {
                approvalStatus.textContent = '✅ Đã duyệt';
                approvalStatus.style.color = 'green';
            }
        }, 300);
    }
    
    // Load substitute signature
    if (approval.substituteSignature) {
        setTimeout(async () => {
            const substituteSignatureDisplay = document.getElementById('substitute-signature-display');
            const substituteStatus = document.querySelector('.substitute-hvl-status');
            
            if (substituteSignatureDisplay) {
                // SỬA: Sử dụng chữ ký thực từ thư mục signatures
                const signatureData = getUserSignature(approval.substituteSignature.name, approval.substituteSignature.role);
                const signatureHTML = await generateSignatureHTML(signatureData, approval.substituteSignature.timestamp);
                substituteSignatureDisplay.innerHTML = signatureHTML;
            }
            
            if (substituteStatus) {
                substituteStatus.textContent = '✅ Đã ký';
                substituteStatus.style.color = 'green';
            }
        }, 300);
    }
    
    // Load leader comment
    setTimeout(() => {
        const leaderCommentField = document.getElementById('leader_comment');
        if (leaderCommentField && approval.leaderComment) {
            leaderCommentField.value = approval.leaderComment;
        }
    }, 300);
}

// THÊM FUNCTION DEBUG CHO NGƯỜI DÙNG
function debugSignatureSystem() {
    console.log('🔍 DEBUG SIGNATURE SYSTEM:');
    console.log('Current User:', currentUserName, currentUserRole);
    console.log('HLV Info:', hlvInfo);
    
    // Check DOM elements
    const hvlDisplay = document.getElementById('hvl-signature-display');
    const submissionStatus = document.querySelector('.submission-status');
    const submitBtn = document.querySelector('.btn-submit-hvl');
    
    console.log('DOM Elements Check:', {
        hvlDisplay: !!hvlDisplay,
        submissionStatus: !!submissionStatus,
        submitBtn: !!submitBtn,
        allSubmissionStatus: document.querySelectorAll('.submission-status').length
    });
    
    // Check signature database
    const signatures = JSON.parse(localStorage.getItem(SIGNATURE_STORAGE_KEY)) || [];
    console.log('Available signatures:', signatures.length);
    
    // Test getUserSignature
    try {
        const testSig = getUserSignature(currentUserName || 'Test User', currentUserRole || 'TRAINER');
        console.log('Test signature:', testSig);
    } catch (error) {
        console.error('Error getting signature:', error);
    }
    
    alert('Debug info đã được ghi vào Console. Bấm F12 để xem chi tiết.');
}

// Test function cho nút Ký
function testHvlSignature() {
    console.log('🧪 TEST: submitHvlSignature called');
    console.log('Current state:', {
        userRole: currentUserRole,
        userName: currentUserName,
        hlvInfo: hlvInfo
    });
    
    // Gọi function thực
    submitHvlSignature();
}

console.log("✅ Script.js đã được tải hoàn tất với chữ ký thực và workflow Manager hoàn chỉnh!");

// ===== TÓM TẮT CÁC SỬA ĐỔI CHÍNH =====
console.log(`

🔧 CÁC VẤN ĐỀ ĐÃ ĐƯỢC SỬA:

✅ 1. TÊN HIỂN THỊ:
- Đã sửa từ "Phạm Thị Quỳnh" → "Hoàng Trọng Quỳnh"
- Cập nhật trong tất cả functions: login, updateUserDisplay, getUserSignature
- Fix mapping trong initializeDefaultUsers và initializeSignatureDatabase

✅ 2. HỆ THỐNG CHỮ KÝ:
- submitHvlSignature(): Đã thêm error handling và logging chi tiết
- generateSignatureHTML(): Hỗ trợ cả ảnh và text fallback
- getUserSignature(): Fix mapping tên chính xác
- Kết nối với thư mục signatures/ để lấy ảnh chữ ký thực

✅ 3. MANAGER WORKFLOW:
- showAllPendingJournalsForManager(): Tìm tất cả journals đã ký HLV, chưa duyệt Manager
- viewJournalForApproval(): Manager có thể xem journal PDF để duyệt
- approveJournalAsManager(): Manager có thể ký duyệt với chữ ký thực
- setJournalPendingForManagerApproval(): Auto chuyển journal cho Manager sau khi HLV ký

✅ 4. LƯU NHẬT KÝ:
- saveJournalData(): Thêm workflow chuyển cho Manager khi có chữ ký HLV
- Thông báo cho user khi nhật ký sẵn sàng cho Manager duyệt
- Đồng bộ với Dashboard thông qua notifyDashboardUpdate()

✅ 5. SỬA LỖI LOGOUT:
- closeAllDropdowns(): Đóng tất cả dropdown khi logout
- logout(): Reset hoàn toàn UI, ẩn user display, clear data
- Sửa vấn đề user dropdown vẫn hiển thị sau khi đăng xuất

✅ 6. SỬA Z-INDEX:
- showContent(): Đặt position: relative, z-index: 1 cho content
- showDogProfileForm(): Đảm bảo form không đè lên navigation
- showJournalEditForm(): Đảm bảo journal form không đè lên thanh navigation
- showAllPendingJournalsForManager(): Đặt z-index đúng cho manager view

📝 CÁCH SỬ DỤNG:
1. Đăng nhập với tài khoản: Quynh/123456 (Hoàng Trọng Quỳnh - MANAGER)
2. Tạo nhật ký → Ký (chữ ký sẽ được chèn từ thư mục signatures/)
3. Lưu nhật ký → Tự động chuyển cho Manager
4. Manager vào "Duyệt nhật ký chờ phê duyệt" để xem và ký duyệt

`);

// ===== KIỂM TRA TÍNH NĂNG HOẠT ĐỘNG =====
function checkSystemHealth() {
    const issues = [];
    
    // Kiểm tra signature database
    const signatures = JSON.parse(localStorage.getItem(SIGNATURE_STORAGE_KEY)) || [];
    if (signatures.length === 0) {
        issues.push('❌ Signature database trống');
    }
    
    // Kiểm tra users database
    const users = JSON.parse(localStorage.getItem('k9_users')) || [];
    const quynhUser = users.find(u => u.username === 'Quynh');
    
    if (!quynhUser) {
        issues.push('❌ User Quynh không tồn tại');
    } else if (quynhUser.name !== 'Hoàng Trọng Quỳnh') {
        issues.push('❌ Tên user Quynh chưa đúng: ' + quynhUser.name);
    }
    
    // Kiểm tra DOM elements quan trọng
    if (!document.getElementById('hvl-signature-display')) {
        issues.push('❌ Signature display element không tồn tại');
    }
    
    if (issues.length === 0) {
        console.log('✅ System Health Check: TẤT CẢ TÍNH NĂNG HOẠT ĐỘNG BÌNH THƯỜNG');
    } else {
        console.warn('⚠️ System Health Issues:', issues);
    }
    
    return issues.length === 0;
}

// Chạy kiểm tra sức khỏe hệ thống sau khi load xong
setTimeout(() => {
    checkSystemHealth();
}, 2000);

// DEBUG FUNCTION cho Manager
function debugManagerSystem() {
    console.log('🔧 DEBUGGING MANAGER SYSTEM...');
    
    let allJournals = 0;
    let signedJournals = 0;
    let approvedJournals = 0;
    let pendingDetails = [];
    
    // Kiểm tra tất cả journals
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_')) {
            allJournals++;
            try {
                const data = JSON.parse(localStorage.getItem(key));
                console.log('📄 Journal:', key, {
                    hasHvlSignature: !!data.approval?.hvlSignature,
                    hasLeaderSignature: !!data.approval?.leaderSignature,
                    status: data.approval?.status
                });
                
                if (data.approval?.hvlSignature) {
                    signedJournals++;
                    if (!data.approval?.leaderSignature) {
                        pendingDetails.push({
                            key: key,
                            dogName: data.generalInfo?.dogName,
                            date: data.generalInfo?.date,
                            trainer: data.generalInfo?.hlv
                        });
                    }
                }
                if (data.approval?.leaderSignature) {
                    approvedJournals++;
                }
            } catch (e) {
                console.error('Error parsing:', key, e);
            }
        }
    }
    
    const pendingList = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
    
    console.log('📊 SYSTEM STATUS:', {
        currentUser: currentUserName,
        currentRole: currentUserRole,
        totalJournals: allJournals,
        signedJournals: signedJournals,
        approvedJournals: approvedJournals,
        pendingApproval: pendingDetails.length,
        pendingList: pendingList.length
    });
    
    console.log('📋 PENDING JOURNALS DETAILS:', pendingDetails);
    
    alert(`🔧 MANAGER SYSTEM DEBUG\n\n` +
          `👤 User: ${currentUserName} (${currentUserRole})\n` +
          `📄 Total journals: ${allJournals}\n` +
          `✅ Signed by HLV: ${signedJournals}\n` +
          `🏢 Approved by Manager: ${approvedJournals}\n` +
          `⏳ Pending approval: ${pendingDetails.length}\n` +
          `📋 Pending list: ${pendingList.length}\n\n` +
          `Check console (F12) for detailed logs`);
    
    // Force refresh menu
    refreshDynamicMenus();
}

// SỬA: Function riêng để update journal menu cho Manager
function updateJournalSubMenuForManager() {
    const journalMenu = document.getElementById('journal-sub-menu');
    if (!journalMenu) {
        console.error('❌ journal-sub-menu element not found');
        return;
    }
    
    console.log('🔧 Creating manager journal menu...');
    
    // Đếm số journal pending thực tế
    let actualPendingCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_')) {
            try {
                const journalData = JSON.parse(localStorage.getItem(key));
                if (journalData?.approval?.hvlSignature && !journalData?.approval?.leaderSignature) {
                    actualPendingCount++;
                }
            } catch (e) {
                console.error('Error checking journal:', key, e);
            }
        }
    }
    
    console.log('📊 Found pending journals:', actualPendingCount);
    
    // SỬA: Tạo HTML trực tiếp cho Manager menu
    journalMenu.innerHTML = `
        <li class="sub-item manager-approval" onclick="showAllPendingJournalsForManager()" style="color: #ff9800; font-weight: bold; cursor: pointer; padding: 12px; border-radius: 5px; background: linear-gradient(135deg, #fff3e0, #ffe0b2); border: 1px solid #ff9800; margin: 5px 0; display: block;">
            📋 Duyệt nhật ký chờ phê duyệt (${actualPendingCount})
        </li>
        <li class="sub-item manager-stats" onclick="showManagerStatistics()" style="color: #9c27b0; cursor: pointer; padding: 10px; border-radius: 5px; background: #f3e5f5; border: 1px solid #9c27b0; margin: 5px 0; display: block;">
            📊 Thống kê tổng quan
        </li>
        <li class="sub-item debug-btn" onclick="debugManagerSystem()" style="color: #f44336; cursor: pointer; padding: 10px; border-radius: 5px; background: #ffebee; border: 1px solid #f44336; margin: 5px 0; display: block;">
            🔧 DEBUG - Kiểm tra hệ thống
        </li>
    `;
    
    console.log('✅ Manager journal menu created successfully');
}

console.log("✅ Script.js đã được tải hoàn tất với chữ ký thực và workflow Manager hoàn chỉnh!");

// SỬA: THÊM DEBUG FUNCTION CHO MANAGER
function debugManagerSystem() {
    console.log('🔧 DEBUGGING MANAGER SYSTEM...');
    console.log('👤 Current user:', currentUserName, currentUserRole);
    
    let allJournals = 0;
    let signedJournals = 0;
    let approvedJournals = 0;
    let pendingDetails = [];
    
    // Kiểm tra tất cả journals
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('journal_')) {
            allJournals++;
            try {
                const data = JSON.parse(localStorage.getItem(key));
                
                if (data.approval?.hvlSignature) {
                    signedJournals++;
                    if (!data.approval?.leaderSignature) {
                        pendingDetails.push({
                            key: key,
                            dogName: data.generalInfo?.dogName,
                            date: data.generalInfo?.date,
                            trainer: data.generalInfo?.hlv
                        });
                    }
                }
                if (data.approval?.leaderSignature) {
                    approvedJournals++;
                }
            } catch (e) {
                console.error('Error parsing:', key, e);
            }
        }
    }
    
    console.log('📊 SYSTEM STATUS:', {
        totalJournals: allJournals,
        signedJournals: signedJournals,
        approvedJournals: approvedJournals,
        pendingApproval: pendingDetails.length
    });
    
    alert(`🔧 MANAGER SYSTEM DEBUG\n\n` +
          `👤 User: ${currentUserName} (${currentUserRole})\n` +
          `📄 Total journals: ${allJournals}\n` +
          `✅ Signed by HLV: ${signedJournals}\n` +
          `🏢 Approved by Manager: ${approvedJournals}\n` +
          `⏳ Pending approval: ${pendingDetails.length}\n\n` +
          `Pending journals:\n${pendingDetails.map(p => `- ${p.dogName} (${p.date})`).join('\n')}\n\n` +
          `Check console (F12) for detailed logs`);
    
    // Force refresh menu
    updateJournalSubMenuForManager();
}

// SỬA: Function khôi phục layout hoàn toàn
function restoreNormalLayout() {
    console.log('🔧 Restoring normal layout...');
    
    // Khôi phục tất cả elements có thể bị ẩn
    const elementsToRestore = [
        '#toggleReadButton',
        '.header',
        '.sidebar', 
        '#dashboardBanner',
        '.journal-header-actions',
        '.journal-action-buttons'
    ];
    
    elementsToRestore.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = '';
            element.style.visibility = '';
            element.style.opacity = '';
        }
    });
    
    // Reset content container
    const content = document.getElementById('content');
    if (content) {
        content.style.cssText = '';
        content.style.display = 'block';
        content.style.position = 'relative';
        content.style.zIndex = '1';
        content.style.width = 'auto';
        content.style.height = 'auto';
        content.style.margin = '0';
        content.style.padding = '20px';
        content.style.overflow = 'visible';
    }
    
    // Reset title
    const title = document.getElementById('title');
    if (title) {
        title.style.display = 'block';
    }
    
    console.log('✅ Layout restored successfully');
}

// SỬA: Function quay lại Manager view
function returnToManagerView() {
    console.log('🔄 Returning to Manager view...');
    
    // Khôi phục layout hoàn toàn
    restoreNormalLayout();
    
    // Quay về manager pending journals view
    setTimeout(() => {
        if (currentUserRole === 'MANAGER') {
            showAllPendingJournalsForManager();
        } else {
            returnToJournalList();
        }
    }, 100);
}

// SỬA: Function ký duyệt với nhận xét và chữ ký thực
async function approveJournalWithComment(journalKey) {
    // Lấy nhận xét từ textarea
    const commentTextarea = document.getElementById(`managerComment_${journalKey}`);
    const managerComment = commentTextarea ? commentTextarea.value.trim() : '';
    
    if (!managerComment) {
        alert('Vui lòng nhập nhận xét trước khi ký duyệt!');
        return;
    }
    
    if (confirm(`Bạn có chắc muốn ký duyệt nhật ký này?\n\nNhận xét: "${managerComment}"\n\nSau khi ký, nhật ký sẽ được hoàn thành và HLV sẽ nhận được thông báo.`)) {
        try {
            const journalData = JSON.parse(localStorage.getItem(journalKey));
            
            if (journalData) {
                const currentTime = new Date().toISOString();
                
                if (!journalData.approval) journalData.approval = {};
                
                // SỬA: Lấy chữ ký thực của Manager
                const signatureData = getUserSignature(currentUserName, currentUserRole);
                console.log('📋 Manager signature data:', signatureData);
                
                // Tạo hash an toàn cho Manager
                let hashString = '';
                try {
                    hashString = btoa(unescape(encodeURIComponent(currentUserName + '_MANAGER_' + currentTime)));
                } catch (error) {
                    console.warn('Hash encoding error, using fallback:', error);
                    hashString = 'HASH_MANAGER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                }
                
                // Cập nhật thông tin duyệt
                journalData.approval.leaderComment = managerComment; // SỬA: Sử dụng nhận xét thực tế
                journalData.approval.leaderStatus = 'Đã duyệt';
                journalData.approval.leaderApprovalTime = currentTime;
                journalData.approval.status = 'APPROVED';
                journalData.approval.approvedBy = currentUserName;
                
                // SỬA: Tạo chữ ký Manager với CHỮ KÝ THỰC
                journalData.approval.leaderSignature = {
                    name: currentUserName,
                    role: currentUserRole,
                    timestamp: currentTime,
                    id: 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    hash: hashString,
                    verified: true,
                    digitalSignature: generateDigitalSignature(currentUserName, currentUserRole, currentTime),
                    comment: managerComment // SỬA: Lưu nhận xét vào chữ ký
                };
                
                localStorage.setItem(journalKey, JSON.stringify(journalData));
                
                // Remove từ pending approvals
                const pendingJournals = JSON.parse(localStorage.getItem('pending_manager_approvals')) || [];
                const filteredJournals = pendingJournals.filter(j => j.key !== journalKey);
                localStorage.setItem('pending_manager_approvals', JSON.stringify(filteredJournals));
                
                // Tạo notification cho HLV
                createTrainerNotification(journalData, 'APPROVED');
                
                // Notify dashboard
                notifyDashboardUpdate();
                
                alert('🎉 Nhật ký đã được ký duyệt thành công!\n\n' +
                      '✅ Chữ ký Manager đã được lưu trữ\n' +
                      `💬 Nhận xét: "${managerComment}"\n` +
                      '📢 HLV đã nhận được thông báo\n' +
                      '📊 Dashboard sẽ được cập nhật tự động');
                
                console.log('✅ Manager approval with comment completed for:', journalKey);
                
                // Refresh manager view
                showAllPendingJournalsForManager();
            }
        } catch (error) {
            console.error('❌ Error in approveJournalWithComment:', error);
            alert('Có lỗi khi ký duyệt nhật ký: ' + error.message);
        }
    }
}