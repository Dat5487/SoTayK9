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

// =============================================================================
// API INTEGRATION & AUTHENTICATION - THÊM VÀO ĐẦU SCRIPT.JS
// =============================================================================

// Global variables
let authToken = null; // Will be set from database session
let currentUser = {}; // Will be loaded from database
const API_BASE = 'http://localhost:5000';

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save auth info
            // Store auth token and user in memory (no localStorage)
            authToken = data.access_token;
            currentUser = data.user;

            // Show success message
            showNotification('Đăng nhập thành công!', 'success');

            // Reload page or update UI
            location.reload();
            return true;
        } else {
            showNotification(data.error || 'Đăng nhập thất bại', 'error');
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Lỗi kết nối server', 'error');
        return false;
    }
}

function logout() {
    // Clear auth info from memory (no localStorage)
    authToken = null;
    currentUser = {};
    location.reload();
}

function isLoggedIn() {
    return authToken && currentUser.id;
}

// =============================================================================
// API HELPER FUNCTIONS
// =============================================================================

async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// =============================================================================
// WORKFLOW FUNCTIONS
// =============================================================================

async function submitDiaryForApproval(diaryId) {
    try {
        const result = await apiCall(`/api/diary/${diaryId}/submit`, {
            method: 'POST'
        });

        if (result.success) {
            showNotification('Đã gửi nhật ký để duyệt', 'success');
            refreshDiaryList();
        } else {
            showNotification(result.error || 'Lỗi gửi duyệt', 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối', 'error');
    }
}

async function approveDiary(diaryId, reviewNotes = '') {
    try {
        const result = await apiCall(`/api/diary/${diaryId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ review_notes: reviewNotes })
        });

        if (result.success) {
            showNotification('Đã phê duyệt nhật ký', 'success');
            refreshDiaryList();
        } else {
            showNotification(result.error || 'Lỗi phê duyệt', 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối', 'error');
    }
}

// =============================================================================
// AI CHATBOT FUNCTIONS
// =============================================================================

async function sendChatMessage(message) {
    try {
        const result = await apiCall('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message })
        });

        if (result.success) {
            return result.response;
        } else {
            return 'Xin lỗi, tôi không thể trả lời lúc này.';
        }
    } catch (error) {
        return 'Lỗi kết nối với chatbot.';
    }
}

function toggleChatbot() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
        chatWidget.style.display = chatWidget.style.display === 'none' ? 'block' : 'none';
    }
}

// =============================================================================
// UI HELPER FUNCTIONS  
// =============================================================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function refreshDiaryList() {
    // Reload diary entries - implement based on your current UI
    location.reload();
}

// =============================================================================
// DASHBOARD FUNCTIONS
// =============================================================================

async function loadDashboardStats() {
    try {
        const result = await apiCall('/api/dashboard/stats');
        if (result.success) {
            updateDashboardUI(result.stats);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function updateDashboardUI(stats) {
    // Update dashboard numbers
    const elements = {
        'total-dogs': stats.total_dogs,
        'total-entries': stats.total_entries,
        'pending-approvals': stats.pending_approvals,
        'active-users': stats.active_users
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || 0;
        }
    });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Add login form if not exists
    addLoginFormIfNeeded();

    // Add chatbot widget if not exists  
    addChatbotWidget();
});

function addLoginFormIfNeeded() {
    if (!isLoggedIn() && !document.getElementById('loginForm')) {
        // Add simple login form (you can customize this)
        const loginHtml = `
            <div id="loginModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;">
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:30px;border-radius:10px;">
                    <h3>Đăng nhập hệ thống</h3>
                    <form id="loginForm" onsubmit="handleLogin(event)">
                        <div style="margin:10px 0;">
                            <label>Username:</label><br>
                            <input type="text" id="username" required style="width:200px;padding:5px;">
                        </div>
                        <div style="margin:10px 0;">
                            <label>Password:</label><br>
                            <input type="password" id="password" style="width:200px;padding:5px;">
                        </div>
                        <button type="submit" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:5px;">Đăng nhập</button>
                    </form>
                    <p style="font-size:12px;color:#666;margin-top:10px;">
                        Test accounts: admin, manager1, trainer1
                    </p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loginHtml);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const success = await login(username, password);
    if (success) {
        document.getElementById('loginModal').remove();
    }
}

function addChatbotWidget() {
    if (!document.getElementById('chatWidget')) {
        const chatHtml = `
            <div id="chatWidget" style="position:fixed;bottom:20px;right:20px;width:300px;height:400px;background:white;border:1px solid #ccc;border-radius:10px;display:none;z-index:9998;">
                <div style="background:#007bff;color:white;padding:10px;border-radius:10px 10px 0 0;">
                    <span>🤖 Trợ lý AI</span>
                    <button onclick="toggleChatbot()" style="float:right;background:none;border:none;color:white;">×</button>
                </div>
                <div id="chatMessages" style="height:300px;overflow-y:auto;padding:10px;"></div>
                <div style="padding:10px;border-top:1px solid #eee;">
                    <input type="text" id="chatInput" placeholder="Nhập câu hỏi..." style="width:70%;padding:5px;" onkeypress="if(event.key==='Enter')sendChat()">
                    <button onclick="sendChat()" style="width:25%;padding:5px;">Gửi</button>
                </div>
            </div>
            <button onclick="toggleChatbot()" style="position:fixed;bottom:20px;right:20px;background:#007bff;color:white;border:none;border-radius:50%;width:60px;height:60px;font-size:20px;z-index:9999;">💬</button>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHtml);
    }
}

async function sendChat() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    messages.innerHTML += `<div style="margin:5px 0;text-align:right;"><b>Bạn:</b> ${message}</div>`;
    input.value = '';

    // Get AI response
    const response = await sendChatMessage(message);
    messages.innerHTML += `<div style="margin:5px 0;"><b>AI:</b> ${response}</div>`;

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}



// Global variable to track the currently selected dog for the journal
let currentDogForJournal = '';

// Dummy data for Trainer (HLV) and Dogs (loaded from database)
const HLV_INFO_KEY = 'hvl_current_user_info';
let hlvInfo = {
    name: 'Trần Đức Kiên',
    id: 'HLV001',
    image: 'images/hlv_tran_duc_kien.jpg' // Your HLV image path
};

// Dog profiles data (loaded from database)
const DOG_PROFILES_KEY = 'dog_profiles_data';
let dogProfiles = {
    'CNV BI': { name: 'CNV BI', image: 'images/dog_bi.jpg' }, // Your dog image paths
    'CNV LU': { name: 'CNV LU', image: 'images/dog_lu.jpg' },
    'CNV RẾCH': { name: 'CNV RẾCH', image: 'images/dog_rech.jpg' },
    'CNV KY': { name: 'CNV KY', image: 'images/dog_ky.jpg' },
    'CNV REX': { name: 'CNV REX', image: 'images/dog_rex.jpg' },
};

// Define drug types, food types, health manifestations, operation locations
const DRUG_TYPES = ['Cần sa', 'Heroin', 'Cocain', 'MDMA', 'Methamfetamin', 'Khác'];
const HEALTH_MANIFESTATIONS = ['Cào', 'Sủa', 'Nắm', 'Ngồi', 'Khác'];
const FOOD_TYPES = ['Cơm', 'Thịt', 'Rau', 'Trứng', 'Sữa', 'Hạt', 'Khác'];
const OPERATION_LOCATIONS = ['CỬA KHẨU BẮC LUÂN I', 'BÃI KIỂM TRA HÀNG HÓA BẮC LUÂN II', 'CẢNG ICD THÀNH ĐẠT KM 3+4'];

let blockCounter = 0; // Counter for unique IDs for dynamic blocks and training/operation session numbering

// Function to hide all main content sections
function hideAllContentSections() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
}

// Function to show the login page
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Dummy authentication for demonstration
    if (username === 'admin' && password === 'admin') {
        // Removed: alert('Đăng nhập thành công!');
        showMainApp();
    } else {
        alert('Tên người dùng hoặc mật khẩu không đúng.');
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
function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showDefaultImage(); // Show default content after login
}

// Generic function to handle "Other" input visibility for checkboxes
function handleCheckboxOther(checkboxElement, otherInputElement) {
    if (checkboxElement && otherInputElement) {
        const toggleOtherInput = () => {
            if (checkboxElement.checked) {
                otherInputElement.classList.remove('hidden');
            } else {
                otherInputElement.classList.add('hidden');
                otherInputElement.value = ''; // Clear content when hidden
            }
        };
        checkboxElement.addEventListener('change', toggleOtherInput);
        toggleOtherInput(); // Call once on load to set initial state
    }
}

// Generic function to handle "Other" input visibility for single select dropdowns
function handleSingleSelectOther(selectElement, otherInputElement) {
    if (selectElement && otherInputElement) {
        const toggleOtherInput = () => {
            if (selectElement.value === 'Khác') {
                otherInputElement.classList.remove('hidden');
            } else {
                otherInputElement.classList.add('hidden');
                otherInputElement.value = ''; // Clear content when hidden
            }
        };
        selectElement.addEventListener('change', toggleOtherInput);
        toggleOtherInput(); // Call once on load to set initial state
    }
}

// Function to initialize visibility for "Other" inputs within a specific container (when blocks are added dynamically)
function initializeHiddenInputs(container = document) {
    // "Other" in Training Activity (text input for checkbox)
    container.querySelectorAll('.training-block .training-other-input').forEach(input => {
        const relatedCheckbox = input.closest('.field-group')?.querySelector('.training-checkbox[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });

    // Training Location "Other" (radio button)
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

    // "Other" in Operation Activity (text input for checkbox) - row 1
    container.querySelectorAll('.operation-activity-row-1 .operation-other-input-1').forEach(input => {
        const relatedCheckbox = input.closest('.operation-activity-row-1')?.querySelector('.operation-checkbox-1[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });

    // "Other" in Operation Activity (text input for checkbox) - row 2
    container.querySelectorAll('.operation-activity-row-2 .operation-other-input-2').forEach(input => {
        const relatedCheckbox = input.closest('.operation-activity-row-2')?.querySelector('.operation-checkbox-2[value="Khác"]');
        if (relatedCheckbox) {
            handleCheckboxOther(relatedCheckbox, input);
        }
    });
}

// NEW FUNCTION: To display a default image
function showDefaultImage() {
    hideAllContentSections(); // Hide other sections first
    document.getElementById('toggleReadButton').style.display = 'none'; // Hide speech button for image view

    const title = document.getElementById('title');
    const content = document.getElementById('content');

    title.innerText = 'PHẦN MỀM QUẢN LÝ, THEO DÕI CHÓ NGHIỆP VỤ'; // Set a default title for the image view
    content.style.display = 'flex'; // Use flexbox to center the image
    content.style.justifyContent = 'center';
    content.style.alignItems = 'center';
    content.style.height = 'calc(100vh - 100px)'; // Adjust height as needed
    content.innerHTML = `
        <img src="/static/images/my_welcome_image.jpg" alt="Chào mừng đến với Phần mềm quản lý, theo dõi chó nghiệp vụ" style="max-width: 100%; max-height: 100%; object-fit: fill;">
    `;
    // IMPORTANT: Replace "images/default_welcome_image.jpg" with the actual path to your desired image.
    // Make sure the image file exists in your project.
}

// Function to display main content
function showContent(type) {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';

    const content = document.getElementById('content');
    content.style.display = "block"; // Reset display to block for content
    content.style.justifyContent = 'flex-start'; // Reset flexbox properties
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto'; // Reset height

    const title = document.getElementById('title');

    // Hide submenus when navigating to other sections
    document.getElementById('dog-sub-menu').classList.remove('open');
    document.getElementById('journal-sub-menu').classList.remove('open');

    // Remove dynamic dog sub-items if any
    document.querySelectorAll('.sub-item-dynamic').forEach(el => el.remove());
    if (type === 'TỔNG QUAN') {
        title.innerText = 'TỔNG QUAN';
        content.innerHTML = `
            <p>Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm.</p>
            <p>Chó nghiệp vụ không chỉ là một phương tiện kỹ thuật đặc biệt mà còn là một lực lượng hỗ trợ trực tiếp cho cán bộ công chức Hải quan tại các cửa khẩu, sân bay, bến cảng, nơi có nguy cơ cao về buôn lậu và vận chuyển trái phép hàng hóa, ma túy. Việc huấn luyện, nuôi dưỡng, sử dụng hiệu quả chó nghiệp vụ đòi hỏi sự đầu tư bài bản, khoa học, và đội ngũ cán bộ huấn luyện viên chuyên trách có chuyên môn sâu và tâm huyết.</p>
            <p>Nhằm hệ thống hóa các quy định, quy trình, nghiệp vụ liên quan đến công tác quản lý, theo dõi chó nghiệp vụ trong ngành Hải quan, Hải quan cửa khẩu quốc tế Móng cái xây dựng phần mềm quản lý, theo dõi chó nghiệp vụ. Phần mềm này gồm các nội dung: Tổng quan; Hồ sơ quản lý chó nghiệp vụ; Quy trình chăm sóc; Quy trình sử dụng; Quy trình huấn luyện; Sổ nhật ký huấn luyện; Kế hoạch chăm sóc, huấn luyện, sử dụng và các video hướng dẫn.</p>
            <p>Phần mềm quản lý, theo dõi chó nghiệp vụ là tài liệu nghiệp vụ nội bộ, phục vụ cho cán bộ quản lýlý, huấn luyện viên và các đơn vị liên quan trong ngành Hải quan. Trong trường hợp các văn bản pháp lý có thay đổi, các nội dung trong sổ tay sẽ được cập nhật và điều chỉnh cho phù hợp.</p>
            <p>Hải quan cửa khẩu quốc tế Móng Cái mong muốn tiếp tục nhận được các ý kiến đóng góp từ các chuyên gia, cán bộ trong và ngoài ngành nhằm hoàn thiện hơn nữa hệ thống tài liệu phục vụ công tác này.</p>
            <p><strong>Xin trân trọng cảm ơn!</strong></p>
        `;
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
            <h3>Điều 12. Nguyên tắc chăm sóc, huấn luyện chó nghiệp vụ</h3>
            <p>1. Việc chăm sóc, huấn luyện CNV là công việc phải thực hiện hằng ngày. Huấn luyện viên chịu trách nhiệm hoàn toàn việc chăm sóc sức khỏe và huấn luyện CNV do mình quản lý.</p>
            <p>2. Huấn luyện thường xuyên, liên tục trong suốt quá trình sử dụng CNV.</p>
            <p>3. Coi trọng cả ba nội dung: huấn luyện thể lực - kỹ luật, huấn luyện củng cố và huấn luyện nâng cao năng lực.</p>
            <p>4. Huấn luyện sát thực tế địa bàn nơi công tác của huấn luyện viên và môi trường tác nghiệp của CNV.</p>
            <p>5. Quy định này không áp dụng đối với huấn luyện viên, CNV đang tập huấn tại các cơ sở sơ huấn luyện CNV.</p>
            <p>6. Mọi trường hợp CNV bị bệnh, suy giảm sức khỏe, hoặc bị chết bởi yếu tố chủ quan, thiếu trách nhiệm; CNV bị suy giảm năng lực tác nghiệp, hoặc không được huấn luyện và sử dụng theo quy định đều phải kiểm điểm, xem xét trách nhiệm huấn luyện viên, các đơn vị liên quan và đơn vị quản lý. Nếu có vi phạm các quy định do lỗi chủ quan thì bị bắt đưa, xem xét kỷ luật.</p>
            <h4>Điều 13. Quy trình công tác chăm sóc, huấn luyện chó nghiệp vụ hằng ngày của huấn luyện viên và nhân viên chăm nuôi, nhận giống</h4>
            <p>1. Nội dung công việc</p>
            <p>1.1. Huấn luyện viên, nhân viên chăm nuôi, nhân giống chịu trách nhiệm hoàn toàn và có nghĩa vụ chấp hành nghiêm chỉnh các quy định về công tác chăm sóc, nuôi dưỡng, huấn luyện, sử dụng chó nghiệp vụ từ khi tiếp nhận đến khi chó nghiệp vụ được thanh lý. Mọi trường hợp vi phạm các quy định do lỗi chủ quan đều bị kiểm điểm, xem xét kỷ luật, hồ sơ. Kết quả công tác chăm sóc, huấn luyện, sử dụng chó nghiệp vụ là tiêu chí quan trọng nhất để đánh giá kết quả công tác, xét khen thưởng, kỷ luật đối với huấn luyện viên.</p>
            <p>Huấn luyện viên và nhân viên chăm nuôi/nhân giống có trách nhiệm đảm bảo đủ khẩu phần ăn và nước uống sạch cho chó; đủ thuốc men chữa trị các bệnh thông thường. Vệ sinh chuồng trại và khu vực xung quanh, đảm bảo khô ráo, thoáng mát, sạch sẽ. Môi trường xung quanh phải đảm bảo vệ sinh. Đảm bảo chó nghiệp vụ luôn khỏe mạnh để huấn luyện, tác nghiệp hoặc nhân giống, cụ thể:</p>
            <p>a. Vệ sinh chuồng trại:</p>
            <p>Vệ sinh nền chuồng, tường, hàng rào bên trong chuồng chó nghiệp vụ;</p>
            <p>Kiểm tra, diệt ve, rận, ký sinh trùng trong chuồng (nếu có);</p>
            <p>Quét dọn, vệ sinh khu vực xung quanh chuồng chó;</p>
            <p>b. Dạo chơi, vận động chó:</p>
            <p>Dắt chó ra ngoài để vệ sinh;</p>
            <p>Cho chó vận động: đi bộ, chạy;</p>
            <p>c. Kiểm tra sức khỏe:</p>
            <p>Kiểm tra khả năng vận động của chó;</p>
            <p>Chải lông, kiểm tra da, lông, mắt, mũi, răng, miệng;</p>
            <p>Kịp thời phát hiện các dấu hiệu bệnh tật, suy giảm sức khỏe của chó.</p>
            <p>d. Quan sát:</p>
            <p>Quan sát và kiểm tra sức ăn.</p>
            <p>Vệ sinh máng ăn, nền chuồng và bổ sung nước sạch sau khi chó ăn xong.</p>
            <p>1.2. Huấn luyện viên phải nghiêm chỉnh chấp hành các quy định về công tác huấn luyện, sử dụng chó nghiệp vụ, bao gồm:</p>
            <p>Xây dựng kế hoạch huấn luyện: Nêu rõ nội dung huấn luyện thể lực, kỹ luật, nghiệp vụ; thời gian và địa điểm huấn luyện. Tổng thời gian huấn luyện hằng ngày không dưới 90 phút. Ghi rõ tiến độ, nội dung, kết quả và đề xuất kiến nghị.</p>
            <p>Xây dựng và thực hiện kế hoạch củng cố năng lực chó nghiệp vụ nếu chó không đạt yêu cầu kiểm tra.</p>
            <p>Thực hiện kế hoạch huấn luyện: Huấn luyện viên chủ động thực hiện kế hoạch, điều chỉnh phù hợp với thời tiết, sức khỏe chó và môi trường huấn luyện.</p>
            <p>Huấn luyện thường xuyên, củng cố và nâng cao năng lực chó nghiệp vụ. Yêu cầu chó nghiệp vụ phải duy trì thể lực và có sự tiến bộ về năng lực so với khi tốt nghiệp.</p>
            <p>Huấn luyện nâng cao trong môi trường tác nghiệp. Yêu cầu chó nghiệp vụ phải thích nghi với môi trường tác nghiệp, hưng phấn trong hoạt động, phát hiện được các mẫu ma túy được cất giấu, mùi vị ngụy trang, và nồng độ khuếch tán thấp.</p>
            <p>Huấn luyện phát hiện ma túy (củng cố và nâng cao): mỗi chó nghiệp vụ phải được huấn luyện tối thiểu 03 lần, mỗi lần tối thiểu 10 phút/buổi huấn luyện.</p>
            <p>Huấn luyện động tác cơ bản: thực hiện 02 vòng bài tập cơ bản và thể lực như: đi, đứng, nằm, ngồi, về vị trí, tha vật, v.v.</p>
            <p>Cập nhật đầy đủ và ghi chép vào Sổ nhật ký, sổ phản hồi. (có xác nhận của lãnh đạo phụ trách).</p>
            <p>Đối với chó nghiệp vụ không đạt yêu cầu huấn luyện, huấn luyện viên sẽ không được công nhận hoàn thành nhiệm vụ được giao.</p>
            <p>Khi sử dụng chó nghiệp vụ: Huấn luyện viên và chó nghiệp vụ phải có mặt đúng giờ, với đầy đủ trang thiết bị, sẵn sàng chấp hành lệnh của lãnh đạo tại hiện trường, và sử dụng chó nghiệp vụ theo đúng quy trình do Tổng cục ban hành.</p>
            <p>Chuẩn bị đầy đủ công cụ, trang bị huấn luyện: Mẫu huấn luyện; Trang thiết bị chuyên dùng: kìm huấn luyện, găng tay, dây dắt, rọ mõm, còi, áo giả; Các vật dụng khác tùy theo nội dung huấn luyện: vali, thùng carton, v.v.</p>
            <p>1.3. Huấn luyện viên phải xây dựng và thực hiện thời gian biểu làm việc hằng ngày, ghi chép nội dung, kết quả công việc và kiến nghị (nếu có) vào Sổ nhật ký:</p>
            <p>Nội dung công việc chăm sóc, nuôi dưỡng.</p>
            <p>Nội dung, phương pháp, thời gian, địa điểm huấn luyện thể lực và nghiệp vụ cho chó nghiệp vụ.</p>
            <p>Diễn biến và kết quả sử dụng CNV tác nghiệp.</p>
            <p>2. Thời gian biểu thực hiện:</p>
            <p>Vệ sinh chuồng trại: vào đầu giờ sáng trước khi làm việc và cuối buổi chiều khi kết thúc ngày làm việc,cụ thể: 07h00' - 07h20' và 16h45' - 17h00'.</p>
            <p>Cho chó dạo chơi, vận động và kiểm tra sức khỏe chó: 07h20' - 07h45'</p>
            <p>Chuẩn bị dụng cụ, trang bị huấn luyện: 07h45' - 08h00'; 13h45' - 14h00'</p>
            <p>Huấn luyện CNV: từ 08h00' đến 09h00'; 14h00' - 15h00'.</p>
            <p>Cho chó ăn: 10h30' - 11h00' và 16h30' - 17h00'.</p>
            <p>Nếu có động lực hoặc thời tiết bất thường không thể thực hiện các công việc theo đúng lịch trên thì huấn luyện viên báo cáo với lãnh đạo đơn vị điều chỉnh lịch cho phù hợp vào thời gian khác trong cùng ngày làm việc; nhưng vẫn phải đảm bảo đủ nội dung và thời lượng của từng công việc quy định.</p>
            <p>3. Đối với nhân viên chăm nuôi, nhân giống không thực hiện các nội dung liên quan đến công tác huấn luyện và sử dụng CNV.</p>
        `;
    }
    else if (type === 'QUY TRÌNH HUẤN LUYỆN') {
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
    } else {
        title.innerText = type;
        content.innerHTML = `<p>Đây là nội dung của mục "${type}". Bạn có thể cập nhật nội dung sau.</p>`;
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

// Function to display dog profile form
function showDogProfileForm(dogName) {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';

    const content = document.getElementById('content');
    content.style.display = "block"; // Reset display to block for content
    content.style.justifyContent = 'flex-start'; // Reset flexbox properties
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto'; // Reset height

    const title = document.getElementById('title');

    title.innerText = dogName;

    content.innerHTML = `
        <div class="dog-profile-header">
            <img id="dog_profile_image" src="images/default_dog.jpg" alt="Ảnh CNV" class="profile-dog-image">
            <h3>SƠ YẾU LÝ LỊCH</h3>
        </div>

        <p>1. Tên CNV: <input type="text" id="syll_name"></p>
        <p>2. Số hiệu: <input type="text" id="syll_sohieu"></p>
        <p>3. Ngày sinh: <input type="date" id="syll_ngaysinh"></p>
        <p>4. Nơi sinh: <input type="text" id="syll_noisinh"></p>
        <p>5. Giống CNV: <input type="text" id="syll_giong"></p>
        <p>6. Tính biệt: <input type="text" id="syll_tinhbiet"></p>
        <p>7. Đặc điểm ngoại hình: <input type="text" id="syll_dacdiem"></p>
        <p>8. Màu lông: <input type="text" id="syll_maulong"></p>
        <p>9. Số giá trị: <input type="text" id="syll_giatri"></p>

        <hr>

        <h3>DÒNG HỌ</h3>
        <p>1. Tên bố: <input type="text" id="dongho_ba"></p>
        <p>2. Ngày sinh: <input type="date" id="dongho_ngaysinh"></p>
        <p>3. Nơi sinh: <input type="text" id="dongho_noisinh"></p>
        <p>4. Giống: <input type="text" id="dongho_giong"></p>
        <p>5. Đặc điểm ngoại hình: <input type="text" id="dongho_dacdiem"></p>

        <hr>

        <div class="hlv-profile-header">
            <img id="hlv_profile_image" src="${hlvInfo.image || 'images/default_hvl.jpg'}" alt="Ảnh HLV" class="profile-hlv-image">
            <h3>HUẤN LUYỆN VIÊN QUẢN LÝ</h3>
        </div>
        <p>1. Họ và tên HLV: <input type="text" id="hlv_ten" value="${hlvInfo.name}"></p>
        <p>2. Ngày tháng năm sinh HLV: <input type="date" id="hlv_ngaysinh"></p>
        <p>3. Cấp bậc: <input type="text" id="hlv_capbac"></p>
        <p>4. Chức vụ: <input type="text" id="hlv_chucvu"></p>
        <p>5. Đơn vị: <input type="text" id="hlv_donvi"></p>
        <p>6. Qua trường đào tạo: <input type="text" id="hlv_daotao"></p>

        <hr>

        <button onclick="saveDogProfile('${dogName}')">Lưu hồ sơ</button>
    `;

    loadDogProfile(dogName);
}

// Function to save dog profile
function saveDogProfile(dogName) {
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
        hlv_daotao: document.getElementById('hlv_daotao').value,
    };

    // Save profile data to database (no localStorage)
}

// Function to load dog profile from database
async function loadDogProfile(dogName) {
    try {
        // Fetch dog data from database API
        const response = await fetch('/api/dogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const dogs = data.data || [];
            const dog = dogs.find(d => d.name === dogName);
            
            if (dog) {
                // Populate form fields with database data
                document.getElementById('syll_name').value = dog.name || '';
                document.getElementById('syll_sohieu').value = dog.chip_id || '';
                document.getElementById('syll_ngaysinh').value = dog.birth_date || '';
                document.getElementById('syll_noisinh').value = dog.birth_place || '';
                document.getElementById('syll_giong').value = dog.breed || '';
                document.getElementById('syll_tinhbiet').value = dog.gender || '';
                document.getElementById('syll_dacdiem').value = dog.features || '';
                document.getElementById('syll_maulong').value = dog.fur_color || '';
                document.getElementById('syll_giatri').value = dog.value || '';
                
                // Father information
                document.getElementById('dongho_ba').value = dog.father_name || '';
                document.getElementById('dongho_ngaysinh').value = dog.father_birth || '';
                document.getElementById('dongho_noisinh').value = dog.father_place || '';
                document.getElementById('dongho_giong').value = dog.father_breed || '';
                document.getElementById('dongho_dacdiem').value = dog.father_features || '';
                
                // Trainer information
                document.getElementById('hlv_ten').value = dog.hlv_ten || '';
                document.getElementById('hlv_ngaysinh').value = dog.hlv_ngaysinh || '';
                document.getElementById('hlv_capbac').value = dog.hlv_capbac || '';
                document.getElementById('hlv_chucvu').value = dog.hlv_chucvu || '';
                document.getElementById('hlv_donvi').value = dog.hlv_donvi || '';
                document.getElementById('hlv_daotao').value = dog.hlv_daotao || '';
                
                console.log('Dog profile loaded successfully:', dog);
            } else {
                console.warn(`Dog ${dogName} not found in database`);
            }
        } else {
            console.error('Failed to fetch dog data from database');
        }
    } catch (error) {
        console.error('Error loading dog profile:', error);
    }
}

// Function to perform search
function performSearch() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    const contentDiv = document.getElementById("content");
    const searchDiv = document.getElementById("searchResults");

    if (keyword === "") {
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
                const regex = new RegExp(`(${keyword})`, 'gi');
                const highlighted = el.innerHTML.replace(regex, '<mark>$1</mark>');
                resultHTML += `<p>${highlighted}</p>`;
                contentFound = true;
            }
        });

        if (contentFound) {
            contentDiv.style.display = 'none';
            searchDiv.style.display = 'block';

            searchDiv.innerHTML = `
                <h3>Kết quả tìm kiếm cho "${keyword}":</h3>
                <div class="search-results-content">${resultHTML}</div>
                <button onclick="backToMainContent()">Quay lại</button>
            `;
            found = true;
        }
    }

    if (!found) {
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
        // Function to find and set Vietnamese voice
        function findVietnameseVoice() {
            const voices = speechSynthesis.getVoices();
            
            // Try to find Vietnamese voices with different language codes
            let vietnameseVoice = voices.find(v => 
                v.lang === 'vi-VN' || 
                v.lang === 'vi' || 
                v.lang.startsWith('vi-') ||
                v.name.toLowerCase().includes('vietnamese') ||
                v.name.toLowerCase().includes('vietnam')
            );
            
            // If no Vietnamese voice found, try to find any Asian voice
            if (!vietnameseVoice) {
                vietnameseVoice = voices.find(v => 
                    v.lang.startsWith('zh-') || 
                    v.lang.startsWith('ja-') || 
                    v.lang.startsWith('ko-') ||
                    v.name.toLowerCase().includes('chinese') ||
                    v.name.toLowerCase().includes('japanese') ||
                    v.name.toLowerCase().includes('korean')
                );
            }
            
            return vietnameseVoice;
        }

        // Function to speak with voice selection
        function speakWithVoice() {
            currentUtterance = new SpeechSynthesisUtterance(contentText);
            
            // Set speech parameters for better Vietnamese pronunciation
            currentUtterance.rate = 0.9; // Slightly slower for better clarity
            currentUtterance.pitch = 1.0;
            currentUtterance.volume = 1.0;
            
            const vietnameseVoice = findVietnameseVoice();
            
            if (vietnameseVoice) {
                currentUtterance.voice = vietnameseVoice;
                console.log('Đang sử dụng giọng:', vietnameseVoice.name, 'Ngôn ngữ:', vietnameseVoice.lang);
            } else {
                console.warn("Không tìm thấy giọng tiếng Việt. Đang dùng giọng mặc định.");
                // Try to set language to Vietnamese even if voice is not Vietnamese
                currentUtterance.lang = 'vi-VN';
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

        // Check if voices are already loaded
        if (speechSynthesis.getVoices().length > 0) {
            speakWithVoice();
        } else {
            // Wait for voices to be loaded
            speechSynthesis.addEventListener('voiceschanged', function() {
                speakWithVoice();
                // Remove the event listener after first use
                speechSynthesis.removeEventListener('voiceschanged', arguments.callee);
            });
        }
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

    // Toggle journal submenu
    submenu.classList.toggle('open');
}

// Function to update the displayed selected food
function updateFoodDisplay(displayBoxId, optionsListId, otherFoodInputId) {
    const optionsList = document.getElementById(optionsListId);
    const displayBox = document.getElementById(displayBoxId); // This should now correctly target the separate display box
    const otherFoodInput = document.getElementById(otherFoodInputId);

    if (!optionsList || !displayBox || !otherFoodInput) {
        console.warn(`Missing elements for updateFoodDisplay: displayBoxId=${displayBoxId}, optionsListId=${optionsListId}, otherFoodInputId=${otherFoodInputId}`);
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
        otherFoodInput.value = ''; // Clear content when hidden
    }

    let displayText = selectedFoods.join(', ');
    if (hasOtherSelected && otherFoodInput.value.trim() !== '') {
        if (displayText !== '') {
            displayText += `, ${otherFoodInput.value.trim()}`;
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
}

// Function to update the displayed selected location for operation blocks (NEW LOGIC FOR CHECKBOXES)
function updateOperationLocationDisplay(blockId) {
    const optionsList = document.getElementById(`operationLocationOptions-${blockId}`);
    const displayBox = document.getElementById(`operationLocationDisplayBox-${blockId}`);
    const khoInput = document.getElementById(`operationLocationKho-${blockId}`);
    const otherInput = document.getElementById(`operationLocationOther-${blockId}`);

    if (!optionsList || !displayBox || !khoInput || !otherInput) {
        console.warn(`Missing elements for updateOperationLocationDisplay for block ${blockId}.`);
        return;
    }

    const selectedLocations = [];
    let isKhoNgoaiQuanSelected = false;
    let isKhacSelected = false;

    optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.dataset.locationValue === 'KHO NGOẠI QUAN') {
                isKhoNgoaiQuanSelected = true;
            } else if (checkbox.dataset.locationValue === 'Khac') {
                isKhacSelected = true;
            } else {
                selectedLocations.push(checkbox.dataset.locationValue);
            }
        }
    });

    // Toggle visibility of specific inputs
    if (isKhoNgoaiQuanSelected) {
        khoInput.classList.remove('hidden');
    } else {
        khoInput.classList.add('hidden');
        khoInput.value = ''; // Clear content when hidden
    }

    if (isKhacSelected) {
        otherInput.classList.remove('hidden');
    } else {
        otherInput.classList.add('hidden');
        otherInput.value = ''; // Clear content when hidden
    }

    // Construct the display text
    let displayTextParts = [];
    selectedLocations.forEach(loc => displayTextParts.push(loc));

    if (isKhoNgoaiQuanSelected) {
        displayTextParts.push(`KHO NGOẠI QUAN${khoInput.value.trim() !== '' ? ` (${khoInput.value.trim()})` : ''}`);
    }
    if (isKhacSelected) {
        displayTextParts.push(otherInput.value.trim() !== '' ? otherInput.value.trim() : 'Khác');
    }

    displayBox.innerText = displayTextParts.join(', ') || 'Chưa chọn';

    // Update the trigger text (optional, but good for consistency)
    const triggerTextElement = document.getElementById(`operationLocationTriggerText-${blockId}`);
    if (triggerTextElement) {
        triggerTextElement.innerText = displayTextParts.length > 0 ? displayTextParts.join(', ') : 'Chọn địa điểm';
    }
}

// NEW FUNCTION: Update drug type display for detection attempts
function updateDrugDisplay(blockId, attemptNumber) {

    const optionsList = document.getElementById(`drugTypeOptions-${blockId}-${attemptNumber}`);
    const displayBox = document.getElementById(`drugTypeDisplayBox-${blockId}-${attemptNumber}`);
    const otherInput = document.getElementById(`drugTypeOther-${blockId}-${attemptNumber}`);

    if (!optionsList || !displayBox || !otherInput) {
        console.warn(`Missing elements for updateDrugDisplay for block ${blockId}, attempt ${attemptNumber}.`);
        console.warn(`optionsList: ${optionsList}, displayBox: ${displayBox}, otherInput: ${otherInput}`);
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
        otherInput.value = ''; // Clear content when hidden
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
    const triggerTextElement = document.getElementById(`drugTypeTriggerText-${blockId}-${attemptNumber}`);
    if (triggerTextElement) {
        triggerTextElement.innerText = displayTextParts.length > 0 ? displayTextParts.join(', ') : 'Chọn loại ma túy';
    }
}

// Function to add a new training block with updated drug selection system
function addTrainingBlock(data = {}) {
    blockCounter++;
    const container = document.getElementById('training-blocks-container');
    if (!container) {
        console.error("Error: 'training-blocks-container' not found in DOM.");
        return;
    }
    const newBlock = document.createElement('div');
    newBlock.classList.add('training-block');
    newBlock.setAttribute('data-block-id', blockCounter);

    // Tạo drug options HTML trước
    const drugOptionsHtml = DRUG_TYPES.map(drug =>
        `<label><input type="checkbox" data-drug-value="${drug}"> ${drug}</label>`
    ).join('');

    newBlock.innerHTML = `
        <div class="training-first-row">
            <h3>Ca ${blockCounter}:</h3>
            <div class="field-group">
                <label for="trainingFromTime-${blockCounter}">Thời gian:</label>
                <input type="time" id="trainingFromTime-${blockCounter}" value="${data.fromTime || '08:00'}">
            </div>
            <div class="field-group">
                <label for="trainingToTime-${blockCounter}">Đến:</label>
                <input type="time" id="trainingToTime-${blockCounter}" value="${data.toTime || '09:00'}">
            </div>
            <div class="field-group">
                <label>Địa điểm:</label>
                <label><input type="radio" name="training-location-group-${blockCounter}" value="Sân tập" ${data.locationType === 'Sân tập' ? 'checked' : ''}> Sân tập</label>
                <label><input type="radio" name="training-location-group-${blockCounter}" value="Khác" data-location-type="khac" ${data.locationType === 'Khác' ? 'checked' : ''}> Khác</label>
                <input type="text" class="location-other-input hidden" id="trainingLocationOther-${blockCounter}" placeholder="Ghi địa điểm khác" value="${data.locationOther || ''}">
            </div>
        </div>

        <div class="training-second-row">
            <div class="field-group">
                <label>Nội dung:</label>
                <div class="training-content-checkboxes">
                    <label><input type="checkbox" class="training-checkbox" id="hlNangCaoCheckbox-${blockCounter}" value="HL nâng cao" ${data.advancedTraining ? 'checked' : ''}> HL nâng cao</label>
                    <label><input type="checkbox" class="training-checkbox" id="hlCoBanCheckbox-${blockCounter}" value="HL động tác cơ bản" ${data.basicTraining ? 'checked' : ''}> HL động tác cơ bản</label>
                    <label><input type="checkbox" class="training-checkbox" id="hlTheLucCheckbox-${blockCounter}" value="HL thể lực" ${data.physicalTraining ? 'checked' : ''}> HL thể lực</label>
                    <label><input type="checkbox" class="training-checkbox" id="hlKhacCheckbox-${blockCounter}" value="Khác" ${data.otherTraining ? 'checked' : ''}> Khác</label>
                    <input type="text" class="training-other-input hidden" id="hlKhacText-${blockCounter}" placeholder="Ghi nội dung khác" value="${data.otherTraining || ''}">
                </div>
            </div>
        </div>

        <div class="drug-detection-section">
            <h4>HL phát hiện nguồn hơi ma túy:</h4>
            ${[1, 2, 3].map(i => `
                <div class="drug-detection-row">
                    <label>Lần ${i}:</label>
                    <div class="custom-location-select-wrapper drug-select-wrapper-${blockCounter}-${i}">
                        <div class="custom-dropdown-trigger">
                            <span class="selected-text" id="drugTypeTriggerText-${blockCounter}-${i}">Chọn loại ma túy</span>
                            <span class="dropdown-arrow">▼</span>
                        </div>
                        <div class="custom-dropdown-options hidden" id="drugTypeOptions-${blockCounter}-${i}">
                            ${drugOptionsHtml}
                        </div>
                    </div>
                    <span class="location-selected-display-box" id="drugTypeDisplayBox-${blockCounter}-${i}">Chưa chọn</span>
                    <input type="text" class="location-other-input hidden" id="drugTypeOther-${blockCounter}-${i}" placeholder="Loại ma túy khác" value="${data.drugDetection && data.drugDetection[i - 1] ? (data.drugDetection[i - 1].drugTypeOther || '') : ''}">
                    
                    <label>Biểu hiện:</label>
                    <div class="detection-manifestation-checkboxes detection-manifestation-${i}">
                        ${HEALTH_MANIFESTATIONS.map(manifest => `
                            <label>
                                <input type="checkbox" data-manifestation-type="${manifest.toLowerCase().replace(/\s/g, '-')}" value="${manifest}" ${data.drugDetection && data.drugDetection[i - 1] && data.drugDetection[i - 1].manifestation?.includes(manifest) ? 'checked' : ''}> ${manifest}
                            </label>
                        `).join('')}
                    </div>
                    <input type="text" class="detection-manifestation-other-${i} hidden" id="manifestationOther-${blockCounter}-${i}" placeholder="Biểu hiện khác" value="${data.drugDetection && data.drugDetection[i - 1] ? (data.drugDetection[i - 1].manifestationOther || '') : ''}">
                </div>
            `).join('')}
        </div>
    `;
    container.appendChild(newBlock);

    // Initialize drug displays for all attempts
    for (let i = 1; i <= 3; i++) {
        if (data.drugDetection && data.drugDetection[i - 1] && data.drugDetection[i - 1].selectedDrugs) {
            // Load saved drug selections
            const optionsList = document.getElementById(`drugTypeOptions-${blockCounter}-${i}`);
            if (optionsList) {
                optionsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = data.drugDetection[i - 1].selectedDrugs.includes(checkbox.dataset.drugValue);
                });
            }
        }
        updateDrugDisplay(blockCounter, i);
    }

    initializeHiddenInputs(newBlock);
}

// Function to add a new operation block
function addOperationBlock(data = {}) {
    const container = document.getElementById('operation-blocks-container');
    if (!container) {
        console.error("Error: 'operation-blocks-container' not found in DOM.");
        return;
    }

    // Calculate the correct operation number based on existing blocks
    const existingBlocks = container.querySelectorAll('.operation-block').length;
    const operationNumber = existingBlocks + 1;

    // Use a unique ID for this block but display the correct number
    blockCounter++;
    const currentBlockId = blockCounter;

    const newBlock = document.createElement('div');
    newBlock.classList.add('operation-block');
    newBlock.setAttribute('data-block-id', currentBlockId);

    // Prepare options for location checkboxes
    const locationOptionsHtml = OPERATION_LOCATIONS.map(loc => `
        <label><input type="checkbox" data-location-value="${loc}" ${data.selectedLocations?.includes(loc) ? 'checked' : ''}> ${loc}</label>
    `).join('');

    newBlock.innerHTML = `
        <div class="operation-header-line" style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 10px;">
            <h3 style="margin: 0;">Ca ${operationNumber}</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
                <label for="operationFromTime-${currentBlockId}">Thời gian:</label>
                <input type="time" id="operationFromTime-${currentBlockId}" value="${data.fromTime || '09:00'}">
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>Đến:</span>
                <input type="time" id="operationToTime-${currentBlockId}" value="${data.toTime || '10:00'}">
            </div>
        </div>
        <div class="operation-location-line">
            <label>Địa điểm:</label>
            <div class="custom-location-select-wrapper">
                <div class="custom-dropdown-trigger">
                    <span class="selected-text" id="operationLocationTriggerText-${currentBlockId}">Chọn địa điểm</span>
                    <span class="dropdown-arrow">▼</span>
                </div>
                <div class="custom-dropdown-options hidden" id="operationLocationOptions-${currentBlockId}">
                    ${locationOptionsHtml}
                    <label><input type="checkbox" data-location-value="KHO NGOẠI QUAN" ${data.selectedLocations?.includes('KHO NGOẠI QUAN') ? 'checked' : ''}> KHO NGOẠI QUAN</label>
                    <label><input type="checkbox" data-location-value="Khac" ${data.selectedLocations?.includes('Khac') ? 'checked' : ''}> Khác</label>
                </div>
            </div>
            <span class="location-selected-display-box" id="operationLocationDisplayBox-${currentBlockId}">Chưa chọn</span>
            <input type="text" class="location-kho-input hidden" id="operationLocationKho-${currentBlockId}" placeholder="Ghi số Kho" value="${data.locationKhoText || ''}">
            <input type="text" class="location-other-input hidden" id="operationLocationOther-${currentBlockId}" placeholder="Ghi địa điểm khác" value="${data.locationOtherText || ''}">
        </div>

        <div class="operation-activity-row-1">
            <label>Nội dung:</label>
            <label><input type="checkbox" class="operation-checkbox-1" id="checkGoods-${currentBlockId}" value="Kiểm tra hàng hóa XNK" ${data.checkGoods ? 'checked' : ''}> Kiểm tra hàng hóa XNK</label>
            <label><input type="checkbox" class="operation-checkbox-1" id="checkLuggage-${currentBlockId}" value="Kiểm tra hành lý, phương tiện XNC" ${data.checkLuggage ? 'checked' : ''}> Kiểm tra hành lý, phương tiện XNC</label>
            <label><input type="checkbox" class="operation-checkbox-1" id="opKhacCheckbox1-${currentBlockId}" value="Khác" ${data.otherOperation1 ? 'checked' : ''}> Khác</label>
            <input type="text" class="operation-other-input-1 hidden" id="opKhacText1-${currentBlockId}" placeholder="Ghi nội dung khác" value="${data.otherOperation1 || ''}">
        </div>

        <div class="operation-activity-row-2">
            <label><input type="checkbox" class="operation-checkbox-2" id="fieldTraining-${currentBlockId}" value="HL nâng cao tại hiện trường" ${data.fieldTraining ? 'checked' : ''}> HL nâng cao tại hiện trường</label>
            <label><input type="checkbox" class="operation-checkbox-2" id="patrol-${currentBlockId}" value="Tuần tra kiểm soát" ${data.patrol ? 'checked' : ''}> Tuần tra kiểm soát</label>
            <label><input type="checkbox" class="operation-checkbox-2" id="opKhacCheckbox2-${currentBlockId}" value="Khác" ${data.otherOperation2 ? 'checked' : ''}> Khác</label>
            <input type="text" class="operation-other-input-2 hidden" id="opKhacText2-${currentBlockId}" placeholder="Ghi nội dung khác" value="${data.otherOperation2 || ''}">
        </div>

        <div class="textarea-block operation-issues-block">
            <label for="operation_other_issues_${currentBlockId}">Vấn đề khác:</label>
            <textarea id="operation_other_issues_${currentBlockId}" rows="3">${data.otherIssues || ''}</textarea>
        </div>
    `;
    container.appendChild(newBlock);
    // Initialize visibility and display for the new location section
    updateOperationLocationDisplay(currentBlockId);
}

// Function to update operation block numbers after removal
function updateOperationBlockNumbers() {
    document.querySelectorAll('#operation-blocks-container .operation-block').forEach((block, index) => {
        // Update the display number to be sequential starting from 1
        block.querySelector('h3').innerText = `Ca ${index + 1}`;
        // Also update the display for this block in case its number changed
        const blockId = block.getAttribute('data-block-id');
        updateOperationLocationDisplay(blockId);
    });
}

// Function to save journal data to database with updated drug selection
async function saveJournalData() {
    const journalDate = document.getElementById('journal_date').value;
    const dogName = document.getElementById('journal_dog_name').value;
    const hlvName = document.getElementById('journal_hlv').value;

    if (!journalDate || !dogName) {
        alert("Vui lòng nhập đầy đủ Ngày ghi và chọn Tên CNV.");
        return;
    }

    const trainingBlocksData = [];
    document.querySelectorAll('#training-blocks-container .training-block').forEach(block => {
        const blockId = block.getAttribute('data-block-id');
        const fromTime = document.getElementById(`trainingFromTime-${blockId}`).value;
        const toTime = document.getElementById(`trainingToTime-${blockId}`).value;
        const locationType = block.querySelector(`input[name="training-location-group-${blockId}"]:checked`)?.value || '';
        const locationOther = document.getElementById(`trainingLocationOther-${blockId}`)?.value || '';

        const advancedTraining = document.getElementById(`hlNangCaoCheckbox-${blockId}`)?.checked || false;
        const basicTraining = document.getElementById(`hlCoBanCheckbox-${blockId}`)?.checked || false;
        const physicalTraining = document.getElementById(`hlTheLucCheckbox-${blockId}`)?.checked || false;
        const otherTraining = document.getElementById(`hlKhacText-${blockId}`)?.value || '';

        const drugDetectionData = [];
        for (let i = 1; i <= 3; i++) {
            // Get selected drugs from checkboxes
            const drugOptionsContainer = document.getElementById(`drugTypeOptions-${blockId}-${i}`);
            const selectedDrugs = [];
            if (drugOptionsContainer) {
                drugOptionsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                    selectedDrugs.push(checkbox.dataset.drugValue);
                });
            }
            const drugTypeOther = document.getElementById(`drugTypeOther-${blockId}-${i}`)?.value || '';

            const manifestationCheckboxes = block.querySelectorAll(`.detection-manifestation-${i} input[type="checkbox"]:checked`);
            const manifestation = Array.from(manifestationCheckboxes).map(cb => cb.value);
            const manifestationOther = document.getElementById(`manifestationOther-${blockId}-${i}`)?.value || '';

            if (selectedDrugs.length > 0 || drugTypeOther || manifestation.length > 0 || manifestationOther) {
                drugDetectionData.push({
                    selectedDrugs: selectedDrugs,
                    drugTypeOther: drugTypeOther,
                    manifestation: manifestation,
                    manifestationOther: manifestationOther
                });
            }
        }

        trainingBlocksData.push({
            fromTime,
            toTime,
            locationType,
            locationOther,
            advancedTraining,
            basicTraining,
            physicalTraining,
            otherTraining,
            drugDetection: drugDetectionData
        });
    });

    const hlvComment = document.getElementById('journal_hlv_comment').value;

    const careData = {
        lunchTime: document.getElementById('lunchTime').value,
        lunchAmount: document.getElementById('lunchAmount').value,
        // Get selected food values from checkboxes
        lunchFood: Array.from(document.querySelectorAll('#lunchFoodOptions input[type="checkbox"]:checked')).map(cb => cb.dataset.foodValue),
        lunchFoodOther: document.getElementById('lunchFoodOther').value,

        dinnerTime: document.getElementById('dinnerTime').value,
        dinnerAmount: document.getElementById('dinnerAmount').value,
        // Get selected food values from checkboxes
        dinnerFood: Array.from(document.querySelectorAll('#dinnerFoodOptions input[type="checkbox"]:checked')).map(cb => cb.dataset.foodValue),
        dinnerFoodOther: document.getElementById('dinnerFoodOther').value,

        careBath: document.getElementById('care_bath').checked,
        careBrush: document.getElementById('care_brush').checked,
        careWipe: document.getElementById('care_wipe').checked,

        healthStatus: document.querySelector('input[name="health_status"]:checked')?.value || '',
        healthOtherText: document.getElementById('health_other_text').value,
        otherIssues: document.getElementById('journal_other_issues').value
    };

    const operationBlocksData = [];
    document.querySelectorAll('#operation-blocks-container .operation-block').forEach(block => {
        const blockId = block.getAttribute('data-block-id');
        const fromTime = document.getElementById(`operationFromTime-${blockId}`).value;
        const toTime = document.getElementById(`operationToTime-${blockId}`).value;

        // Get selected locations from checkboxes
        const selectedLocations = Array.from(document.querySelectorAll(`#operationLocationOptions-${blockId} input[type="checkbox"]:checked`))
            .map(cb => cb.dataset.locationValue);

        const locationKhoText = document.getElementById(`operationLocationKho-${blockId}`).value;
        const locationOtherText = document.getElementById(`operationLocationOther-${blockId}`).value;

        const checkGoods = document.getElementById(`checkGoods-${blockId}`).checked;
        const checkLuggage = document.getElementById(`checkLuggage-${blockId}`).checked;
        const otherOperation1 = document.getElementById(`opKhacText1-${blockId}`).value;
        const fieldTraining = document.getElementById(`fieldTraining-${blockId}`).checked;
        const patrol = document.getElementById(`patrol-${blockId}`).checked;
        const otherOperation2 = document.getElementById(`opKhacText2-${blockId}`).value;
        const otherIssues = document.getElementById(`operation_other_issues_${blockId}`).value;

        operationBlocksData.push({
            fromTime,
            toTime,
            selectedLocations, // Store array of selected locations
            locationKhoText,   // Store specific kho text
            locationOtherText, // Store specific other text
            checkGoods,
            checkLuggage,
            otherOperation1,
            fieldTraining,
            patrol,
            otherOperation2,
            otherIssues
        });
    });

    const approvalData = {
        leaderComment: document.getElementById('leader_comment').value,
        leaderStatus: document.querySelector('.leader-approval .approval-status').innerText,
        hvlNameDisplay: document.getElementById('hvl_name_display').innerText,
        submissionStatus: document.querySelector('.hvl-submission .submission-status').innerText,
        substituteHvlName: document.getElementById('substitute_hvl_name').value,
        substituteHvlComment: document.getElementById('substitute_hvl_comment').value,
        substituteHvlStatus: document.querySelector('.substitute-hvl-section .substitute-hvl-status').innerText
    };

    const journalData = {
        generalInfo: {
            date: journalDate,
            hlv: hlvName,
            dogName: dogName
        },
        training: {
            blocks: trainingBlocksData,
            hlvComment: hlvComment
        },
        care: careData,
        operations: operationBlocksData,
        approval: approvalData
    };

    // Save journal data to database
    try {
        await window.journalDBManager.saveJournalData();
        alert(`Nhật ký cho CNV ${dogName} ngày ${journalDate} đã được lưu thành công!`);
    } catch (error) {
        console.error('Error saving journal to database:', error);
        alert('Có lỗi xảy ra khi lưu nhật ký vào database');
    }
}

// Function to reset form fields to default state
function resetJournalFormFields() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('journal_date').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('journal_hlv').value = `${hlvInfo.name} (Số hiệu: ${hlvInfo.id})`;

    document.getElementById('training-blocks-container').innerHTML = '';
    document.getElementById('journal_hlv_comment').value = '';

    document.getElementById('lunchTime').value = '11:00';
    document.getElementById('lunchAmount').value = 'Ăn hết';
    document.querySelectorAll('#lunchFoodOptions input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('lunchFoodOther').value = '';
    // Call updateFoodDisplay for the separate display box
    updateFoodDisplay('lunchFoodDisplayBox', 'lunchFoodOptions', 'lunchFoodOther');
    // Also reset the trigger text
    document.getElementById('lunchFoodTriggerText').innerText = 'Chọn thức ăn';

    document.getElementById('dinnerTime').value = '17:00';
    document.getElementById('dinnerAmount').value = 'Ăn hết';
    document.querySelectorAll('#dinnerFoodOptions input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('dinnerFoodOther').value = '';
    // Call updateFoodDisplay for the separate display box
    updateFoodDisplay('dinnerFoodDisplayBox', 'dinnerFoodOptions', 'dinnerFoodOther');
    // Also reset the trigger text
    document.getElementById('dinnerFoodTriggerText').innerText = 'Chọn thức ăn';

    document.getElementById('care_bath').checked = false;
    document.getElementById('care_brush').checked = false;
    document.getElementById('care_wipe').checked = false;

    document.querySelector('input[name="health_status"][value="Tốt"]').checked = true;
    document.getElementById('health_other_text').value = '';
    document.getElementById('health_other_text').classList.add('hidden');
    document.getElementById('journal_other_issues').value = '';
    document.getElementById('journal_other_issues').classList.remove('highlight-issue');
    document.querySelector('.other-issues-label').classList.remove('highlight-issue');

    document.getElementById('operation-blocks-container').innerHTML = '';
    // Add default operation block "Ca 1"
    addOperationBlock();

    document.getElementById('leader_comment').value = '';
    document.querySelector('.leader-approval .approval-status').innerText = '[Chưa duyệt]';
    document.querySelector('.leader-approval .approval-status').classList.remove('approved');

    document.getElementById('hvl_name_display').innerText = hlvInfo.name;
    document.querySelector('.hvl-submission .submission-status').innerText = '(Chưa gửi duyệt)';
    document.querySelector('.hvl-submission .submission-status').classList.remove('approved');

    document.getElementById('substitute_hvl_name').value = '';
    document.getElementById('substitute_hvl_comment').value = '';
    document.querySelector('.substitute-hvl-section .substitute-hvl-status').innerText = '[Chưa ký]';
    document.querySelector('.substitute-hvl-section .substitute-hvl-status').classList.remove('signed');

    blockCounter = 0; // This should ideally be handled by a function that gets max ID + 1 from existing blocks
    // For now, it resets, which means new blocks will start from 1. This is fine if old blocks are cleared.
    disableJournalForm(false, 'leader');
    disableJournalForm(false, 'substitute');
}

// Function to display the journal edit form
function showJournalEditForm(dogName, date = null) {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'block';

    const content = document.getElementById('content');
    content.style.display = 'block'; // Reset display to block for content
    content.style.justifyContent = 'flex-start'; // Reset flexbox properties
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto'; // Reset height

    const title = document.getElementById('title');

    currentDogForJournal = dogName;
    title.innerText = `SỔ NHẬT KÝ HUẤN LUYỆN - CNV ${dogName}`;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;

    content.innerHTML = `
        <div class="journal-header-actions">
            <button class="btn-create-new-journal">Nhật ký mới +</button>
        </div>

        <div class="journal-section info-general">
            <h2>I. THÔNG TIN CHUNG</h2>
            <div class="info-general-grid">
                <div class="info-item-group journal-date-field">
                    <label for="journal_date">Ngày ghi:</label>
                    <input type="date" id="journal_date" value="${date || defaultDate}" required>
                </div>
                <div class="info-item-group">
                    <label for="journal_hlv">Huấn luyện viên:</label>
                    <input type="text" id="journal_hlv" value="${hlvInfo.name} (Số hiệu: ${hlvInfo.id})" readonly>
                </div>
                <div class="info-item-group">
                    <label for="journal_dog_name">Tên CNV:</label>
                    <input type="text" id="journal_dog_name" value="${dogName}" readonly>
                </div>
            </div>
        </div>

        <div class="journal-section training-activity">
            <h2>II. HOẠT ĐỘNG HUẤN LUYỆN</h2>
            <div id="training-blocks-container">
                <!-- Training blocks will be dynamically added here -->
            </div>
            <div class="training-activity-buttons">
                <button class="add-block add-training-block">Thêm Ca +</button>
                <button class="remove-block remove-training-block">Xóa Ca HL</button>
            </div>
            <div class="textarea-block">
                <label for="journal_hlv_comment">Đánh giá chung của Huấn luyện viên:</label>
                <textarea id="journal_hlv_comment" rows="4"></textarea>
            </div>
        </div>

        <div class="journal-section care-block">
            <h2>III. CHĂM SÓC & NUÔI DƯỠNG</h2>
            <div class="meal-row">
                <div class="meal-part">
                    <div class="meal-header-time">
                        <h3>Bữa trưa:</h3>
                        <label for="lunchTime">Thời gian:</label>
                        <input type="time" id="lunchTime" value="11:00">
                    </div>
                    <div class="meal-food-details-row">
                        <div class="meal-item">
                            <label for="lunchAmount">Sức ăn:</label>
                            <select id="lunchAmount" class="appetite-select">
                                <option value="Ăn hết">Ăn hết</option>
                                <option value="Ăn ít">Ăn ít</option>
                                <option value="Không ăn">Không ăn</option>
                            </select>
                        </div>
                        <div class="meal-item food-selection-group">
                            <label>Thức ăn:</label>
                            <div class="custom-food-select-wrapper">
                                <div class="custom-dropdown-trigger">
                                    <span class="selected-text" id="lunchFoodTriggerText">Chọn thức ăn</span>
                                    <span class="dropdown-arrow">▼</span>
                                </div>
                                <div class="custom-dropdown-options hidden" id="lunchFoodOptions">
                                    ${FOOD_TYPES.map(food => `<label><input type="checkbox" data-food-value="${food}"> ${food}</label>`).join('')}
                                </div>
                            </div>
                            <span class="food-selected-display-box" id="lunchFoodDisplayBox">Chưa chọn</span>
                            <input type="text" id="lunchFoodOther" class="hidden" placeholder="Thức ăn khác">
                        </div>
                    </div>
                </div>
                <div class="meal-part">
                    <div class="meal-header-time">
                        <h3>Bữa chiều:</h3>
                        <label for="dinnerTime">Thời gian:</label>
                        <input type="time" id="dinnerTime" value="17:00">
                    </div>
                    <div class="meal-food-details-row">
                        <div class="meal-item">
                            <label for="dinnerAmount">Sức ăn:</label>
                            <select id="dinnerAmount" class="appetite-select">
                                <option value="Ăn hết">Ăn hết</option>
                                <option value="Ăn ít">Ăn ít</option>
                                <option value="Không ăn">Không ăn</option>
                            </select>
                        </div>
                        <div class="meal-item food-selection-group">
                            <label>Thức ăn:</label>
                            <div class="custom-food-select-wrapper">
                                <div class="custom-dropdown-trigger">
                                    <span class="selected-text" id="dinnerFoodTriggerText">Chọn thức ăn</span>
                                    <span class="dropdown-arrow">▼</span>
                                </div>
                                <div class="custom-dropdown-options hidden" id="dinnerFoodOptions">
                                    ${FOOD_TYPES.map(food => `<label><input type="checkbox" data-food-value="${food}"> ${food}</label>`).join('')}
                                </div>
                            </div>
                            <span class="food-selected-display-box" id="dinnerFoodDisplayBox">Chưa chọn</span>
                            <input type="text" id="dinnerFoodOther" class="hidden" placeholder="Thức ăn khác">
                        </div>
                    </div>
                </div>
            </div>
            <div class="care-checks">
                <label><input type="checkbox" id="care_bath"> Tắm rửa</label>
                <label><input type="checkbox" id="care_brush"> Chải lông</label>
                <label><input type="checkbox" id="care_wipe"> Lau lông</label>
            </div>
            <div class="health-status">
                <label><input type="radio" name="health_status" value="Tốt" checked> Tốt</label>
                <label><input type="radio" name="health_status" value="Khá" data-health-type="abnormal"> Khá</label>
                <label><input type="radio" name="health_status" value="Trung bình" data-health-type="sick"> Trung bình</label>
                <label><input type="radio" name="health_status" value="Kém" data-health-type="sick"> Kém</label>
                <input type="text" id="health_other_text" class="health-other-input hidden" placeholder="Ghi rõ tình trạng">
            </div>
            <div class="textarea-block">
                <label for="journal_other_issues" class="other-issues-label">Vấn đề khác (nếu có):</label>
                <textarea id="journal_other_issues" rows="3"></textarea>
            </div>
        </div>

        <div class="journal-section operation-activity">
            <h2>IV. HOẠT ĐỘNG TÁC NGHIỆP</h2>
            <div id="operation-blocks-container">
                <!-- Operation blocks will be dynamically added here -->
            </div>
            <div class="operation-activity-buttons">
                <button class="add-block add-operation-block">Thêm Ca Tác Nghiệp</button>
                <button class="remove-block remove-operation-block">Xóa Ca Tác Nghiệp</button>
            </div>
        </div>

        <div class="journal-section approval-section">
            <h2>DUYỆT & KÝ</h2>
            <div class="approval-flex-container">
                <div class="approval-box leader-approval">
                    <h3>Lãnh đạo đơn vị duyệt</h3>
                    <div class="signature-area">
                        <label for="leader_comment">Ý kiến:</label>
                        <textarea id="leader_comment" rows="3"></textarea>
                        <p>Trạng thái: <span class="approval-status">[Chưa duyệt]</span></p>
                        <button class="btn-approve">Ký & Duyệt</button>
                    </div>
                </div>
                <div class="approval-box hvl-submission">
                    <h3>Huấn luyện viên xác nhận</h3>
                    <div class="signature-area">
                        <p>Họ và tên: <span id="hvl_name_display">${hlvInfo.name}</span></p>
                        <p>Trạng thái: <span class="submission-status">(Chưa gửi duyệt)</span></p>
                        <button class="btn-submit-hvl">Xác nhận & Gửi duyệt</button>
                    </div>
                </div>
                <div class="approval-box substitute-hvl-section">
                    <h3>HLV trực thay (nếu có)</h3>
                    <div class="signature-area">
                        <label for="substitute_hvl_name">Họ và tên:</label>
                        <input type="text" id="substitute_hvl_name">
                        <label for="substitute_hvl_comment">Ý kiến:</label>
                        <textarea id="substitute_hvl_comment" rows="3"></textarea>
                        <p>Trạng thái: <span class="substitute-hvl-status">[Chưa ký]</span></p>
                        <button class="btn-substitute-hvl-approve">Ký & Duyệt</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="journal-action-buttons">
            <button class="save-journal">Lưu Nhật Ký</button>
            <button class="export-pdf">Xuất PDF</button>
            <button class="reset-journal">Tải lại</button>
        </div>
    `;
    blockCounter = 0; // Reset block counter for new form
    loadJournalData(dogName, date || defaultDate, true).catch(console.error); // Load data or create empty form
    initializeHiddenInputs(); // Initialize visibility for "Other" inputs after form is built
}

// Function to load journal data (decides between edit form or A4 view) with updated drug loading
async function loadJournalData(dogName, journalDate, forceEditForm = false) {
    const journalKey = `journal_${dogName}_${journalDate}`;
    // Load data from database instead of localStorage
    const storedData = null; // Will be loaded from database

    if (storedData && !forceEditForm) {
        showA4JournalView(dogName, journalDate);
    } else {
        resetJournalFormFields(); // Reset form before loading new data

        if (storedData) {
            const journal = JSON.parse(storedData);

            document.getElementById('journal_date').value = journal.generalInfo.date || journalDate;
            document.getElementById('journal_hlv').value = journal.generalInfo.hlv || `${hlvInfo.name} (Số hiệu: ${hlvInfo.id})`;
            document.getElementById('journal_dog_name').value = journal.generalInfo.dogName || dogName;

            document.getElementById('training-blocks-container').innerHTML = '';
            if (journal.training && journal.training.blocks && journal.training.blocks.length > 0) {
                journal.training.blocks.forEach(data => addTrainingBlock(data));
            } else {
                // Thêm 1 training block mặc định nếu không có data
                addTrainingBlock();
            }
            document.getElementById('journal_hlv_comment').value = (journal.training && journal.training.hlvComment) || '';

            if (journal.care) {
                document.getElementById('lunchTime').value = journal.care.lunchTime || '11:00';
                document.getElementById('lunchAmount').value = journal.care.lunchAmount || 'Ăn hết';
                const lunchFoodOptions = document.getElementById('lunchFoodOptions');
                if (lunchFoodOptions && journal.care.lunchFood) {
                    lunchFoodOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = journal.care.lunchFood.includes(checkbox.dataset.foodValue);
                    });
                }
                document.getElementById('lunchFoodOther').value = journal.care.lunchFoodOther || '';
                updateFoodDisplay('lunchFoodDisplayBox', 'lunchFoodOptions', 'lunchFoodOther');

                document.getElementById('dinnerTime').value = journal.care.dinnerTime || '17:00';
                document.getElementById('dinnerAmount').value = journal.care.dinnerAmount || 'Ăn hết';
                const dinnerFoodOptions = document.getElementById('dinnerFoodOptions');
                if (dinnerFoodOptions && journal.care.dinnerFood) {
                    dinnerFoodOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = journal.care.dinnerFood.includes(checkbox.dataset.foodValue);
                    });
                }
                document.getElementById('dinnerFoodOther').value = journal.care.dinnerFoodOther || '';
                updateFoodDisplay('dinnerFoodDisplayBox', 'dinnerFoodOptions', 'dinnerFoodOther');

                document.getElementById('care_bath').checked = journal.care.careBath || false;
                document.getElementById('care_brush').checked = journal.care.careBrush || false;
                document.getElementById('care_wipe').checked = journal.care.careWipe || false;

                const healthRadios = document.querySelectorAll('input[name="health_status"]');
                if (healthRadios) {
                    healthRadios.forEach(radio => {
                        radio.checked = (radio.value === journal.care.healthStatus);
                    });
                }
                document.getElementById('health_other_text').value = journal.care.healthOtherText || '';
                const selectedHealthRadio = document.querySelector('input[name="health_status"]:checked');
                if (selectedHealthRadio && (selectedHealthRadio.dataset.healthType === 'abnormal' || selectedHealthRadio.dataset.healthType === 'sick')) {
                    document.getElementById('health_other_text').classList.remove('hidden');
                } else {
                    document.getElementById('health_other_text').classList.add('hidden');
                }

                document.getElementById('journal_other_issues').value = journal.care.otherIssues || '';
            }

            document.getElementById('operation-blocks-container').innerHTML = '';
            if (journal.operations && journal.operations.length > 0) {
                // Reset blockCounter để operation blocks có numbering đúng
                const tempBlockCounter = blockCounter;
                blockCounter = 0;
                journal.operations.forEach(data => addOperationBlock(data));
                blockCounter = tempBlockCounter; // Restore blockCounter
                updateOperationBlockNumbers();
            } else {
                // Add default operation block "Ca 1" when no operations exist
                addOperationBlock();
            }

            if (journal.approval) {
                document.getElementById('leader_comment').value = journal.approval.leaderComment || '';
                document.querySelector('.leader-approval .approval-status').innerText = journal.approval.leaderStatus || '[Chưa duyệt]';
                if (journal.approval.leaderStatus === 'Đã duyệt') {
                    document.querySelector('.leader-approval .approval-status').classList.add('approved');
                } else {
                    document.querySelector('.leader-approval .approval-status').classList.remove('approved');
                }

                document.getElementById('hvl_name_display').innerText = journal.approval.hvlNameDisplay || hlvInfo.name;
                document.querySelector('.hvl-submission .submission-status').innerText = journal.approval.submissionStatus || '(Chưa gửi duyệt)';
                if (journal.approval.submissionStatus === '(Đã gửi duyệt)') {
                    document.querySelector('.hvl-submission .submission-status').classList.add('approved');
                } else {
                    document.querySelector('.hvl-submission .submission-status').classList.remove('approved');
                }

                document.getElementById('substitute_hvl_name').value = journal.approval.substituteHvlName || '';
                document.getElementById('substitute_hvl_comment').value = journal.approval.substituteHvlComment || '';
                document.querySelector('.substitute-hvl-section .substitute-hvl-status').innerText = journal.approval.substituteHvlStatus || '[Chưa ký]';
                if (journal.approval.substituteHvlStatus === 'Đã ký') {
                    document.querySelector('.substitute-hvl-section .substitute-hvl-status').classList.add('signed');
                } else {
                    document.querySelector('.substitute-hvl-section .substitute-hvl-status').classList.remove('signed');
                }
            }
        } else {
            // If no stored data, thêm blocks mặc định
            // Reset blockCounter trước khi tạo
            blockCounter = 0;
            addTrainingBlock(); // Thêm training block mặc định

            // Add default operation block "Ca 1"
            addOperationBlock(); // Thêm operation block mặc định
        }
    }
    const leaderStatus = document.querySelector('.leader-approval .approval-status')?.innerText;
    if (leaderStatus === 'Đã duyệt') {
        disableJournalForm(true, 'leader');
    } else {
        disableJournalForm(false, 'leader');
    }
    const substituteStatus = document.querySelector('.substitute-hvl-section .substitute-hvl-status')?.innerText;
    if (substituteStatus === 'Đã ký') {
        disableJournalForm(true, 'substitute');
    } else {
        disableJournalForm(false, 'substitute');
    }
    updateOtherIssuesHighlight();
}

// Function to handle approval actions
async function handleApproval(actionType) {
    const journalDate = document.getElementById('journal_date').value;
    const dogName = document.getElementById('journal_dog_name').value;
    const journalKey = `journal_${dogName}_${journalDate}`;
    // Load journal data from database
    let journalData = await getJournalFromDatabase(journalKey) || {};

    if (!journalData.approval) {
        journalData.approval = {};
    }

    if (actionType === 'approveLeader') {
        if (confirm('Bạn có chắc chắn muốn DUYỆT nhật ký này không? Hành động này không thể hoàn tác.')) {
            journalData.approval.leaderComment = document.getElementById('leader_comment').value;
            journalData.approval.leaderStatus = 'Đã duyệt';
            document.querySelector('.leader-approval .approval-status').innerText = 'Đã duyệt';
            document.querySelector('.leader-approval .approval-status').classList.add('approved');
            disableJournalForm(true, 'leader');
            saveJournalData(); // Save changes after approval
            alert('Nhật ký đã được lãnh đạo duyệt.');
        }
    } else if (actionType === 'submitHVL') {
        if (confirm('Bạn có chắc chắn muốn GỬI DUYỆT nhật ký này không?')) {
            journalData.approval.hvlNameDisplay = hlvInfo.name;
            journalData.approval.submissionStatus = '(Đã gửi duyệt)';
            document.querySelector('.hvl-submission .submission-status').innerText = '(Đã gửi duyệt)';
            document.querySelector('.hvl-submission .submission-status').classList.add('approved');
            saveJournalData(); // Save changes after submission
            alert('Nhật ký đã được gửi duyệt.');
        }
    } else if (actionType === 'approveSubstituteHVL') {
        if (confirm('Bạn có chắc chắn muốn KÝ DUYỆT nhật ký này không? Hành động này không thể hoàn tác.')) {
            journalData.approval.substituteHvlName = document.getElementById('substitute_hvl_name').value;
            journalData.approval.substituteHvlComment = document.getElementById('substitute_hvl_comment').value;
            journalData.approval.substituteHvlStatus = 'Đã ký';
            document.querySelector('.substitute-hvl-section .substitute-hvl-status').innerText = 'Đã ký';
            document.querySelector('.substitute-hvl-section .substitute-hvl-status').classList.add('signed');
            disableJournalForm(true, 'substitute');
            saveJournalData().catch(console.error); // Save changes after signing
            alert('Nhật ký đã được HLV trực thay ký duyệt.');
        }
    }
    // Save journal data to database
    try {
        await window.journalDBManager.saveJournalData();
    } catch (error) {
        console.error('Error saving journal to database:', error);
    }
}

// Function to disable/enable form fields based on approval status
function disableJournalForm(disable, role) {
    const formElements = document.querySelectorAll(
        '#journal_date, #journal_hlv_comment, #lunchTime, #lunchAmount, #lunchFoodOptions input, #lunchFoodOther, ' +
        '#dinnerTime, #dinnerAmount, #dinnerFoodOptions input, #dinnerFoodOther, #care_bath, #care_brush, #care_wipe, ' +
        'input[name="health_status"], #health_other_text, #journal_other_issues'
    );
    const trainingInputs = document.querySelectorAll('#training-blocks-container input, #training-blocks-container select, #training-blocks-container textarea');
    const operationInputs = document.querySelectorAll('#operation-blocks-container input, #operation-blocks-container select, #operation-blocks-container textarea');

    if (role === 'leader') {
        document.getElementById('leader_comment').disabled = disable;
        document.querySelector('.leader-approval .btn-approve').disabled = disable;

        formElements.forEach(el => el.disabled = disable);
        trainingInputs.forEach(el => el.disabled = disable);
        operationInputs.forEach(el => el.disabled = disable);
        document.querySelectorAll('.add-training-block, .remove-training-block, .add-operation-block, .remove-operation-block').forEach(btn => btn.disabled = disable);
        document.querySelector('.save-journal').disabled = disable;
    } else if (role === 'substitute') {
        document.getElementById('substitute_hvl_name').disabled = disable;
        document.getElementById('substitute_hvl_comment').disabled = disable;
        document.querySelector('.substitute-hvl-section .btn-substitute-hvl-approve').disabled = disable;
    }
}

// Function to highlight "Vấn đề khác" if appetite is "Ăn ít" or "Không ăn"
function updateOtherIssuesHighlight() {
    const lunchAppetite = document.getElementById('lunchAmount')?.value;
    const dinnerAppetite = document.getElementById('dinnerAmount')?.value;
    const otherIssuesTextarea = document.getElementById('journal_other_issues');
    const otherIssuesLabel = document.querySelector('.other-issues-label');

    if (otherIssuesTextarea && otherIssuesLabel) {
        if (lunchAppetite === 'Ăn ít' || lunchAppetite === 'Không ăn' ||
            dinnerAppetite === 'Ăn ít' || dinnerAppetite === 'Không ăn') {
            otherIssuesTextarea.classList.add('highlight-issue');
            otherIssuesLabel.classList.add('highlight-issue');
        } else {
            otherIssuesTextarea.classList.remove('highlight-issue');
            otherIssuesLabel.classList.remove('highlight-issue');
        }
    }
}

// Function to create new journal (next day)
function createNewJournal() {
    const dogName = currentDogForJournal;

    if (!dogName) {
        alert("Vui lòng chọn một chó nghiệp vụ trước.");
        return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    if (confirm('Bạn có muốn tạo nhật ký mới cho ngày hôm nay không? Mọi dữ liệu chưa lưu sẽ bị mất.')) {
        showJournalEditForm(dogName, formattedToday);
    }
}

// Function to view old journals
async function viewOldJournals() {
    const content = document.getElementById('content');
    const dogName = currentDogForJournal;

    if (!dogName) {
        alert('Vui lòng chọn một chó nghiệp vụ để xem nhật ký.');
        return;
    }

    // Load journals from database
    const journals = [];
    try {
        const response = await fetch(`/api/journals/by-dog/${encodeURIComponent(dogName)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                journals.push(...data.data);
            }
        }
    } catch (error) {
        console.error('Error loading journals from database:', error);
    }

    journals.sort((a, b) => {
        const dateA = new Date(a.journal_date);
        const dateB = new Date(b.journal_date);
        return dateB - dateA;
    });

    let journalListHtml = `
        <div class="old-journals-list">
            <h2>Nhật Ký Cũ của CNV ${dogName}</h2>
            <button class="back-to-current-journal" data-dog="${dogName}" data-date="${document.getElementById('journal_date')?.value || new Date().toISOString().slice(0, 10)}">Quay lại nhật ký hiện tại</button>
            <ul class="journal-entries">
    `;
    if (journals.length > 0) {
        journals.forEach(journal => {
            const date = journal.journal_date;
            let approvalStatus = '[Chưa duyệt]';
            if (journal.approval_status === 'APPROVED') {
                approvalStatus = '[Đã duyệt]';
            } else if (journal.approval_status === 'REJECTED') {
                approvalStatus = '[Bị từ chối]';
            }

            journalListHtml += `
                <li>
                    <a href="#" class="load-old-journal" data-dog="${dogName}" data-date="${date}">
                        Ngày: ${date} <span class="status-badge ${approvalStatus.includes('Đã duyệt') ? 'approved' : ''}">${approvalStatus}</span>
                    </a>
                </li>
            `;
        });
    } else {
        journalListHtml += `<li>Chưa có nhật ký nào được lưu cho CNV ${dogName}.</li>`;
    }

    journalListHtml += `
            </ul>
        </div>
    `;

    content.innerHTML = journalListHtml;
    document.getElementById('title').innerText = `Xem lại Nhật Ký - ${dogName}`;
}

// Function to export journal to PDF
function exportPdf() {
    const pdfLoadingIndicator = document.createElement('div');
    pdfLoadingIndicator.id = 'pdf-loading-indicator';
    pdfLoadingIndicator.innerText = 'Đang tạo PDF...';
    document.body.appendChild(pdfLoadingIndicator);

    setTimeout(() => {
        const a4Page = document.querySelector('.a4-page');
        if (!a4Page) {
            alert('Không tìm thấy nội dung để xuất PDF. Vui lòng xem nhật ký ở chế độ A4 trước.');
            pdfLoadingIndicator.remove();
            return;
        }

        const { jsPDF } = window.jspdf;
        html2canvas(a4Page, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
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

            pdf.save(`NhatKyCNV_${currentDogForJournal}_${document.getElementById('journal_date').value}.pdf`);
            pdfLoadingIndicator.remove();
        }).catch(error => {
            console.error('Lỗi khi tạo PDF:', error);
            alert('Đã xảy ra lỗi khi tạo PDF. Vui lòng thử lại.');
            pdfLoadingIndicator.remove();
        });
    }, 100); // Small delay to ensure indicator shows
}

// Function to display A4 Journal View with updated drug display
async function showA4JournalView(dogName, journalDate) {
    hideAllContentSections();
    document.getElementById('toggleReadButton').style.display = 'none'; // Hide speech button for A4 view

    const title = document.getElementById('title');
    const content = document.getElementById('content');
    content.style.display = 'block'; // Reset display to block for content
    content.style.justifyContent = 'flex-start'; // Reset flexbox properties
    content.style.alignItems = 'flex-start';
    content.style.height = 'auto'; // Reset height

    title.innerText = `SỔ NHẬT KÝ HUẤN LUYỆN - CNV ${dogName} (Ngày ${journalDate})`;

    // Load journal from database
    let journal = null;
    try {
        const response = await fetch(`/api/journals/by-dog-date/${encodeURIComponent(dogName)}/${journalDate}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                journal = data.data;
            }
        }
    } catch (error) {
        console.error('Error loading journal from database:', error);
    }

    if (!journal) {
        content.innerHTML = `<p>Không tìm thấy nhật ký cho CNV ${dogName} ngày ${journalDate}.</p>
                             <button class="btn-back-to-edit" data-dog="${dogName}" data-date="${journalDate}">Quay lại form chỉnh sửa</button>`;
        return;
    }

    let trainingBlocksHtml = '';
    if (journal.training && journal.training.blocks && journal.training.blocks.length > 0) {
        journal.training.blocks.forEach((block, index) => {
            let drugDetectionHtml = '';
            if (block.drugDetection && block.drugDetection.length > 0) {
                drugDetectionHtml = `<h5>Phát hiện ma túy:</h5>`;
                block.drugDetection.forEach((detection, detIndex) => {
                    // Handle new drug selection format
                    let drugTypes = '';
                    if (detection.selectedDrugs && detection.selectedDrugs.length > 0) {
                        const filteredDrugs = detection.selectedDrugs.filter(d => d !== 'Khác');
                        drugTypes = filteredDrugs.join(', ');
                        if (detection.selectedDrugs.includes('Khác') && detection.drugTypeOther) {
                            drugTypes += (drugTypes ? ', ' : '') + detection.drugTypeOther;
                        } else if (detection.selectedDrugs.includes('Khác')) {
                            drugTypes += (drugTypes ? ', ' : '') + 'Khác';
                        }
                    } else if (detection.drugType) {
                        // Handle old format for backward compatibility
                        drugTypes = detection.drugType === 'Khác' ? detection.drugTypeOther : detection.drugType;
                    }

                    const manifestations = detection.manifestation.filter(m => m !== 'Khác').join(', ');
                    const manifestationOther = detection.manifestation.includes('Khác') ? (detection.manifestationOther || 'Khác') : '';
                    let fullManifestation = manifestations;
                    if (manifestationOther) {
                        if (fullManifestation) fullManifestation += `, ${manifestationOther}`;
                        else fullManifestation = manifestationOther;
                    }
                    drugDetectionHtml += `<p>Lần ${detIndex + 1}: Loại: <strong>${drugTypes || 'N/A'}</strong>, Biểu hiện: <strong>${fullManifestation || 'N/A'}</strong></p>`;
                });
            }

            trainingBlocksHtml += `
                <div class="a4-training-block">
                    <h4>Ca ${index + 1}: ${block.fromTime} - ${block.toTime}</h4>
                    <p>Địa điểm: <strong>${block.locationType === 'Khác' ? block.locationOther : block.locationType}</strong></p>
                    <p>Nội dung: <strong>${[
                    block.advancedTraining ? 'HL nâng cao' : '',
                    block.basicTraining ? 'HL động tác cơ bản' : '',
                    block.physicalTraining ? 'HL thể lực' : '',
                    block.otherTraining || ''
                ].filter(Boolean).join(', ') || 'N/A'}</strong></p>
                    <div class="a4-drug-detection">${drugDetectionHtml}</div>
                </div>
            `;
        });
    } else {
        trainingBlocksHtml = '<p>Không có hoạt động huấn luyện nào được ghi nhận.</p>';
    }

    let operationBlocksHtml = '';
    if (journal.operations && journal.operations.length > 0) {
        journal.operations.forEach((block, index) => {
            const selectedLocationsDisplay = [];
            if (block.selectedLocations) {
                block.selectedLocations.forEach(loc => {
                    if (loc === 'KHO NGOẠI QUAN') {
                        selectedLocationsDisplay.push(`KHO NGOẠI QUAN${block.locationKhoText ? ` (${block.locationKhoText})` : ''}`);
                    } else if (loc === 'Khac') {
                        selectedLocationsDisplay.push(block.locationOtherText || 'Khác');
                    } else {
                        selectedLocationsDisplay.push(loc);
                    }
                });
            }
            const locationDisplay = selectedLocationsDisplay.join(', ') || 'N/A';

            operationBlocksHtml += `
                <div class="a4-operation-block">
                    <h4>Ca ${index + 1}: ${block.fromTime} - ${block.toTime}</h4>
                    <p>Địa điểm: <strong>${locationDisplay}</strong></p>
                    <p>Nội dung: <strong>${[
                    block.checkGoods ? 'Kiểm tra hàng hóa XNK' : '',
                    block.checkLuggage ? 'Kiểm tra hành lý, phương tiện XNC' : '',
                    block.otherOperation1 || '',
                    block.fieldTraining ? 'HL nâng cao tại hiện trường' : '',
                    block.patrol ? 'Tuần tra kiểm soát' : '',
                    block.otherOperation2 || ''
                ].filter(Boolean).join(', ') || 'N/A'}</strong></p>
                    <p>Vấn đề khác: <strong>${block.otherIssues || 'Không'}</strong></p>
                </div>
            `;
        });
    } else {
        operationBlocksHtml = '<p>Không có hoạt động tác nghiệp nào được ghi nhận.</p>';
    }

    const lunchFoodDisplay = journal.care?.lunchFood?.filter(f => f !== 'Khác').join(', ') + (journal.care?.lunchFood?.includes('Khác') && journal.care?.lunchFoodOther ? `, ${journal.care.lunchFoodOther}` : (journal.care?.lunchFood?.includes('Khác') ? ', Khác' : '')) || 'Chưa chọn';
    const dinnerFoodDisplay = journal.care?.dinnerFood?.filter(f => f !== 'Khác').join(', ') + (journal.care?.dinnerFood?.includes('Khác') && journal.care?.dinnerFoodOther ? `, ${journal.care.dinnerFoodOther}` : (journal.care?.dinnerFood?.includes('Khác') ? ', Khác' : '')) || 'Chưa chọn';

    const healthStatusText = journal.care?.healthStatus === 'Có dấu hiệu bất thường' || journal.care?.healthStatus === 'Bị ốm/Chấn thương'
        ? `${journal.care.healthStatus} (${journal.care.healthOtherText || 'Không rõ'})`
        : (journal.care?.healthStatus || 'Bình thường');

    const careChecksText = [
        journal.care?.careBath ? 'Tắm rửa' : '',
        journal.care?.careBrush ? 'Chải lông' : '',
        journal.care?.careWipe ? 'Lau lông' : ''
    ].filter(Boolean).join(', ') || 'Không có';

    const leaderStamp = journal.approval?.leaderStatus === 'Đã duyệt' ? '<span class="stamp approved-stamp">ĐÃ DUYỆT</span>' : '<span class="stamp pending-stamp">CHƯA DUYỆT</span>';
    const hvlStamp = journal.approval?.submissionStatus === '(Đã gửi duyệt)' ? '<span class="stamp submitted-stamp">ĐÃ GỬI DUYỆT</span>' : '<span class="stamp pending-stamp">CHƯA GỬI</span>';
    const substituteHvlStamp = journal.approval?.substituteHvlStatus === 'Đã ký' ? '<span class="stamp signed-stamp">ĐÃ KÝ</span>' : '<span class="stamp pending-stamp">CHƯA KÝ</span>';

    content.innerHTML = `
        <div class="a4-view-actions">
            <button class="btn-back-to-edit" data-dog="${dogName}" data-date="${journalDate}">Quay lại form chỉnh sửa</button>
            <button class="export-pdf">Xuất PDF</button>
        </div>
        <div class="a4-page">
            <div class="a4-section-header">
                <h2>SỔ NHẬT KÝ HUẤN LUYỆN CHÓ NGHIỆP VỤ</h2>
                <p>Ngày: <strong>${journal.generalInfo.date}</strong></p>
                <p>Tên CNV: <strong>${journal.generalInfo.dogName}</strong></p>
                <p>Huấn luyện viên: <strong>${journal.generalInfo.hlv}</strong></p>
            </div>

            <div class="a4-section">
                <h3>II. HOẠT ĐỘNG HUẤN LUYỆN</h3>
                ${trainingBlocksHtml}
                <p><strong>Đánh giá chung của Huấn luyện viên:</strong> ${journal.training?.hlvComment || 'Không có'}</p>
            </div>

            <div class="a4-section">
                <h3>III. CHĂM SÓC & NUÔI DƯỠNG</h3>
                <p><strong>Bữa trưa:</strong> Thời gian: ${journal.care?.lunchTime || 'N/A'}, Sức ăn: ${journal.care?.lunchAmount || 'N/A'}, Thức ăn: ${lunchFoodDisplay}</p>
                <p><strong>Bữa chiều:</strong> Thời gian: ${journal.care?.dinnerTime || 'N/A'}, Sức ăn: ${journal.care?.dinnerAmount || 'N/A'}, Thức ăn: ${dinnerFoodDisplay}</p>
                <p><strong>Vệ sinh:</strong> ${careChecksText}</p>
                <p><strong>Tình trạng sức khỏe:</strong> ${healthStatusText}</p>
                <p><strong>Vấn đề khác (nếu có):</strong> ${journal.care?.otherIssues || 'Không'}</p>
            </div>

            <div class="a4-section">
                <h3>IV. HOẠT ĐỘNG TÁC NGHIỆP</h3>
                ${operationBlocksHtml}
            </div>

            <div class="a4-section approval-a4-section">
                <h3>DUYỆT & KÝ</h3>
                <div class="a4-approval-grid">
                    <div class="a4-signature-box">
                        <p><strong>Lãnh đạo đơn vị duyệt</strong></p>
                        <p class="comment-text">Ý kiến: ${journal.approval?.leaderComment || 'Không có'}</p>
                        <div class="signature-stamp-area">${leaderStamp}</div>
                    </div>
                    <div class="a4-signature-box">
                        <p><strong>Huấn luyện viên xác nhận</strong></p>
                        <p class="comment-text">Họ và tên: ${journal.approval?.hvlNameDisplay || hlvInfo.name}</p>
                        <div class="signature-stamp-area">${hvlStamp}</div>
                    </div>
                    <div class="a4-signature-box">
                        <p><strong>HLV trực thay (nếu có)</strong></p>
                        <p class="comment-text">Họ và tên: ${journal.approval?.substituteHvlName || 'N/A'}</p>
                        <p class="comment-text">Ý kiến: ${journal.approval?.substituteHvlComment || 'Không có'}</p>
                        <div class="signature-stamp-area">${substituteHvlStamp}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize login page when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showLoginPage();

    // Add event listeners for "Enter" key press on username and password fields
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
});

// --- EVENT DELEGATION ---
// Attach a single listener to the document to handle all clicks and changes on dynamic elements

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-training-block')) {
        addTrainingBlock();
    } else if (e.target.classList.contains('remove-training-block')) {
        const trainingBlocksContainer = document.getElementById('training-blocks-container');
        const trainingBlocks = trainingBlocksContainer.querySelectorAll('.training-block');

        if (trainingBlocks.length > 0) {
            if (confirm('Bạn có chắc chắn muốn xóa ca huấn luyện cuối cùng này?')) {
                trainingBlocksContainer.removeChild(trainingBlocks[trainingBlocks.length - 1]);
                document.querySelectorAll('#training-blocks-container .training-block h3').forEach((h3, index) => {
                    h3.innerText = `Ca ${index + 1}:`;
                });
            }
        } else {
            console.warn("No training blocks to remove.");
        }
    } else if (e.target.classList.contains('add-operation-block')) {
        addOperationBlock();
    } else if (e.target.classList.contains('remove-operation-block')) {
        const operationBlocks = document.querySelectorAll('#operation-blocks-container .operation-block');
        if (operationBlocks.length > 0) {
            if (confirm('Bạn có chắc chắn muốn xóa ca tác nghiệp cuối cùng này?')) {
                operationBlocks[operationBlocks.length - 1].remove();
                updateOperationBlockNumbers();
            }
        } else {
            console.warn("No operation blocks to remove.");
        }
    } else if (e.target.classList.contains('save-journal')) {
        saveJournalData();
    } else if (e.target.classList.contains('export-pdf')) {
        exportPdf();
    } else if (e.target.classList.contains('reset-journal')) {
        if (confirm('Bạn có chắc muốn tải lại form? Mọi dữ liệu chưa lưu sẽ bị mất.')) {
            const dogName = document.getElementById('journal_dog_name').value;
            const journalDate = document.getElementById('journal_date').value;
            showJournalEditForm(dogName, journalDate);
        }
    } else if (e.target.classList.contains('btn-approve')) {
        handleApproval('approveLeader');
    } else if (e.target.classList.contains('btn-submit-hvl')) {
        handleApproval('submitHVL');
    } else if (e.target.classList.contains('btn-substitute-hvl-approve')) {
        handleApproval('approveSubstituteHVL');
    } else if (e.target.classList.contains('btn-create-new-journal')) {
        createNewJournal();
    } else if (e.target.classList.contains('btn-view-old-journals')) {
        viewOldJournals();
    } else if (e.target.classList.contains('load-old-journal')) {
        e.preventDefault();
        const dog = e.target.dataset.dog;
        const date = e.target.dataset.date;
        loadJournalData(dog, date);
    } else if (e.target.classList.contains('back-to-current-journal') || e.target.classList.contains('btn-back-to-edit')) {
        e.preventDefault();
        const dog = e.target.dataset.dog;
        const date = e.target.dataset.date;
        showJournalEditForm(dog, date);
    } else if (e.target.closest('.custom-dropdown-trigger')) {
        const trigger = e.target.closest('.custom-dropdown-trigger');
        // Determine if it's a food, location, or drug trigger
        const isFoodTrigger = trigger.closest('.meal-item.food-selection-group');
        const isDrugTrigger = trigger.closest('.drug-detection-row');

        let optionsList;
        if (isFoodTrigger) {
            optionsList = trigger.closest('.custom-food-select-wrapper')?.querySelector('.custom-dropdown-options');
        } else if (isDrugTrigger) {
            optionsList = trigger.closest('.custom-location-select-wrapper')?.querySelector('.custom-dropdown-options');
        } else {
            optionsList = trigger.closest('.custom-location-select-wrapper')?.querySelector('.custom-dropdown-options');
        }

        if (optionsList) {
            optionsList.classList.toggle('hidden');
            // Hide other open dropdowns
            document.querySelectorAll('.custom-dropdown-options').forEach(list => {
                if (list !== optionsList && !list.classList.contains('hidden')) {
                    list.classList.add('hidden');
                }
            });
        }
    }
});

document.addEventListener('change', function (e) {
    if (e.target.matches('input[type="radio"]')) {
        const parentContainer = e.target.closest('.field-group') || e.target.closest('.health-status');
        if (parentContainer) {
            const otherInput = parentContainer.querySelector('.location-other-input, .health-other-input');
            if (otherInput) {
                if (e.target.dataset.locationType === 'khac' || e.target.dataset.healthType === 'abnormal' || e.target.dataset.healthType === 'sick') {
                    otherInput.classList.remove('hidden');
                } else {
                    otherInput.classList.add('hidden');
                    otherInput.value = '';
                }
            }
        }
    } else if (e.target.closest('.detection-manifestation-checkboxes') && e.target.type === 'checkbox') {
        const parentDiv = e.target.closest('.detection-manifestation-checkboxes');
        const otherInput = parentDiv.closest('.drug-detection-row')?.querySelector('input[class^="detection-manifestation-other-"]');
        const selectedCheckboxes = Array.from(parentDiv.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

        if (otherInput) {
            if (!selectedCheckboxes.includes('Khác')) {
                otherInput.classList.add('hidden');
            } else {
                otherInput.classList.remove('hidden');
            }
        }
    } else if (e.target.closest('.custom-location-select-wrapper') && e.target.type === 'checkbox') {
        // Handle location checkboxes or drug checkboxes
        const isDrugRow = e.target.closest('.drug-detection-row');

        if (isDrugRow) {
            // This is a drug checkbox
            const blockElement = isDrugRow.closest('.training-block');
            const blockId = blockElement.dataset.blockId;

            // Find which attempt this is (Lần 1, 2, 3)
            const wrapper = e.target.closest('.custom-location-select-wrapper');
            const attemptMatch = wrapper.className.match(/drug-select-wrapper-\d+-(\d+)/);
            const attemptNumber = attemptMatch ? attemptMatch[1] : '1';

            updateDrugDisplay(blockId, attemptNumber);
        } else {
            // This is a location checkbox  
            const blockId = e.target.closest('.operation-block').dataset.blockId;
            updateOperationLocationDisplay(blockId);
        }
    } else if (e.target.id === 'journal_date') {
        const newDate = e.target.value;
        const currentDog = document.getElementById('journal_dog_name').value;
        if (currentDog) {
            loadJournalData(currentDog, newDate);
        }
    } else if (e.target.classList.contains('appetite-select')) {
        updateOtherIssuesHighlight();
    } else if (e.target.id && e.target.id.startsWith('hlKhacCheckbox-')) {
        const otherInputId = e.target.id.replace('Checkbox', 'Text');
        const otherInput = document.getElementById(otherInputId);
        handleCheckboxOther(e.target, otherInput);
    } else if (e.target.id && e.target.id.startsWith('opKhacCheckbox1-')) {
        const otherInputId = e.target.id.replace('Checkbox1', 'Text1');
        const otherInput = document.getElementById(otherInputId);
        handleCheckboxOther(e.target, otherInput);
    } else if (e.target.id && e.target.id.startsWith('opKhacCheckbox2-')) {
        const otherInputId = e.target.id.replace('Checkbox2', 'Text2');
        const otherInput = document.getElementById(otherInputId);
        handleCheckboxOther(e.target, otherInput);
    } else if (e.target.closest('.custom-dropdown-options') && e.target.type === 'checkbox') {
        // This handles food checkboxes
        const parentFoodSelectionGroup = e.target.closest('.meal-item.food-selection-group');
        if (parentFoodSelectionGroup) {
            const displayBoxId = parentFoodSelectionGroup.querySelector('.food-selected-display-box').id;
            const optionsListId = parentFoodSelectionGroup.querySelector('.custom-dropdown-options').id;
            const otherFoodInputId = parentFoodSelectionGroup.querySelector('input[type="text"][id$="FoodOther"]').id;
            updateFoodDisplay(displayBoxId, optionsListId, otherFoodInputId);
        }
    }
});

// Add an input event listener for the location and drug text inputs
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('location-kho-input') || e.target.classList.contains('location-other-input')) {
        const isDrugInput = e.target.closest('.drug-detection-row');

        if (isDrugInput) {
            // This is a drug other input
            const blockElement = isDrugInput.closest('.training-block');
            const blockId = blockElement.dataset.blockId;

            // Find attempt number from the input ID  
            const inputId = e.target.id;
            const attemptMatch = inputId.match(/drugTypeOther-\d+-(\d+)/);
            const attemptNumber = attemptMatch ? attemptMatch[1] : '1';

            updateDrugDisplay(blockId, attemptNumber);
        } else {
            // This is a location input
            const blockId = e.target.id.split('-')[1]; // Extract block ID
            updateOperationLocationDisplay(blockId); // Use the new function for operation locations
        }
    } else if (e.target.id === 'lunchFoodOther' || e.target.id === 'dinnerFoodOther') {
        const parentFoodSelectionGroup = e.target.closest('.meal-item.food-selection-group');
        if (parentFoodSelectionGroup) {
            const displayBoxId = parentFoodSelectionGroup.querySelector('.food-selected-display-box').id;
            const optionsListId = parentFoodSelectionGroup.querySelector('.custom-dropdown-options').id;
            const otherFoodInputId = e.target.id;
            updateFoodDisplay(displayBoxId, optionsListId, otherFoodInputId);
        }
    }
});

document.addEventListener('click', function (e) {
    document.querySelectorAll('.custom-dropdown-options').forEach(optionsList => {
        const foodSelectionGroup = optionsList.closest('.meal-item.food-selection-group');
        const locationSelectionGroup = optionsList.closest('.custom-location-select-wrapper');
        const isDrugDropdown = optionsList.closest('.drug-detection-row');

        if (foodSelectionGroup) {
            const trigger = foodSelectionGroup.querySelector('.custom-dropdown-trigger');
            const displayBox = foodSelectionGroup.querySelector('.food-selected-display-box');

            if (!trigger.contains(e.target) && !optionsList.contains(e.target) && !displayBox.contains(e.target)) {
                optionsList.classList.add('hidden');
            }
        } else if (locationSelectionGroup && isDrugDropdown) {
            // This is a drug dropdown
            const trigger = locationSelectionGroup.querySelector('.custom-dropdown-trigger');
            const displayBox = locationSelectionGroup.querySelector('.location-selected-display-box');
            const otherInput = locationSelectionGroup.querySelector('.location-other-input');

            if (!trigger.contains(e.target) && !optionsList.contains(e.target) && !displayBox.contains(e.target) &&
                !(otherInput && otherInput.contains(e.target))) {
                optionsList.classList.add('hidden');
            }
        } else if (locationSelectionGroup) {
            // This is a location dropdown
            const trigger = locationSelectionGroup.querySelector('.custom-dropdown-trigger');
            const displayBox = locationSelectionGroup.querySelector('.location-selected-display-box');
            const khoInput = locationSelectionGroup.querySelector('.location-kho-input');
            const otherInput = locationSelectionGroup.querySelector('.location-other-input');

            if (!trigger.contains(e.target) && !optionsList.contains(e.target) && !displayBox.contains(e.target) &&
                !(khoInput && khoInput.contains(e.target)) && !(otherInput && otherInput.contains(e.target))) {
                optionsList.classList.add('hidden');
            }
        }
    });
});

// Function to initialize AI chat interface (placeholder)
function chatWithAI() {
    alert('Chức năng Tra cứu AI đang được phát triển!');
}
// ===========================================
// BACKEND CONNECTION FUNCTIONS
// Thêm vào cuối file script.js gốc của bạn
// ===========================================

// Lưu journal với backend database
function saveJournalToBackend() {
    const currentDog = currentDogForJournal || 'CNV BI';
    const journalDate = document.getElementById('journal_date')?.value || new Date().toISOString().slice(0, 10);

    // Save to database only
    saveJournalData();

}

// Override hàm saveJournalData gốc để sử dụng database
const originalSaveJournalData = saveJournalData;
saveJournalData = function () {
    // Gọi hàm gốc trước
    originalSaveJournalData();

    // Thêm thông báo thành công
};

// Thêm hàm submit cho approval workflow
function submitCurrentJournalForApproval() {
    if (!currentDogForJournal) {
        alert('⚠️ Vui lòng chọn chó nghiệp vụ trước.');
        return;
    }

    const journalDate = document.getElementById('journal_date')?.value;
    if (!journalDate) {
        alert('⚠️ Vui lòng chọn ngày ghi nhật ký.');
        return;
    }

    // Lưu trước khi submit
    saveJournalData();

    // Hiển thị modal xác nhận
    if (document.getElementById('submitModal')) {
        document.getElementById('submitModal').style.display = 'block';
    }
}

// Hàm collect journal data đã được định nghĩa trong index.html
// Chỉ cần đảm bảo nó hoạt động với localStorage hiện tại

// Thêm event listener cho việc auto-save
document.addEventListener('DOMContentLoaded', function () {
    // Auto-save mỗi 30 giây nếu có thay đổi
    let hasChanges = false;
    let autoSaveInterval;

    // Theo dõi thay đổi trong form
    function markAsChanged() {
        hasChanges = true;
    }

    // Lắng nghe thay đổi trong các input quan trọng
    const watchedSelectors = [
        'input[type="text"]',
        'input[type="time"]',
        'input[type="date"]',
        'textarea',
        'select',
        'input[type="radio"]',
        'input[type="checkbox"]'
    ];

    watchedSelectors.forEach(selector => {
        document.addEventListener('change', function (e) {
            if (e.target.matches(selector)) {
                markAsChanged();
            }
        });

        document.addEventListener('input', function (e) {
            if (e.target.matches(selector)) {
                markAsChanged();
            }
        });
    });

    // Auto-save timer
    autoSaveInterval = setInterval(function () {
        if (hasChanges && currentDogForJournal) {
            saveJournalData();
            hasChanges = false;
        }
    }, 30000); // 30 seconds

    // Cleanup on page unload
    window.addEventListener('beforeunload', function () {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }
        if (hasChanges && currentDogForJournal) {
            saveJournalData();
        }
    });
});

// Hàm kiểm tra trạng thái approval của nhật ký
function checkJournalApprovalStatus(dogName, date) {
    // Hiển thị trong UI nếu nhật ký đã được gửi duyệt

    // Bạn có thể mở rộng để gọi API kiểm tra trạng thái
    // fetch(`/api/journals/status?dog=${dogName}&date=${date}`)...
}

// Thêm indicator cho trạng thái journal
function updateJournalStatusIndicator(status = 'draft') {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'journal-status-indicator';
    statusIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    // Remove existing indicator
    const existing = document.getElementById('journal-status-indicator');
    if (existing) {
        existing.remove();
    }

    // Set status-specific styling
    switch (status) {
        case 'draft':
            statusIndicator.innerHTML = '📝 Nháp';
            statusIndicator.style.backgroundColor = '#6c757d';
            statusIndicator.style.color = 'white';
            break;
        case 'submitted':
            statusIndicator.innerHTML = '⏳ Chờ duyệt';
            statusIndicator.style.backgroundColor = '#ffc107';
            statusIndicator.style.color = '#212529';
            break;
        case 'approved':
            statusIndicator.innerHTML = '✅ Đã duyệt';
            statusIndicator.style.backgroundColor = '#28a745';
            statusIndicator.style.color = 'white';
            break;
        case 'rejected':
            statusIndicator.innerHTML = '❌ Từ chối';
            statusIndicator.style.backgroundColor = '#dc3545';
            statusIndicator.style.color = 'white';
            break;
    }

    document.body.appendChild(statusIndicator);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (statusIndicator && statusIndicator.parentNode) {
            statusIndicator.remove();
        }
    }, 3000);
}

// Khởi tạo status indicator
updateJournalStatusIndicator('draft');

// Export các hàm cần thiết cho global scope
window.submitCurrentJournalForApproval = submitCurrentJournalForApproval;
window.checkJournalApprovalStatus = checkJournalApprovalStatus;
window.updateJournalStatusIndicator = updateJournalStatusIndicator;
