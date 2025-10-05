// Log to confirm script loads and executes
console.log('🚀 SCRIPT LOADED - VERSION WITH NO DEFAULT OPERATION BLOCKS');

// Script loaded successfully

// =============================================================================
// DATE FORMATTING UTILITY FUNCTIONS
// =============================================================================

/**
 * Format date to dd/mm/yyyy format
 * @param {Date|string} date - Date object or ISO string
 * @param {boolean} includeTime - Whether to include time in the format
 * @returns {string} Formatted date string
 */
function formatDateToDDMMYYYY(date, includeTime = false) {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'N/A';
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    if (includeTime) {
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    
    return `${day}/${month}/${year}`;
}

/**
 * Get current date in dd/mm/yyyy format
 * @returns {string} Current date formatted as dd/mm/yyyy
 */
function getCurrentDateDDMMYYYY() {
    return formatDateToDDMMYYYY(new Date());
}



// ===== THÊM PHẦN QUẢN LÝ CHỮ KÝ THỰC =====



// Hệ thống quản lý chữ ký - sử dụng database



// Khởi tạo database chữ ký mặc định




// Function lấy chữ ký của user - SỬA: FIX USER MAPPING HOÀNG TRỌNG QUỲNH

// Function to get user signature from database
async function getUserSignature(userName, role) {
    // Getting signature for user

    try {
        // Fetch user data to get signature info
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const users = data.data || [];

            // Available users loaded

            // Find user by name or username
            const user = users.find(u => u.name === userName || u.username === userName);

            // User found

            if (user && user.signature) {
                // User has signature file
                return {
                    userId: user.id,
                    userName: user.name,
                    role: user.role,
                    signatureImage: 'signatures/' + user.signature,
                    signatureText: user.name,
                    createdDate: user.updated_at
                };
            } else if (user) {
                // User exists but no signature file - return user data with default signature
                // Using default signature
                return {
                    userId: user.id,
                    userName: user.name,
                    role: user.role,
                    signatureImage: 'signatures/default_signature.png',
                    signatureText: user.name,
                    createdDate: user.updated_at
                };
            } else {
                // User not found
            }
        } else {
            console.error('❌ Failed to fetch users:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching signature from database:', error);
    }

    // Return default signature if none found
    // Returning default signature
    return {
        userId: 'default',
        userName: userName,
        role: role,
        signatureImage: 'signatures/default_signature.png',
        signatureText: userName,
        createdDate: new Date().toISOString()
    };
}



// Function kiểm tra file chữ ký có tồn tại không - SỬA: FORCE HIỂN THỊ CHỮ KÝ

function checkSignatureImageExists(imagePath) {

    return new Promise((resolve) => {

        // Checking signature image

        const img = new Image();

        img.onload = () => {

            // Image loaded successfully

            resolve(true);

        };

        img.onerror = () => {

            // Image failed to load, will use text fallback

            resolve(false); // SỬA: Return false để sử dụng text fallback

        };

        // Set timeout để tránh hang

        setTimeout(() => {

            // Image check timeout

            resolve(false); // SỬA: Return false để sử dụng text fallback

        }, 3000);

        img.src = imagePath;

    });

}



// Function tạo HTML hiển thị chữ ký thực - SỬA: CẢI THIỆN HIỂN THỊ CHỮ KÝ

async function generateSignatureHTML(signatureData, timestamp) {

    // Validate signatureData
    if (!signatureData || typeof signatureData !== 'object') {
        console.error('❌ Invalid signatureData provided to generateSignatureHTML:', signatureData);
        return '<div class="signature-error">Lỗi: Dữ liệu chữ ký không hợp lệ</div>';
    }

    // Ensure required properties exist
    const userName = signatureData.userName || signatureData.name || 'Unknown User';
    const signatureImage = signatureData.signatureImage || 'signatures/default_signature.png';

    // Generating signature HTML
    // Processing signature data



    // Kiểm tra xem ảnh chữ ký có tồn tại không

    const imageExists = await checkSignatureImageExists(signatureImage);



    let signatureImageHTML = '';

    if (imageExists) {

        // Hiển thị ảnh chữ ký

        signatureImageHTML = `<div style="margin: 15px 0; text-align: center; position: relative;">

            <img src="${signatureImage}" alt="Chữ ký ${userName}" 

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

        // Generated image HTML

    } else {

        // Fallback to text signature

        signatureImageHTML = `<div style="margin: 15px 0; padding: 20px; border: 3px solid #2196F3;

            background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;

            font-size: 24px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 8px;

            box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            ${signatureData.signatureText}

        </div>`;

        // Generated text fallback

    }



    const signatureId = 'SIG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const digitalSig = generateDigitalSignature(userName, signatureData.role || 'TRAINER', timestamp);



    return `<div class="signature-display" style="border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;">

        <div style="display: flex; align-items: center; margin-bottom: 15px;">

            <span style="font-size: 24px; margin-right: 10px;">✅</span>

            <strong style="font-size: 18px; color: #2e7d32;">${userName}</strong>

        </div>

        ${signatureImageHTML}

        <div style="margin-top: 15px; padding: 12px; background: #e8f5e8; border-left: 4px solid #4caf50; border-radius: 4px;">

            <div style="font-size: 14px; color: #2e7d32; margin-bottom: 8px;">

                <strong>📅 Ký ngày:</strong> ${formatDateToDDMMYYYY(timestamp, true)}

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

let currentUserId = null; // Store current user ID for API calls

let currentUserAssignedDogs = [];

let isDashboardConnected = false;



// SỬA: Khởi tạo users mặc định để đảm bảo luôn có data - FIX HOÀNG TRỌNG QUỲNH




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

async function autoLogin() {

    document.getElementById('loginPage').classList.add('hidden');

    document.getElementById('mainApp').classList.remove('hidden');

    showDashboardBanner();

    applyRoleBasedRestrictions();

    refreshDynamicMenus();

    showDefaultImage();

    await updateUserDisplay();

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



    // Closed all dropdowns

}



// ===== GIẢI PHÁP CUỐI CÙNG - THAY THẾ HÀM updateUserDisplay() - SỬA: FIX TÊN HIỂN THỊ HOÀNG TRỌNG QUỲNH =====

async function updateUserDisplay() {
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    const userInitials = document.getElementById('userInitials');

    if (currentUserName && currentUserRole !== 'GUEST') {
        if (!userInfoDisplay || !userInitials) {
            // User display elements not found
            return;
        }

        // Get user information from database (no localStorage)
        let displayName = currentUserName;

        try {
            // Fetch user data from database API
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const users = data.data || [];

                // Find current user by name or username
                const currentUser = users.find(u => u.name === currentUserName || u.username === currentUserName);

                if (currentUser) {
                    displayName = currentUser.name; // Sử dụng tên từ database
                    // Updated display name from database
                } else {
                    // User not found in database
                }
            } else {
                // Failed to fetch users from database
            }
        } catch (error) {
            console.error('❌ Error fetching user data from database:', error);
            // Using current name as fallback
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
        userInitials.onclick = function (e) {
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

        // Updated user display
    } else {
        if (userInfoDisplay) {
            userInfoDisplay.style.display = 'none';
        }
    }
}

// ===== END OF updateUserDisplay FUNCTION =====


// Hiển thị banner kết nối Dashboard

function showDashboardBanner() {
    const banner = document.getElementById('dashboardBanner');
    const connectedUser = document.getElementById('connectedUser');
    const userRole = document.getElementById('userRole');

    if (banner && connectedUser && userRole) {
        connectedUser.textContent = currentUserName || 'Unknown User';
        userRole.textContent = currentUserRole || 'GUEST';
        banner.style.display = 'block';
    }
}

// Function refresh dashboard data

function refreshDashboardData() {
    if (confirm('Cập nhật dữ liệu với Dashboard?')) {
        if (window.opener) {
            window.opener.postMessage({
                type: 'K9_DATA_UPDATE',
                data: {
                    currentUser: currentUserName,
                    role: currentUserRole,
                    assignedDogs: currentUserAssignedDogs
                }
            }, '*');
        }

        refreshDynamicMenus();
        alert('Đã cập nhật dữ liệu thành công!');
    }
}

// Áp dụng phân quyền theo role với đồng bộ dashboard

// This function is replaced by the more comprehensive version below

// Manager access restrictions



// SỬA: Function toggle user dropdown

function toggleUserDropdown(e) {
    // Toggle user dropdown
    e.stopPropagation();

    const dropdown = document.getElementById('userDropdown');
    // Dropdown element found

    if (dropdown) {
        // Current dropdown classes
        dropdown.classList.toggle('hidden');
        // After toggle, dropdown classes

        // Temporary fix: force visibility with inline styles
        if (!dropdown.classList.contains('hidden')) {
            dropdown.style.display = 'block';
            dropdown.style.visibility = 'visible';
            dropdown.style.opacity = '1';
            dropdown.style.zIndex = '99999';
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.right = '0';
            dropdown.style.backgroundColor = 'white';
            dropdown.style.border = '2px solid red'; // Temporary visual indicator
            // Applied temporary visibility fix
        }

        // Debug positioning and visibility
        const rect = dropdown.getBoundingClientRect();
        // Dropdown position debug info available

        // Check computed styles
        const computedStyle = window.getComputedStyle(dropdown);
        // Computed styles debug info available
    } else {
        console.error('❌ Dropdown element not found!');
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
        
        // Show care plan menu for Manager
        const carePlanMenu = document.getElementById('care-plan-menu');
        if (carePlanMenu) {
            carePlanMenu.style.display = 'block';
        }

    } else if (currentUserRole === 'ADMIN') {
        
        // Show care plan menu for Admin as well
        const carePlanMenu = document.getElementById('care-plan-menu');
        if (carePlanMenu) {
            carePlanMenu.style.display = 'block';
        }
        
    } else if (currentUserRole === 'TRAINER') {
        
        // Show care plan menu for Trainer (read-only access)
        const carePlanMenu = document.getElementById('care-plan-menu');
        if (carePlanMenu) {
            carePlanMenu.style.display = 'block';
        }
        
    } else {
        
        // Hide care plan menu for other roles (Guest, etc.)
        const carePlanMenu = document.getElementById('care-plan-menu');
        if (carePlanMenu) {
            carePlanMenu.style.display = 'none';
        }
    }

    refreshDynamicMenus();

}

// Fallback function to ensure care plan menu is shown for authorized roles
function ensureCarePlanMenuVisibility() {
    
    if (currentUserRole === 'TRAINER' || currentUserRole === 'MANAGER' || currentUserRole === 'ADMIN') {
        const carePlanMenu = document.getElementById('care-plan-menu');
        if (carePlanMenu) {
            carePlanMenu.style.display = 'block';
        }
    }
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



    // Manager access restricted

}



// Function refreshDynamicMenus để đồng bộ với dashboard

async function refreshDynamicMenus() {
    let userDogs = [];
    
    // Try to fetch assigned dogs from database if user ID is available
    if (currentUserId) {
        try {
            const response = await fetch(`/api/users/${currentUserId}/dogs`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    // Convert database dogs to expected format
                    userDogs = data.data.map(dog => ({ name: dog.name, id: dog.id }));
                    console.log('✅ Fetched assigned dogs from database:', userDogs);
                } else {
                    console.warn('⚠️ Failed to fetch assigned dogs from database, using fallback');
                    userDogs = currentUserAssignedDogs.map(dogName => ({ name: dogName }));
                }
            } else {
                console.warn('⚠️ API request failed, using fallback assigned dogs');
                userDogs = currentUserAssignedDogs.map(dogName => ({ name: dogName }));
            }
        } catch (error) {
            console.error('❌ Error fetching assigned dogs:', error);
            // Fallback to currentUserAssignedDogs
            userDogs = currentUserAssignedDogs.map(dogName => ({ name: dogName }));
        }
    } else {
        // Fallback to currentUserAssignedDogs if no user ID
        console.log('⚠️ No user ID available, using fallback assigned dogs');
        userDogs = currentUserAssignedDogs.map(dogName => ({ name: dogName }));
    }

    // Refreshing dynamic menus

    updateDogSubMenu(userDogs);

    if (currentUserRole !== 'MANAGER') {
        updateJournalSubMenu(userDogs);
    }

}



// Function cập nhật dog sub-menu động THEO DASHBOARD DATA

function updateDogSubMenu(dashboardDogs) {

    const dogMenu = document.getElementById('dog-sub-menu');

    if (!dogMenu) return;



    // Clear existing menu items (except any add button)
    dogMenu.querySelectorAll('li').forEach(item => {

        if (!item.textContent.includes('➕')) {

            item.remove();

        }

    });



    // Find the add new button if it exists
    const addNewButton = dogMenu.querySelector('li:last-child');



    dashboardDogs.forEach(dog => {

        // Since dashboardDogs now comes from database assignment, 
        // we don't need to check currentUserAssignedDogs anymore
        const li = document.createElement('li');

        li.innerHTML = '🐶' + dog.name;

        li.onclick = () => showDogProfileForm(dog.name);

        if (addNewButton) {

            dogMenu.insertBefore(li, addNewButton);

        } else {

            dogMenu.appendChild(li);

        }

    });



    // Updated dog sub-menu

}



// Function cập nhật journal sub-menu động THEO DASHBOARD DATA - SỬA: MANAGER WORKFLOW

async function updateJournalSubMenu(dashboardDogs) {

    const journalMenu = document.getElementById('journal-sub-menu');

    if (!journalMenu) return;



    // Updating journal sub-menu

    // Current user name



    if (currentUserRole === 'MANAGER') {

        // SỬA: Manager menu với kiểm tra pending journals

        let actualPendingCount = 0;

        try {
            // Get pending journals from database
            const response = await fetch('/api/journals/pending');
            if (response.ok) {
                const data = await response.json();
                actualPendingCount = data.data ? data.data.length : 0;
            } else {
                throw new Error('Database request failed');
            }
        } catch (error) {
            console.error('Failed to get pending journals from database:', error);
            actualPendingCount = 0;
        }



        // Pending journals count



        journalMenu.innerHTML = `<li class="sub-item manager-approval" onclick="showAllPendingJournalsForManager()" style="color: #ff9800; font-weight: bold; cursor: pointer; padding: 12px; border-radius: 5px; background: linear-gradient(135deg, #fff3e0, #ffe0b2); border: 1px solid #ff9800; margin: 5px 0;">📋 Duyệt nhật ký chờ phê duyệt (${actualPendingCount})</li><li class="sub-item manager-journal-view" onclick="showManagerJournalView()" style="color: #2196F3; cursor: pointer; padding: 10px; border-radius: 5px; background: #e3f2fd; border: 1px solid #2196F3; margin: 5px 0;">📖 Sổ nhật ký huấn luyện</li><li class="sub-item manager-stats" onclick="showManagerStatistics()" style="color: #9c27b0; cursor: pointer; padding: 10px; border-radius: 5px; background: #f3e5f5; border: 1px solid #9c27b0; margin: 5px 0;">📊 Thống kê tổng quan</li>`;



        // Set manager-specific journal menu

        return;

    }



    // Cho TRAINER và ADMIN: hiển thị menu tạo nhật ký theo chó

    journalMenu.innerHTML = '';



    dashboardDogs.forEach(dog => {

        // Since dashboardDogs now comes from database assignment, 
        // we don't need to check currentUserAssignedDogs anymore
        const li = document.createElement('li');

        li.className = 'sub-item';

        li.textContent = dog.name;

        li.onclick = () => showJournalEditForm(dog.name);

        journalMenu.appendChild(li);

    });



    // Updated journal sub-menu

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

// HLV info now managed through current user session
let hlvInfo = {
    name: 'Unknown User',
    id: 'HLV001',
    image: 'images/hlv_tran_duc_kien.jpg'
};



// Dog profiles data - will be fetched from database
let dogProfiles = {};



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

async function login() {

    const username = document.getElementById('username').value;

    const password = document.getElementById('password').value;



    // Attempting login

    // Authenticate user via API
    try {
        // Making API request
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                remember_me: false
            })
        });

        // Response received

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                const user = data.data;
                // Authentication successful
                // Full user data from API

                currentUserRole = user.role;
                currentUserName = user.name;
                currentUserId = user.id; // Store user ID for API calls
                currentUserAssignedDogs = user.assignedDogs || [];

                // Set currentUserName
                // Set currentUserRole

                // Assigned dogs for user

                // Update HLV info
                hlvInfo.name = user.name;
                // Updated hlvInfo.name

                showMainApp();
                return;
            } else {
                // Authentication failed
                alert('Tên người dùng hoặc mật khẩu không đúng.');
                return;
            }
        } else {
            const errorData = await response.json();
            // Authentication failed
            alert('Tên người dùng hoặc mật khẩu không đúng.');
            return;
        }
    } catch (error) {
        // Error during authentication
        // Error type
        // Error message
        // Error stack
        alert('Lỗi kết nối. Vui lòng thử lại sau. Chi tiết: ' + error.message);
        return;
    }

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

async function showMainApp() {

    document.getElementById('loginPage').classList.add('hidden');

    document.getElementById('mainApp').classList.remove('hidden');



    setTimeout(async () => {

        applyRoleBasedRestrictions();

        refreshDynamicMenus();

        await updateUserDisplay();
        
        // Ensure care plan menu visibility as fallback
        ensureCarePlanMenuVisibility();



        // SỬA: Force update journal menu cho Manager

        if (currentUserRole === 'MANAGER') {

            updateJournalSubMenuForManager();

        }

    }, 100);



    showDefaultImage();

}



// SỬA LỖI LOGOUT: Function to handle logout - ĐÓNG TẤT CẢ DROPDOWN VÀ RESET HOÀN TOÀN

function logout() {

    // Logout initiated



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

    currentUserId = null;

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



    // Logout completed

    showLoginPage();
    
    // Reload the page to ensure complete reset
    location.reload();

}



// Function to display a default image

function showDefaultImage() {

    hideAllContentSections();

    document.getElementById('toggleReadButton').style.display = 'none';



    const title = document.getElementById('title');

    const content = document.getElementById('content');



    title.innerText = 'PHẦN MỀM QUẢN LÝ, THEO DÕI CHÓ NGHIỆP VỤ';

    content.style.display = 'flex';

    content.style.justifyContent = 'center';

    content.style.alignItems = 'center';

    content.style.height = 'calc(100vh - 100px)';



    content.innerHTML = '<img src="images/my_welcome_image.jpg" alt="Chào mừng đến với phần mềm quản lý, theo dõi chó nhiệp vụvụ" style="max-width: 100%; max-height: 100%; object-fit: fill;">';

}



// Function showA4JournalViewFromKey để xem journal từ Dashboard - SỬA: FORCE PDF VIEW

async function showA4JournalViewFromKey(journalKey) {
    console.log('🔍 showA4JournalViewFromKey called with key:', journalKey);

    try {
        // Extract dog name, date, and ID from journal key
        const keyParts = journalKey.replace('journal_', '').split('_');
        const dogName = keyParts[0];
        
        // Handle both old format (dogName_date) and new format (dogName_date_id)
        let date, journalId = null;
        if (keyParts.length >= 3) {
            // New format: dogName_date_id
            journalId = keyParts[keyParts.length - 1];
            date = keyParts.slice(1, -1).join('_');
        } else {
            // Old format: dogName_date
            date = keyParts.slice(1).join('_');
        }

        console.log('🔍 Parsed key - Dog:', dogName, 'Date:', date, 'ID:', journalId);

        // Try to get journal by ID first if available, otherwise by dog+date
        let journalData = null;
        
        if (journalId) {
            // Try to get journal by ID first - this should be the specific journal
            try {
                const response = await fetch(`/api/journals/${journalId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        journalData = convertDatabaseToFrontendFormat(data.data);
                        console.log('✅ Found specific journal by ID:', journalId);
                    }
                } else {
                    console.warn('⚠️ Journal not found by ID:', journalId, 'Status:', response.status);
                }
            } catch (error) {
                console.log('⚠️ Failed to get journal by ID, trying by dog+date');
            }
        }
        
        // Only try by dog+date if we couldn't get the specific journal by ID
        if (!journalData) {
            console.log('🔍 Falling back to dog+date method for:', dogName, date);
            const response = await fetch(`/api/journals/by-dog-date/${encodeURIComponent(dogName)}/${date}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    journalData = convertDatabaseToFrontendFormat(data.data);
                    console.log('✅ Found journal by dog+date:', dogName, date);
                }
            } else {
                console.warn('⚠️ Journal not found by dog+date:', dogName, date, 'Status:', response.status);
            }
        }

        if (journalData) {
            const dogName = journalData.generalInfo.dogName;
            const date = journalData.generalInfo.date;
            currentDogForJournal = dogName;

            // Debug: Log the journal data to see what we're actually showing
            console.log('📄 Journal data being displayed:', {
                journalId: journalData.id || 'No ID',
                dogName: dogName,
                date: date,
                trainer: journalData.generalInfo?.hlv || 'Unknown',
                approvalStatus: journalData.approval?.status || 'Unknown',
                hasHlvSignature: !!journalData.approval?.hvlSignature,
                hasLeaderSignature: !!journalData.approval?.leaderSignature
            });

            // SỬA: FORCE chuyển sang pure PDF view ngay lập tức
            console.log('📄 Loading journal for:', dogName, date);
            showPureA4JournalView(dogName, date);

        } else {
            console.error('❌ Journal not found for key:', journalKey);
            alert('Không tìm thấy nhật ký!');
        }

    } catch (error) {
        console.error('Error loading journal:', error);
        alert('Có lỗi khi tải nhật ký!');
    }
}



// SỬA: Khởi tạo khi DOM load xong với enhanced debugging

document.addEventListener('DOMContentLoaded', () => {




    // SỬA: Ẩn nút Dashboard bên ngoài navigation nếu có

    hideDashboardButtonFromNavigation();



    // Kiểm tra URL parameters trước

    if (!handleURLParameters()) {

        showLoginPage();

    }



    // Add event listeners for "Enter" key press

    document.getElementById('username').addEventListener('keypress', function (event) {

        if (event.key === 'Enter') {

            login();

        }

    });



    document.getElementById('password').addEventListener('keypress', function (event) {

        if (event.key === 'Enter') {

            login();

        }

    });



    // Refresh menu khi focus window

    window.addEventListener('focus', () => {

        if (currentUserRole !== 'GUEST') {

            refreshDynamicMenus();

            // Refreshed menus on window focus

        }

    });



    // Listen cho dashboard refresh trigger

    window.addEventListener('storage', (e) => {

        if (e.key === 'dashboard_refresh_trigger') {

            if (currentUserRole !== 'GUEST') {

                refreshDynamicMenus();

                // Refreshed menus from dashboard trigger

            }

        }

    });



    // K9 Management System initialized
    
    // Ensure care plan menu visibility on page load
    setTimeout(() => {
        ensureCarePlanMenuVisibility();
    }, 1000);

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

        content.innerHTML = '<p>Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm.</p><p>Chó nghiệp vụ không chỉ là một phương tiện kỹ thuật đặc biệt mà còn là một lực lượng hỗ trợ trực tiếp cho cán bộ công chức Hải quan tại các cửa khẩu, sân bay, bến cảng, nơi có nguy cơ cao về buôn lậu và vận chuyển trái phép hàng hóa, ma túy. Việc huấn luyện, nuôi dưỡng, sử dụng hiệu quả chó nghiệp vụ đòi hỏi sự đầu tư bài bản, khoa học, và đội ngũ cán bộ huấn luyện viên chuyên trách có chuyên môn sâu và tâm huyết.</p><p>Nhằm hệ thống hóa các quy định, quy trình, nghiệp vụ liên quan đến công tác quản lý, theo dõi chó nghiệp vụ trong ngành Hải quan, Hải quan cửa khẩu quốc tế Móng cái xây dựng phần mềm quản lý, theo dõi chó nghiệp vụ. Phần mềm này gồm các nội dung: Tổng quan; Hồ sơ quản lý chó nghiệp vụ; Quy trình chăm sóc; Quy trình sử dụng; Quy trình huấn luyện; Sổ nhật ký huấn luyện; Kế hoạch chăm sóc, huấn luyện, sử dụng và các video hướng dẫn.</p><p>Phần mềm quản lý, theo dõi chó nghiệp vụ là tài liệu nghiệp vụ nội bộ, phục vụ cho cán bộ quản lý, huấn luyện viên và các đơn vị liên quan trong ngành Hải quan. Trong trường hợp các văn bản pháp lý có thay đổi, các nội dung trong Phần mềm quản lý, theo dõi chó nghiệp vụ sẽ được cập nhật và điều chỉnh cho phù hợp.</p><p>Hải quan cửa khẩu quốc tế Móng Cái mong muốn tiếp tục nhận được các ý kiến đóng góp từ các chuyên gia, cán bộ trong và ngoài ngành nhằm hoàn thiện hơn nữa hệ thống tài liệu phục vụ công tác này.</p><p><strong>Xin trân trọng cảm ơn!</strong></p>';

    } else if (type === 'HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ') {

        title.innerText = 'HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ';

        content.innerHTML = `
            <p>Vui lòng chọn từng chó nghiệp vụ ở menu bên trái.</p>
            <p>Đây là HỒ SƠ QUẢN LÝ CHÓ NGHIỆP VỤ từ cơ sở dữ liệu:</p>
            <div id="dogProfilesList">
                <div class="loading">Đang tải danh sách chó nghiệp vụ...</div>
            </div>
        `;
        
        // Load dogs from database only
        loadDogProfilesFromDatabase();

    } else if (type === 'QUY TRÌNH CHĂM SÓC') {

        title.innerText = 'QUY TRÌNH CHĂM SÓC';

        content.innerHTML = `
        <h3>1. Nguyên tắc và Trách nhiệm trong Chăm sóc</h3>
        <p>Việc chăm sóc, nuôi dưỡng CNV (chó nghiệp vụ) là công việc phải được thực hiện hàng ngày và liên tục trong suốt quá trình sử dụng. Trách nhiệm được phân công rõ ràng:</p>
        <ul>
          <li><strong>Huấn luyện viên (HLV):</strong> Chịu trách nhiệm toàn diện về sức khỏe của CNV do mình quản lý.</li>
          <li><strong>Nhân viên thú y:</strong> Tham mưu cho lãnh đạo về công tác chăn nuôi, theo dõi sức khỏe, xây dựng khẩu phần ăn, và trực tiếp thực hiện tiêm phòng, chẩn đoán, điều trị bệnh cho CNV.</li>
          <li><strong>Nhân viên chăn nuôi, nhân giống:</strong> Chịu trách nhiệm đảm bảo khẩu phần ăn, vệ sinh chuồng trại, chăm sóc chó bố mẹ và chó con đến 60 ngày tuổi.</li>
        </ul>
      
        <h3>2. Quy trình Chăm sóc Hàng ngày</h3>
        <h4>a. Lịch trình hàng ngày:</h4>
        <ul>
          <li>07h20 - 07h45: Cho chó dạo chơi, vệ sinh chuồng trại và kiểm tra sức khỏe ban đầu.</li>
          <li>07h45 - 08h00: Chuẩn bị trang bị, dụng cụ cho buổi huấn luyện.</li>
          <li>08h00 - 14h00 &amp; 14h00 - 15h00: Huấn luyện CNV.</li>
          <li>10h30 - 11h00: Cho chó ăn bữa trưa.</li>
          <li>16h30 - 17h00: Cho chó ăn bữa chiều.</li>
          <li>Vận động: Ngoài giờ huấn luyện, CNV cần được vận động vào buổi sáng và buổi chiều, mỗi lần 30 phút, để tăng cường mối quan hệ với HLV và giải trí.</li>
        </ul>
      
        <h4>b. Vệ sinh và Chăm sóc cá nhân:</h4>
        <ul>
          <li><strong>Vệ sinh chuồng trại:</strong> Hàng ngày phải dọn dẹp sạch sẽ chuồng và khu vực xung quanh, đảm bảo khô, thoáng, sạch. Kiểm tra, diệt ve, bọ chét, ký sinh trùng trong chuồng (nếu có).</li>
          <li><strong>Chải lông:</strong> HLV phải chải lông cho CNV hàng ngày để loại bỏ lông rụng, các dị vật và ký sinh trùng.</li>
          <li><strong>Tắm chó:</strong> Việc tắm được thực hiện tùy theo mùa. Mùa hè tắm 10-15 ngày/lần, mùa đông 5-7 ngày/lần, và nên chọn ngày ấm để tắm.</li>
        </ul>
      
        <h4>c. Kiểm tra sức khỏe:</h4>
        <ul>
          <li><strong>Kiểm tra hàng ngày:</strong> HLV phải kiểm tra khả năng vận động, da, lông, mắt, mũi, răng, miệng và các giác quan của chó (khứu giác, thính giác, thị giác, phản xạ). Việc này giúp phát hiện kịp thời các biểu hiện bất thường như ốm, bỏ ăn, suy giảm sức khỏe.</li>
          <li><strong>Theo dõi:</strong> Mọi thông tin về ăn uống, vệ sinh, tình hình sức khỏe của CNV phải được ghi chép vào sổ theo dõi hàng ngày.</li>
        </ul>
      
        <h3>3. Chế độ Dinh dưỡng</h3>
        <p>Chế độ dinh dưỡng được xây dựng chi tiết cho từng giai đoạn phát triển và tình trạng công tác của CNV.</p>
      
        <h4>a. Nguyên tắc chế biến:</h4>
        <ul>
          <li>Thực phẩm phải đảm bảo chất lượng, không thiu thối, không dùng động vật chết do bệnh.</li>
          <li>Ngũ cốc phải được bảo vệ khỏi sâu mọt, ẩm mốc.</li>
          <li>Thức ăn được nấu chín, không cho ăn quá nóng hoặc quá lạnh. Thức ăn thừa phải được đổ bỏ, không cho ăn lại vào bữa sau.</li>
          <li>Nước uống phải là nước sạch và được thay 2 lần mỗi ngày.</li>
        </ul>
      
        <h4>b. Định lượng khẩu phần ăn (mỗi tháng cho 01 chó):</h4>
        <ul>
          <li><strong>Chó đã tốt nghiệp và đang huấn luyện:</strong>
            <ul>
              <li><strong>Giống chó lớn (trên 20kg):</strong> 15kg gạo, 9kg thịt lợn, 6kg thịt gia cầm, 30 quả trứng, 5kg rau xanh, 0.3kg muối, 20kg (hoặc 5kg) chất đốt.</li>
              <li><strong>Giống chó nhỏ (dưới 20kg):</strong> 10kg gạo, 6kg thịt lợn, 4kg thịt gia cầm, 20 quả trứng, 3kg rau xanh, 0.2kg muối, 15kg (hoặc 4kg) chất đốt.</li>
            </ul>
          </li>
      
          <li><strong>Chó con (tính theo từng giai đoạn):</strong>
            <ul>
              <li><strong>Từ 15-60 ngày tuổi:</strong> 4kg gạo, 3kg thịt lợn, 2kg sữa, 0.5kg đường, 0kg rau, 15 quả trứng.</li>
              <li><strong>Từ tháng thứ 3 đến hết tháng 4:</strong> 8kg gạo, 7kg thịt lợn, 1.5kg sữa, 0.3kg đường, 3kg rau, 0.5kg bột xương, 0.3kg muối.</li>
              <li><strong>Từ tháng thứ 5 đến hết tháng 10:</strong> 14kg gạo, 6kg thịt lợn, 1.5kg thịt gia cầm, 4kg rau, 1kg bột xương, 0.3kg muối, 20 quả trứng.</li>
            </ul>
          </li>
      
          <li><strong>Chế độ bồi dưỡng:</strong> Trong những ngày huấn luyện, tác nghiệp, khẩu phần thức ăn tổng hợp được tăng thêm 40%. Chó ốm được ăn theo chỉ định của thú y và được bồi dưỡng thêm sữa, đường.</li>
        </ul>
      
        <h3>4. Y tế và Phòng bệnh</h3>
        <p>Công tác phòng bệnh là ưu tiên hàng đầu, bao gồm tiêm chủng, tẩy ký sinh trùng và vệ sinh môi trường.</p>
      
        <h4>a. Tiêm phòng và tẩy giun:</h4>
        <ul>
          <li><strong>Vaccine:</strong>
            <ul>
              <li>43 – 45 ngày tuổi: Tiêm vaccine 5 bệnh.</li>
              <li>63 – 65 ngày tuổi: Tiêm vaccine 7 bệnh.</li>
              <li>Sau 12 tháng: Tiêm nhắc lại vaccine 7 bệnh và vaccine dại.</li>
            </ul>
          </li>
          <li><strong>Tẩy giun:</strong> Định kỳ 2 tháng/lần.</li>
          <li><strong>Phòng trừ ký sinh trùng ngoài da (ve, bọ chét):</strong> Dùng thuốc xịt hoặc tiêm định kỳ. Thuốc xịt (Frontline) có hiệu quả trong 1-2 tháng, trong khi thuốc tiêm (Dectomac) có hiệu quả 20-30 ngày.</li>
        </ul>
      
        <h4>b. Vệ sinh phòng dịch:</h4>
        <ul>
          <li><strong>Tẩy uế chuồng trại:</strong>
            <ul>
              <li>Tổng tẩy uế: 6 tháng/lần, bao gồm việc phun thuốc sát trùng và đặt bả diệt chuột.</li>
              <li>Tẩy uế định kỳ: 2 tháng/lần, bao gồm dọn dẹp và phun thuốc sát trùng.</li>
            </ul>
          </li>
          <li>Khi có dịch bệnh: Phải tẩy uế ngay lập tức, cách ly CNV bệnh, và xử lý chất thải đúng quy trình để ngăn ngừa lây lan. Định kỳ hai tháng một lần phải phun thuốc diệt trùng chuồng trại và môi trường xung quanh.</li>
        </ul>
      
        <h4>c. Chữa bệnh:</h4>
        <ul>
          <li>Mỗi đơn vị có một tủ thuốc cấp cứu với các loại thuốc và dụng cụ y tế cơ bản theo tiêu chuẩn.</li>
          <li>Khi CNV bị bệnh nặng, đơn vị phải đưa đến các cơ sở thú y để điều trị kịp thời.</li>
        </ul>
      
        <h3>5. Điều kiện Cơ sở vật chất</h3>
        <h4>a. Chuồng nuôi:</h4>
        <ul>
          <li><strong>Thiết kế:</strong> Chuồng phải được xây dựng ở nơi thoáng mát, dễ thoát nước, xa khu dân cư. Thiết kế đảm bảo mát về mùa hè, ấm về mùa đông. Diện tích mỗi chuồng là 8m², có khu nghỉ và sân chơi riêng.</li>
          <li><strong>Vật liệu:</strong> Tường gạch, mái tôn chống nóng, sàn bê tông chống trơn trượt. Có bệ nằm cao 10cm để tránh bệnh ngoài da.</li>
          <li><strong>Chuồng cách ly:</strong> Các đơn vị có từ 6 CNV trở lên phải xây dựng khu cách ly riêng cho chó bị bệnh.</li>
        </ul>
      
        <h4>b. Dụng cụ chăn nuôi:</h4>
        <ul>
          <li>Mỗi CNV được cấp các vật dụng cần thiết như chậu đựng thức ăn, nước uống bằng inox; lược chải lông; khăn tắm; xà phòng. Các vật dụng này được cấp mới hàng năm hoặc theo niên hạn sử dụng.</li>
        </ul>
      
        <p><em>Quy trình trên thể hiện sự đầu tư bài bản và chuyên nghiệp trong việc nuôi dưỡng, chăm sóc chó nghiệp vụ, là nền tảng vững chắc để xây dựng lực lượng CNV tinh nhuệ, đáp ứng yêu cầu nhiệm vụ của ngành.</em></p>
      `;

    } else if (type === 'QUY TRÌNH HUẤN LUYỆN') {

        title.innerText = 'QUY TRÌNH HUẤN LUYỆN';

        content.innerHTML = `
  <h2>Quy Trình Huấn Luyện</h2>

  <h3>2. Quy Trình Chăm Sóc và Huấn Luyện Hằng Ngày</h3>
  <p>Việc chăm sóc và huấn luyện là công việc phải được thực hiện hàng ngày, liên tục và khoa học, là trách nhiệm của huấn luyện viên và nhân viên chăn nuôi.</p>

  <h4>a. Chế độ Chăm sóc và Vệ sinh</h4>
  <ul>
    <li><strong>Vệ sinh chuồng trại:</strong> Dọn dẹp vệ sinh chuồng và khu vực xung quanh hàng ngày để đảm bảo sạch sẽ, khô thoáng.</li>
    <li><strong>Kiểm tra sức khỏe:</strong> Mỗi ngày, huấn luyện viên phải kiểm tra sức khỏe tổng thể của chó, bao gồm khả năng vận động, da, lông, mắt, mũi, miệng và các giác quan như khứu giác, thính giác, thị giác. Kịp thời phát hiện các biểu hiện bất thường để xử lý.</li>
    <li><strong>Chế độ ăn uống:</strong> Quan sát kỹ khả năng ăn uống và bổ sung nước đầy đủ sau khi cho ăn. Chế độ dinh dưỡng được quy định cụ thể cho từng giống chó, độ tuổi và trọng lượng khác nhau.</li>
  </ul>

  <h4>Lịch làm việc hàng ngày</h4>
  <ul>
    <li>07h20 - 07h45: Cho chó dạo, vệ sinh và kiểm tra sức khỏe.</li>
    <li>07h45 - 09h00: Chuẩn bị và huấn luyện buổi sáng.</li>
    <li>10h30 - 11h00: Cho chó ăn.</li>
    <li>13h45 - 15h00: Chuẩn bị và huấn luyện buổi chiều.</li>
    <li>16h30 - 17h00: Cho chó ăn.</li>
  </ul>

  <h4>b. Nội Dung Huấn Luyện</h4>
  <p>Quá trình huấn luyện bao gồm 3 nội dung cốt lõi: huấn luyện thể lực, huấn luyện kỷ luật và huấn luyện nghiệp vụ nâng cao. Tổng thời gian huấn luyện mỗi ngày là 90 phút.</p>

  <h5>1. Huấn luyện Thể lực và Kỷ luật</h5>
  <ul>
    <li><strong>Động tác cơ bản:</strong> Huấn luyện chó thực hiện các động tác như đi, đứng, nằm, ngồi bên cạnh huấn luyện viên; bò, trườn; sửa các thói quen xấu.</li>
    <li><strong>Rèn luyện thể lực:</strong> Hàng ngày cho chó tập các bài tập như bơi, chui ống, chạy trên cầu độc mộc, vượt chướng ngại vật. Hàng tuần, huấn luyện viên phải cho chó chạy bộ ngoài dã ngoại 2 lần, mỗi lần từ 2-5km.</li>
    <li><strong>Yêu cầu:</strong> Chó phải duy trì vững chắc các phản xạ có điều kiện, tuân thủ mệnh lệnh của huấn luyện viên một cách chính xác, bền bỉ và dẻo dai.</li>
  </ul>

  <h5>2. Huấn luyện Nghiệp vụ (Phát hiện ma túy)</h5>
  <ul>
    <li><strong>Huấn luyện cơ bản:</strong> Huấn luyện viên sử dụng các mẫu ma túy để chó làm quen và hình thành phản xạ tìm kiếm. Các mẫu này được giấu ở nhiều vị trí khác nhau:
      <ul>
        <li>Trong hành lý, vali, băng chuyền, container.</li>
        <li>Trên các phương tiện vận tải như tàu thủy, máy bay.</li>
        <li>Trên tường vách với độ cao tối thiểu 01 mét.</li>
        <li>Giấu trên người: trong túi quần, túi áo, thắt lưng.</li>
      </ul>
    </li>

    <li><strong>Huấn luyện nâng cao:</strong>
      <ul>
        <li>Khi chó đã thành thục, huấn luyện viên sẽ không cần phải điều khiển mà chó có thể tự tìm kiếm trong khu vực được chỉ định.</li>
        <li>Huấn luyện chó tìm kiếm trên người để đánh giá khả năng phát hiện hơi người có ma túy.</li>
      </ul>
    </li>

    <li><strong>Yêu cầu:</strong> Chó phải có khả năng tìm kiếm liên tục trong 20 phút, khi phát hiện phải có biểu hiện rõ ràng (cào, sủa, ngồi, nằm). Đặc biệt, chó làm việc tại sân bay phải có sức bền tốt, còn chó làm việc ở cảng biển phải nhanh nhẹn và chịu được thời tiết khắc nghiệt.</li>
  </ul>

  <hr>

  <h3>3. Đánh Giá Kết Quả Huấn Luyện</h3>
  <p>Việc đánh giá được thực hiện định kỳ để xác định năng lực của chó nghiệp vụ.</p>

  <ul>
    <li><strong>Phương pháp đánh giá:</strong> Dựa trên số lượng mẫu ma túy mà chó phát hiện được ngay tại khu vực huấn luyện và làm việc hàng ngày (ít nhất 3 mẫu). Đồng thời đánh giá tinh thần độc lập, sự tập trung, tính bền bỉ và sự hợp tác với huấn luyện viên.</li>

    <li><strong>Tiêu chuẩn phân loại:</strong>
      <ul>
        <li><strong>Loại Giỏi:</strong> Phản xạ tìm kiếm vững chắc, bền bỉ, tập trung, không bỏ sót khu vực, phát hiện được tất cả các mẫu thử và có biểu hiện rõ ràng.</li>
        <li><strong>Loại Khá:</strong> Tương tự loại Giỏi nhưng phát hiện được từ 02/03 mẫu thử trở lên.</li>
        <li><strong>Loại Trung bình:</strong> Có phản xạ tìm kiếm nhưng đôi khi mất tập trung, có thể bỏ sót mục tiêu. Phát hiện từ 02 mẫu trở lên nhưng biểu hiện có thể không rõ ràng.</li>
        <li><strong>Không đạt yêu cầu:</strong> Phản xạ tìm kiếm yếu, không tập trung, bỏ sót nhiều khu vực, phát hiện dưới 02/03 mẫu và biểu hiện không rõ ràng.</li>
      </ul>
    </li>

    <li>Những con chó không đáp ứng được yêu cầu huấn luyện sẽ bị thải loại theo quy trình.</li>
  </ul>
`;


    } else if (type === 'KẾ HOẠCH CHĂM SÓC, HUẤN LUYỆN') {

        title.innerText = 'KẾ HOẠCH CHĂM SÓC, HUẤN LUYỆN';

        // Check if user can upload (Admin only)
        const canUpload = currentUserRole === 'ADMIN';
        
        content.innerHTML = `
            <div class="care-plan-container">
                
                ${canUpload ? `
                <div class="care-plan-upload-section">
                    <h4>📤 Upload tài liệu mới</h4>
                    <div class="upload-area">
                        <input type="file" id="carePlanFile" accept=".pdf" style="display: none;">
                        <div class="upload-dropzone" onclick="document.getElementById('carePlanFile').click()">
                            <div class="upload-icon">📄</div>
                            <p>Nhấp để chọn file PDF hoặc kéo thả vào đây</p>
                            <small>Chỉ chấp nhận file PDF, tối đa 10MB</small>
                        </div>
                        <div class="upload-progress" id="uploadProgress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                            <span id="progressText">0%</span>
                        </div>
                    </div>
                    <button id="uploadBtn" class="upload-btn" onclick="uploadCarePlan()" disabled>
                        📤 Upload PDF
                    </button>
                </div>
                ` : ''}
                
                <div class="care-plan-viewer-section">
                    <h4>📖 Tài liệu hiện tại</h4>
                    <div id="carePlanViewer" class="care-plan-viewer">
                        <div class="loading">Đang tải tài liệu...</div>
                    </div>
                </div>
            </div>
        `;

        // Load and display the current care plan PDF
        loadCurrentCarePlan();

        // Setup file input change handler if user can upload
        if (canUpload) {
            document.getElementById('carePlanFile').addEventListener('change', handleFileSelect);
        }

    } else {

        title.innerText = type;

        content.innerHTML = '<p>Đây là nội dung của mục "' + type + '". Bạn có thể cập nhật nội dung sau.</p>';

    }



    document.getElementById("searchResults").style.display = "none";

}

// Function to load dog profiles from database only
async function loadDogProfilesFromDatabase() {
    const container = document.getElementById('dogProfilesList');
    
    if (!container) {
        console.error('Dog profiles container not found');
        return;
    }
    
    try {
        // Fetch dogs from database API
        const response = await fetch('/api/dogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const dogs = data.data || [];
            
            if (dogs.length === 0) {
                container.innerHTML = '<div class="no-data">Chưa có chó nghiệp vụ nào trong cơ sở dữ liệu.</div>';
                return;
            }
            
            // Display dogs from database only
            let html = '<div class="dog-profiles-grid">';
            dogs.forEach(dog => {
                const trainerName = dog.trainer_name || 'Chưa phân công';
                const statusClass = dog.status ? dog.status.toLowerCase().replace(' ', '-') : 'unknown';
                
                html += `
                    <div class="dog-profile-card">
                        <div class="dog-profile-header">
                            <h4>${dog.name}</h4>
                            <span class="status-badge status-${statusClass}">${dog.status || 'UNKNOWN'}</span>
                        </div>
                        <div class="dog-profile-details">
                            <p><strong>Số Chip:</strong> ${dog.chip_id || 'N/A'}</p>
                            <p><strong>Giống:</strong> ${dog.breed || 'N/A'}</p>
                            <p><strong>Huấn luyện viên:</strong> ${trainerName}</p>
                            <p><strong>Ngày sinh:</strong> ${dog.birth_date || 'N/A'}</p>
                            <p><strong>Nơi sinh:</strong> ${dog.birth_place || 'N/A'}</p>
                        </div>
                        <div class="dog-profile-actions">
                            <button class="btn btn-primary" onclick="showDogProfileForm('${dog.name}')">
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            container.innerHTML = html;
        } else {
            container.innerHTML = '<div class="error">Lỗi khi tải dữ liệu từ cơ sở dữ liệu.</div>';
        }
    } catch (error) {
        console.error('Error loading dog profiles:', error);
        container.innerHTML = '<div class="error">Không thể kết nối đến cơ sở dữ liệu.</div>';
    }
}

// Function hiển thị dog profile từ DASHBOARD DATA với tên đúng HLV

async function showDogProfileForm(dogName) {

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



    // Get dog data from database via API
    let currentDog = null;
    try {
        const response = await fetch('/api/dogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const dogs = data.data || [];
            currentDog = dogs.find(d => d.name === dogName);
        }
    } catch (error) {
        console.error('Error fetching dog data:', error);
    }



    // READ-ONLY cho Trainer

    const isReadOnly = currentUserRole === 'TRAINER';

    const readOnlyAttr = isReadOnly ? 'readonly' : '';

    const saveButtonDisplay = isReadOnly ? 'style="display: none;"' : '';



    // Enhanced dog profile display with better styling

    content.innerHTML = `

        <div class="dog-profile-container">

            ${isReadOnly ? '<div class="read-only-banner">CHẾ ĐỘ XEM - Không thể chỉnh sửa</div>' : ''}

            

            <div class="dog-profile-header">

                <img id="dog_profile_image" src="images/default_dog.jpg" alt="Ảnh CNV" class="profile-dog-image">

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

                    <input type="text" id="syll_sohieu" value="${currentDog?.chip_id || ''}" ${readOnlyAttr}>

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

async function saveDogProfile(dogName) {

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



    // Save dog profile to database via API
    try {
        const response = await fetch(`/api/dogs/${data.chip_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Dog profile saved to database
        } else {
            console.error('Failed to save dog profile to database');
        }
    } catch (error) {
        console.error('Error saving dog profile:', error);
    }

}



// Function to load dog profile

async function loadDogProfile(dogName) {
    // Load dog profile from database
    try {
        const response = await fetch('/api/dogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const dogs = data.data || [];
            const dogData = dogs.find(d => d.name === dogName);

            if (dogData) {
                // Populate form fields with dog data from database

                document.getElementById('syll_name').value = dogData.name || '';

                document.getElementById('syll_sohieu').value = dogData.chip_id || '';

                document.getElementById('syll_ngaysinh').value = dogData.birth_date || '';

                document.getElementById('syll_noisinh').value = dogData.birth_place || '';

                document.getElementById('syll_giong').value = dogData.breed || '';

                document.getElementById('syll_tinhbiet').value = dogData.gender || '';

                document.getElementById('syll_dacdiem').value = dogData.features || '';

                document.getElementById('syll_maulong').value = dogData.fur_color || '';

                document.getElementById('syll_giatri').value = dogData.value || '';

                document.getElementById('dongho_ba').value = dogData.father_name || '';

                document.getElementById('dongho_ngaysinh').value = dogData.father_birth || '';

                document.getElementById('dongho_noisinh').value = dogData.father_place || '';

                document.getElementById('dongho_giong').value = dogData.father_breed || '';

                document.getElementById('dongho_dacdiem').value = dogData.father_features || '';

                document.getElementById('hlv_ten').value = dogData.hlv_ten || currentUserName || hlvInfo.name;

                document.getElementById('hlv_ngaysinh').value = dogData.hlv_ngaysinh || '';

                document.getElementById('hlv_capbac').value = dogData.hlv_capbac || '';

                document.getElementById('hlv_chucvu').value = dogData.hlv_chucvu || '';

                document.getElementById('hlv_donvi').value = dogData.hlv_donvi || '';

                document.getElementById('hlv_daotao').value = dogData.hlv_daotao || '';
                
                // Update status indicator
                const statusIndicator = document.querySelector('.status-indicator');
                if (statusIndicator && dogData.status) {
                    statusIndicator.textContent = dogData.status;
                    statusIndicator.className = `status-indicator status-${dogData.status.toLowerCase()}`;
                }
                
                console.log('Dog profile loaded successfully:', dogData);

            } else {

                document.getElementById('hlv_ten').value = currentUserName || hlvInfo.name;

            }

        }
    } catch (error) {
        console.error('Error loading dog profile:', error);
        // Set default trainer name on error
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

        // Please enter keyword

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

                if (contentName === 'TỔNG QUAN' || contentName === 'QUY TRÌNH CHĂM SÓC' || contentName === 'QUY TRÌNH SỬ DỤNG' || contentName === 'QUY TRÌNH HUẤN LUYỆN' || contentName === 'KẾ HOẠCH CHĂM SÓC, HUẤN LUYỆN' || contentName === 'VIDEO HƯỚNG DẪN') {

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

        // Keyword not found

    }

}



// Function to go back to main content

function backToMainContent() {

    document.getElementById("searchResults").style.display = "none";

    document.getElementById("content").style.display = "block";

    showContent(document.getElementById('title').innerText);

    // Initialize audio system for TTS
    initializeAudioSystem();

}



let isSpeaking = false;
let currentUtterance = null;
let currentAudio = null;
let audioCache = new Map(); // Cache for audio file mappings
let audioPreloaded = false;

// UTF-8 safe content hashing function
function createContentHash(text) {
    // Convert string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(text);
    
    // Convert bytes to hex string
    let hexString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        hexString += utf8Bytes[i].toString(16).padStart(2, '0');
    }
    
    // Take first 16 characters as hash
    return hexString.substring(0, 16);
}

// Function to preload audio files for all content sections
async function preloadAllAudio() {
    if (audioPreloaded) {
        console.log('✅ Audio already preloaded');
        return;
    }

    console.log('🔄 Preloading audio files for all content sections...');
    
    const contentSections = [
        {
            title: 'TỔNG QUAN',
            content: 'Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm.'
        },
        {
            title: 'QUY TRÌNH CHĂM SÓC',
            content: 'Việc chăm sóc, nuôi dưỡng CNV (chó nghiệp vụ) là công việc phải được thực hiện hàng ngày và liên tục trong suốt quá trình sử dụng. Trách nhiệm được phân công rõ ràng: Huấn luyện viên chịu trách nhiệm toàn diện về sức khỏe của CNV do mình quản lý. Nhân viên thú y tham mưu cho lãnh đạo về công tác chăn nuôi, theo dõi sức khỏe, xây dựng khẩu phần ăn, và trực tiếp thực hiện tiêm phòng, chẩn đoán, điều trị bệnh cho CNV.'
        },
        {
            title: 'QUY TRÌNH SỬ DỤNG',
            content: 'Quy trình sử dụng chó nghiệp vụ trong kiểm tra hải quan bao gồm các bước chuẩn bị, thực hiện kiểm tra, và xử lý kết quả. Huấn luyện viên cần đảm bảo chó được nghỉ ngơi đầy đủ trước khi thực hiện nhiệm vụ, kiểm tra sức khỏe và trạng thái tinh thần của chó.'
        },
        {
            title: 'QUY TRÌNH HUẤN LUYỆN',
            content: 'Quy trình huấn luyện chó nghiệp vụ được thực hiện theo các giai đoạn từ cơ bản đến nâng cao. Giai đoạn đầu tập trung vào việc xây dựng mối quan hệ tin cậy giữa huấn luyện viên và chó, sau đó chuyển sang các bài tập chuyên môn về phát hiện ma túy và chất cấm.'
        }
    ];

    try {
        // Use the preload endpoint to generate all audio files
        const response = await fetch('/api/tts/preload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sections: contentSections
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Audio files preloaded successfully:', data.total_files + ' files');
            
            // Store audio file mappings in cache for instant access
            data.generated.forEach(item => {
                audioCache.set(item.title, item.filename);
                console.log(`📁 Cached: ${item.title} → ${item.filename}`);
            });
            
            audioPreloaded = true;
        } else {
            throw new Error(data.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('❌ Audio preload error:', error);
        // Don't show alert for preload errors, just log them
    }
}

// Function to get cached audio filename for current content
function getCachedAudioFilename() {
    const contentElement = document.getElementById('content');
    if (!contentElement) return null;
    
    const contentText = contentElement.innerText || contentElement.textContent || '';
    if (!contentText.trim()) return null;
    
    // Create hash from actual content (UTF-8 safe)
    const cleanedText = cleanTextForTTS(contentText);
    const contentHash = createContentHash(cleanedText);
    const expectedFilename = `${contentHash}.mp3`;
    
    console.log('🔍 Looking for cached audio:', expectedFilename);
    console.log('📝 Content preview:', cleanedText.substring(0, 100) + '...');
    
    // Check if this file exists in our cache or server
    return expectedFilename;
}

// Function to check if audio file exists on server
async function checkAudioFileExists(filename) {
    try {
        const response = await fetch(`/api/tts/get/${filename}`, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Function to toggle speech using cached audio or generate new
function toggleSpeech() {
    const contentElement = document.getElementById('content');
    const toggleButton = document.getElementById('toggleReadButton');
    
    if (!contentElement) {
        console.error('❌ Content element not found');
        alert('Không tìm thấy nội dung để đọc');
        return;
    }

    const contentText = contentElement.innerText || contentElement.textContent || '';
    
    if (!contentText.trim()) {
        console.warn('⚠️ No content to read');
        alert('Không có nội dung để đọc');
        return;
    }

    console.log('📝 Content to read:', contentText.substring(0, 100) + '...');

    if (isSpeaking) {
        console.log('⏹️ Stopping speech');
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        isSpeaking = false;
        toggleButton.innerText = '🔊 Đọc nội dung';
        toggleButton.style.background = '#007bff';
        return;
    }

    // Clean text for better TTS
    function cleanTextForTTS(text) {
        return text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    // Start Vietnamese TTS (immediate playback from saved files)
    async function startVietnameseTTS() {
        try {
            const cleanedText = cleanTextForTTS(contentText);
            
            // Get expected filename based on content hash (UTF-8 safe)
            const contentHash = createContentHash(cleanedText);
            const expectedFilename = `${contentHash}.mp3`;
            
            // Check if audio file exists on server
            const fileExists = await checkAudioFileExists(expectedFilename);
            
            if (fileExists) {
                console.log('🎵 Found cached audio file:', expectedFilename);
                
                // Update button state
                toggleButton.innerText = '🔄 Đang tải âm thanh...';
                toggleButton.style.background = '#ffc107';
                toggleButton.disabled = true;
                
                // Play the cached audio file immediately
                const audioUrl = `/api/tts/get/${expectedFilename}`;
                currentAudio = new Audio(audioUrl);
                
            } else {
                console.log('🌐 No cached audio found, generating new file:', expectedFilename);
                
                // Update button state
                toggleButton.innerText = '🔄 Đang tạo âm thanh...';
                toggleButton.style.background = '#ffc107';
                toggleButton.disabled = true;
                
                // Use file-based TTS endpoint
                const response = await fetch('/api/tts/speak/file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: cleanedText,
                        lang: 'vi' // Vietnamese
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Unknown error');
                }

                console.log('✅ Audio file generated:', data.filename, '(' + Math.round(data.size / 1024) + ' KB)');
                
                // Play the newly generated audio file
                const audioUrl = `/api/tts/get/${data.filename}`;
                currentAudio = new Audio(audioUrl);
            }
            
            currentAudio.onloadstart = () => {
                console.log('🎵 Audio loading started');
                toggleButton.innerText = '⏸️ Dừng đọc';
                toggleButton.style.background = '#dc3545';
                toggleButton.disabled = false;
            };
            
            currentAudio.oncanplaythrough = () => {
                console.log('🎵 Audio ready to play');
            };
            
            currentAudio.onplay = () => {
                console.log('🎤 Speech started');
                isSpeaking = true;
                toggleButton.innerText = '⏹️ Dừng đọc';
                toggleButton.style.background = '#dc3545';
            };
            
            currentAudio.onended = () => {
                console.log('✅ Speech completed');
                isSpeaking = false;
                toggleButton.innerText = '🔊 Đọc nội dung';
                toggleButton.style.background = '#007bff';
                currentAudio = null;
            };
            
            currentAudio.onerror = (event) => {
                console.error('❌ Audio error:', event);
                isSpeaking = false;
                toggleButton.innerText = '🔊 Đọc nội dung';
                toggleButton.style.background = '#007bff';
                toggleButton.disabled = false;
                
                alert('Lỗi khi phát âm thanh. Vui lòng thử lại.');
                currentAudio = null;
            };
            
            currentAudio.onpause = () => {
                console.log('⏸️ Speech paused');
                isSpeaking = false;
                toggleButton.innerText = '🔊 Đọc nội dung';
                toggleButton.style.background = '#007bff';
            };
            
            // Start playing
            await currentAudio.play();
            
        } catch (error) {
            console.error('❌ TTS Error:', error);
            
            isSpeaking = false;
            toggleButton.innerText = '🔊 Đọc nội dung';
            toggleButton.style.background = '#007bff';
            toggleButton.disabled = false;
            
            let errorMessage = 'Lỗi khi tạo âm thanh. ';
            if (error.message.includes('gTTS not installed')) {
                errorMessage += 'Vui lòng cài đặt gTTS: pip install gTTS';
            } else if (error.message.includes('fetch')) {
                errorMessage += 'Không thể kết nối đến server.';
            } else {
                errorMessage += error.message;
            }
            
            alert(errorMessage);
        }
    }

    // Start the TTS process
    startVietnameseTTS();
}

// Initialize audio preloading when page loads
async function initializeAudioSystem() {
    console.log('🎵 Initializing audio system...');
    
    // Preload audio in background (don't wait for it)
    preloadAllAudio().then(() => {
        console.log('🎵 Audio system ready');
    }).catch(error => {
        console.warn('⚠️ Audio preload failed, will generate on demand:', error);
    });
}

// Function to check audio cache status
async function checkAudioCacheStatus() {
    try {
        const response = await fetch('/api/tts/cache/status');
        const data = await response.json();
        
        if (data.success) {
            console.log('📊 Audio cache status:', {
                files: data.file_count,
                size: Math.round(data.total_size / 1024) + ' KB'
            });
            return data;
        }
    } catch (error) {
        console.error('❌ Error checking cache status:', error);
    }
    return null;
}

// Function to clear audio cache
async function clearAudioCache() {
    try {
        const response = await fetch('/api/tts/cache/clear', {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            console.log('🗑️ Audio cache cleared:', data.cleared_files + ' files, ' + Math.round(data.freed_space / 1024) + ' KB freed');
            audioCache.clear();
            audioPreloaded = false;
            return true;
        }
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
    }
    return false;
}

// Test function to debug speech synthesis
function testSpeechSynthesis() {
    console.log('🧪 Testing speech synthesis...');
    
    // Check browser support
    if (!('speechSynthesis' in window)) {
        console.error('❌ Speech synthesis not supported');
        alert('Trình duyệt không hỗ trợ speech synthesis');
        return;
    }
    
    // Get voices
    const voices = speechSynthesis.getVoices();
    console.log('🎤 Total voices available:', voices.length);
    
    if (voices.length === 0) {
        console.warn('⚠️ No voices available');
        alert('Không có giọng nào khả dụng');
        return;
    }
    
    // List all voices
    console.log('📋 Available voices:');
    voices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.gender || 'unknown'}`);
    });
    
    // Test with simple Vietnamese text (processed for English voices)
    const testText = 'Xin chao, day la thu nghiem doc tieng Viet.';
    console.log('📝 Test text:', testText);
    
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.rate = 0.6;  // Slower for Vietnamese clarity
    utterance.pitch = 0.9; // Lower pitch for Vietnamese tone
    utterance.volume = 1.0;
    utterance.lang = 'en-US'; // Use English for processed Vietnamese text
    
    // Try to find Vietnamese voice
    const vietnameseVoice = voices.find(v => 
        v.lang === 'vi-VN' || 
        v.lang === 'vi' || 
        v.name.toLowerCase().includes('vietnamese')
    );
    
    if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
        console.log('✅ Using Vietnamese voice:', vietnameseVoice.name);
    } else {
        console.warn('⚠️ No Vietnamese voice found, using default');
    }
    
    utterance.onstart = () => console.log('🎤 Test speech started');
    utterance.onend = () => console.log('✅ Test speech completed');
    utterance.onerror = (event) => console.error('❌ Test speech error:', event.error);
    
    try {
        speechSynthesis.speak(utterance);
        console.log('🚀 Test speech initiated');
    } catch (error) {
        console.error('❌ Failed to start test speech:', error);
        alert('Không thể khởi động test speech: ' + error.message);
    }
}

// Add test button to console for debugging
console.log('🔧 Speech synthesis test function available: testSpeechSynthesis()');


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

        // Force updating journal menu for Manager

        updateJournalSubMenuForManager();

    }



    // Toggle journal submenu

    submenu.classList.toggle('open');

}



// Function showJournalEditForm - SỬA: MANAGER TỰ ĐỘNG VÀO CHẾ ĐỘ DUYỆT

function showJournalEditForm(dogName, date = null) {

    // SỬA: Manager tự động chuyển sang chế độ duyệt nhật ký

    if (currentUserRole === 'MANAGER') {

        // Manager detected - redirecting to approval mode

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



    content.innerHTML = roleInfo + '<div class="journal-header-actions"><button class="btn-create-new-journal" onclick="createNewJournal()">Nhật ký mới +</button><button class="btn-view-old-journals" onclick="viewOldJournals()">Xem nhật ký cũ</button></div><div class="journal-section info-general"><h2>I. THÔNG TIN CHUNG</h2><div class="info-general-grid"><div class="info-item-group journal-date-field"><label for="journal_date">Ngày ghi:</label><input type="date" id="journal_date" value="' + (date || defaultDate) + '" required></div><div class="info-item-group"><label for="journal_hlv">Huấn luyện viên:</label><input type="text" id="journal_hlv" value="' + (currentUserName || hlvInfo.name) + ' (Số hiệu: ' + hlvInfo.id + ')" readonly></div><div class="info-item-group"><label for="journal_dog_name">Tên CNV:</label><input type="text" id="journal_dog_name" value="' + dogName + '" readonly></div></div></div><div class="journal-section training-activity"><h2>II. HOẠT ĐỘNG HUẤN LUYỆN</h2><div id="training-blocks-container"><!-- Training blocks will be dynamically added here --></div><div class="training-activity-buttons"><button class="add-block add-training-block" onclick="addTrainingBlock()">Thêm Ca +</button><button class="remove-block remove-training-block" onclick="removeLastTrainingBlock()">Xóa Ca HL</button></div><div class="textarea-block"><label for="journal_hlv_comment">Đánh giá chung của Huấn luyện viên:</label><textarea id="journal_hlv_comment" rows="4"></textarea></div></div><div class="journal-section care-block"><h2>III. CHĂM SÓC & NUÔI DƯỠNG</h2><!-- Care and feeding section content --><div class="meal-row"><div class="meal-part"><div class="meal-header-time"><h3>Bữa trưa:</h3><label for="lunchTime">Thời gian:</label><input type="time" id="lunchTime" value="11:00"></div><div class="meal-food-details-row"><div class="meal-item"><label for="lunchAmount">Sức ăn:</label><select id="lunchAmount" class="appetite-select"><option value="Ăn hết">Ăn hết</option><option value="Ăn ít">Ăn ít</option><option value="Không ăn">Không ăn</option></select></div><div class="meal-item food-selection-group"><label>Thức ăn:</label><div class="custom-food-select-wrapper"><div class="custom-dropdown-trigger" onclick="toggleFoodDropdown(\'lunchFoodOptions\')"><span class="selected-text" id="lunchFoodTriggerText">Chọn thức ăn</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="lunchFoodOptions">' + foodTypesOptions1 + '</div></div><span class="food-selected-display-box" id="lunchFoodDisplayBox">Chưa chọn</span><input type="text" id="lunchFoodOther" class="hidden" placeholder="Thức ăn khác" onchange="updateFoodDisplay(\'lunchFoodDisplayBox\', \'lunchFoodOptions\', \'lunchFoodOther\')"></div></div></div><div class="meal-part"><div class="meal-header-time"><h3>Bữa chiều:</h3><label for="dinnerTime">Thời gian:</label><input type="time" id="dinnerTime" value="17:00"></div><div class="meal-food-details-row"><div class="meal-item"><label for="dinnerAmount">Sức ăn:</label><select id="dinnerAmount" class="appetite-select"><option value="Ăn hết">Ăn hết</option><option value="Ăn ít">Ăn ít</option><option value="Không ăn">Không ăn</option></select></div><div class="meal-item food-selection-group"><label>Thức ăn:</label><div class="custom-food-select-wrapper"><div class="custom-dropdown-trigger" onclick="toggleFoodDropdown(\'dinnerFoodOptions\')"><span class="selected-text" id="dinnerFoodTriggerText">Chọn thức ăn</span><span class="dropdown-arrow">▼</span></div><div class="custom-dropdown-options hidden" id="dinnerFoodOptions">' + foodTypesOptions2 + '</div></div><span class="food-selected-display-box" id="dinnerFoodDisplayBox">Chưa chọn</span><input type="text" id="dinnerFoodOther" class="hidden" placeholder="Thức ăn khác" onchange="updateFoodDisplay(\'dinnerFoodDisplayBox\', \'dinnerFoodOptions\', \'dinnerFoodOther\')"></div></div></div></div><div class="care-checks"><label><input type="checkbox" id="care_bath"> Tắm rửa</label><label><input type="checkbox" id="care_brush"> Chải lông</label><label><input type="checkbox" id="care_wipe"> Lau lông</label></div><div class="health-status"><label><input type="radio" name="health_status" value="Tốt" checked> Tốt</label><label><input type="radio" name="health_status" value="Khá" data-health-type="abnormal"> Khá</label><label><input type="radio" name="health_status" value="Trung bình" data-health-type="sick"> Trung bình</label><label><input type="radio" name="health_status" value="Kém" data-health-type="sick"> Kém</label><input type="text" id="health_other_text" class="health-other-input hidden" placeholder="Ghi rõ tình trạng"></div><div class="textarea-block"><label for="journal_other_issues" class="other-issues-label">Vấn đề khác (nếu có):</label><textarea id="journal_other_issues" rows="3"></textarea></div></div><div class="journal-section operation-activity"><h2>IV. HOẠT ĐỘNG TÁC NGHIỆP</h2><div id="operation-blocks-container"><!-- Operation blocks will be dynamically added here --></div><div class="operation-activity-buttons"><button class="add-block add-operation-block" onclick="addOperationBlock()">Thêm Ca Tác Nghiệp</button><button class="remove-block remove-operation-block" onclick="removeLastOperationBlock()">Xóa Ca Tác Nghiệp</button></div></div><div class="journal-section approval-section"><h2>DUYỆT & KÝ</h2><div class="approval-flex-container">' + leaderApprovalSection + '<div class="approval-box hvl-submission"><h3>Huấn luyện viên xác nhận</h3><div class="signature-area"><p>Họ và tên: <span id="hvl_name_display">' + (currentUserName || hlvInfo.name) + '</span></p><p>Trạng thái: <span class="submission-status">(Chưa gửi duyệt)</span></p><div id="hvl-signature-display"></div><button class="btn-submit-hvl" onclick="submitHvlSignature()">Ký</button></div></div><div class="approval-box substitute-hvl-section"><h3>HLV trực thay (nếu có)</h3><div class="signature-area"><label for="substitute_hvl_name">Họ và tên:</label><input type="text" id="substitute_hvl_name"><label for="substitute_hvl_comment">Ý kiến:</label><textarea id="substitute_hvl_comment" rows="3"></textarea><p>Trạng thái: <span class="substitute-hvl-status">[Chưa ký]</span></p><div id="substitute-signature-display"></div><button class="btn-substitute-hvl-approve" onclick="substituteHvlApprove()">Ký</button></div></div></div></div><div class="journal-action-buttons"><button class="save-journal" onclick="saveJournalData()">Lưu Nhật Ký</button><button class="export-pdf" onclick="exportJournalToPDF(\'' + dogName + '\', document.getElementById(\'journal_date\').value)">Xuất PDF</button></div>';



    // Reset counters khi tạo form mới
    console.log('🔄 Resetting counters - trainingSessionCounter:', trainingSessionCounter, 'operationSessionCounter:', operationSessionCounter);
    trainingSessionCounter = 0;
    operationSessionCounter = 0;
    blockCounter = 0;
    console.log('✅ Counters reset - trainingSessionCounter:', trainingSessionCounter, 'operationSessionCounter:', operationSessionCounter);

    // Reset counters for new journal form



    loadJournalData(dogName, date || defaultDate, true);

    initializeHiddenInputs();

    setupFormEventListeners();

}



// SỬA: Function showAllPendingJournalsForManager - TÌM TẤT CẢ JOURNAL ĐÃ KÝ CHƯA DUYỆT - FIX MANAGER WORKFLOW

async function showAllPendingJournalsForManager() {

    hideAllContentSections();

    document.getElementById('toggleReadButton').style.display = 'block';



    const content = document.getElementById('content');

    content.style.display = 'block';

    content.style.position = 'relative';

    content.style.zIndex = '1';



    const title = document.getElementById('title');

    title.innerText = 'DUYỆT NHẬT KÝ - CHẾ ĐỘ MANAGER';



    // Manager checking for journals



    // SỬA: TÌM JOURNALS TỪ DATABASE

    const allPendingJournals = [];

    try {
        // Get pending journals from database
        const response = await fetch('/api/journals/pending');
        if (response.ok) {
            const data = await response.json();
            const dbJournals = data.data || [];

            // Convert database format to frontend format for compatibility
            for (const journal of dbJournals) {
                const journalKey = `journal_${journal.dog_name}_${journal.journal_date}_${journal.id}`;
                console.log('📋 Manager journal entry:', {
                    key: journalKey,
                    id: journal.id,
                    dogName: journal.dog_name,
                    date: journal.journal_date,
                    trainer: journal.trainer_name,
                    status: journal.approval_status
                });
                
                allPendingJournals.push({
                    key: journalKey, // Include journal ID for uniqueness
                    dogName: journal.dog_name,
                    date: journal.journal_date,
                    trainerName: journal.trainer_name,
                    status: journal.approval_status,
                    data: journal
                });
            }
        } else {
            throw new Error('Database request failed');
        }
    } catch (error) {
        console.error('Failed to get pending journals from database:', error);
    }



    // Database search completed



    // Total journals requiring manager approval



    if (allPendingJournals.length === 0) {

        content.innerHTML = `<div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <h3 style="color: #2196F3; margin-bottom: 20px;">📋 CHẾ ĐỘ MANAGER - DUYỆT NHẬT KÝ</h3>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px;">

                <h4 style="color: #155724; margin-top: 0;">✅ Không có nhật ký nào cần duyệt</h4>

                <p style="color: #155724;">Tất cả nhật ký đã được xử lý hoặc chưa có nhật ký nào được gửi duyệt.</p>

            </div>

            <div style="margin-top: 20px;">
                <button onclick="refreshManagerView()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-right: 10px;">🔄 Làm mới</button>
                <button onclick="showManagerPastJournalsModal()" style="background: #17a2b8; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer;">📚 Xem nhật ký cũ</button>
            </div>

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

            formatDateToDDMMYYYY(journal.data.approval.hvlSignature.timestamp) : 'N/A';



        html += `<div style="background: white; border: 2px solid ${isUrgent ? '#ff4444' : '#e3f2fd'}; padding: 20px; margin: 15px 0; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; position: relative;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">

    ${urgentBadge}

    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">

        <div style="flex: 1; min-width: 300px;">

            <div style="display: flex; align-items: center; margin-bottom: 12px;">

                <span style="font-size: 24px; margin-right: 10px;">📅</span>

                <strong style="color: #1976d2; font-size: 18px;">Ngày: ${formatDateToDDMMYYYY(journal.date)}</strong>

            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">

                <span style="font-size: 20px; margin-right: 10px;">🐕</span>

                <strong style="color: #2e7d32;">CNV: ${journal.dogName}</strong>

            </div>

            <div style="display: flex; align-items: center; margin-bottom: 10px;">

                <span style="font-size: 20px; margin-right: 10px;">👨‍💼</span>

                <span style="color: #666;">HLV: ${journal.trainerName || 'N/A'}</span>

            </div>


            <div style="display: flex; align-items: center; margin-bottom: 15px;">

                <span style="font-size: 20px; margin-right: 10px;">⏰</span>

                <span style="color: #666; font-size: 14px;">Gửi lúc: ${formatDateToDDMMYYYY(journal.submittedAt || journal.date, true)}</span>

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

            <button onclick="showManagerPastJournalsModal()" style="background: #17a2b8; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 15px;">📚 Xem nhật ký cũ</button>

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

            // Auto-refreshing manager view

            showAllPendingJournalsForManager();

        }

    }, 30000);

}

// SỬA: Function MANAGER JOURNAL VIEW - XEM SỔ NHẬT KÝ HUẤN LUYỆN
async function showManagerJournalView() {
    hideAllContentSections();
    
    const content = document.getElementById('content');
    const title = document.getElementById('title');
    
    content.style.display = 'block';
    content.style.justifyContent = 'flex-start';
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto';
    content.style.position = 'relative';
    content.style.zIndex = '1';
    
    title.innerText = 'SỔ NHẬT KÝ HUẤN LUYỆN - CHẾ ĐỘ MANAGER';
    
    // Load all journals from database
    let allJournals = [];
    
    try {
        console.log('🔍 Loading all journals for Manager view...');
        
        const response = await fetch('/api/journals');
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('📄 API Response data:', data);
            
            if (data.success && data.data) {
                allJournals = data.data.map(journal => ({
                    id: journal.id,
                    key: `journal_${journal.dog_name}_${journal.journal_date}`,
                    dogName: journal.dog_name,
                    date: journal.journal_date,
                    trainerName: journal.trainer_name,
                    status: journal.approval_status,
                    data: journal,
                    approvedAt: journal.approved_at,
                    approvedBy: journal.approver_name
                }));
                console.log('✅ Loaded journals from database:', allJournals.length);
                console.log('📋 Journal details:', allJournals.map(j => ({ id: j.id, dog: j.dogName, date: j.date, status: j.status })));
            } else {
                console.error('❌ API returned unsuccessful response:', data);
            }
        } else {
            const errorText = await response.text();
            console.error('❌ API request failed:', response.status, errorText);
            throw new Error('Database request failed');
        }
    } catch (error) {
        console.error('❌ Failed to get journals from database:', error);
        content.innerHTML = `
            <div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h3 style="color: #f44336; margin-bottom: 20px;">❌ Lỗi tải dữ liệu</h3>
                <p style="color: #666;">Không thể tải danh sách nhật ký từ cơ sở dữ liệu.</p>
                <button onclick="showManagerJournalView()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 20px;">🔄 Thử lại</button>
            </div>
        `;
        return;
    }
    
    if (allJournals.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 50px; background: white; border-radius: 10px; margin: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h3 style="color: #2196F3; margin-bottom: 20px;">📖 SỔ NHẬT KÝ HUẤN LUYỆN</h3>
                <div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 20px; border-radius: 8px;">
                    <h4 style="color: #1976d2; margin-top: 0;">📝 Chưa có nhật ký nào</h4>
                    <p style="color: #1976d2;">Hệ thống chưa có nhật ký huấn luyện nào được tạo.</p>
                </div>
                <button onclick="showManagerJournalView()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 20px;">🔄 Làm mới</button>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    allJournals.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('📅 Sorted journals:', allJournals.map(j => ({ id: j.id, dog: j.dogName, date: j.date })));
    
    // Group by dog
    const journalsByDog = {};
    allJournals.forEach(journal => {
        if (!journalsByDog[journal.dogName]) {
            journalsByDog[journal.dogName] = [];
        }
        journalsByDog[journal.dogName].push(journal);
    });
    console.log('🐕 Journals grouped by dog:', journalsByDog);
    
    // Create HTML for journal view
    let html = `
        <div style="background: white; border-radius: 10px; margin: 20px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 20px; margin-bottom: 25px; border-radius: 8px; text-align: center;">
                <h3 style="color: #1976d2; margin-top: 0;">📖 SỔ NHẬT KÝ HUẤN LUYỆN</h3>
                <p style="color: #1976d2; font-size: 18px; font-weight: bold;">Tổng cộng: ${allJournals.length} nhật ký từ ${Object.keys(journalsByDog).length} chó nghiệp vụ</p>
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-top: 15px;">
                    <strong>📊 Thống kê:</strong> 
                    ${allJournals.filter(j => j.status === 'APPROVED').length} đã duyệt, 
                    ${allJournals.filter(j => j.status === 'PENDING').length} chờ duyệt, 
                    ${allJournals.filter(j => j.status === 'REJECTED').length} từ chối
                </div>
            </div>
            
            <div class="manager-journals-list">
                <h4 style="color: #333; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">📋 Danh sách nhật ký theo chó nghiệp vụ:</h4>
    `;
    
    // Create journal list by dog
    Object.keys(journalsByDog).sort().forEach(dogName => {
        const dogJournals = journalsByDog[dogName];
        const approvedCount = dogJournals.filter(j => j.status === 'APPROVED').length;
        const pendingCount = dogJournals.filter(j => j.status === 'PENDING').length;
        const rejectedCount = dogJournals.filter(j => j.status === 'REJECTED').length;
        
        html += `
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; margin: 15px 0; overflow: hidden;">
                <div style="background: #007bff; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0; font-size: 18px;">🐕 ${dogName}</h4>
                    <div style="font-size: 14px;">
                        <span style="background: #28a745; padding: 4px 8px; border-radius: 4px; margin-right: 5px;">✅ ${approvedCount}</span>
                        <span style="background: #ffc107; padding: 4px 8px; border-radius: 4px; margin-right: 5px;">⏳ ${pendingCount}</span>
                        <span style="background: #dc3545; padding: 4px 8px; border-radius: 4px;">❌ ${rejectedCount}</span>
                    </div>
                </div>
                <div style="padding: 15px;">
        `;
        
        dogJournals.forEach(journal => {
            const statusColor = journal.status === 'APPROVED' ? '#28a745' : 
                               journal.status === 'PENDING' ? '#ffc107' : '#dc3545';
            const statusText = journal.status === 'APPROVED' ? 'Đã duyệt' : 
                              journal.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối';
            const statusIcon = journal.status === 'APPROVED' ? '✅' : 
                              journal.status === 'PENDING' ? '⏳' : '❌';
            
            html += `
                <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 12px; margin: 8px 0; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 16px; margin-right: 8px;">📅</span>
                            <strong style="color: #495057;">${formatDateToDDMMYYYY(journal.date)}</strong>
                            <span style="background: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">
                                ${statusIcon} ${statusText}
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 14px; margin-right: 8px;">👨‍💼</span>
                            <span style="color: #6c757d; font-size: 14px;">HLV: ${journal.trainerName || 'N/A'}</span>
                        </div>
                        ${journal.approvedBy ? `
                            <div style="display: flex; align-items: center;">
                                <span style="font-size: 14px; margin-right: 8px;">👤</span>
                                <span style="color: #6c757d; font-size: 14px;">Duyệt bởi: ${journal.approvedBy}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="viewJournalFromManagerView('${journal.key}')" style="background: #17a2b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">👀 Xem</button>
                        <button onclick="exportJournalFromManagerView('${journal.key}')" style="background: #6f42c1; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">📄 PDF</button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e3f2fd;">
                <button onclick="showManagerJournalView()" style="background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 15px;">🔄 Làm mới</button>
                <button onclick="exportAllJournalsForManager()" style="background: #28a745; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-right: 15px;">📊 Xuất báo cáo</button>
                <button onclick="showManagerStatistics()" style="background: #9c27b0; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">📈 Thống kê</button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

// Helper functions for Manager Journal View
async function viewJournalFromManagerView(journalKey) {
    try {
        // Extract dog name, date, and ID from journal key
        const keyParts = journalKey.replace('journal_', '').split('_');
        const dogName = keyParts[0];
        
        // Handle both old format (dogName_date) and new format (dogName_date_id)
        let date, journalId = null;
        if (keyParts.length >= 3) {
            // New format: dogName_date_id
            journalId = keyParts[keyParts.length - 1];
            date = keyParts.slice(1, -1).join('_');
        } else {
            // Old format: dogName_date
            date = keyParts.slice(1).join('_');
        }
        
        console.log('🔍 Manager viewing journal - Dog:', dogName, 'Date:', date, 'ID:', journalId);
        
        // Use existing function to show A4 view
        await showPureA4JournalView(dogName, date);
    } catch (error) {
        console.error('Error viewing journal from manager view:', error);
        alert('Có lỗi khi xem nhật ký: ' + error.message);
    }
}

async function exportJournalFromManagerView(journalKey) {
    try {
        // Extract dog name, date, and ID from journal key
        const keyParts = journalKey.replace('journal_', '').split('_');
        const dogName = keyParts[0];
        
        // Handle both old format (dogName_date) and new format (dogName_date_id)
        let date, journalId = null;
        if (keyParts.length >= 3) {
            // New format: dogName_date_id
            journalId = keyParts[keyParts.length - 1];
            date = keyParts.slice(1, -1).join('_');
        } else {
            // Old format: dogName_date
            date = keyParts.slice(1).join('_');
        }
        
        console.log('🔍 Manager exporting journal - Dog:', dogName, 'Date:', date, 'ID:', journalId);
        
        // Use existing PDF export functionality
        if (window.pdfExportSystem) {
            await window.pdfExportSystem.exportJournalToPDF(dogName, date);
        } else {
            alert('Chức năng xuất PDF chưa sẵn sàng. Vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Error exporting journal from manager view:', error);
        alert('Có lỗi khi xuất PDF: ' + error.message);
    }
}

async function exportAllJournalsForManager() {
    try {
        alert('Chức năng xuất báo cáo tổng hợp đang được phát triển. Vui lòng sử dụng chức năng xuất PDF cho từng nhật ký riêng lẻ.');
    } catch (error) {
        console.error('Error exporting all journals:', error);
        alert('Có lỗi khi xuất báo cáo: ' + error.message);
    }
}

// Manager Past Journals Modal - Similar to viewOldJournals but for Manager
async function showManagerPastJournalsModal() {
    try {
        // Load all journals from database
        const response = await fetch('/api/journals');
        if (!response.ok) {
            throw new Error('Database request failed');
        }
        
        const result = await response.json();
        if (!result.success || !result.data) {
            throw new Error('No journals found');
        }
        
        const allJournals = result.data;
        console.log('📚 Manager Past Journals - Total journals:', allJournals.length);
        console.log('📚 Journal details:', allJournals.map(j => ({ id: j.id, dog: j.dog_name, date: j.journal_date, trainer: j.trainer_name })));
        
        if (allJournals.length === 0) {
            alert('Không có nhật ký nào trong hệ thống.');
            return;
        }
        
        // Sort by date (newest first)
        allJournals.sort((a, b) => new Date(b.journal_date) - new Date(a.journal_date));
        console.log('📅 Sorted journals for dropdown:', allJournals.map(j => ({ id: j.id, dog: j.dog_name, date: j.journal_date })));
        
        // Create dropdown options
        let dateOptions = '<option value="">Chọn ngày xem nhật ký</option>';
        
        allJournals.forEach(journal => {
            const dateStr = formatDateToDDMMYYYY(journal.journal_date);
            
            // Get status badge
            let statusBadge = '';
            switch(journal.approval_status) {
                case 'APPROVED':
                    statusBadge = '✅ Đã duyệt';
                    break;
                case 'PENDING':
                    statusBadge = '⏳ Chờ duyệt';
                    break;
                case 'REJECTED':
                    statusBadge = '❌ Từ chối';
                    break;
                default:
                    statusBadge = '❓ ' + journal.approval_status;
            }
            
            // Get trainer info
            const trainerInfo = journal.trainer_name || 'Chưa xác định';
            
            // Get approver info if approved
            let approverInfo = '';
            if (journal.approval_status === 'APPROVED' && journal.approver_name) {
                approverInfo = ` | Duyệt bởi: ${journal.approver_name}`;
            }
            
            // Create comprehensive option text
            const optionText = `${dateStr} - CNV ${journal.dog_name} | HLV: ${trainerInfo} | ${statusBadge}${approverInfo}`;
            dateOptions += `<option value="${journal.journal_date}|${journal.dog_name}|${journal.id}">${optionText}</option>`;
            console.log('➕ Added detailed option:', optionText, '| Journal ID:', journal.id);
        });
        
        console.log('📋 Total dropdown options created:', allJournals.length + 1);
        
        // Create modal HTML
        const modalHtml = `
            <div id="managerPastJournalsModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <h3 style="margin-top: 0; color: #2196F3;">📚 XEM NHẬT KÝ CŨ - MANAGER</h3>
                    <p style="color: #666; margin-bottom: 20px;">Tìm thấy <strong>${allJournals.length}</strong> nhật ký trong hệ thống. Chọn nhật ký để xem bản PDF A4:</p>
                    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 10px; margin-bottom: 15px; font-size: 12px; color: #6c757d;">
                        <strong>📋 Thông tin hiển thị:</strong> Ngày | Tên CNV | Huấn luyện viên | Trạng thái duyệt | Người duyệt (nếu có)
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="managerPastJournalSelect" style="display: block; margin-bottom: 8px; font-weight: bold;">Chọn nhật ký:</label>
                        <select id="managerPastJournalSelect" style="width: 100%; padding: 12px; border: 2px solid #007bff; border-radius: 8px; font-size: 13px; background: white; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            ${dateOptions}
                        </select>
                    </div>
                    
                    <div style="text-align: right; margin-top: 20px;">
                        <button onclick="closeManagerPastJournalsModal()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 5px; margin-right: 10px; cursor: pointer; font-size: 14px;">❌ Hủy</button>
                        <button onclick="viewSelectedManagerPastJournal()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 14px;">📄 Xem PDF A4</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
    } catch (error) {
        console.error('Error loading past journals for manager:', error);
        alert('Có lỗi khi tải danh sách nhật ký: ' + error.message);
    }
}

// Close Manager Past Journals Modal
function closeManagerPastJournalsModal() {
    const modal = document.getElementById('managerPastJournalsModal');
    if (modal) {
        modal.remove();
    }
}

// View Selected Manager Past Journal
function viewSelectedManagerPastJournal() {
    const selectedValue = document.getElementById('managerPastJournalSelect').value;
    
    if (!selectedValue) {
        alert('Vui lòng chọn ngày để xem nhật ký!');
        return;
    }
    
    try {
        const [date, dogName, journalId] = selectedValue.split('|');
        
        console.log('🎯 Manager selected journal:', { date, dogName, journalId });
        
        // Use existing function to show A4 view with specific journal ID
        showPureA4JournalView(dogName, date, journalId);
        
        // Close modal
        closeManagerPastJournalsModal();
        
    } catch (error) {
        console.error('Error viewing selected past journal:', error);
        alert('Có lỗi khi xem nhật ký: ' + error.message);
    }
}

// SỬA: Function MARK NOTIFICATIONS AS READ

async function markManagerNotificationsAsRead() {
    try {
        // TODO: Update notifications in database
        // Manager notifications marked as read
    } catch (error) {
        console.error('Failed to mark notifications as read:', error);
    }
}



// SỬA: Function XEM JOURNAL CHO MANAGER APPROVAL

// SỬA: Function XEM JOURNAL CHO MANAGER APPROVAL

function viewJournalForManagerApproval(journalKey) {

    // Manager viewing journal for approval



    // SỬA: Lưu trạng thái trước khi chuyển sang PDF view

    window.previousManagerView = 'PENDING_JOURNALS';



    // Chuyển sang PDF view để Manager có thể xem chi tiết

    showA4JournalViewFromKey(journalKey);

}



// Function hỗ trợ Manager

function refreshManagerView() {

    // Manual refresh requested by Manager

    showAllPendingJournalsForManager();

}



async function showManagerStatistics() {
    // Show loading modal first
    showStatisticsModal();
    
    try {
        // Get all journals from database
        const response = await fetch('/api/journals');
        if (response.ok) {
            const data = await response.json();
            const journals = data.data || [];
            
            // Calculate comprehensive statistics
            const stats = calculateDetailedStatistics(journals);
            
            // Update modal with statistics
            updateStatisticsModal(stats);
        } else {
            throw new Error('Failed to fetch journals');
        }
    } catch (error) {
        console.error('Error getting journal statistics:', error);
        showStatisticsError(error.message);
    }
}

function calculateDetailedStatistics(journals) {
    const stats = {
        total: journals.length,
        approved: 0,
        pending: 0,
        rejected: 0,
        incomplete: 0,
        byDog: {},
        byTrainer: {},
        byMonth: {},
        byStatus: {},
        recentActivity: [],
        averageTrainingTime: 0,
        totalTrainingHours: 0
    };

    // Process each journal
    journals.forEach(journal => {
        // Status counts
        switch(journal.approval_status) {
            case 'APPROVED':
                stats.approved++;
                break;
            case 'PENDING':
                stats.pending++;
                break;
            case 'REJECTED':
                stats.rejected++;
                break;
            default:
                stats.incomplete++;
        }

        // By dog
        if (!stats.byDog[journal.dog_name]) {
            stats.byDog[journal.dog_name] = { total: 0, approved: 0, pending: 0 };
        }
        stats.byDog[journal.dog_name].total++;
        if (journal.approval_status === 'APPROVED') stats.byDog[journal.dog_name].approved++;
        if (journal.approval_status === 'PENDING') stats.byDog[journal.dog_name].pending++;

        // By trainer
        if (!stats.byTrainer[journal.trainer_name]) {
            stats.byTrainer[journal.trainer_name] = { total: 0, approved: 0, pending: 0 };
        }
        stats.byTrainer[journal.trainer_name].total++;
        if (journal.approval_status === 'APPROVED') stats.byTrainer[journal.trainer_name].approved++;
        if (journal.approval_status === 'PENDING') stats.byTrainer[journal.trainer_name].pending++;

        // By month
        const month = new Date(journal.journal_date).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' });
        if (!stats.byMonth[month]) {
            stats.byMonth[month] = { total: 0, approved: 0, pending: 0 };
        }
        stats.byMonth[month].total++;
        if (journal.approval_status === 'APPROVED') stats.byMonth[month].approved++;
        if (journal.approval_status === 'PENDING') stats.byMonth[month].pending++;

        // Training time calculation (if available)
        if (journal.training_duration) {
            stats.totalTrainingHours += parseFloat(journal.training_duration) || 0;
        }

        // Recent activity (last 10 journals)
        stats.recentActivity.push({
            date: journal.journal_date,
            dog: journal.dog_name,
            trainer: journal.trainer_name,
            status: journal.approval_status,
            approvedAt: journal.approved_at
        });
    });

    // Sort recent activity by date
    stats.recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    stats.recentActivity = stats.recentActivity.slice(0, 10);

    // Calculate average training time
    if (stats.total > 0) {
        stats.averageTrainingTime = stats.totalTrainingHours / stats.total;
    }

    return stats;
}

function showStatisticsModal() {
    const modal = document.createElement('div');
    modal.id = 'statisticsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
        ">
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 15px 15px 0 0;
                position: sticky;
                top: 0;
                z-index: 1;
            ">
                <h2 style="margin: 0; font-size: 24px; font-weight: bold;">
                    📊 THỐNG KÊ CHI TIẾT HỆ THỐNG QUẢN LÝ K9
                </h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
                    Báo cáo tổng quan và phân tích dữ liệu huấn luyện
                </p>
            </div>
            
            <div style="padding: 30px;">
                <div id="statisticsContent" style="text-align: center; padding: 50px;">
                    <div style="
                        display: inline-block;
                        width: 50px;
                        height: 50px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    "></div>
                    <h3 style="color: #667eea; margin-bottom: 10px;">Đang tải dữ liệu...</h3>
                    <p style="color: #666;">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
            
            <div style="
                padding: 20px 30px;
                border-top: 1px solid #eee;
                text-align: center;
                background: #f8f9fa;
                border-radius: 0 0 15px 15px;
            ">
                <button onclick="closeStatisticsModal()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 15px;
                ">Đóng</button>
                <button onclick="exportStatistics()" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                ">📊 Xuất báo cáo</button>
            </div>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(modal);
}

function updateStatisticsModal(stats) {
    const content = document.getElementById('statisticsContent');
    
    // Calculate percentages
    const approvedPercent = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0;
    const pendingPercent = stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0;
    const rejectedPercent = stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0;
    const incompletePercent = stats.total > 0 ? ((stats.incomplete / stats.total) * 100).toFixed(1) : 0;

    content.innerHTML = `
        <!-- Overview Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">📋 Tổng số nhật ký</h3>
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 5px;">${stats.total}</div>
                <div style="font-size: 14px; opacity: 0.9;">Tất cả nhật ký</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">✅ Đã duyệt</h3>
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 5px;">${stats.approved}</div>
                <div style="font-size: 14px; opacity: 0.9;">${approvedPercent}% tổng số</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">⏳ Chờ duyệt</h3>
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 5px;">${stats.pending}</div>
                <div style="font-size: 14px; opacity: 0.9;">${pendingPercent}% tổng số</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #dc3545, #e83e8c); color: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">❌ Từ chối/Chưa hoàn thành</h3>
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 5px;">${stats.rejected + stats.incomplete}</div>
                <div style="font-size: 14px; opacity: 0.9;">${(parseFloat(rejectedPercent) + parseFloat(incompletePercent)).toFixed(1)}% tổng số</div>
            </div>
        </div>

        <!-- Training Hours Summary -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #17a2b8;">
            <h3 style="color: #17a2b8; margin: 0 0 15px 0; font-size: 20px;">⏱️ Thống kê thời gian huấn luyện</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #17a2b8;">${stats.totalTrainingHours.toFixed(1)}</div>
                    <div style="color: #666; font-size: 14px;">Tổng giờ huấn luyện</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #17a2b8;">${stats.averageTrainingTime.toFixed(1)}</div>
                    <div style="color: #666; font-size: 14px;">Giờ trung bình/buổi</div>
                </div>
            </div>
        </div>

        <!-- Detailed Breakdown -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <!-- By Dog -->
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 20px;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">🐕 Thống kê theo chó nghiệp vụ</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${Object.entries(stats.byDog).map(([dog, data]) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f8f9fa; margin-bottom: 5px;">
                            <div>
                                <strong style="color: #495057;">${dog}</strong>
                                <div style="font-size: 12px; color: #6c757d;">Tổng: ${data.total} | Đã duyệt: ${data.approved} | Chờ: ${data.pending}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 18px; font-weight: bold; color: #28a745;">${data.total > 0 ? ((data.approved / data.total) * 100).toFixed(0) : 0}%</div>
                                <div style="font-size: 10px; color: #6c757d;">Tỷ lệ duyệt</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- By Trainer -->
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 20px;">
                <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">👨‍🏫 Thống kê theo huấn luyện viên</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${Object.entries(stats.byTrainer).map(([trainer, data]) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f8f9fa; margin-bottom: 5px;">
                            <div>
                                <strong style="color: #495057;">${trainer}</strong>
                                <div style="font-size: 12px; color: #6c757d;">Tổng: ${data.total} | Đã duyệt: ${data.approved} | Chờ: ${data.pending}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 18px; font-weight: bold; color: #28a745;">${data.total > 0 ? ((data.approved / data.total) * 100).toFixed(0) : 0}%</div>
                                <div style="font-size: 10px; color: #6c757d;">Tỷ lệ duyệt</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Monthly Statistics -->
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">📅 Thống kê theo tháng</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ${Object.entries(stats.byMonth).sort((a, b) => b[0].localeCompare(a[0])).map(([month, data]) => `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                        <div style="font-weight: bold; color: #495057; margin-bottom: 5px;">${month}</div>
                        <div style="font-size: 14px; color: #6c757d;">
                            Tổng: ${data.total} | Đã duyệt: ${data.approved} | Chờ: ${data.pending}
                        </div>
                        <div style="font-size: 12px; color: #28a745; margin-top: 5px;">
                            Tỷ lệ duyệt: ${data.total > 0 ? ((data.approved / data.total) * 100).toFixed(1) : 0}%
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Recent Activity -->
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 20px;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">🕒 Hoạt động gần đây</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                ${stats.recentActivity.map(activity => {
                    const statusColor = activity.status === 'APPROVED' ? '#28a745' : 
                                      activity.status === 'PENDING' ? '#ffc107' : '#dc3545';
                    const statusText = activity.status === 'APPROVED' ? 'Đã duyệt' : 
                                     activity.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối/Chưa hoàn thành';
                    
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f8f9fa; margin-bottom: 5px;">
                            <div>
                                <div style="font-weight: bold; color: #495057;">${activity.dog}</div>
                                <div style="font-size: 12px; color: #6c757d;">
                                    ${new Date(activity.date).toLocaleDateString('vi-VN')} - ${activity.trainer}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px;">
                                    ${statusText}
                                </span>
                                ${activity.approvedAt ? `
                                    <div style="font-size: 10px; color: #6c757d; margin-top: 2px;">
                                        Duyệt: ${new Date(activity.approvedAt).toLocaleDateString('vi-VN')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function showStatisticsError(message) {
    const content = document.getElementById('statisticsContent');
    content.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <div style="font-size: 48px; color: #dc3545; margin-bottom: 20px;">❌</div>
            <h3 style="color: #dc3545; margin-bottom: 15px;">Lỗi tải dữ liệu</h3>
            <p style="color: #666; margin-bottom: 20px;">${message}</p>
            <button onclick="showManagerStatistics()" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
            ">🔄 Thử lại</button>
        </div>
    `;
}

function closeStatisticsModal() {
    const modal = document.getElementById('statisticsModal');
    if (modal) {
        modal.remove();
    }
}

function exportStatistics() {
    // Get current statistics data
    const content = document.getElementById('statisticsContent');
    const statsText = content.innerText;
    
    // Create and download file
    const blob = new Blob([statsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thong-ke-k9-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Báo cáo thống kê đã được xuất thành công!', 'success');
}

// AI Search System - Ultra Stable Version
let aiSearchHistory = [];

// Load AI search history from database
async function loadAISearchHistory() {
    try {
        // TODO: Implement database loading for AI search history
        aiSearchHistory = [];
    } catch (error) {
        console.error('Failed to load AI search history:', error);
        aiSearchHistory = [];
    }
}

// Initialize AI search history
loadAISearchHistory();
let aiSearchIndex = {};
let aiSearchState = {
    isOpening: false,
    isClosing: false,
    isOpen: false
};

// Ultra Stable AI Search Function
function chatWithAI() {

    // Opening AI Search interface

    // Prevent any concurrent operations
    if (aiSearchState.isOpening || aiSearchState.isClosing || aiSearchState.isOpen) {
        // Modal operation already in progress
        return;
    }

    aiSearchState.isOpening = true;

    // Initialize search index if not done
    if (Object.keys(aiSearchIndex).length === 0) {
        initializeAISearchIndex();
    }

    // Use requestAnimationFrame for smooth opening
    requestAnimationFrame(() => {
        openAISearchModalStable();
    });
}

// Stable modal opening function
function openAISearchModalStable() {
    const modal = document.getElementById('aiSearchModal');

    // Add show class immediately
    modal.classList.add('show');
    aiSearchState.isOpen = true;

    // Focus on input after a short delay
    setTimeout(() => {
        const input = document.getElementById('aiSearchInput');
        if (input) {
            input.focus();
        }
        aiSearchState.isOpening = false;
    }, 50);

    // Load search history
    loadAISearchHistory();
}

// Initialize AI search index
function initializeAISearchIndex() {
    // Initializing AI search index

    // Build search index from various sources
    aiSearchIndex = {
        dogs: [],
        users: [],
        journals: [],
        content: [],
        procedures: [],
        files: []
    };

    // Index static content
    indexStaticContent();

    // AI search index initialized
}

// Index static content from the application
function indexStaticContent() {
    // Dog profiles content
    const dogProfiles = [
        {
            name: 'CNV BI',
            content: 'Chó nghiệp vụ CNV BI - Chuyên phát hiện ma túy, hàng cấm. Huấn luyện viên: Trần Đức Kiên. Giống: Belgian Malinois. Trạng thái: Hoạt động.',
            keywords: ['chó nghiệp vụ', 'ma túy', 'hàng cấm', 'huấn luyện', 'Belgian Malinois']
        },
        {
            name: 'CNV LU',
            content: 'Chó nghiệp vụ CNV LU - Chuyên phát hiện ma túy, hàng cấm. Huấn luyện viên: Trần Đức Kiên. Giống: Belgian Malinois. Trạng thái: Hoạt động.',
            keywords: ['chó nghiệp vụ', 'ma túy', 'hàng cấm', 'huấn luyện', 'Belgian Malinois']
        },
        {
            name: 'CNV RẾCH',
            content: 'Chó nghiệp vụ CNV RẾCH - Chuyên phát hiện ma túy, hàng cấm. Huấn luyện viên: Nguyễn Văn Tuấn. Giống: Belgian Malinois. Trạng thái: Hoạt động.',
            keywords: ['chó nghiệp vụ', 'ma túy', 'hàng cấm', 'huấn luyện', 'Belgian Malinois']
        },
        {
            name: 'CNV KY',
            content: 'Chó nghiệp vụ CNV KY - Chuyên phát hiện ma túy, hàng cấm. Huấn luyện viên: Lê Văn Quang. Giống: Belgian Malinois. Trạng thái: Hoạt động.',
            keywords: ['chó nghiệp vụ', 'ma túy', 'hàng cấm', 'huấn luyện', 'Belgian Malinois']
        },
        {
            name: 'CNV REX',
            content: 'Chó nghiệp vụ CNV REX - Chuyên phát hiện ma túy, hàng cấm. Huấn luyện viên: Phạm Văn Kiên. Giống: Belgian Malinois. Trạng thái: Hoạt động.',
            keywords: ['chó nghiệp vụ', 'ma túy', 'hàng cấm', 'huấn luyện', 'Belgian Malinois']
        }
    ];

    // Procedures and guidelines
    const procedures = [
        {
            title: 'Quy trình chăm sóc chó nghiệp vụ',
            content: 'Quy trình chăm sóc bao gồm: Kiểm tra sức khỏe hàng ngày, cho ăn đúng giờ, tập thể dục, vệ sinh chuồng trại, tiêm phòng định kỳ, kiểm tra răng miệng.',
            keywords: ['chăm sóc', 'sức khỏe', 'vệ sinh', 'tiêm phòng', 'chuồng trại']
        },
        {
            title: 'Quy trình huấn luyện chó nghiệp vụ',
            content: 'Quy trình huấn luyện: Làm quen với mùi ma túy, huấn luyện phát hiện, tập luyện hàng ngày, kiểm tra hiệu quả, cập nhật kỹ năng.',
            keywords: ['huấn luyện', 'ma túy', 'phát hiện', 'kỹ năng', 'tập luyện']
        },
        {
            title: 'Quy trình sử dụng chó nghiệp vụ',
            content: 'Quy trình sử dụng: Kiểm tra trước khi làm việc, tuân thủ an toàn, ghi nhật ký hoạt động, báo cáo kết quả, bảo dưỡng thiết bị.',
            keywords: ['sử dụng', 'an toàn', 'nhật ký', 'báo cáo', 'bảo dưỡng']
        }
    ];

    // Add to search index
    aiSearchIndex.dogs = dogProfiles;
    aiSearchIndex.procedures = procedures;

    // Add general content
    aiSearchIndex.content = [
        {
            title: 'Tổng quan hệ thống',
            content: 'Hệ thống quản lý chó nghiệp vụ Hải quan Việt Nam tại cửa khẩu quốc tế Móng Cái. Quản lý thông tin chó, huấn luyện viên, nhật ký hoạt động.',
            keywords: ['hệ thống', 'quản lý', 'hải quan', 'móng cái', 'cửa khẩu']
        }
    ];
}

// Ultra Stable Close Function
function closeAISearch() {
    // Prevent concurrent operations
    if (aiSearchState.isClosing || !aiSearchState.isOpen) {
        // Close operation already in progress
        return;
    }

    aiSearchState.isClosing = true;

    const modal = document.getElementById('aiSearchModal');

    // Remove show class immediately
    modal.classList.remove('show');
    aiSearchState.isOpen = false;

    // Clear content after animation
    setTimeout(() => {
        clearAISearchContent();
        aiSearchState.isClosing = false;
    }, 200);
}

// Clear search content
function clearAISearchContent() {
    const resultsContainer = document.getElementById('aiSearchResults');
    const loadingContainer = document.getElementById('aiSearchLoading');
    const noResultsContainer = document.getElementById('aiSearchNoResults');

    if (resultsContainer) resultsContainer.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'none';
    if (noResultsContainer) noResultsContainer.style.display = 'none';

    // Clear input
    const input = document.getElementById('aiSearchInput');
    if (input) input.value = '';
}

// Search suggestion click handler
function searchSuggestion(query) {
    document.getElementById('aiSearchInput').value = query;
    performAISearch();
}

// Main AI search function
async function performAISearch() {
    const query = document.getElementById('aiSearchInput').value.trim();
    if (!query) {
        alert('Vui lòng nhập từ khóa tìm kiếm!');
        return;
    }

    // Performing AI search

    // Show loading
    showAISearchLoading();

    // Add to search history
    addToSearchHistory(query);

    try {
        // Perform comprehensive search
        const results = await performComprehensiveSearch(query);

        // Display results
        displayAISearchResults(results, query);

    } catch (error) {
        console.error('❌ AI search error:', error);
        showAISearchError('Có lỗi xảy ra khi tìm kiếm: ' + error.message);
    }
}

// Perform comprehensive search across all sources
async function performComprehensiveSearch(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

    // Search terms

    // 1. Search database (dogs, users, journals)
    try {
        const dbResults = await searchDatabase(query);
        results.push(...dbResults);
    } catch (error) {
        console.warn('⚠️ Database search failed:', error);
    }

    // 2. Search static content
    const staticResults = searchStaticContent(query, searchTerms);
    results.push(...staticResults);

    // 3. Search current page content
    const pageResults = searchPageContent(query);
    results.push(...pageResults);

    // Sort results by relevance
    return sortSearchResults(results, query);
}

// Search database for relevant information
async function searchDatabase(query) {
    const results = [];

    try {
        // Search dogs
        const dogsResponse = await fetch('http://localhost:5000/api/dogs');
        if (dogsResponse.ok) {
            const dogs = await dogsResponse.json();
            dogs.forEach(dog => {
                if (matchesQuery(dog, query)) {
                    results.push({
                        type: 'dog',
                        icon: '🐶',
                        title: `Chó nghiệp vụ ${dog.name}`,
                        content: `Giống: ${dog.breed}, Huấn luyện viên: ${dog.trainer_id}, Trạng thái: ${dog.status}`,
                        relevance: calculateRelevance(dog, query),
                        action: () => showDogProfileForm(dog.name)
                    });
                }
            });
        }

        // Search journals
        const journalsResponse = await fetch('http://localhost:5000/api/journals');
        if (journalsResponse.ok) {
            const journals = await journalsResponse.json();
            journals.forEach(journal => {
                if (matchesQuery(journal, query)) {
                    results.push({
                        type: 'journal',
                        icon: '📝',
                        title: `Nhật ký ${journal.dog_name} - ${formatDateToDDMMYYYY(journal.date)}`,
                        content: `Huấn luyện viên: ${journal.trainer_name}, Trạng thái: ${journal.approval_status}`,
                        relevance: calculateRelevance(journal, query),
                        action: () => showJournalEditForm(journal.dog_name)
                    });
                }
            });
        }

    } catch (error) {
        console.warn('⚠️ Database search error:', error);
    }

    return results;
}

// Search static content
function searchStaticContent(query, searchTerms) {
    const results = [];

    // Search dogs
    aiSearchIndex.dogs.forEach(dog => {
        if (matchesQuery(dog, query)) {
            results.push({
                type: 'dog',
                icon: '🐶',
                title: `Chó nghiệp vụ ${dog.name}`,
                content: dog.content,
                relevance: calculateRelevance(dog, query),
                action: () => showDogProfileForm(dog.name)
            });
        }
    });

    // Search procedures
    aiSearchIndex.procedures.forEach(procedure => {
        if (matchesQuery(procedure, query)) {
            results.push({
                type: 'procedure',
                icon: '📋',
                title: procedure.title,
                content: procedure.content,
                relevance: calculateRelevance(procedure, query),
                action: () => showContent(procedure.title)
            });
        }
    });

    return results;
}

// Search current page content
function searchPageContent(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ');

    // Search sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    sidebarItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (searchTerms.some(term => text.includes(term))) {
            results.push({
                type: 'navigation',
                icon: '🧭',
                title: `Menu: ${item.innerText.trim()}`,
                content: `Tìm thấy trong menu điều hướng`,
                relevance: 0.7,
                action: () => item.click()
            });
        }
    });

    return results;
}

// Helper functions
function matchesQuery(obj, query) {
    const searchText = JSON.stringify(obj).toLowerCase();
    const queryLower = query.toLowerCase();

    if (searchText.includes(queryLower)) return true;

    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    return queryWords.some(word => searchText.includes(word));
}

function calculateRelevance(obj, query) {
    const searchText = JSON.stringify(obj).toLowerCase();
    const queryLower = query.toLowerCase();

    let score = 0;

    if (searchText.includes(queryLower)) score += 1.0;

    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    queryWords.forEach(word => {
        if (searchText.includes(word)) score += 0.3;
    });

    if (obj.title && obj.title.toLowerCase().includes(queryLower)) score += 0.5;

    return Math.min(score, 1.0);
}

function sortSearchResults(results, query) {
    return results.sort((a, b) => {
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;

        const typePriority = {
            'dog': 1, 'journal': 2, 'procedure': 3, 'user': 4,
            'content': 5, 'navigation': 6, 'file': 7
        };

        return (typePriority[a.type] || 99) - (typePriority[b.type] || 99);
    });
}

// Display and UI functions
function displayAISearchResults(results, query) {
    hideAISearchLoading();

    const resultsContainer = document.getElementById('aiSearchResults');
    const noResultsContainer = document.getElementById('aiSearchNoResults');

    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        noResultsContainer.style.display = 'block';
        noResultsContainer.innerHTML = `
            <div>Không tìm thấy kết quả nào cho "${query}"</div>
            <div style="margin-top: 10px; font-size: 14px; color: #999;">
                Thử các từ khóa khác hoặc kiểm tra chính tả
            </div>
        `;
        return;
    }

    noResultsContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    const topResults = results.slice(0, 10);

    resultsContainer.innerHTML = topResults.map(result => `
        <div class="ai-search-result-item" onclick="${result.action ? 'handleSearchResultClick(this)' : ''}" data-action="${result.action ? 'true' : 'false'}">
            <div class="ai-result-header">
                <span class="ai-result-icon">${result.icon}</span>
                <span class="ai-result-title">${highlightQuery(result.title, query)}</span>
                <span class="ai-result-type">${getTypeLabel(result.type)}</span>
            </div>
            <div class="ai-result-content">
                ${highlightQuery(result.content, query)}
            </div>
        </div>
    `).join('');

    window.currentSearchResults = topResults;
}

function handleSearchResultClick(element) {
    const index = Array.from(element.parentNode.children).indexOf(element);
    const result = window.currentSearchResults[index];

    if (result && result.action) {
        closeAISearch();
        setTimeout(() => result.action(), 300);
    }
}

function highlightQuery(text, query) {
    if (!query) return text;

    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let highlightedText = text;

    queryWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="ai-result-highlight">$1</span>');
    });

    return highlightedText;
}

function getTypeLabel(type) {
    const labels = {
        'dog': 'Chó', 'journal': 'Nhật ký', 'procedure': 'Quy trình',
        'user': 'Người dùng', 'content': 'Nội dung', 'navigation': 'Menu', 'file': 'Tệp'
    };
    return labels[type] || 'Khác';
}

function showAISearchLoading() {
    document.getElementById('aiSearchResults').style.display = 'none';
    document.getElementById('aiSearchNoResults').style.display = 'none';
    document.getElementById('aiSearchLoading').style.display = 'block';
}

function hideAISearchLoading() {
    document.getElementById('aiSearchLoading').style.display = 'none';
}

function showAISearchError(message) {
    hideAISearchLoading();
    document.getElementById('aiSearchResults').style.display = 'none';
    document.getElementById('aiSearchNoResults').style.display = 'block';
    document.getElementById('aiSearchNoResults').innerHTML = `<div>❌ ${message}</div>`;
}

// Search history management
function addToSearchHistory(query) {
    const timestamp = new Date().toISOString();
    const historyItem = { query, timestamp };

    aiSearchHistory = aiSearchHistory.filter(item => item.query !== query);
    aiSearchHistory.unshift(historyItem);
    aiSearchHistory = aiSearchHistory.slice(0, 20);

    // TODO: Save AI search history to database
    loadAISearchHistory();
}

function loadAISearchHistory() {
    const historyContainer = document.getElementById('aiSearchHistory');
    const historyList = document.getElementById('aiHistoryList');

    if (aiSearchHistory.length === 0) {
        historyContainer.style.display = 'none';
        return;
    }

    historyContainer.style.display = 'block';

    historyList.innerHTML = aiSearchHistory.slice(0, 10).map(item => {
        const timeAgo = getTimeAgo(item.timestamp);
        return `
            <div class="ai-history-item" onclick="searchSuggestion('${item.query}')">
                <span class="ai-history-query">${item.query}</span>
                <span class="ai-history-time">${timeAgo}</span>
            </div>
        `;
    }).join('');
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
}

// Ultra Stable Event Handlers
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && aiSearchState.isOpen) {
        closeAISearch();
    }
});

document.addEventListener('click', function (event) {
    const modal = document.getElementById('aiSearchModal');
    if (event.target === modal && aiSearchState.isOpen) {
        closeAISearch();
    }
});

document.addEventListener('click', function (event) {
    const modalContent = document.querySelector('.ai-search-content');
    if (modalContent && modalContent.contains(event.target)) {
        event.stopPropagation();
    }
});


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
    console.log('🏋️ addTrainingBlock called with data:', data);
    console.log('📊 Current counters - trainingSessionCounter:', trainingSessionCounter, 'operationSessionCounter:', operationSessionCounter);

    const container = document.getElementById('training-blocks-container');

    if (!container) {

        console.error("Error: 'training-blocks-container' not found in DOM.");

        return;

    }



    trainingSessionCounter++;

    const trainingNumber = trainingSessionCounter;

    // Adding training block

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



    // Initialize drug displays and manifestation checkboxes for all attempts

    for (let i = 1; i <= 3; i++) {

        if (data.drugDetection && data.drugDetection[i - 1] && data.drugDetection[i - 1].selectedDrugs) {

            const optionsList = document.getElementById('drugTypeOptions-' + currentBlockId + '-' + i);

            if (optionsList) {

                optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {

                    checkbox.checked = data.drugDetection[i - 1].selectedDrugs.includes(checkbox.dataset.drugValue);

                });

            }

        }

        // Initialize manifestation checkboxes
        if (data.drugDetection && data.drugDetection[i - 1] && data.drugDetection[i - 1].manifestation) {

            const manifestationContainer = document.querySelector('.detection-manifestation-' + i);

            if (manifestationContainer) {

                manifestationContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {

                    checkbox.checked = data.drugDetection[i - 1].manifestation.includes(checkbox.value);

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
    console.log('🚨 addOperationBlock called with data:', data);
    console.trace('Call stack for addOperationBlock:');

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

    // Initialize operation location display
    updateOperationLocationDisplay(currentBlockId);

    // Initialize content checkboxes and text inputs
    if (data) {
        // Initialize location text inputs
        const locationKhoInput = document.getElementById(`operationLocationKho-${currentBlockId}`);
        const locationOtherInput = document.getElementById(`operationLocationOther-${currentBlockId}`);
        if (locationKhoInput && data.locationKhoText) {
            locationKhoInput.value = data.locationKhoText;
        }
        if (locationOtherInput && data.locationOtherText) {
            locationOtherInput.value = data.locationOtherText;
        }

        // Initialize content checkboxes
        const checkGoodsCheckbox = document.getElementById(`checkGoods-${currentBlockId}`);
        const checkLuggageCheckbox = document.getElementById(`checkLuggage-${currentBlockId}`);
        const fieldTrainingCheckbox = document.getElementById(`fieldTraining-${currentBlockId}`);
        const patrolCheckbox = document.getElementById(`patrol-${currentBlockId}`);
        
        if (checkGoodsCheckbox) checkGoodsCheckbox.checked = data.checkGoods || false;
        if (checkLuggageCheckbox) checkLuggageCheckbox.checked = data.checkLuggage || false;
        if (fieldTrainingCheckbox) fieldTrainingCheckbox.checked = data.fieldTraining || false;
        if (patrolCheckbox) patrolCheckbox.checked = data.patrol || false;

        // Initialize other operation text inputs and checkboxes
        const otherOp1Checkbox = document.getElementById(`opKhacCheckbox1-${currentBlockId}`);
        const otherOp1Text = document.getElementById(`opKhacText1-${currentBlockId}`);
        const otherOp2Checkbox = document.getElementById(`opKhacCheckbox2-${currentBlockId}`);
        const otherOp2Text = document.getElementById(`opKhacText2-${currentBlockId}`);
        
        if (otherOp1Checkbox) otherOp1Checkbox.checked = data.otherOperation1Checked || false;
        if (otherOp1Text && data.otherOperation1) otherOp1Text.value = data.otherOperation1;
        if (otherOp2Checkbox) otherOp2Checkbox.checked = data.otherOperation2Checked || false;
        if (otherOp2Text && data.otherOperation2) otherOp2Text.value = data.otherOperation2;

        // Initialize other issues textarea
        const otherIssuesTextarea = document.getElementById(`operation_other_issues_${currentBlockId}`);
        if (otherIssuesTextarea && data.otherIssues) {
            otherIssuesTextarea.value = data.otherIssues;
        }

        // Update visibility of "other" inputs based on checkbox states
        if (data.otherOperation1Checked) {
            toggleOperationOtherInput(currentBlockId, 1);
        }
        if (data.otherOperation2Checked) {
            toggleOperationOtherInput(currentBlockId, 2);
        }
    }

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

    // Updating drug display



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

async function showPureA4JournalView(dogName, date, journalId = null) {
    console.log('🎯 showPureA4JournalView called for:', dogName, date, 'Journal ID:', journalId);

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


        }

    });



    const content = document.getElementById('content');

    const title = document.getElementById('title');



    // SỬA: FORCE thiết lập chế độ pure PDF view

    content.style.cssText = 'display: block !important; margin: 0 !important; padding: 0 !important; width: 100vw !important; max-width: none !important; height: 100vh !important; overflow-y: auto !important; background: #f5f5f5 !important; position: relative !important; z-index: 1 !important;';



    // Ẩn title web

    title.style.display = 'none';



    // SỬA: Load journal data from database

    const journalKey = 'journal_' + dogName + '_' + date;

    let journalData = null;
    try {
        if (journalId) {
            // Load specific journal by ID
            console.log('🔍 Loading specific journal by ID:', journalId);
            const response = await fetch(`/api/journals/${journalId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    journalData = convertDatabaseToFrontendFormat(data.data);
                    console.log('✅ Loaded specific journal:', journalData.generalInfo?.dogName, journalData.generalInfo?.date);
                }
            }
        } else {
            // Load best journal for dog+date (original behavior)
            console.log('🔍 Loading best journal for dog+date:', dogName, date);
            const response = await fetch(`/api/journals/by-dog-date/${encodeURIComponent(dogName)}/${date}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    journalData = convertDatabaseToFrontendFormat(data.data);
                    console.log('✅ Loaded best journal:', journalData.generalInfo?.dogName, journalData.generalInfo?.date);
                }
            }
        }
    } catch (error) {
        console.error('Failed to load journal from database:', error);
    }



    if (!journalData) {
        const errorMessage = journalId 
            ? `Không tìm thấy nhật ký với ID ${journalId}`
            : `Không có nhật ký cho CNV ${dogName} ngày ${date}`;
        
        content.innerHTML = '<div style="text-align: center; padding: 50px; background: white;"><h3>❌ KHÔNG TÌM THẤY NHẬT KÝ</h3><p>' + errorMessage + '</p></div>';
        return;
    }



    // SỬA: Hiển thị pure A4 PDF view hoàn chỉnh
    
    try {
        // Safe access to journal data with proper null checks
        const generalInfo = journalData.generalInfo || {};
        const approval = journalData.approval || {};
        const hlvSignature = approval.hlvSignature || {};
        const leaderSignature = approval.leaderSignature || {};
        const substituteSignature = approval.substituteSignature || {};
        const meals = journalData.meals || {};
        const health = journalData.health || {};
        const care = journalData.care || {};
        
        // Debug: Log journal data structure
        console.log('🔍 Journal data structure:', journalData);
        console.log('🔍 General info:', generalInfo);
        console.log('🔍 Approval:', approval);
        console.log('🔍 HLV Signature:', hlvSignature);
        
        // Simple fallback HTML if data is missing
        if (!generalInfo.dogName) {
            console.log('⚠️ No general info found, using fallback data');
            // Use provided parameters as fallback
            generalInfo.dogName = dogName || 'N/A';
            generalInfo.date = date || 'N/A';
            generalInfo.hlv = 'N/A';
        }

        // Render signature images asynchronously
        const hlvSignatureHTML = await renderSignatureImageForA4(hlvSignature, 'hlv');
        const leaderSignatureHTML = await renderSignatureImageForA4(leaderSignature, 'leader');
        const substituteSignatureHTML = substituteSignature.name ? await renderSignatureImageForA4(substituteSignature, 'substitute') : '';

        // Build HTML template safely using template literals
        const htmlTemplate = `
        <div class="a4-journal-view" style="background: white; max-width: 210mm; margin: 20px auto; padding: 20mm; font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.4; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm;">
            <div class="a4-header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">TỔNG CỤC HẢI QUAN</h1>
                <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">SỔ NHẬT KÝ HUẤN LUYỆN CHÓ NGHIỆP VỤ</h2>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <div><strong>CNV:</strong> ${generalInfo.dogName || 'N/A'}</div>
                    <div><strong>Ngày:</strong> ${formatDateToDDMMYYYY(generalInfo.date || '')}</div>
                </div>
                <div style="margin-top: 10px;"><strong>Huấn luyện viên:</strong> ${generalInfo.hlv || 'N/A'}</div>
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">I. HOẠT ĐỘNG HUẤN LUYỆN</h3>
                ${renderTrainingBlocks(journalData.trainingBlocks || [])}
                <div style="margin-top: 20px;">
                    <strong>Đánh giá chung của Huấn luyện viên:</strong><br>
                    <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; min-height: 60px;">
                        ${journalData.hlvComment || 'Chưa có đánh giá'}
                    </div>
                </div>
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">II. CHĂM SÓC & NUÔI DƯỠNG</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; width: 15%;"><strong>Bữa trưa:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.time || ''} - ${meals.lunch?.amount || ''}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn trưa:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.food || 'Chưa ghi'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Bữa chiều:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.time || ''} - ${meals.dinner?.amount || ''}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn chiều:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.food || 'Chưa ghi'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Chăm sóc:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${renderCareActivities(care)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Sức khỏe:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${health.status || 'Bình thường'}</td>
                    </tr>
                </table>
                ${health.other ? `<p><strong>Ghi chú sức khỏe:</strong> ${health.other}</p>` : ''}
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">III. HOẠT ĐỘNG TÁC NGHIỆP</h3>
                ${renderOperationBlocks(journalData.operationBlocks || [])}
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">IV. DUYỆT & KÝ</h3>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 150px;">
                        <strong>HUẤN LUYỆN VIÊN</strong><br><br>
                        ${hlvSignatureHTML}
                    </div>
                    <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 150px;">
                        <strong>LÃNH ĐẠO ĐƠN VỊ</strong><br><br>
                        ${leaderSignatureHTML}
                        ${leaderSignature.name && approval.leaderComment ? 
                            `<div style="margin-top: 10px; font-size: 12px; color: #666;">
                                <strong>Nhận xét:</strong> ${approval.leaderComment}
                            </div>` : ''
                        }
                    </div>
                </div>
                ${substituteSignature.name ? 
                    `<div style="width: 100%; text-align: center; border: 1px solid #000; padding: 20px; margin-top: 20px; min-height: 100px;">
                        <strong>HLV TRỰC THAY</strong><br><br>
                        ${substituteSignatureHTML}
                        ${substituteSignature.comment ? 
                            `<div style="margin-top: 10px; font-size: 12px; color: #666;">
                                <strong>Ý kiến:</strong> ${substituteSignature.comment}
                            </div>` : ''
                        }
                    </div>` : ''
                }
            </div>
            
            <div style="text-align: center; margin: 20px 0; background: white; padding: 20px;" class="no-print">
                <button onclick="window.print()" style="background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">🖨️ In nhật ký</button>
                <button onclick="returnToJournalList()" style="background: #2196F3; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">📋 Quay lại danh sách</button>
                <button onclick="window.close()" style="background: #f44336; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 0 10px;">❌ Đóng</button>
            </div>
        </div>`;

        content.innerHTML = htmlTemplate +
        '<style>@media print { .no-print { display: none !important; } body { margin: 0; padding: 0; } .a4-journal-view { max-width: none !important; margin: 0 !important; padding: 15mm !important; box-shadow: none !important; font-size: 12px !important; } } @media screen { .a4-journal-view { background: white; max-width: 210mm; margin: 20px auto; padding: 20mm; font-family: "Times New Roman", serif; font-size: 14px; line-height: 1.4; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm; } }</style>';


        console.log('✅ showPureA4JournalView completed successfully');
        
    } catch (error) {
        console.error('❌ Error in showPureA4JournalView:', error);
        content.innerHTML = '<div style="text-align: center; padding: 50px; background: white;"><h3>❌ LỖI HIỂN THỊ NHẬT KÝ</h3><p>Có lỗi xảy ra khi hiển thị nhật ký: ' + error.message + '</p><button onclick="returnToJournalList()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Quay lại</button></div>';
    }

}



// SỬA: Helper function để quay lại journal list

// SỬA: Helper function để quay lại journal list

function returnToJournalList() {




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


        showAllPendingJournalsForManager();

    } else {

        // Cho TRAINER/ADMIN quay về journal edit form

        showJournalEditForm(currentDogForJournal);

    }




}



// Helper function to render signature images for A4 view
async function renderSignatureImageForA4(signatureData, signatureType) {
    if (!signatureData || !signatureData.name) {
        return '<span style="color: red;">Chưa ký</span>';
    }

    try {
        // Try to get signature image from user data
        const userSignature = await getUserSignature(signatureData.name, signatureData.role || 'TRAINER');
        
        if (userSignature && userSignature.signatureImage) {
            // Check if signature image exists
            const imageExists = await checkSignatureImageExists(userSignature.signatureImage);
            
            if (imageExists) {
                return `
                    <div style="text-align: center; margin: 10px 0;">
                        <img src="${userSignature.signatureImage}" 
                             alt="Chữ ký ${signatureData.name}" 
                             style="max-width: 200px; max-height: 80px; border: 1px solid #ccc; 
                                    background: white; padding: 5px; display: block; margin: 0 auto;"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display: none; margin-top: 5px; padding: 10px; border: 2px solid #2196F3;
                                    background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;
                                    font-size: 18px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 5px;">
                            ✍️ ${signatureData.name}
                        </div>
                        <div style="margin-top: 5px; font-size: 12px; color: #666;">
                            <strong>${signatureData.name}</strong><br>
                            Ký ngày: ${formatDateToDDMMYYYY(signatureData.timestamp, true)}<br>
                            ${signatureData.id ? 'ID: ' + signatureData.id : ''}
                        </div>
                    </div>
                `;
            }
        }
        
        // Fallback to text signature
        return `
            <div style="text-align: center; margin: 10px 0;">
                <div style="margin-top: 5px; padding: 15px; border: 2px solid #2196F3;
                            background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;
                            font-size: 20px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ✍️ ${signatureData.name}
                </div>
                <div style="margin-top: 5px; font-size: 12px; color: #666;">
                    Ký ngày: ${formatDateToDDMMYYYY(signatureData.timestamp, true)}<br>
                    ${signatureData.id ? 'ID: ' + signatureData.id : ''}
                    ${signatureData.digitalSignature ? '<br>Chữ ký số: ' + signatureData.digitalSignature : ''}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering signature image:', error);
        return `
            <div style="text-align: center; margin: 10px 0;">
                <div style="margin-top: 5px; padding: 15px; border: 2px solid #2196F3;
                            background: linear-gradient(135deg, #f8f9ff, #e3f2fd); font-family: 'Dancing Script', cursive;
                            font-size: 20px; text-align: center; color: #1976d2; font-weight: bold; border-radius: 8px;">
                    ✍️ ${signatureData.name}
                </div>
                <div style="margin-top: 5px; font-size: 12px; color: #666;">
                    Ký ngày: ${formatDateToDDMMYYYY(signatureData.timestamp, true)}<br>
                    ${signatureData.id ? 'ID: ' + signatureData.id : ''}
                </div>
            </div>
        `;
    }
}

// Helper functions for rendering journal sections

function renderTrainingBlocks(blocks) {
    if (!blocks || blocks.length === 0) return '<p>Không có hoạt động huấn luyện.</p>';

    return blocks.map((block, index) => {
        const location = block.locationType === 'Khác' ? block.locationOther : (block.locationType || 'Sân tập');
        const timeRange = (block.fromTime || '08:00') + ' - ' + (block.toTime || '09:00');

        return `
            <div class="training-block-display" style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
                <p><strong>Ca ${index + 1}:</strong> ${timeRange}</p>
                <p><strong>Địa điểm:</strong> ${location}</p>
                <p><strong>Nội dung:</strong> ${renderTrainingContent(block)}</p>
                ${block.drugDetection && block.drugDetection.length > 0 ?
                '<p><strong>Phát hiện ma túy:</strong> ' + renderDrugDetection(block.drugDetection) + '</p>' : ''}
            </div>
        `;
    }).join('');
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

// Enhanced helper functions for better data display
function renderMealsData(meals) {
    if (!meals || (!meals.lunch && !meals.dinner)) {
        return '<p>Không có thông tin bữa ăn.</p>';
    }

    return `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="border: 1px solid #000; padding: 8px; width: 15%;"><strong>Bữa trưa:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.time || ''} - ${meals.lunch?.amount || ''}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn trưa:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.food || 'Chưa ghi'}${meals.lunch?.foodOther ? ' (' + meals.lunch.foodOther + ')' : ''}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Bữa chiều:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.time || ''} - ${meals.dinner?.amount || ''}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn chiều:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.food || 'Chưa ghi'}${meals.dinner?.foodOther ? ' (' + meals.dinner.foodOther + ')' : ''}</td>
            </tr>
        </table>
    `;
}

function renderHealthData(health) {
    if (!health) return '';

    let html = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="border: 1px solid #000; padding: 8px; width: 15%;"><strong>Sức khỏe:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${health.status || 'Tốt'}</td>
            </tr>
    `;

    if (health.weather) {
        html += `
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Thời tiết:</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">${health.weather}</td>
            </tr>
        `;
    }

    html += '</table>';

    if (health.other) {
        html += `<p><strong>Ghi chú sức khỏe:</strong> ${health.other}</p>`;
    }

    return html;
}

function renderApprovalData(approval) {
    if (!approval) return '<p>Chưa có thông tin duyệt.</p>';

    return `
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 120px;">
                <strong>HUẤN LUYỆN VIÊN</strong><br><br>
                ${approval.hlvSignature ?
            `<div style="text-align: left;">✓ <strong>${approval.hlvSignature.name}</strong><br>Ký ngày: ${formatDateToDDMMYYYY(approval.hlvSignature.timestamp, true)}<br>ID: ${approval.hlvSignature.id}</div>` :
            '<span style="color: red;">Chưa ký</span>'
        }
            </div>
            <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 120px;">
                <strong>LÃNH ĐẠO ĐƠN VỊ</strong><br><br>
                ${approval.leaderSignature ?
            `<div style="text-align: left;">✓ <strong>${approval.leaderSignature.name}</strong><br>Ký ngày: ${formatDateToDDMMYYYY(approval.leaderSignature.timestamp, true)}<br>Nhận xét: ${approval.leaderComment || 'Đã duyệt'}<br>Chữ ký số: ${approval.leaderSignature.digitalSignature}<br>ID: ${approval.leaderSignature.id}</div>` :
            '<span style="color: orange;">Chờ duyệt</span>'
        }
            </div>
        </div>
        ${approval.substituteSignature ?
            `<div style="width: 100%; text-align: center; border: 1px solid #000; padding: 20px; margin-top: 20px; min-height: 80px;">
                <strong>HLV TRỰC THAY</strong><br><br>
                <div style="text-align: left;">✓ <strong>${approval.substituteSignature.name}</strong><br>Ký ngày: ${formatDateToDDMMYYYY(approval.substituteSignature.timestamp, true)}<br>Ý kiến: ${approval.substituteSignature.comment}<br>ID: ${approval.substituteSignature.id}</div>
            </div>` : ''
        }
    `;
}



function renderOperationBlocks(blocks) {
    if (!blocks || blocks.length === 0) return '<p>Không có hoạt động tác nghiệp.</p>';

    return blocks.map((block, index) => {
        const timeRange = (block.fromTime || '08:00') + ' - ' + (block.toTime || '09:00');
        const locations = block.selectedLocations?.join(', ') || 'Chưa ghi';

        return `
            <div class="operation-block-display" style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
                <p><strong>Ca ${index + 1}:</strong> ${timeRange}</p>
                <p><strong>Địa điểm:</strong> ${locations}</p>
                <p><strong>Nội dung:</strong> ${renderOperationContent(block)}</p>
                ${block.otherIssues ? '<p><strong>Vấn đề khác:</strong> ' + block.otherIssues + '</p>' : ''}
            </div>
        `;
    }).join('');
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
    console.log('📖 loadJournalData called with:', { dogName, date, createNew });
    try {
        // Use the database manager
        const journalData = await window.journalDBManager.loadJournalData(dogName, date, createNew);

        if (journalData) {
            // Convert database format to frontend format for compatibility
            const frontendFormat = convertDatabaseToFrontendFormat(journalData);
            populateJournalForm(frontendFormat);
        } else {
            // No journal found, create new - REMOVED: Database manager already handles this
            // addTrainingBlock();
        }
    } catch (error) {
        console.error('Error loading journal data:', error);
        // Database failed, show error
        console.error('Failed to load journal from database');



        if (existingData && !createNew) {

            const data = JSON.parse(existingData);

            populateJournalForm(data);

        } else {
            // REMOVED: Database manager already handles training block creation
            // addTrainingBlock();
        }
    }
}

// Function to convert database journal format to frontend format (no localStorage)
function convertDatabaseToFrontendFormat(dbJournal) {

    // Try to parse detailed data from JSON fields first
    let trainingBlocks = [];
    let operationBlocks = [];
    let meals = {};
    let care = {};

    try {
        // Try to parse training_activities as JSON first
        if (dbJournal.training_activities) {
            const parsed = JSON.parse(dbJournal.training_activities);
            if (Array.isArray(parsed)) {
                trainingBlocks = parsed;
            } else {
                // Fallback to simple string parsing
                trainingBlocks = dbJournal.training_activities.split(';').map(activity => ({ content: activity.trim() }));
            }
        }
    } catch (e) {
        // Fallback to simple string parsing
        trainingBlocks = dbJournal.training_activities ?
            dbJournal.training_activities.split(';').map(activity => ({ content: activity.trim() })) : [];
    }

    try {
        // Try to parse operation_activities as JSON first
        if (dbJournal.operation_activities) {
            const parsed = JSON.parse(dbJournal.operation_activities);
            if (Array.isArray(parsed)) {
                operationBlocks = parsed;
            } else {
                // Fallback to simple string parsing
                operationBlocks = dbJournal.operation_activities.split(';').map(activity => ({ content: activity.trim() }));
            }
        }
    } catch (e) {
        // Fallback to simple string parsing
        operationBlocks = dbJournal.operation_activities ?
            dbJournal.operation_activities.split(';').map(activity => ({ content: activity.trim() })) : [];
    }

    try {
        // Try to parse care_activities as JSON
        if (dbJournal.care_activities) {
            const parsed = JSON.parse(dbJournal.care_activities);
            if (typeof parsed === 'object') {
                // Apply proper field mapping for care activities
                const activities = parsed.activities || {};
                care = {
                    morning: activities.morning || '',
                    afternoon: activities.afternoon || '',
                    evening: activities.evening || '',
                    bath: activities.careBath || false,
                    brush: activities.careBrush || false,
                    wipe: activities.careWipe || false
                };
                meals = parsed.meals || {};
            } else {
                care = convertCareActivitiesToFrontend(dbJournal.care_activities);
            }
        }
    } catch (e) {
        care = convertCareActivitiesToFrontend(dbJournal.care_activities);
    }

    // If meals wasn't extracted from care_activities, create default structure
    if (!meals || Object.keys(meals).length === 0) {
        meals = {
            lunch: {
                time: '11:00',
                amount: 'Ăn hết',
                food: [],
                otherFood: ''
            },
            dinner: {
                time: '17:00',
                amount: 'Ăn hết',
                food: [],
                otherFood: ''
            }
        };
    }

    const converted = {
        generalInfo: {
            dogName: dbJournal.dog_name || 'Unknown',
            date: dbJournal.journal_date || '',
            hlv: dbJournal.trainer_name || 'Unknown'
        },
        trainingBlocks: trainingBlocks,
        operationBlocks: operationBlocks,
        meals: meals,
        care: care,
        health: {
            status: dbJournal.health_status || 'Tốt',
            other: dbJournal.health_notes || '',
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
            approvedAt: dbJournal.approved_at || '',
            // Add signature data if available
            hlvSignature: parseSignatureData(dbJournal.hlv_signature, dbJournal.hlv_signature_timestamp),
            leaderSignature: parseSignatureData(dbJournal.leader_signature, dbJournal.leader_signature_timestamp),
            substituteSignature: parseSignatureData(dbJournal.substitute_signature, dbJournal.substitute_signature_timestamp)
        },
        lastModified: dbJournal.updated_at || dbJournal.created_at
    };

    return converted;
}

function parseSignatureData(signatureString, timestamp = null) {
    if (!signatureString) return null;

    try {
        const signatureData = JSON.parse(signatureString);
        // Add timestamp if provided and not already present
        if (timestamp && !signatureData.timestamp) {
            signatureData.timestamp = timestamp;
        }
        return signatureData;
    } catch (e) {
        console.warn('Error parsing signature data:', e);
        return null;
    }
}

// Function to convert frontend journal format to database format (no localStorage)
function convertFrontendToDatabaseFormat(frontendJournal) {
    const generalInfo = frontendJournal.generalInfo || {};

    // Find dog and trainer IDs (simplified - in real implementation, these would be passed as parameters)
    const dogName = generalInfo.dogName || '';
    const trainerName = generalInfo.hlv || '';

    // Convert training blocks to training activities
    const trainingBlocks = frontendJournal.trainingBlocks || [];
    const trainingActivities = trainingBlocks
        .filter(block => block.content)
        .map(block => block.content)
        .join('; ');

    // Convert operation blocks to operation activities
    const operationBlocks = frontendJournal.operationBlocks || [];
    const operationActivities = operationBlocks
        .filter(block => block.content)
        .map(block => block.content)
        .join('; ');

    // Convert care data
    const careData = frontendJournal.care || {};
    const careActivities = [];
    if (careData.morning) careActivities.push(`Sáng: ${careData.morning}`);
    if (careData.afternoon) careActivities.push(`Chiều: ${careData.afternoon}`);
    if (careData.evening) careActivities.push(`Tối: ${careData.evening}`);

    // Determine approval status
    const approval = frontendJournal.approval || {};
    let approvalStatus = 'PENDING';
    if (approval.leaderStatus && approval.leaderStatus.includes('Đã duyệt')) {
        approvalStatus = 'APPROVED';
    } else if (approval.leaderStatus && approval.leaderStatus.includes('Từ chối')) {
        approvalStatus = 'REJECTED';
    }

    // Preserve original IDs if they exist, otherwise use placeholders
    // In a real implementation, these would be resolved from the names
    return {
        dog_id: frontendJournal.dog_id || 1, // Use existing dog_id or placeholder
        trainer_id: frontendJournal.trainer_id || 1, // Use existing trainer_id or placeholder
        journal_date: generalInfo.date || '',
        training_activities: trainingActivities,
        care_activities: careActivities.join('; '),
        operation_activities: operationActivities,
        health_status: frontendJournal.health?.status || 'Tốt',
        behavior_notes: frontendJournal.hlvComment || '',
        weather_conditions: frontendJournal.health?.weather || '',
        challenges: frontendJournal.otherIssues || '',
        approval_status: approvalStatus,
        rejection_reason: approvalStatus === 'REJECTED' ? approval.leaderComment : null,
        // Add signature data
        hlv_signature: approval.hlvSignature ? JSON.stringify(approval.hlvSignature) : null,
        leader_signature: approval.leaderSignature ? JSON.stringify(approval.leaderSignature) : null,
        substitute_signature: approval.substituteSignature ? JSON.stringify(approval.substituteSignature) : null,
        hlv_signature_timestamp: approval.hlvSignature?.timestamp || null,
        leader_signature_timestamp: approval.leaderSignature?.timestamp || null,
        substitute_signature_timestamp: approval.substituteSignature?.timestamp || null
    };
}

// Function to convert care activities from database format to frontend format
function convertCareActivitiesToFrontend(careActivities) {
    const care = { 
        morning: '', 
        afternoon: '', 
        evening: '',
        bath: false,
        brush: false,
        wipe: false
    };

    if (careActivities) {
        try {
            // Try to parse as JSON first (new format)
            const parsed = JSON.parse(careActivities);
            if (typeof parsed === 'object' && parsed.activities) {
                return {
                    morning: parsed.activities.morning || '',
                    afternoon: parsed.activities.afternoon || '',
                    evening: parsed.activities.evening || '',
                    bath: parsed.activities.careBath || false,
                    brush: parsed.activities.careBrush || false,
                    wipe: parsed.activities.careWipe || false
                };
            }
        } catch (e) {
            // Fallback to old string format
        }
        
        // Old string format parsing
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

// Helper function to get journal data from database instead of localStorage
async function getJournalFromDatabase(journalKey) {
    try {
        // Parse journal key to get dog name, date, and optionally journal ID
        const keyParts = journalKey.replace('journal_', '').split('_');
        if (keyParts.length < 2) {
            console.error('Invalid journal key format:', journalKey);
            return null;
        }

        // Check if this is the new format with journal ID (4+ parts: dogName_date_id)
        if (keyParts.length >= 3) {
            const journalId = keyParts[keyParts.length - 1]; // Last part is journal ID
            console.log('🔍 Loading specific journal by ID:', journalId);
            
            // Load specific journal by ID
            const response = await fetch(`/api/journals/${journalId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    return convertDatabaseToFrontendFormat(data.data);
                }
            }
            console.warn('⚠️ Failed to load journal by ID, falling back to dog+date method');
        }

        // Fallback to old method (dog name + date)
        const dogName = keyParts[0];
        const date = keyParts.slice(1, -1).join('_'); // Exclude the last part (journal ID) if present

        // Get journal from database using the database manager
        const journalData = await window.journalDBManager.loadJournalData(dogName, date, false);

        if (journalData) {
            // Convert to frontend format
            return convertDatabaseToFrontendFormat(journalData);
        }

        return null;
    } catch (error) {
        console.error('Error getting journal from database:', error);
        return null;
    }
}

// Helper function to get pending journals from database
async function getPendingJournalsFromDatabase() {
    try {
        const response = await fetch('/api/journals/pending');
        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting pending journals from database:', error);
        return [];
    }
}

// Helper function to save pending journals to database
async function savePendingJournalsToDatabase(pendingJournals) {
    try {
        // Update journal status in database
        for (const journal of pendingJournals) {
            const response = await fetch(`/api/journals/${journal.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'PENDING_MANAGER_APPROVAL' })
            });
            if (!response.ok) {
                console.error('Failed to update journal status:', journal.id);
            }
        }
    } catch (error) {
        console.error('Error saving pending journals to database:', error);
    }
}

// Helper function to get trainer notifications from database
async function getTrainerNotificationsFromDatabase() {
    try {
        const response = await fetch('/api/notifications/trainer');
        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }
        console.warn('⚠️ Notification API not available, using empty array');
        return [];
    } catch (error) {
        console.warn('⚠️ Failed to get trainer notifications (non-blocking):', error.message);
        return [];
    }
}

// Helper function to save trainer notifications to database
async function saveTrainerNotificationsToDatabase(notifications) {
    try {
        const response = await fetch('/api/notifications/trainer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notifications })
        });
        if (!response.ok) {
            console.warn('⚠️ Failed to save trainer notifications (non-blocking)');
        }
    } catch (error) {
        console.warn('⚠️ Failed to save trainer notifications (non-blocking):', error.message);
    }
}

// Helper function to get users from database
async function getUsersFromDatabase() {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting users from database:', error);
        return [];
    }
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



    // Populate operation blocks - only if there are existing operation blocks in data
    console.log('🔍 Checking operation blocks:', data.operationBlocks);
    if (data.operationBlocks && data.operationBlocks.length > 0) {
        console.log('✅ Found existing operation blocks, populating them');
        data.operationBlocks.forEach(blockData => {
            addOperationBlock(blockData);
        });
    } else {
        console.log('❌ No operation blocks found, creating default "Ca 1"');
        addOperationBlock(); // Add default operation block "Ca 1"
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

            // SỬA: Ưu tiên currentUserName, không fallback về hlvInfo.name
            const signerName = currentUserName;

            // SỬA: Ưu tiên currentUserRole, không fallback về 'TRAINER'
            const signerRole = currentUserRole;



            // SỬA: Kiểm tra và cảnh báo nếu thông tin người dùng không đầy đủ
            if (!signerName || !signerRole) {
                console.error('❌ Missing user information for signature:', { signerName, signerRole, currentUserName, currentUserRole });
                alert('Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                return;
            }




            // Lấy chữ ký thực từ database chữ ký

            const signatureData = await getUserSignature(signerName, signerRole);




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






            // Update UI NGAY LẬP TỨC với chữ ký thực

            const signatureHTML = await generateSignatureHTML(signatureData, currentTime);




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

async function addJournalToPendingManagerApproval() {

    const dogName = document.getElementById('journal_dog_name').value;

    const date = document.getElementById('journal_date').value;

    const journalKey = 'journal_' + dogName + '_' + date;



    console.log('📝 Adding journal to pending manager approval:', journalKey);



    // SỬA: CẬP NHẬT JOURNAL STATUS (with database fallback)

    let journalData = {};

    try {
        // Try to get journal from database first
        const response = await fetch(`/api/journals/by-dog-date/${encodeURIComponent(dogName)}/${date}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                // Convert database format to frontend format
                journalData = convertDatabaseToFrontendFormat(data.data);
            }
        }
    } catch (error) {
        console.error('Failed to get journal from database:', error);
    }

    if (!journalData.approval) {

        journalData.approval = {};

    }



    // Set trạng thái chờ duyệt

    journalData.approval.status = 'PENDING_MANAGER_APPROVAL';

    journalData.approval.submittedAt = new Date().toISOString();

    journalData.approval.submittedBy = currentUserName;

    journalData.approval.requiresManagerApproval = true; // SỬA: THÊM FLAG ĐẶC BIỆT

    // Try to save to database using journal database manager
    try {
        // Get proper dog and trainer IDs
        const dogName = document.getElementById('journal_dog_name').value;
        const dogInfo = await window.journalDBManager.getDogByName(dogName);
        
        if (!dogInfo) {
            throw new Error(`Không tìm thấy chó "${dogName}" trong cơ sở dữ liệu`);
        }
        
        // Create journal data with proper IDs
        const journalData = {
            dog_id: dogInfo.id,
            trainer_id: dogInfo.trainer_id,
            journal_date: document.getElementById('journal_date').value,
            approval_status: 'PENDING_MANAGER_APPROVAL',
            // Add other required fields with empty values for now
            training_activities: '',
            care_activities: '',
            operation_activities: '',
            health_status: 'Tốt',
            behavior_notes: '',
            weather_conditions: '',
            challenges: '',
            next_goals: '',
            training_duration: 0,
            success_rate: 0
        };
        
        console.log('🔍 Sending journal data to API:', journalData);

        const response = await fetch('/api/journals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(journalData)
        });

        if (response.ok) {
            console.log('✅ Journal status updated in database');
        } else {
            const errorData = await response.json();
            console.error('❌ Failed to save journal to database:', errorData);
        }
    } catch (error) {
        console.warn('Failed to update journal in database:', error);
    }

    console.log('✅ Updated journal status to PENDING_MANAGER_APPROVAL');



    // SỬA: THÊM VÀO DANH SÁCH PENDING JOURNALS RIÊNG

    // TODO: Add to database pending list

    // Load pending journals from database
    let pendingJournals = await getPendingJournalsFromDatabase();

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



    // TODO: Save to database



    // SỬA: TẠO NOTIFICATION CHO MANAGER

    createManagerNotification(journalEntry);



    console.log('📊 Current pending journals for manager:', pendingJournals.length);

}



// SỬA: Function TẠO NOTIFICATION CHO MANAGER

function createManagerNotification(journalEntry) {

    // TODO: Get from database
    const notifications = [];



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



    // TODO: Save to database

    console.log('📢 Created manager notification:', notification.id);

}



// SỬA: Function đặt trạng thái nhật ký chờ Manager duyệt

async function setJournalPendingForManagerApproval() {

    const dogName = document.getElementById('journal_dog_name').value;

    const date = document.getElementById('journal_date').value;

    const journalKey = 'journal_' + dogName + '_' + date;



    // TODO: Get from database
    let journalData = {};



    if (!journalData.approval) {

        journalData.approval = {};

    }



    // Set trạng thái chờ duyệt

    journalData.approval.status = 'PENDING_MANAGER_APPROVAL';

    journalData.approval.submittedAt = new Date().toISOString();

    journalData.approval.submittedBy = currentUserName;

    // Try to save to database using journal database manager
    try {
        // Get proper dog and trainer IDs
        const dogName = document.getElementById('journal_dog_name').value;
        const dogInfo = await window.journalDBManager.getDogByName(dogName);
        
        if (!dogInfo) {
            throw new Error(`Không tìm thấy chó "${dogName}" trong cơ sở dữ liệu`);
        }
        
        // Create journal data with proper IDs
        const journalData = {
            dog_id: dogInfo.id,
            trainer_id: dogInfo.trainer_id,
            journal_date: document.getElementById('journal_date').value,
            approval_status: 'PENDING_MANAGER_APPROVAL',
            // Add other required fields with empty values for now
            training_activities: '',
            care_activities: '',
            operation_activities: '',
            health_status: 'Tốt',
            behavior_notes: '',
            weather_conditions: '',
            challenges: '',
            next_goals: '',
            training_duration: 0,
            success_rate: 0
        };
        
        const response = await fetch('/api/journals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(journalData)
        });
        if (response.ok) {
            console.log('✅ Journal status updated in database');
        } else {
            const errorData = await response.json();
            console.error('❌ Failed to save journal to database:', errorData);
        }
    } catch (error) {
        console.warn('Failed to update journal in database:', error);
    }

    console.log('✅ Set journal pending for manager approval:', journalKey);



    // Thêm vào danh sách journals chờ duyệt

    // TODO: Get from database
    const pendingJournals = [];

    const existingIndex = pendingJournals.findIndex(j => j.key === journalKey);



    if (existingIndex === -1) {

        pendingJournals.push({

            key: journalKey,

            dogName: dogName,

            date: date,

            trainer: currentUserName,

            submittedAt: new Date().toISOString()

        });

        // TODO: Save to database

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

            const signatureData = await getUserSignature(currentUserName, currentUserRole);

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

async function removeFromPendingApprovals() {

    const dogName = document.getElementById('journal_dog_name').value;

    const date = document.getElementById('journal_date').value;

    const journalKey = 'journal_' + dogName + '_' + date;



    // TODO: Get from database
    const pendingJournals = [];

    const filteredJournals = pendingJournals.filter(j => j.key !== journalKey);

    // Save pending journals to database
    await savePendingJournalsToDatabase(filteredJournals);

    console.log('✅ Removed journal from pending approvals');

}



// Function tạo chữ ký số - SỬA: Hỗ trợ Unicode (tiếng Việt)

function generateDigitalSignature(userName, role, timestamp) {

    // Validate input parameters
    if (!userName || typeof userName !== 'string') {
        console.warn('⚠️ Invalid userName provided to generateDigitalSignature:', userName);
        userName = 'UnknownUser';
    }

    if (!role || typeof role !== 'string') {
        console.warn('⚠️ Invalid role provided to generateDigitalSignature:', role);
        role = 'UNKNOWN';
    }

    if (!timestamp || typeof timestamp !== 'string') {
        console.warn('⚠️ Invalid timestamp provided to generateDigitalSignature:', timestamp);
        timestamp = new Date().toISOString();
    }

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

            const signatureData = await getUserSignature(substituteName, 'TRAINER');



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



    // Dashboard sync - now handled through database

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
        } else {
            // For new journals, store signature data temporarily in a global variable
            // This will be picked up when the journal is first saved
            if (!window.tempSignatureData) {
                window.tempSignatureData = {};
            }
            window.tempSignatureData[signatureType] = {
                signature: JSON.stringify(signatureData),
                timestamp: new Date().toISOString()
            };
            console.log('✅ Stored ' + signatureType + ' signature temporarily for new journal');
            console.log('🔍 Temp signature data after storing:', window.tempSignatureData);
        }

        // TODO: Save to database
        const dogName = document.getElementById('journal_dog_name').value;

        const date = document.getElementById('journal_date').value;

        const journalKey = 'journal_' + dogName + '_' + date;



        // TODO: Get from database
        let journalData = {};



        if (!journalData.approval) {

            journalData.approval = {};

        }



        journalData.approval[signatureType] = signatureData;

        // TODO: Save to database



        console.log('✅ Saved ' + signatureType + ' signature to database');

    } catch (error) {
        console.error('Error saving signature:', error);

        // Database save failed
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const journalKey = 'journal_' + dogName + '_' + date;

        // TODO: Get from database
        let journalData = {};

        if (!journalData.approval) {
            journalData.approval = {};
        }

        journalData.approval[signatureType] = signatureData;

        console.log('✅ Saved ' + signatureType + ' signature to database');
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

        // TODO: Save to database
        const dogName = document.getElementById('journal_dog_name').value;

        const date = document.getElementById('journal_date').value;

        const journalKey = 'journal_' + dogName + '_' + date;



        // TODO: Get from database
        let journalData = {};



        if (!journalData.approval) {

            journalData.approval = {};

        }



        Object.assign(journalData.approval, approvalData);

        // TODO: Save to database



        console.log('✅ Saved approval data to database');

    } catch (error) {
        console.error('Error saving approval data:', error);

        // Database save failed
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const journalKey = 'journal_' + dogName + '_' + date;

        // TODO: Get from database
        let journalData = {};

        if (!journalData.approval) {
            journalData.approval = {};
        }

        Object.assign(journalData.approval, approvalData);

        console.log('✅ Saved approval data to database');
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

        // TODO: Save to database/compatibility
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

        // TODO: Get existing data from database
        const existingData = null;

        if (existingData) {

            const existing = JSON.parse(existingData);

            if (existing.approval) {

                journalData.approval = existing.approval;

            }

        }



        // Check if journal has HLV signature for manager approval
        if (journalData.approval && journalData.approval.hlvSignature && !journalData.approval && journalData.approval.leaderSignature) {

            journalData.approval.status = 'PENDING_MANAGER_APPROVAL';

            console.log('✅ Journal has HLV signature, set for manager approval');

        }



        // TODO: Save to database



        // Notify dashboard about journal save
        notifyDashboardUpdate();



        console.log('✅ Journal saved successfully to database:', journalKey);

    } catch (error) {
        console.error('Error saving journal:', error);

        // Database save failed
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
        // TODO: Get existing data from database
        const existingData = null;
        if (existingData) {
            const existing = JSON.parse(existingData);
            if (existing.approval) {
                journalData.approval = existing.approval;
            }
        }

        notifyDashboardUpdate();

        alert('Không thể lưu nhật ký vào cơ sở dữ liệu. ' +
            'Vui lòng kiểm tra kết nối và thử lại.');

        console.log('❌ Failed to save journal to database:', journalKey);
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

        const selectedLocations = getSelectedCheckboxValues('operationLocationOptions-' + blockId, 'data-location-value');

        const blockData = {

            fromTime: document.getElementById('operationFromTime-' + blockId).value,

            toTime: document.getElementById('operationToTime-' + blockId).value,

            selectedLocations: selectedLocations,

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



// SỬA: Function viewOldJournals - CHUYỂN SANG DATABASE API

async function viewOldJournals() {

    // Load journals from database
    const dogJournals = [];

    try {
        console.log('🔍 Loading old journals for dog:', currentDogForJournal);

        // Get dog info first
        const dogInfo = await window.journalDBManager.getDogByName(currentDogForJournal);
        if (!dogInfo) {
            alert('Không tìm thấy thông tin chó: ' + currentDogForJournal);
            return;
        }

        // Get all journals for this dog
        const response = await fetch(`${window.journalDBManager.apiBaseUrl}/api/journals/by-dog/${dogInfo.id}`);
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                result.data.forEach(journal => {
                    dogJournals.push({
                        key: `journal_${currentDogForJournal}_${journal.journal_date}`,
                        date: journal.journal_date,
                        data: journal,
                        id: journal.id
                    });
                });
                console.log('✅ Loaded journals from database:', dogJournals.length);
            }
        } else {
            console.error('❌ Failed to load journals from database:', response.status);
        }
    } catch (error) {
        console.error('❌ Error loading journals from database:', error);
        alert('Lỗi khi tải nhật ký từ cơ sở dữ liệu: ' + error.message);
        return;
    }



    if (dogJournals.length === 0) {

        alert('Không có nhật ký cũ nào cho CNV ' + currentDogForJournal);

        return;

    }



    // Sắp xếp theo ngày giảm dần

    dogJournals.sort((a, b) => new Date(b.date) - new Date(a.date));



    // Tạo danh sách chọn ngày với thông tin chi tiết

    let dateOptions = '<option value="">Chọn ngày xem nhật ký</option>';

    dogJournals.forEach(journal => {
        const journalData = journal.data;
        
        // Lấy thông tin trainer
        const trainerName = journalData.trainer_name || 'Chưa xác định';
        
        // Lấy trạng thái duyệt
        let approvalStatus = 'Chưa duyệt';
        if (journalData.approval_status === 'APPROVED') {
            approvalStatus = '✅ Đã duyệt';
        } else if (journalData.approval_status === 'REJECTED') {
            approvalStatus = '❌ Bị từ chối';
        } else {
            approvalStatus = '⏳ Chờ duyệt';
        }
        
        // Lấy trạng thái sức khỏe
        const healthStatus = journalData.health_status || 'Không có thông tin';
        
        // Lấy số lượng hoạt động huấn luyện
        let trainingCount = 0;
        if (journalData.training_activities) {
            try {
                const trainingData = JSON.parse(journalData.training_activities);
                trainingCount = trainingData.length || 0;
            } catch (e) {
                trainingCount = 0;
            }
        }
        
        // Tạo text hiển thị với thông tin chi tiết
        const displayText = `${formatDateToDDMMYYYY(journal.date)} | ${trainerName} | ${approvalStatus} | Sức khỏe: ${healthStatus} | ${trainingCount} hoạt động`;
        
        dateOptions += `<option value="${journal.date}" title="${displayText}">${displayText}</option>`;
    });



    // Hiển thị modal chọn ngày để xem A4 PDF

    const modalHtml = '<div id="viewOldJournalModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;"><div style="background: white; padding: 30px; border-radius: 10px; max-width: 800px; width: 95%; max-height: 80vh; overflow-y: auto;"><h3 style="margin-top: 0; color: #333;">📋 XEM NHẬT KÝ CŨ - CNV ' + currentDogForJournal + '</h3><p style="color: #666; margin-bottom: 20px;">Tìm thấy <strong>' + dogJournals.length + '</strong> nhật ký. Chọn ngày để xem bản PDF A4:</p><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">📅 Chọn nhật ký:</label><select id="oldJournalDateSelect" style="width: 100%; padding: 12px; margin: 5px 0; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; background: white; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' + dateOptions + '</select></div><div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #007bff;"><h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">ℹ️ Thông tin hiển thị:</h4><ul style="margin: 0; padding-left: 20px; color: #666; font-size: 13px;"><li><strong>Ngày:</strong> Ngày của nhật ký</li><li><strong>Huấn luyện viên:</strong> Người phụ trách</li><li><strong>Trạng thái:</strong> Đã duyệt/Chờ duyệt/Bị từ chối</li><li><strong>Sức khỏe:</strong> Tình trạng sức khỏe của chó</li><li><strong>Hoạt động:</strong> Số lượng hoạt động huấn luyện</li></ul></div><div style="text-align: right; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;"><button onclick="closeOldJournalModal()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin-right: 10px; cursor: pointer; font-size: 14px; transition: background 0.3s;">Hủy</button><button onclick="viewSelectedOldJournal()" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.3s;">📄 Xem PDF A4</button></div></div></div>';



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

async function exportJournalToPDF(dogName, date) {
    try {
        console.log('📄 Starting PDF export for:', dogName, date);

        // Get current journal data from the form (not from database)
        const journalData = collectJournalFormData();
        if (!journalData) {
            throw new Error('Không có dữ liệu nhật ký để xuất');
        }

        console.log('✅ Collected form data for PDF export:', journalData);
        console.log('🔍 Journal data structure:', {
            generalInfo: journalData.generalInfo,
            trainingBlocks: journalData.trainingBlocks,
            operationBlocks: journalData.operationBlocks,
            meals: journalData.meals,
            care: journalData.care,
            health: journalData.health
        });

        // Use the same display format as showPureA4JournalView
        await generatePDFFromA4View(dogName, date, journalData);

    } catch (error) {
        console.error('❌ PDF Export Error:', error);
        alert('❌ Lỗi khi xuất PDF: ' + error.message + '\n\nSử dụng Ctrl+P để in thành PDF.');
    }
}

// Generate PDF from A4 view (same format as viewSelectedManagerPastJournal)
async function generatePDFFromA4View(dogName, date, journalData) {
    try {
        console.log('📄 Generating PDF from A4 view for:', dogName, date);

        // Safe access to journal data with proper null checks
        const generalInfo = journalData.generalInfo || {};
        const approval = journalData.approval || {};
        const hlvSignature = approval.hlvSignature || {};
        const leaderSignature = approval.leaderSignature || {};
        const substituteSignature = approval.substituteSignature || {};
        const meals = journalData.meals || {};
        const health = journalData.health || {};
        const care = journalData.care || {};

        // Simple fallback HTML if data is missing
        if (!generalInfo.dogName) {
            console.log('⚠️ No general info found, using fallback data');
            // Use provided parameters as fallback
            generalInfo.dogName = dogName || 'N/A';
            generalInfo.date = date || 'N/A';
            generalInfo.hlv = 'N/A';
        }

        // Render signature images asynchronously (only if signatures exist)
        const hlvSignatureHTML = hlvSignature.name ? await renderSignatureImageForA4(hlvSignature, 'hlv') : '<div style="min-height: 60px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #666;">Chưa ký</div>';
        const leaderSignatureHTML = leaderSignature.name ? await renderSignatureImageForA4(leaderSignature, 'leader') : '<div style="min-height: 60px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #666;">Chưa duyệt</div>';
        const substituteSignatureHTML = substituteSignature.name ? await renderSignatureImageForA4(substituteSignature, 'substitute') : '';

        // Build HTML template (same as showPureA4JournalView)
        const htmlTemplate = `
        <div class="a4-journal-view" style="background: white; max-width: 210mm; margin: 20px auto; padding: 20mm; font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.4; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 297mm;">
            <div class="a4-header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">TỔNG CỤC HẢI QUAN</h1>
                <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">SỔ NHẬT KÝ HUẤN LUYỆN CHÓ NGHIỆP VỤ</h2>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <div><strong>CNV:</strong> ${generalInfo.dogName || 'N/A'}</div>
                    <div><strong>Ngày:</strong> ${formatDateToDDMMYYYY(generalInfo.date || '')}</div>
                </div>
                <div style="margin-top: 10px;"><strong>Huấn luyện viên:</strong> ${generalInfo.hlv || 'N/A'}</div>
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">I. HOẠT ĐỘNG HUẤN LUYỆN</h3>
                ${renderTrainingBlocks(journalData.trainingBlocks || [])}
                <div style="margin-top: 20px;">
                    <strong>Đánh giá chung của Huấn luyện viên:</strong><br>
                    <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; min-height: 60px;">
                        ${journalData.hlvComment || 'Chưa có đánh giá'}
                    </div>
                </div>
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">II. CHĂM SÓC & NUÔI DƯỠNG</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; width: 15%;"><strong>Bữa trưa:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.time || ''} - ${meals.lunch?.amount || ''}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn trưa:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.lunch?.food || 'Chưa ghi'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Bữa chiều:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.time || ''} - ${meals.dinner?.amount || ''}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Thức ăn chiều:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${meals.dinner?.food || 'Chưa ghi'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Chăm sóc:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${renderCareActivities(care)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;"><strong>Sức khỏe:</strong></td>
                        <td style="border: 1px solid #000; padding: 8px;">${health.status || 'Bình thường'}</td>
                    </tr>
                </table>
                ${health.other ? `<p><strong>Ghi chú sức khỏe:</strong> ${health.other}</p>` : ''}
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">III. HOẠT ĐỘNG TÁC NGHIỆP</h3>
                ${renderOperationBlocks(journalData.operationBlocks || [])}
            </div>
            
            <div class="a4-section" style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">IV. DUYỆT & KÝ</h3>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 150px;">
                        <strong>HUẤN LUYỆN VIÊN</strong><br><br>
                        ${hlvSignatureHTML}
                    </div>
                    <div style="width: 45%; text-align: center; border: 1px solid #000; padding: 20px; min-height: 150px;">
                        <strong>LÃNH ĐẠO ĐƠN VỊ</strong><br><br>
                        ${leaderSignatureHTML}
                        ${leaderSignature.name && approval.leaderComment ? 
                            `<div style="margin-top: 10px; font-size: 12px; color: #666;">
                                <strong>Nhận xét:</strong> ${approval.leaderComment}
                            </div>` : ''
                        }
                    </div>
                </div>
                ${substituteSignature.name ? 
                    `<div style="width: 100%; text-align: center; border: 1px solid #000; padding: 20px; margin-top: 20px; min-height: 100px;">
                        <strong>HLV TRỰC THAY</strong><br><br>
                        ${substituteSignatureHTML}
                        ${substituteSignature.comment ? 
                            `<div style="margin-top: 10px; font-size: 12px; color: #666;">
                                <strong>Ý kiến:</strong> ${substituteSignature.comment}
                            </div>` : ''
                        }
                    </div>` : ''
                }
                
                <!-- Add note for form data (no signatures yet) -->
                ${!hlvSignature.name && !leaderSignature.name ? 
                    `<div style="width: 100%; text-align: center; margin-top: 20px; padding: 10px; background: #f8f9fa; border: 1px dashed #ccc; color: #666;">
                        <strong>📝 Ghi chú:</strong> Đây là bản nháp từ form. Chữ ký sẽ được thêm sau khi lưu và duyệt.
                    </div>` : ''
                }
            </div>
        </div>`;

        // Create a temporary container for PDF generation
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.innerHTML = htmlTemplate;
        document.body.appendChild(tempContainer);

        console.log('🔍 HTML Template generated:', htmlTemplate.substring(0, 500) + '...');
        console.log('🔍 Temp container content length:', tempContainer.innerHTML.length);

        // Add print styles
        const printStyles = `
            <style>
                @media print { 
                    .no-print { display: none !important; } 
                    body { margin: 0; padding: 0; } 
                    .a4-journal-view { 
                        max-width: none !important; 
                        margin: 0 !important; 
                        padding: 15mm !important; 
                        box-shadow: none !important; 
                        font-size: 12px !important; 
                    } 
                } 
                @media screen { 
                    .a4-journal-view { 
                        background: white; 
                        max-width: 210mm; 
                        margin: 20px auto; 
                        padding: 20mm; 
                        font-family: "Times New Roman", serif; 
                        font-size: 14px; 
                        line-height: 1.4; 
                        box-shadow: 0 0 20px rgba(0,0,0,0.1); 
                        min-height: 297mm; 
                    } 
                }
            </style>
        `;
        tempContainer.innerHTML += printStyles;

        // Wait a bit for images to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show preview option first
        const showPreview = confirm('📄 PDF đã sẵn sàng!\n\nBạn muốn:\n• OK: Xem trước PDF trong tab mới\n• Cancel: Tải PDF trực tiếp');
        
        if (showPreview) {
            // Show preview in new tab
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(`
                <html>
                    <head>
                        <title>Xem trước PDF - ${dogName} - ${date}</title>
                        ${printStyles}
                        <style>
                            body { margin: 0; padding: 20px; background: #f5f5f5; }
                            .preview-header { background: #2196F3; color: white; padding: 15px; margin: -20px -20px 20px -20px; text-align: center; }
                            .preview-actions { text-align: center; margin: 20px 0; }
                            .preview-actions button { margin: 0 10px; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
                            .btn-download { background: #4CAF50; color: white; }
                            .btn-print { background: #FF9800; color: white; }
                            .btn-close { background: #f44336; color: white; }
                        </style>
                    </head>
                    <body>
                        <div class="preview-header">
                            <h2>📄 Xem trước PDF - Nhật ký ${dogName} - ${date}</h2>
                        </div>
                        <div class="preview-actions">
                            <button class="btn-download" onclick="downloadPDF()">📥 Tải PDF</button>
                            <button class="btn-print" onclick="window.print()">🖨️ In PDF</button>
                            <button class="btn-close" onclick="window.close()">❌ Đóng</button>
                        </div>
                        ${htmlTemplate}
                        <script>
                            function downloadPDF() {
                                // Trigger download
                                window.print();
                            }
                        </script>
                    </body>
                </html>
            `);
            previewWindow.document.close();
            console.log('🔍 PDF preview opened in new tab');
            return; // Don't proceed with automatic download
        }

        // Generate PDF using html2pdf
        if (typeof html2pdf !== 'undefined') {
            console.log('✅ html2pdf library is available');
            const opt = {
                margin: 10,
                filename: `Nhat_ky_${dogName}_${date}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            console.log('🔍 Starting html2pdf generation...');
            await html2pdf().set(opt).from(tempContainer).save();
            console.log('✅ PDF generated successfully');
            
            // Show success message with more details
            alert(`✅ Đã xuất PDF thành công!\n\n📄 Tên file: Nhat_ky_${dogName}_${date}.pdf\n📁 Vị trí: Thư mục Downloads\n\nNếu không thấy file, hãy kiểm tra thư mục Downloads hoặc thanh thông báo trình duyệt.`);
            
            // Also try to open the PDF in a new tab for immediate viewing
            try {
                const pdfBlob = await html2pdf().set(opt).from(tempContainer).outputPdf('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
                console.log('🔍 PDF opened in new tab for immediate viewing');
            } catch (openError) {
                console.log('⚠️ Could not open PDF in new tab:', openError);
            }
        } else {
            console.log('⚠️ html2pdf library not available, using print fallback');
            // Fallback: open print dialog
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Nhật ký ${dogName} - ${date}</title>
                        ${printStyles}
                    </head>
                    <body>
                        ${htmlTemplate}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }

        // Clean up
        document.body.removeChild(tempContainer);

    } catch (error) {
        console.error('❌ Error generating PDF from A4 view:', error);
        throw error;
    }
}

// Basic PDF export using html2canvas as fallback
function exportBasicJournalToPDF(dogName, date) {
    try {
        const content = document.getElementById('content');
        if (!content) {
            throw new Error('Không tìm thấy nội dung để xuất');
        }

        // Hide buttons during PDF generation
        const buttons = content.querySelectorAll('button');
        buttons.forEach(btn => btn.style.display = 'none');

        html2canvas(content, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: content.scrollWidth,
            height: content.scrollHeight
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

            const fileName = `Nhat_ky_${dogName}_${date}.pdf`;
            pdf.save(fileName);

            // Restore buttons
            buttons.forEach(btn => btn.style.display = '');

            alert('✅ Đã xuất PDF thành công!');
        });

    } catch (error) {
        console.error('❌ Basic PDF Export Error:', error);
        alert('❌ Lỗi khi xuất PDF: ' + error.message + '\n\nSử dụng Ctrl+P để in thành PDF.');
    }
}

// Helper function to collect current journal form data
function collectJournalFormData() {
    try {
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const hlv = document.getElementById('journal_hlv').value;

        console.log('🔍 Form elements found:', {
            dogName: dogName,
            date: date,
            hlv: hlv,
            dogNameElement: document.getElementById('journal_dog_name'),
            dateElement: document.getElementById('journal_date'),
            hlvElement: document.getElementById('journal_hlv')
        });

        if (!dogName || !date) {
            console.log('⚠️ Missing required fields:', { dogName, date });
            return null;
        }

        const trainingBlocks = collectTrainingBlocksData();
        const operationBlocks = collectOperationBlocksData();
        const meals = collectMealsData();
        const care = collectCareData();
        const health = collectHealthData();

        console.log('🔍 Collected data:', {
            trainingBlocks,
            operationBlocks,
            meals,
            care,
            health
        });

        return {
            generalInfo: {
                dogName: dogName,
                date: date,
                hlv: hlv
            },
            trainingBlocks: trainingBlocks,
            operationBlocks: operationBlocks,
            meals: meals,
            care: care,
            health: health,
            hlvComment: document.getElementById('journal_hlv_comment').value,
            otherIssues: document.getElementById('journal_other_issues').value
        };
    } catch (error) {
        console.error('Error collecting journal form data:', error);
        return null;
    }
}



// Functions for viewing journal for approval (Manager mode) - SỬA: FIX MANAGER WORKFLOW

function viewJournalForApproval(journalKey) {

    console.log('👀 Manager viewing journal for approval:', journalKey);



    // SỬA: Chuyển sang PDF view để Manager có thể xem và duyệt

    showA4JournalViewFromKey(journalKey);

}



async function approveJournalAsManager(journalKey) {

    if (confirm('Bạn có chắc muốn duyệt nhật ký này?\n\nSau khi duyệt, nhật ký sẽ được đánh dấu hoàn thành và HLV sẽ nhận được thông báo.')) {

        try {

            // Get journal data from database instead of localStorage
            const journalData = await getJournalFromDatabase(journalKey);



            if (journalData) {

                const currentTime = new Date().toISOString();



                if (!journalData.approval) journalData.approval = {};



                // SỬA: THÊM CHỮ KÝ MANAGER VỚI CHỮ KÝ THỰC

                const signatureData = await getUserSignature(currentUserName, currentUserRole);



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



                // TODO: Save to database



                // SỬA: REMOVE TỪ PENDING APPROVALS

                // TODO: Get from database
                const pendingJournals = [];

                const filteredJournals = pendingJournals.filter(j => j.key !== journalKey);

                // Save pending journals to database
                await savePendingJournalsToDatabase(filteredJournals);



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

async function createTrainerNotification(journalData, action) {
    try {
        console.log('📢 Creating trainer notification for action:', action);
        
        // Load trainer notifications from database
        const trainerNotifications = await getTrainerNotificationsFromDatabase();

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

        // Save trainer notifications to database
        await saveTrainerNotificationsToDatabase(trainerNotifications);

        console.log('📢 Created trainer notification:', notification.id);
    } catch (error) {
        // Don't fail the approval process if notifications fail
        console.warn('⚠️ Failed to create trainer notification (non-blocking):', error.message);
        console.log('📢 Approval process will continue without notification');
    }
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



    // Check signature database - now using database
    // Signatures are stored in database, no need to check localStorage
    console.log('✅ Signature system now uses database storage');



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



// Script.js loaded successfully



// ===== TÓM TẮT CÁC SỬA ĐỔI CHÍNH =====





// ===== KIỂM TRA TÍNH NĂNG HOẠT ĐỘNG =====

async function checkSystemHealth() {

    const issues = [];



    // Kiểm tra signature database - now using database
    // Signatures are stored in database, no need to check localStorage
    console.log('✅ Signature system now uses database storage');



    // Kiểm tra users database

    // Load users from database
    const users = await getUsersFromDatabase();

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



// SỬA: Function riêng để update journal menu cho Manager

async function updateJournalSubMenuForManager() {

    const journalMenu = document.getElementById('journal-sub-menu');

    try {
        const response = await fetch('/api/journals');
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                result.data.forEach(journal => {
                    allJournals++;
                    const data = convertDatabaseToFrontendFormat(journal);

                    console.log('📄 Journal:', journal.id, {

                        hasHvlSignature: !!data.approval?.hvlSignature,

                        hasLeaderSignature: !!data.approval?.leaderSignature,

                        status: data.approval?.status

                    });



                    if (data.approval?.hvlSignature) {

                        signedJournals++;

                        if (!data.approval?.leaderSignature) {

                            pendingDetails.push({

                                key: `journal_${journal.dog_name}_${journal.journal_date}`,

                                dogName: data.generalInfo?.dogName,

                                date: data.generalInfo?.date,

                                trainer: data.generalInfo?.hlv

                            });

                        }

                    }

                    if (data.approval?.leaderSignature) {

                        approvedJournals++;

                    }

                });
            }
        }
    } catch (e) {
        console.error('Error loading journals from database:', e);
    }



    const pendingList = await getPendingJournalsFromDatabase();



    // Force refresh menu

    refreshDynamicMenus();

}



// SỬA: Function riêng để update journal menu cho Manager

async function updateJournalSubMenuForManager() {

    const journalMenu = document.getElementById('journal-sub-menu');

    if (!journalMenu) {

        console.error('❌ journal-sub-menu element not found');

        return;

    }



    console.log('🔧 Creating manager journal menu...');



    // Đếm số journal pending thực tế từ database

    let actualPendingCount = 0;

    try {
        const response = await fetch('/api/journals/pending');
        if (response.ok) {
            const pendingJournals = await response.json();
            actualPendingCount = pendingJournals.length;
        }
    } catch (e) {
        console.error('Error fetching pending journals from database:', e);
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

    `;



    console.log('✅ Manager journal menu created successfully');

}



// Script.js loaded successfully



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
            console.log('🔍 Starting approval process for journal:', journalKey);
            console.log('🔍 Current user info:', { name: currentUserName, role: currentUserRole });

            // Check if user info is available
            if (!currentUserName || !currentUserRole) {
                throw new Error('Thông tin người dùng không đầy đủ. Vui lòng đăng nhập lại.');
            }

            // Get journal data from database instead of localStorage
            const journalData = await getJournalFromDatabase(journalKey);
            console.log('🔍 Retrieved journal data:', journalData);



            if (journalData) {

                const currentTime = new Date().toISOString();



                if (!journalData.approval) journalData.approval = {};



                // SỬA: Lấy chữ ký thực của Manager
                console.log('🔍 Getting signature for user:', currentUserName, 'role:', currentUserRole);
                const signatureData = await getUserSignature(currentUserName, currentUserRole);
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

                    comment: managerComment, // SỬA: Lưu nhận xét vào chữ ký
                    
                    signatureImage: signatureData.signatureImage, // SỬA: Lưu đường dẫn chữ ký thực
                    
                    userId: signatureData.userId // SỬA: Lưu ID người dùng

                };



                // Save to database - get journal ID directly from journal key
                try {
                    // Extract journal ID directly from journal key (new format: journal_dogName_date_id)
                    const keyParts = journalKey.replace('journal_', '').split('_');
                    const journalId = keyParts[keyParts.length - 1]; // Last part is the journal ID
                    
                    console.log('🔍 Extracted journal ID from key:', journalId);
                    console.log('🔍 Journal key:', journalKey);
                    
                    // Use the proper approval API endpoint instead of full update
                    // Get current user ID from database
                    let approverId = 1; // Default fallback
                    try {
                        const userResponse = await fetch('/api/users');
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            if (userData.success) {
                                const currentUser = userData.data.find(u => u.name === currentUserName || u.username === currentUserName);
                                if (currentUser) {
                                    approverId = currentUser.id;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('Could not get current user ID, using fallback:', error);
                    }
                    
                    const approvalData = {
                        approver_id: approverId,
                        approved: true,
                        rejection_reason: null,
                        leader_signature: JSON.stringify(journalData.approval.leaderSignature),
                        leader_signature_timestamp: journalData.approval.leaderSignature.timestamp
                    };
                    
                    console.log('🔍 Sending approval data to API:', approvalData);
                    console.log('🔍 Signature data being sent:', {
                        leader_signature: approvalData.leader_signature,
                        leader_signature_timestamp: approvalData.leader_signature_timestamp
                    });

                    const response = await fetch(`/api/journals/${journalId}/approve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(approvalData)
                    });

                    if (response.ok) {
                        console.log('✅ Journal approval saved to database');
                    } else {
                        const errorData = await response.json();
                        console.error('❌ Failed to save journal approval to database:', errorData);
                    }
                } catch (error) {
                    console.warn('Failed to save journal approval to database:', error);
                }

                // Remove từ pending approvals
                // TODO: Update journal status in database to APPROVED



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
            console.error('❌ Error stack:', error.stack);

            alert('Có lỗi khi ký duyệt nhật ký: ' + error.message + '\n\nChi tiết lỗi: ' + error.stack);

        }
    }
}

// ===== PDF UPLOAD FUNCTIONALITY FOR CARE PLANS =====

let selectedCarePlanFile = null;

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.includes('pdf')) {
            alert('Vui lòng chọn file PDF hợp lệ');
            event.target.value = '';
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
            event.target.value = '';
            return;
        }
        
        selectedCarePlanFile = file;
        document.getElementById('uploadBtn').disabled = false;
        
        // Update UI to show selected file
        const dropzone = document.querySelector('.upload-dropzone');
        dropzone.innerHTML = `
            <div class="upload-icon">✅</div>
            <p><strong>${file.name}</strong></p>
            <small>Kích thước: ${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        `;
    }
}

// Upload care plan PDF
async function uploadCarePlan() {
    if (!selectedCarePlanFile) {
        alert('Vui lòng chọn file PDF trước khi upload');
        return;
    }
    
    const formData = new FormData();
    formData.append('care_plan', selectedCarePlanFile);
    
    const uploadBtn = document.getElementById('uploadBtn');
    const progressDiv = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    try {
        uploadBtn.disabled = true;
        uploadBtn.textContent = '⏳ Đang upload...';
        progressDiv.style.display = 'block';
        
        const response = await fetch('/api/upload-care-plan', {
            method: 'POST',
            headers: {
                'X-User-Role': currentUserRole
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Upload thành công!');
            // Reset UI
            resetUploadUI();
            // Reload the viewer
            loadCurrentCarePlan();
        } else {
            alert('❌ Upload thất bại: ' + result.error);
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Có lỗi khi upload: ' + error.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '📤 Upload PDF';
        progressDiv.style.display = 'none';
    }
}

// Reset upload UI
function resetUploadUI() {
    selectedCarePlanFile = null;
    document.getElementById('carePlanFile').value = '';
    document.getElementById('uploadBtn').disabled = true;
    
    const dropzone = document.querySelector('.upload-dropzone');
    dropzone.innerHTML = `
        <div class="upload-icon">📄</div>
        <p>Nhấp để chọn file PDF hoặc kéo thả vào đây</p>
        <small>Chỉ chấp nhận file PDF, tối đa 10MB</small>
    `;
}

// Load current care plan PDF and display it directly
async function loadCurrentCarePlan() {
    const viewerDiv = document.getElementById('carePlanViewer');
    
    try {
        viewerDiv.innerHTML = '<div class="loading">Đang tải tài liệu...</div>';
        
        const response = await fetch('/api/care-plans');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            // Get the most recent care plan (first in the list)
            const currentFile = result.data[0];
            
            viewerDiv.innerHTML = `
                <div class="care-plan-info">
                    <div class="file-details">
                        <div class="file-name">📄 ${currentFile.original_name || currentFile.filename}</div>
                        <div class="file-meta">
                            <span class="file-size">${(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span class="file-date">Cập nhật: ${new Date(currentFile.upload_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn-download" onclick="downloadCarePlan('${currentFile.filename}', '${currentFile.original_name || currentFile.filename}')" title="Tải về">
                                ⬇️ Tải về
                            </button>
                            ${currentUserRole === 'ADMIN' ? `
                                <button class="btn-delete" onclick="deleteCarePlan('${currentFile.filename}')" title="Xóa">
                                    🗑️ Xóa
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="pdf-viewer-container">
                    <iframe 
                        src="/care-plans/${currentFile.filename}" 
                        class="pdf-viewer"
                        title="Kế hoạch Chăm sóc và Huấn luyện"
                        style="width: 100%; height: 80vh; border: none; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
                    </iframe>
                </div>
            `;
        } else {
            viewerDiv.innerHTML = `
                <div class="no-files">
                    <div class="no-files-icon">📄</div>
                    <h4>Chưa có tài liệu</h4>
                    <p>Chưa có tài liệu PDF nào được upload. ${currentUserRole === 'ADMIN' ? 'Vui lòng upload tài liệu PDF về kế hoạch chăm sóc và huấn luyện.' : 'Liên hệ Admin để upload tài liệu.'}</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Load current care plan error:', error);
        viewerDiv.innerHTML = '<div class="error">❌ Có lỗi khi tải tài liệu</div>';
    }
}

// View PDF in new tab
function viewCarePlan(filename) {
    const url = `/care-plans/${filename}`;
    window.open(url, '_blank');
}

// Download PDF
function downloadCarePlan(filename, originalName = null) {
    const url = `/care-plans/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = originalName || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Delete PDF (Admin only)
async function deleteCarePlan(filename) {
    if (currentUserRole !== 'ADMIN') {
        alert('Chỉ Admin mới có quyền xóa tài liệu');
        return;
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/care-plans/${filename}`, {
            method: 'DELETE',
            headers: {
                'X-User-Role': currentUserRole
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadCurrentCarePlan(); // Reload the viewer
        } else {
            alert('❌ Xóa thất bại: ' + result.error);
        }
        
    } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Có lỗi khi xóa: ' + error.message);
    }
}
