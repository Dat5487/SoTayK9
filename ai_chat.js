// =============================================================================
// AI CHAT SYSTEM - Knowledge Base & Intelligent Assistant
// =============================================================================

class AIChatSystem {
    constructor() {
        this.currentUser = null;
        this.chatHistory = [];
        this.isOpen = false;
        this.knowledgeBase = null;
        this.init();
    }

    init() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.setupKnowledgeBase();
        this.createChatWidget();
    }

    // =============================================================================
    // KNOWLEDGE BASE SETUP
    // =============================================================================

    setupKnowledgeBase() {
        this.knowledgeBase = {
            // DOG CARE KNOWLEDGE
            care: {
                feeding: {
                    keywords: ['cho ăn', 'thức ăn', 'dinh dưỡng', 'feeding', 'food'],
                    responses: [
                        '🍖 **Chế độ cho ăn chó nghiệp vụ:**\n\n• **Tần suất:** 2 lần/ngày (sáng 6-7h, chiều 16-17h)\n• **Lượng thức ăn:** 300-500g/bữa tùy trọng lượng\n• **Loại thức ăn:** Thức ăn chuyên dụng cho chó làm việc\n• **Nước uống:** Luôn có nước sạch\n• **Bổ sung:** Vitamin và khoáng chất theo chỉ định\n\n💡 **Lưu ý:** Không cho ăn trước huấn luyện 2 tiếng',
                        '🥘 **Thực đơn dinh dưỡng theo tuổi:**\n\n**Chó con (2-6 tháng):** 3-4 bữa/ngày, thức ăn mềm\n**Chó trưởng thành (6 tháng+):** 2 bữa/ngày, thức ăn khô\n**Chó già (7+ tuổi):** Thức ăn dễ tiêu, bổ sung canxi\n\n⚠️ **Tránh:** Chocolate, nho, hành, tỏi, xương gà'
                    ]
                },
                health: {
                    keywords: ['sức khỏe', 'bệnh', 'khám', 'health', 'sick', 'veterinary'],
                    responses: [
                        '🏥 **Chăm sóc sức khỏe cơ bản:**\n\n• **Khám định kỳ:** Mỗi 3 tháng/lần\n• **Tiêm phòng:** Theo lịch của bác sĩ thú y\n• **Tẩy giun:** 3 tháng/lần\n• **Vệ sinh:** Tắm 1-2 lần/tuần\n• **Kiểm tra hàng ngày:** Mắt, tai, răng, móng\n\n🚨 **Dấu hiệu cần khám gấp:** Sốt, nôn, tiêu chảy, khó thở',
                        '💊 **Các bệnh thường gặp và cách phòng tránh:**\n\n**Viêm tai:** Vệ sinh tai thường xuyên\n**Ghẻ:** Tắm đúng cách, môi trường sạch\n**Rối loạn tiêu hóa:** Chế độ ăn đều đặn\n**Bệnh kh�b:** Tiêm phòng đầy đủ\n\n📞 **Liên hệ bác sĩ:** Khi có biểu hiện bất thường'
                    ]
                },
                hygiene: {
                    keywords: ['vệ sinh', 'tắm', 'hygiene', 'clean', 'groom'],
                    responses: [
                        '🛁 **Quy trình vệ sinh hàng ngày:**\n\n• **Tắm:** 1-2 lần/tuần, nước ấm, sữa tắm chuyên dụng\n• **Chải lông:** Hàng ngày, đặc biệt chó lông dài\n• **Vệ sinh tai:** 2-3 lần/tuần bằng dung dịch chuyên dụng\n• **Cắt móng:** 2-3 tuần/lần\n• **Vệ sinh răng:** Đánh răng 2-3 lần/tuần\n\n🧼 **Dụng cụ cần thiết:** Bàn chải, sữa tắm, khăn, kéo cắt móng'
                    ]
                }
            },

            // DOG TRAINING KNOWLEDGE  
            training: {
                basic: {
                    keywords: ['huấn luyện cơ bản', 'basic training', 'nghe lời', 'tuân lệnh'],
                    responses: [
                        '🎯 **5 lệnh cơ bản quan trọng:**\n\n1. **"Ngồi" (Sit):** Nền tảng của mọi bài tập\n2. **"Nằm" (Down):** Tăng cường kỷ luật\n3. **"Đứng" (Stand):** Chuẩn bị cho kiểm tra\n4. **"Lại đây" (Come):** An toàn và kiểm soát\n5. **"Ở lại" (Stay):** Kiên nhẫn và tập trung\n\n⏰ **Thời gian:** 15-20 phút/buổi, 2 buổi/ngày\n🏆 **Phần thưởng:** Thức ăn, khen ngợi, vuốt ve',
                        '📚 **Quy trình huấn luyện tuân lệnh:**\n\n**Bước 1:** Thị phạm động tác + lệnh giọng\n**Bước 2:** Hướng dẫn chó thực hiện\n**Bước 3:** Khen thưởng khi đúng\n**Bước 4:** Lặp lại 5-10 lần\n**Bước 5:** Kiểm tra độ thuần thục\n\n💡 **Nguyên tắc:** Kiên nhẫn, nhất quán, tích cực'
                    ]
                },
                detection: {
                    keywords: ['phát hiện', 'detection', 'ma túy', 'drug', 'explosive', 'chất nổ'],
                    responses: [
                        '💊 **Huấn luyện phát hiện ma túy:**\n\n**Giai đoạn 1 (2-4 tuần):** Làm quen với mùi mẫu\n**Giai đoạn 2 (4-8 tuần):** Tìm kiếm cơ bản\n**Giai đoạn 3 (8-12 tuần):** Tìm kiếm phức tạp\n**Giai đoạn 4 (12+ tuần):** Thực hành thực tế\n\n🎯 **Kỹ thuật:** Positive reinforcement, clicker training\n⚠️ **An toàn:** Không tiếp xúc trực tiếp với chất thật',
                        '💣 **Huấn luyện phát hiện chất nổ:**\n\n**Chuẩn bị:** Mẫu huấn luyện an toàn\n**Bước 1:** Nhận diện mùi (2-3 tuần)\n**Bước 2:** Báo hiệu khi phát hiện (3-4 tuần)\n**Bước 3:** Tìm kiếm trong môi trường khác nhau\n**Bước 4:** Kiểm tra độ chính xác\n\n📊 **Tiêu chuẩn:** Độ chính xác >95%'
                    ]
                },
                advanced: {
                    keywords: ['huấn luyện nâng cao', 'advanced', 'chuyên sâu', 'tactical'],
                    responses: [
                        '🚁 **Huấn luyện nghiệp vụ nâng cao:**\n\n• **Tìm kiếm cứu nạn:** Theo dấu vết, tìm người mất tích\n• **Bảo vệ:** Bảo vệ mục tiêu, tuần tra\n• **Chiến thuật:** Phối hợp với lực lượng\n• **Thích ứng môi trường:** Địa hình khó khăn\n• **Làm việc đêm:** Huấn luyện trong tối\n\n🏋️ **Rèn luyện thể chất:** Chạy, nhảy, leo trèo'
                    ]
                }
            },

            // OPERATIONAL PROCEDURES
            operations: {
                patrol: {
                    keywords: ['tuần tra', 'patrol', 'cửa khẩu', 'border', 'kiểm tra'],
                    responses: [
                        '🚔 **Quy trình tuần tra cửa khẩu:**\n\n**Trước tuần tra:**\n• Kiểm tra sức khỏe chó\n• Chuẩn bị thiết bị\n• Xem lại khu vực tuần tra\n\n**Trong tuần tra:**\n• Giữ chó gần bên\n• Quan sát phản ứng\n• Báo cáo bất thường\n• Ghi chép hoạt động\n\n**Sau tuần tra:**\n• Vệ sinh chó\n• Báo cáo kết quả\n• Nghỉ ngơi cho chó'
                    ]
                },
                inspection: {
                    keywords: ['kiểm tra hàng hóa', 'inspection', 'container', 'cargo', 'customs'],
                    responses: [
                        '📦 **Quy trình kiểm tra hàng hóa:**\n\n**Bước 1:** Đánh giá sơ bộ khu vực\n**Bước 2:** Cho chó làm quen môi trường\n**Bước 3:** Kiểm tra có hệ thống\n**Bước 4:** Quan sát phản ứng chó\n**Bước 5:** Báo cáo kết quả\n\n⚠️ **An toàn:** Luôn có HLV bên cạnh, tránh khu vực nguy hiểm'
                    ]
                }
            },

            // SYSTEM USAGE
            system: {
                journal: {
                    keywords: ['nhật ký', 'journal', 'viết nhật ký', 'ghi chép'],
                    responses: [
                        '📝 **Hướng dẫn viết nhật ký:**\n\n**Đầy đủ thông tin:**\n• Hoạt động huấn luyện cụ thể\n• Tình trạng sức khỏe\n• Hiệu suất làm việc\n• Ghi chú đặc biệt\n\n**Mẹo viết tốt:**\n• Ghi ngay sau hoạt động\n• Sử dụng từ ngữ rõ ràng\n• Ghi cả điểm tích cực và tiêu cực\n• Đưa ra đánh giá khách quan'
                    ]
                },
                approval: {
                    keywords: ['duyệt nhật ký', 'approval', 'ký duyệt', 'manager'],
                    responses: [
                        '✅ **Quy trình duyệt nhật ký:**\n\n**Với Manager:**\n1. Xem chi tiết nhật ký\n2. Đánh giá nội dung\n3. Thêm ý kiến (nếu cần)\n4. Ký tên + con dấu\n5. Hoàn tất duyệt\n\n**Tiêu chí duyệt:**\n• Nội dung đầy đủ, rõ ràng\n• Đánh giá khách quan\n• Tuân thủ quy định'
                    ]
                }
            },

            // EMERGENCY PROCEDURES
            emergency: {
                medical: {
                    keywords: ['cấp cứu', 'emergency', 'tai nạn', 'bị thương'],
                    responses: [
                        '🚨 **Xử lý cấp cứu cho chó:**\n\n**Bước 1:** Giữ bình tĩnh, đảm bảo an toàn\n**Bước 2:** Kiểm tra tình trạng chó\n**Bước 3:** Sơ cứu cơ bản (nếu biết)\n**Bước 4:** Liên hệ bác sĩ thú y ngay\n**Bước 5:** Báo cáo lên cấp trên\n\n📞 **Số cấp cứu:** [Cần cập nhật số địa phương]\n🏥 **Bệnh viện thú y gần nhất:** [Cần cập nhật địa chỉ]'
                    ]
                }
            },

            // REGULATIONS & POLICIES
            regulations: {
                general: {
                    keywords: ['quy định', 'regulation', 'chính sách', 'policy', 'luật'],
                    responses: [
                        '📋 **Quy định chung về chó nghiệp vụ:**\n\n• Chó phải được đào tạo và cấp phép\n• Huấn luyện viên phải có chứng chỉ\n• Báo cáo định kỳ về tình trạng\n• Tuân thủ quy tắc an toàn\n• Bảo mật thông tin nhạy cảm\n\n📖 **Tài liệu tham khảo:** Thông tư 15/2020/TT-BCA'
                    ]
                }
            }
        };
    }

    // =============================================================================
    // CHAT WIDGET UI
    // =============================================================================

    createChatWidget() {
        const widgetHtml = `
            <div id="aiChatWidget" class="ai-chat-widget">
                <!-- Chat Toggle Button -->
                <div id="chatToggle" class="chat-toggle" onclick="aiChat.toggleChat()">
                    <div class="chat-icon">🤖</div>
                    <div class="notification-badge" id="chatNotification" style="display: none;">1</div>
                </div>

                <!-- Chat Window -->
                <div id="chatWindow" class="chat-window hidden">
                    <div class="chat-header">
                        <div class="chat-title">
                            <span class="chat-avatar">🤖</span>
                            <div>
                                <div class="chat-name">AI Assistant K9</div>
                                <div class="chat-status">🟢 Sẵn sàng hỗ trợ</div>
                            </div>
                        </div>
                        <div class="chat-controls">
                            <button onclick="aiChat.clearChat()" class="chat-btn" title="Xóa cuộc trò chuyện">🗑️</button>
                            <button onclick="aiChat.toggleChat()" class="chat-btn" title="Thu nhỏ">➖</button>
                        </div>
                    </div>

                    <div id="chatMessages" class="chat-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <strong>Xin chào ${this.currentUser.full_name || 'bạn'}!</strong><br>
                                Tôi là trợ lý AI cho hệ thống quản lý chó nghiệp vụ. Tôi có thể giúp bạn về:
                                <div class="quick-topics">
                                    <span onclick="aiChat.sendQuickMessage('Hướng dẫn chăm sóc chó')">🐕 Chăm sóc chó</span>
                                    <span onclick="aiChat.sendQuickMessage('Cách huấn luyện cơ bản')">🎯 Huấn luyện</span>
                                    <span onclick="aiChat.sendQuickMessage('Quy trình tuần tra')">🚔 Nghiệp vụ</span>
                                    <span onclick="aiChat.sendQuickMessage('Hướng dẫn viết nhật ký')">📝 Nhật ký</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="chat-input-area">
                        <div class="chat-suggestions" id="chatSuggestions">
                            <!-- Dynamic suggestions will appear here -->
                        </div>
                        <div class="chat-input-container">
                            <input type="text" id="chatInput" placeholder="Hỏi về chăm sóc, huấn luyện, nghiệp vụ..." onkeypress="aiChat.handleInputKeyPress(event)">
                            <button onclick="aiChat.sendMessage()" class="send-btn">📤</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHtml);
        this.addChatStyles();
        
        // Show initial notification
        setTimeout(() => {
            this.showNotification();
        }, 3000);
    }

    addChatStyles() {
        const styles = `
            <style>
            .ai-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            }

            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                position: relative;
            }

            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }

            .chat-icon {
                font-size: 24px;
                animation: bounce 2s infinite;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-5px); }
                60% { transform: translateY(-3px); }
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                animation: pulse 1s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideInUp 0.3s ease;
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chat-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-title {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chat-avatar {
                font-size: 18px;
            }

            .chat-name {
                font-weight: bold;
                font-size: 14px;
            }

            .chat-status {
                font-size: 11px;
                opacity: 0.9;
            }

            .chat-controls {
                display: flex;
                gap: 5px;
            }

            .chat-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 5px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.3s;
            }

            .chat-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                background: #f8f9fa;
            }

            .message {
                display: flex;
                margin-bottom: 15px;
                align-items: flex-start;
                gap: 10px;
            }

            .message-avatar {
                font-size: 16px;
                flex-shrink: 0;
            }

            .message-content {
                max-width: 280px;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .bot-message .message-content {
                background: white;
                color: #2d3748;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 6px;
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .user-message .message-content {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-bottom-right-radius: 6px;
            }

            .quick-topics {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .quick-topics span {
                background: #e3f2fd;
                color: #1976d2;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
                border: 1px solid #bbdefb;
            }

            .quick-topics span:hover {
                background: #bbdefb;
                transform: translateY(-1px);
            }

            .chat-input-area {
                border-top: 1px solid #e2e8f0;
                background: white;
            }

            .chat-suggestions {
                padding: 8px 15px;
                background: #f8f9fa;
                border-bottom: 1px solid #e2e8f0;
                font-size: 12px;
                color: #718096;
                display: none;
            }

            .chat-suggestions.show {
                display: block;
            }

            .suggestion-item {
                padding: 4px 8px;
                background: white;
                border-radius: 12px;
                margin: 2px 4px 2px 0;
                display: inline-block;
                cursor: pointer;
                border: 1px solid #e2e8f0;
                transition: all 0.2s;
            }

            .suggestion-item:hover {
                background: #e3f2fd;
                border-color: #bbdefb;
            }

            .chat-input-container {
                display: flex;
                padding: 15px;
                gap: 10px;
                align-items: center;
            }

            #chatInput {
                flex: 1;
                border: 2px solid #e2e8f0;
                border-radius: 20px;
                padding: 10px 15px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }

            #chatInput:focus {
                border-color: #667eea;
            }

            .send-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                color: white;
                padding: 10px 12px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .send-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                margin-bottom: 15px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #718096;
                border-radius: 50%;
                animation: typingBounce 1.4s infinite;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .chat-window {
                    width: 340px;
                    height: 450px;
                    bottom: 70px;
                    right: -10px;
                }
                
                .ai-chat-widget {
                    bottom: 15px;
                    right: 15px;
                }
            }

            .hidden { display: none !important; }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // =============================================================================
    // CHAT FUNCTIONALITY
    // =============================================================================

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const notification = document.getElementById('chatNotification');
        
        if (this.isOpen) {
            chatWindow.classList.add('hidden');
            this.isOpen = false;
        } else {
            chatWindow.classList.remove('hidden');
            this.isOpen = true;
            notification.style.display = 'none';
            document.getElementById('chatInput').focus();
        }
    }

    sendMessage(message = null) {
        const input = document.getElementById('chatInput');
        const messageText = message || input.value.trim();
        
        if (!messageText) return;
        
        // Add user message
        this.addMessage(messageText, 'user');
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(messageText);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    sendQuickMessage(message) {
        this.sendMessage(message);
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'bot' ? '🤖' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${this.formatMessage(content)}
                <div style="font-size: 11px; opacity: 0.7; margin-top: 8px;">${timestamp}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in history
        this.chatHistory.push({
            content,
            type,
            timestamp: new Date().toISOString()
        });
    }

    formatMessage(content) {
        // Convert markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ')
            .replace(/\d+\./g, (match) => `<strong>${match}</strong>`);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleInputKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    // =============================================================================
    // AI MESSAGE PROCESSING
    // =============================================================================

    processMessage(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Check for greetings first
        if (this.isGreeting(lowerMessage)) {
            return this.getGreetingResponse();
        }

        // Check for help/commands
        if (this.isHelpRequest(lowerMessage)) {
            return this.getHelpResponse();
        }

        // Search knowledge base
        const response = this.searchKnowledgeBase(lowerMessage);
        if (response) {
            return response;
        }

        // Fallback responses
        return this.getFallbackResponse(lowerMessage);
    }

    isGreeting(message) {
        const greetings = ['xin chào', 'chào', 'hello', 'hi', 'hey', 'halo', 'chào bạn'];
        return greetings.some(greeting => message.includes(greeting));
    }

    getGreetingResponse() {
        const responses = [
            `🤖 Xin chào ${this.currentUser.full_name || 'bạn'}! Tôi có thể giúp bạn gì về chó nghiệp vụ hôm nay?`,
            `👋 Chào bạn! Tôi là trợ lý AI chuyên về chó nghiệp vụ. Bạn cần hỗ trợ gì không?`,
            `🐕 Xin chào! Tôi sẵn sàng giúp bạn về chăm sóc, huấn luyện và quản lý chó nghiệp vụ.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    isHelpRequest(message) {
        const helpKeywords = ['help', 'giúp đỡ', 'hướng dẫn', 'hỗ trợ', 'giúp tôi', 'làm sao', 'cần giúp'];
        return helpKeywords.some(keyword => message.includes(keyword));
    }

    getHelpResponse() {
        return `🤖 **Tôi có thể giúp bạn về các chủ đề sau:**

🐕 **Chăm sóc chó:**
• Cho ăn và dinh dưỡng
• Chăm sóc sức khỏe
• Vệ sinh và tắm rửa

🎯 **Huấn luyện:**
• Huấn luyện cơ bản
• Phát hiện ma túy/chất nổ
• Kỹ thuật nâng cao

🚔 **Nghiệp vụ:**
• Quy trình tuần tra
• Kiểm tra hàng hóa
• An toàn trong công việc

📝 **Hệ thống:**
• Cách viết nhật ký
• Quy trình duyệt
• Xuất báo cáo

💡 **Ví dụ câu hỏi:**
"Chó ăn mấy lần một ngày?"
"Cách huấn luyện chó nghe lời?"
"Quy trình tuần tra cửa khẩu?"`;
    }

    searchKnowledgeBase(message) {
        let bestMatch = null;
        let bestScore = 0;

        // Search through all knowledge categories
        for (const category in this.knowledgeBase) {
            for (const topic in this.knowledgeBase[category]) {
                const topicData = this.knowledgeBase[category][topic];
                const score = this.calculateRelevanceScore(message, topicData.keywords);
                
                if (score > bestScore && score > 0.3) {
                    bestScore = score;
                    bestMatch = topicData;
                }
            }
        }

        if (bestMatch) {
            const responses = bestMatch.responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }

        return null;
    }

    calculateRelevanceScore(message, keywords) {
        let matches = 0;
        let totalKeywords = keywords.length;
        
        keywords.forEach(keyword => {
            if (message.includes(keyword.toLowerCase())) {
                matches++;
            }
        });
        
        return matches / totalKeywords;
    }

    getFallbackResponse(message) {
        // Analyze message intent and provide contextual fallback
        if (message.includes('chó') || message.includes('dog')) {
            return `🐕 Tôi hiểu bạn đang hỏi về chó nghiệp vụ, nhưng cần thêm thông tin chi tiết. Bạn có thể hỏi cụ thể về:

• **Chăm sóc:** "Chó ăn mấy lần một ngày?"
• **Huấn luyện:** "Cách dạy chó nghe lời?"
• **Sức khỏe:** "Làm sao biết chó bị bệnh?"
• **Nghiệp vụ:** "Quy trình tuần tra như thế nào?"`;
        }
        
        if (message.includes('nhật ký') || message.includes('journal')) {
            return `📝 **Về nhật ký huấn luyện:**

• Nhật ký cần ghi đầy đủ các hoạt động trong ngày
• Bao gồm: huấn luyện, chăm sóc, nghiệp vụ, tình trạng sức khỏe
• Ghi chú của huấn luyện viên về hiệu suất
• Gửi lãnh đạo duyệt khi hoàn thành

Bạn cần hướng dẫn cụ thể nào về nhật ký không?`;
        }

        // General fallback
        const fallbackResponses = [
            `🤔 Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi cụ thể về **chăm sóc chó**, **huấn luyện**, **nghiệp vụ**, hoặc **nhật ký** không?`,
            `💭 Câu hỏi này hơi khó hiểu. Thử hỏi về:\n• Cách cho chó ăn\n• Huấn luyện cơ bản\n• Quy trình tuần tra\n• Cách viết nhật ký`,
            `🔍 Tôi đang học hỏi thêm về chủ đề này. Hiện tại tôi có thể giúp bạn về chăm sóc, huấn luyện và quản lý chó nghiệp vụ. Bạn cần hỗ trợ gì cụ thể?`
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================

    clearChat() {
        if (confirm('🗑️ Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện?')) {
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        Cuộc trò chuyện đã được xóa. Tôi vẫn ở đây để hỗ trợ bạn! 😊
                    </div>
                </div>
            `;
            this.chatHistory = [];
        }
    }

    showNotification() {
        if (!this.isOpen) {
            document.getElementById('chatNotification').style.display = 'flex';
        }
    }

    // =============================================================================
    // INTEGRATION WITH MAIN SYSTEM
    // =============================================================================

    async getSystemContext() {
        // Get current user's context for personalized responses
        return {
            role: this.currentUser.role,
            name: this.currentUser.full_name,
            recentActivity: await this.getRecentActivity()
        };
    }

    async getRecentActivity() {
        // Mock recent activity - in real implementation, fetch from API
        return {
            lastLogin: new Date().toLocaleDateString('vi-VN'),
            journalsToday: 0,
            pendingApprovals: 2
        };
    }

    // Public methods for external integration
    openChatWith(message) {
        if (!this.isOpen) {
            this.toggleChat();
        }
        setTimeout(() => {
            document.getElementById('chatInput').value = message;
            document.getElementById('chatInput').focus();
        }, 300);
    }

    sendSystemMessage(message) {
        if (!this.isOpen) {
            this.showNotification();
        }
        this.addMessage(message, 'bot');
    }
}

// =============================================================================
// GLOBAL INSTANCE
// =============================================================================

let aiChat;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize after a short delay to ensure other systems are ready
    setTimeout(() => {
        aiChat = new AIChatSystem();
    }, 1000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIChatSystem;
}