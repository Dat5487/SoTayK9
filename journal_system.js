// =============================================================================
// JOURNAL SYSTEM - Complete Implementation
// =============================================================================

class JournalSystem {
    constructor() {
        this.currentUser = null;
        this.currentJournals = [];
        this.selectedDogId = null;
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log('📝 Journal System initialized for:', this.currentUser.role);
    }

    // =============================================================================
    // JOURNAL MODAL - ROLE-BASED UI
    // =============================================================================
    
    openJournalModal(dogId = null) {
        this.selectedDogId = dogId;
        
        if (this.currentUser.role === 'TRAINER') {
            this.openTrainerJournalModal(dogId);
        } else if (this.currentUser.role === 'MANAGER') {
            this.openManagerApprovalModal();
        } else if (this.currentUser.role === 'ADMIN') {
            this.openAdminJournalModal();
        }
    }

    // =============================================================================
    // TRAINER - WRITE JOURNAL
    // =============================================================================
    
    async openTrainerJournalModal(dogId) {
        let dogsOptions = '';
        
        if (dogId) {
            // Writing for specific dog
            const dog = currentDogs.find(d => d.id === dogId);
            dogsOptions = `<option value="${dogId}">${dog.name} (${dog.chip_id})</option>`;
        } else {
            // Show all assigned dogs
            const assignedDogs = currentDogs.filter(d => d.trainer && d.trainer.id == this.currentUser.id);
            if (assignedDogs.length === 0) {
                showMessage('warning', '⚠️ Bạn chưa được gán chó nào để viết nhật ký');
                return;
            }
            
            dogsOptions = assignedDogs.map(dog => 
                `<option value="${dog.id}">${dog.name} (${dog.chip_id})</option>`
            ).join('');
        }

        const today = new Date().toISOString().split('T')[0];
        
        const modalHtml = `
            <div id="journalModal" class="modal">
                <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3 class="modal-title">📝 Viết sổ nhật ký - ${today}</h3>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-row">
                                <label>Chọn chó: *</label>
                                <select id="journalDogId" ${dogId ? 'disabled' : ''}>
                                    ${dogsOptions}
                                </select>
                            </div>
                            <div class="form-row">
                                <label>Ngày: *</label>
                                <input type="date" id="journalDate" value="${today}">
                            </div>
                        </div>

                        <div class="form-row">
                            <label>📚 Hoạt động huấn luyện:</label>
                            <textarea id="trainingActivities" rows="3" placeholder="VD: Luyện tập phát hiện ma túy, huấn luyện tuân lệnh cơ bản..."></textarea>
                        </div>

                        <div class="form-row">
                            <label>🏠 Hoạt động chăm sóc:</label>
                            <textarea id="careActivities" rows="3" placeholder="VD: Cho ăn 2 lần, tắm rửa, kiểm tra sức khỏe..."></textarea>
                        </div>

                        <div class="form-row">
                            <label>🚁 Hoạt động nghiệp vụ:</label>
                            <textarea id="operationActivities" rows="3" placeholder="VD: Tuần tra cửa khẩu, kiểm tra hàng hóa xuất nhập..."></textarea>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-row">
                                <label>💊 Tình trạng sức khỏe:</label>
                                <select id="healthStatus">
                                    <option value="Tốt">Tốt</option>
                                    <option value="Bình thường">Bình thường</option>
                                    <option value="Cần theo dõi">Cần theo dõi</option>
                                    <option value="Cần khám">Cần khám</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <label>⭐ Đánh giá hiệu suất:</label>
                                <select id="performanceScore">
                                    <option value="10">10 - Xuất sắc</option>
                                    <option value="9">9 - Rất tốt</option>
                                    <option value="8">8 - Tốt</option>
                                    <option value="7">7 - Khá</option>
                                    <option value="6">6 - Trung bình</option>
                                    <option value="5">5 - Yếu</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <label>📝 Nội dung chi tiết nhật ký: *</label>
                            <textarea id="journalContent" rows="6" placeholder="Ghi lại chi tiết các hoạt động, tình trạng chó, những điều cần lưu ý..." required></textarea>
                        </div>

                        <div class="form-row">
                            <label>💬 Ghi chú của huấn luyện viên:</label>
                            <textarea id="trainerComment" rows="3" placeholder="Ghi chú thêm, đề xuất, kiến nghị..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="journalSystem.closeJournalModal()" class="btn btn-secondary">Hủy</button>
                        <button onclick="journalSystem.saveJournalDraft()" class="btn btn-info">💾 Lưu nháp</button>
                        <button onclick="journalSystem.submitJournal()" class="btn btn-success">📤 Gửi duyệt</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Load existing journal if exists
        if (dogId) {
            this.loadExistingJournal(dogId, today);
        }
    }

    async loadExistingJournal(dogId, date) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/journals?dog_id=${dogId}&date=${date}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.journal) {
                    const journal = data.journal;
                    
                    // Fill form with existing data
                    document.getElementById('trainingActivities').value = journal.training_activities || '';
                    document.getElementById('careActivities').value = journal.care_activities || '';
                    document.getElementById('operationActivities').value = journal.operation_activities || '';
                    document.getElementById('healthStatus').value = journal.health_status || 'Tốt';
                    document.getElementById('performanceScore').value = journal.performance_score || '8';
                    document.getElementById('journalContent').value = journal.content || '';
                    document.getElementById('trainerComment').value = journal.trainer_comment || '';
                }
            }
        } catch (error) {
            console.log('No existing journal found');
        }
    }

    async saveJournalDraft() {
        const journalData = this.getJournalFormData();
        journalData.status = 'DRAFT';
        
        try {
            const result = await this.saveJournalData(journalData);
            if (result.success) {
                showMessage('success', '💾 Đã lưu nháp nhật ký thành công!');
                this.closeJournalModal();
                this.loadJournalsList();
            }
        } catch (error) {
            showMessage('error', '❌ Lỗi khi lưu nhật ký: ' + error.message);
        }
    }

    async submitJournal() {
        const journalData = this.getJournalFormData();
        
        if (!journalData.content.trim()) {
            showMessage('error', '❌ Vui lòng nhập nội dung nhật ký');
            return;
        }

        if (!confirm('📤 Bạn có chắc chắn muốn gửi nhật ký này để lãnh đạo duyệt?\n\nSau khi gửi, bạn sẽ không thể chỉnh sửa cho đến khi được duyệt.')) {
            return;
        }
        
        journalData.status = 'SUBMITTED';
        
        try {
            const result = await this.saveJournalData(journalData);
            if (result.success) {
                // Submit for approval
                await fetch(`${this.apiBaseUrl}/journals/${result.journal_id}/submit`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                showMessage('success', '📤 Đã gửi nhật ký để lãnh đạo duyệt thành công!');
                this.closeJournalModal();
                this.loadJournalsList();
            }
        } catch (error) {
            showMessage('error', '❌ Lỗi khi gửi nhật ký: ' + error.message);
        }
    }

    getJournalFormData() {
        return {
            dog_id: parseInt(document.getElementById('journalDogId').value),
            journal_date: document.getElementById('journalDate').value,
            training_activities: document.getElementById('trainingActivities').value.trim(),
            care_activities: document.getElementById('careActivities').value.trim(),
            operation_activities: document.getElementById('operationActivities').value.trim(),
            health_status: document.getElementById('healthStatus').value,
            performance_score: parseInt(document.getElementById('performanceScore').value),
            content: document.getElementById('journalContent').value.trim(),
            trainer_comment: document.getElementById('trainerComment').value.trim()
        };
    }

    async saveJournalData(journalData) {
        const response = await fetch(`${this.apiBaseUrl}/journals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journalData)
        });
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }
        
        return result;
    }

    // =============================================================================
    // MANAGER - APPROVAL INTERFACE WITH DIGITAL SIGNATURE
    // =============================================================================
    
    async openManagerApprovalModal() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/journals?status=SUBMITTED`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            const data = await response.json();
            const pendingJournals = data.journals || [];
            
            if (pendingJournals.length === 0) {
                showMessage('info', '📋 Không có nhật ký nào cần duyệt');
                return;
            }
            
            let journalsHtml = '';
            pendingJournals.forEach(journal => {
                journalsHtml += `
                    <div class="journal-item" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: #f8f9fa;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0; color: #2d3748;">🐕 ${journal.dog_name} - ${journal.journal_date}</h4>
                            <span class="badge badge-warning">Chờ duyệt</span>
                        </div>
                        <p><strong>👤 Huấn luyện viên:</strong> ${journal.trainer_name}</p>
                        <p><strong>📝 Nội dung:</strong> ${journal.content.substring(0, 200)}${journal.content.length > 200 ? '...' : ''}</p>
                        <div style="margin-top: 1rem;">
                            <button onclick="journalSystem.viewFullJournal(${journal.id})" class="btn btn-info">👁️ Xem chi tiết</button>
                            <button onclick="journalSystem.approveJournal(${journal.id})" class="btn btn-success">✅ Duyệt</button>
                            <button onclick="journalSystem.rejectJournal(${journal.id})" class="btn btn-danger">❌ Từ chối</button>
                        </div>
                    </div>
                `;
            });
            
            const modalHtml = `
                <div id="approvalModal" class="modal">
                    <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
                        <div class="modal-header">
                            <h3 class="modal-title">📋 Duyệt nhật ký huấn luyện - Lãnh đạo</h3>
                        </div>
                        <div class="modal-body">
                            ${journalsHtml}
                        </div>
                        <div class="modal-footer">
                            <button onclick="journalSystem.closeApprovalModal()" class="btn btn-secondary">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
        } catch (error) {
            showMessage('error', '❌ Lỗi khi tải danh sách nhật ký: ' + error.message);
        }
    }

    async viewFullJournal(journalId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/journals/${journalId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            const data = await response.json();
            const journal = data.journal;
            
            const detailHtml = `
                <div id="journalDetailModal" class="modal">
                    <div class="modal-content" style="max-width: 800px;">
                        <div class="modal-header">
                            <h3 class="modal-title">📄 Chi tiết nhật ký - ${journal.dog_name}</h3>
                        </div>
                        <div class="modal-body">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                                <p><strong>Ngày:</strong> ${journal.journal_date}</p>
                                <p><strong>Huấn luyện viên:</strong> ${journal.trainer_name}</p>
                                <p><strong>Sức khỏe:</strong> ${journal.health_status}</p>
                                <p><strong>Điểm hiệu suất:</strong> ${journal.performance_score}/10</p>
                            </div>
                            
                            ${journal.training_activities ? `<div><strong>📚 Hoạt động huấn luyện:</strong><p>${journal.training_activities}</p></div>` : ''}
                            ${journal.care_activities ? `<div><strong>🏠 Hoạt động chăm sóc:</strong><p>${journal.care_activities}</p></div>` : ''}
                            ${journal.operation_activities ? `<div><strong>🚁 Hoạt động nghiệp vụ:</strong><p>${journal.operation_activities}</p></div>` : ''}
                            
                            <div><strong>📝 Nội dung chi tiết:</strong><p>${journal.content}</p></div>
                            
                            ${journal.trainer_comment ? `<div><strong>💬 Ghi chú HLV:</strong><p>${journal.trainer_comment}</p></div>` : ''}
                        </div>
                        <div class="modal-footer">
                            <button onclick="journalSystem.closeJournalDetail()" class="btn btn-secondary">Đóng</button>
                            <button onclick="journalSystem.showApprovalForm(${journalId})" class="btn btn-success">✍️ Ký duyệt</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', detailHtml);
            
        } catch (error) {
            showMessage('error', '❌ Lỗi khi tải chi tiết nhật ký');
        }
    }

    showApprovalForm(journalId) {
        const approvalHtml = `
            <div id="approvalFormModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">✍️ Ký duyệt nhật ký</h3>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <label>📝 Ý kiến của lãnh đạo:</label>
                            <textarea id="managerComment" rows="4" placeholder="Nhập ý kiến duyệt, góp ý hoặc yêu cầu bổ sung..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <label>✍️ Chữ ký số:</label>
                            <canvas id="signatureCanvas" width="400" height="150" style="border: 1px solid #ccc; border-radius: 4px; cursor: crosshair;"></canvas>
                            <div style="margin-top: 0.5rem;">
                                <button onclick="journalSystem.clearSignature()" class="btn btn-warning" style="font-size: 0.8rem;">🗑️ Xóa</button>
                                <span style="color: #718096; font-size: 0.85rem; margin-left: 1rem;">* Vui lòng ký tên trên khung trên</span>
                            </div>
                        </div>

                        <div class="form-row">
                            <label>🏢 Con dấu cơ quan:</label>
                            <div style="text-align: center; padding: 2rem; border: 2px dashed #4299e1; border-radius: 8px; background: #f0f8ff;">
                                <div style="width: 120px; height: 120px; border: 3px solid #c53030; border-radius: 50%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(45deg, #ff6b6b, #ee5a52); color: white; font-weight: bold; position: relative;">
                                    <div style="font-size: 0.7rem; text-align: center; line-height: 1.1;">
                                        <div>CỘNG HÒA XÃ HỘI</div>
                                        <div>CHỦ NGHĨA VIỆT NAM</div>
                                        <div style="margin: 0.2rem 0;">⭐</div>
                                        <div>Độc lập - Tự do</div>
                                        <div>Hạnh phúc</div>
                                    </div>
                                    <div style="position: absolute; bottom: 8px; font-size: 0.6rem;">
                                        ${new Date().toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                <p style="margin-top: 1rem; font-weight: bold; color: #c53030;">CON DẤU CƠ QUAN</p>
                            </div>
                        </div>
                        
                        <div style="background: #f0fff4; border: 1px solid #c6f6d5; border-radius: 6px; padding: 1rem; margin-top: 1rem;">
                            <p style="margin: 0; font-size: 0.9rem; color: #22543d;">
                                <strong>📋 Xác nhận:</strong> Tôi đã xem xét và ký duyệt nhật ký này với chữ ký số và con dấu cơ quan.
                                Thời gian duyệt: <strong>${new Date().toLocaleString('vi-VN')}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="journalSystem.closeApprovalForm()" class="btn btn-secondary">Hủy</button>
                        <button onclick="journalSystem.finalizeApproval(${journalId})" class="btn btn-success">✅ Hoàn tất duyệt</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', approvalHtml);
        this.initSignatureCanvas();
    }

    initSignatureCanvas() {
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            isDrawing = true;
            [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            [lastX, lastY] = [currentX, currentY];
        });

        canvas.addEventListener('touchend', () => isDrawing = false);
    }

    clearSignature() {
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async finalizeApproval(journalId) {
        const managerComment = document.getElementById('managerComment').value.trim();
        const canvas = document.getElementById('signatureCanvas');
        
        // Check if signature exists
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasSignature = imageData.data.some(channel => channel !== 0);
        
        if (!hasSignature) {
            showMessage('error', '❌ Vui lòng ký tên trên khung chữ ký');
            return;
        }
        
        if (!confirm('✅ Xác nhận hoàn tất ký duyệt nhật ký?\n\nSau khi duyệt, nhật ký sẽ được lưu vào hệ thống và không thể thay đổi.')) {
            return;
        }
        
        try {
            // Convert signature to base64
            const signatureData = canvas.toDataURL();
            
            const approvalData = {
                action: 'approve',
                review_notes: managerComment,
                signature_data: signatureData,
                approval_timestamp: new Date().toISOString(),
                manager_name: this.currentUser.full_name,
                manager_position: this.currentUser.department
            };
            
            const response = await fetch(`${this.apiBaseUrl}/journals/${journalId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(approvalData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('success', '✅ Đã ký duyệt nhật ký thành công!');
                this.closeApprovalForm();
                this.closeJournalDetail();
                this.closeApprovalModal();
                this.loadJournalsList();
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            showMessage('error', '❌ Lỗi khi ký duyệt: ' + error.message);
        }
    }

    // =============================================================================
    // ADMIN - VIEW ALL JOURNALS
    // =============================================================================
    
    async openAdminJournalModal() {
        const modalHtml = `
            <div id="adminJournalModal" class="modal">
                <div class="modal-content" style="max-width: 1000px; max-height: 80vh;">
                    <div class="modal-header">
                        <h3 class="modal-title">📊 Quản lý tất cả nhật ký - Admin</h3>
                    </div>
                    <div class="modal-body" style="overflow-y: auto; max-height: 70vh;">
                        <div style="margin-bottom: 1rem; display: flex; gap: 1rem;">
                            <select id="adminFilterStatus" onchange="journalSystem.filterAdminJournals()">
                                <option value="">Tất cả trạng thái</option>
                                <option value="DRAFT">Nháp</option>
                                <option value="SUBMITTED">Chờ duyệt</option>
                                <option value="APPROVED">Đã duyệt</option>
                                <option value="REJECTED">Từ chối</option>
                            </select>
                            <input type="date" id="adminFilterDate" onchange="journalSystem.filterAdminJournals()" placeholder="Lọc theo ngày">
                            <button onclick="journalSystem.loadAdminJournals()" class="btn btn-primary">🔄 Tải lại</button>
                        </div>
                        <div id="adminJournalsContainer">
                            <div style="text-align: center; padding: 2rem;">
                                <div class="loading">
                                    <div class="spinner"></div>
                                    Đang tải dữ liệu...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="journalSystem.closeAdminModal()" class="btn btn-secondary">Đóng</button>
                        <button onclick="journalSystem.exportAllJournals()" class="btn btn-success">📄 Xuất PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.loadAdminJournals();
    }

    async loadAdminJournals() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/journals?all=true`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            const data = await response.json();
            const journals = data.journals || [];
            this.currentJournals = journals;
            
            this.renderAdminJournals(journals);
            
        } catch (error) {
            document.getElementById('adminJournalsContainer').innerHTML = 
                '<p style="text-align: center; color: #e53e3e;">❌ Lỗi khi tải dữ liệu nhật ký</p>';
        }
    }

    renderAdminJournals(journals) {
        const container = document.getElementById('adminJournalsContainer');
        
        if (journals.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #718096;">📋 Không có nhật ký nào</p>';
            return;
        }
        
        const journalsHtml = journals.map(journal => {
            const statusBadge = {
                'DRAFT': '<span class="badge" style="background: #f7fafc; color: #718096;">Nháp</span>',
                'SUBMITTED': '<span class="badge badge-warning">Chờ duyệt</span>',
                'APPROVED': '<span class="badge badge-success">Đã duyệt</span>',
                'REJECTED': '<span class="badge badge-danger">Từ chối</span>'
            }[journal.approval_status] || '<span class="badge">Unknown</span>';
            
            return `
                <div class="journal-admin-item" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0;">🐕 ${journal.dog_name} - ${journal.journal_date}</h4>
                        ${statusBadge}
                    </div>
                    <p><strong>👤 HLV:</strong> ${journal.trainer_name} | <strong>📝:</strong> ${journal.content.substring(0, 100)}...</p>
                    <div style="margin-top: 1rem;">
                        <button onclick="journalSystem.viewAdminJournal(${journal.id})" class="btn btn-info">👁️ Xem</button>
                        <button onclick="journalSystem.editAdminJournal(${journal.id})" class="btn btn-warning">✏️ Sửa</button>
                        <button onclick="journalSystem.deleteJournal(${journal.id})" class="btn btn-danger">🗑️ Xóa</button>
                        ${journal.approval_status === 'SUBMITTED' ? 
                            `<button onclick="journalSystem.quickApprove(${journal.id})" class="btn btn-success">✅ Duyệt nhanh</button>` : 
                            ''
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = journalsHtml;
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================
    
    closeJournalModal() {
        const modal = document.getElementById('journalModal');
        if (modal) modal.remove();
    }

    closeApprovalModal() {
        const modal = document.getElementById('approvalModal');
        if (modal) modal.remove();
    }

    closeJournalDetail() {
        const modal = document.getElementById('journalDetailModal');
        if (modal) modal.remove();
    }

    closeApprovalForm() {
        const modal = document.getElementById('approvalFormModal');
        if (modal) modal.remove();
    }

    closeAdminModal() {
        const modal = document.getElementById('adminJournalModal');
        if (modal) modal.remove();
    }

    async loadJournalsList() {
        // Refresh journals list in dashboard
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        }
    }
}

// =============================================================================
// GLOBAL INSTANCE
// =============================================================================

let journalSystem;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    journalSystem = new JournalSystem();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalSystem;
}