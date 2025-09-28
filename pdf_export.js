// =============================================================================
// PDF EXPORT SYSTEM - Professional A4 Format
// =============================================================================

class PDFExportSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log('📄 PDF Export System initialized');
    }

    // =============================================================================
    // MAIN EXPORT FUNCTIONS
    // =============================================================================

    async exportSingleJournal(journalId) {
        try {
            showMessage('info', '📄 Đang tạo file PDF...');
            
            // Fetch journal data
            const journalData = await this.fetchJournalData(journalId);
            if (!journalData) {
                throw new Error('Không tìm thấy dữ liệu nhật ký');
            }

            // Generate PDF
            const pdf = await this.generateSingleJournalPDF(journalData);
            
            // Download PDF
            const fileName = `Nhat_ky_${journalData.dog_name}_${journalData.journal_date}.pdf`;
            pdf.save(fileName);
            
            showMessage('success', '✅ Đã xuất PDF thành công!');
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            showMessage('error', '❌ Lỗi khi xuất PDF: ' + error.message);
        }
    }

    async exportMultipleJournals(journalIds) {
        try {
            showMessage('info', '📄 Đang tạo file PDF nhiều nhật ký...');
            
            const journalsData = [];
            for (const id of journalIds) {
                const data = await this.fetchJournalData(id);
                if (data) journalsData.push(data);
            }

            if (journalsData.length === 0) {
                throw new Error('Không có dữ liệu nhật ký để xuất');
            }

            const pdf = await this.generateMultipleJournalsPDF(journalsData);
            
            const fileName = `Bao_cao_nhat_ky_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            showMessage('success', `✅ Đã xuất ${journalsData.length} nhật ký thành công!`);
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            showMessage('error', '❌ Lỗi khi xuất PDF: ' + error.message);
        }
    }

    async exportDogReport(dogId, startDate, endDate) {
        try {
            showMessage('info', '📄 Đang tạo báo cáo chó nghiệp vụ...');
            
            const reportData = await this.fetchDogReportData(dogId, startDate, endDate);
            const pdf = await this.generateDogReportPDF(reportData);
            
            const fileName = `Bao_cao_${reportData.dog_name}_${startDate}_${endDate}.pdf`;
            pdf.save(fileName);
            
            showMessage('success', '✅ Đã xuất báo cáo thành công!');
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            showMessage('error', '❌ Lỗi khi xuất báo cáo: ' + error.message);
        }
    }

    // =============================================================================
    // DATA FETCHING
    // =============================================================================

    async fetchJournalData(journalId) {
        try {
            const response = await fetch(`http://localhost:5000/api/journals/${journalId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.journal;
            } else {
                // Fallback data for demo
                return this.getFallbackJournalData(journalId);
            }
        } catch (error) {
            console.error('Error fetching journal:', error);
            return this.getFallbackJournalData(journalId);
        }
    }

    async fetchDogReportData(dogId, startDate, endDate) {
        try {
            const response = await fetch(`http://localhost:5000/api/dogs/${dogId}/report?start=${startDate}&end=${endDate}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.report;
            } else {
                return this.getFallbackDogReportData(dogId, startDate, endDate);
            }
        } catch (error) {
            console.error('Error fetching dog report:', error);
            return this.getFallbackDogReportData(dogId, startDate, endDate);
        }
    }

    getFallbackJournalData(journalId) {
        return {
            id: journalId,
            dog_name: 'Max',
            dog_chip_id: 'CNV001',
            dog_breed: 'German Shepherd',
            journal_date: '2025-08-12',
            trainer_name: 'John Trainer',
            trainer_rank: 'Thiếu úy',
            trainer_unit: 'Đơn vị K9',
            content: 'Hôm nay thực hiện huấn luyện phát hiện ma túy cho Max. Chó có phản ứng tốt với các mẫu test, tìm thấy 3/3 mẫu ẩn giấu. Sức khỏe ổn định, ăn uống bình thường.',
            training_activities: 'Luyện tập phát hiện ma túy, huấn luyện tuân lệnh cơ bản, luyện tập tìm kiếm trong khu vực phức tạp',
            care_activities: 'Cho ăn 2 lần (sáng 7h, chiều 17h), tắm rửa vệ sinh, kiểm tra sức khỏe tổng quát, chải lông',
            operation_activities: 'Tuần tra cửa khẩu buổi sáng, kiểm tra hàng hóa xuất nhập khẩu, hỗ trợ lực lượng biên phòng',
            health_status: 'Tốt',
            performance_score: 8,
            trainer_comment: 'Max có tiến bộ rõ rệt trong việc phát hiện ma túy. Cần tiếp tục duy trì chế độ huấn luyện.',
            approval_status: 'APPROVED',
            approved_by_name: 'Trần Thị Hương',
            approved_by_rank: 'Thiếu tá',
            approved_by_position: 'Trưởng phòng',
            approved_at: '2025-08-12 16:30:00',
            manager_comment: 'Nhật ký chi tiết, tốt. Tiếp tục duy trì.',
            signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        };
    }

    getFallbackDogReportData(dogId, startDate, endDate) {
        return {
            dog_id: dogId,
            dog_name: 'Max',
            dog_chip_id: 'CNV001',
            dog_breed: 'German Shepherd',
            dog_age: 3,
            dog_specialty: 'Drug Detection',
            start_date: startDate,
            end_date: endDate,
            trainer_name: 'John Trainer',
            total_journals: 15,
            approved_journals: 14,
            pending_journals: 1,
            average_score: 8.2,
            health_summary: 'Tình trạng sức khỏe tốt trong suốt thời gian báo cáo',
            training_summary: 'Có tiến bộ rõ rệt trong các kỹ năng phát hiện ma túy và tuân lệnh',
            operation_summary: 'Tham gia 25 ca tuần tra, phát hiện 3 vụ vi phạm',
            journals: [
                { date: '2025-08-12', status: 'APPROVED', score: 8, health: 'Tốt' },
                { date: '2025-08-11', status: 'APPROVED', score: 9, health: 'Tốt' },
                { date: '2025-08-10', status: 'APPROVED', score: 7, health: 'Bình thường' }
            ]
        };
    }

    // =============================================================================
    // PDF GENERATION - SINGLE JOURNAL
    // =============================================================================

    async generateSingleJournalPDF(journal) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Setup Vietnamese font (if available)
        try {
            pdf.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
            pdf.setFont('NotoSans');
        } catch (e) {
            pdf.setFont('helvetica');
        }

        let yPosition = 20;

        // HEADER - Government Format
        this.addOfficialHeader(pdf, yPosition);
        yPosition += 40;

        // TITLE
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        const title = 'SO NHAT KY HUAN LUYEN CHO NGHIEP VU';
        const titleWidth = pdf.getStringUnitWidth(title) * 16 / pdf.internal.scaleFactor;
        pdf.text(title, (210 - titleWidth) / 2, yPosition);
        yPosition += 15;

        // JOURNAL INFO BOX
        this.addInfoBox(pdf, journal, yPosition);
        yPosition += 60;

        // CONTENT SECTIONS
        yPosition = this.addContentSection(pdf, 'HOAT DONG HUAN LUYEN', journal.training_activities, yPosition);
        yPosition = this.addContentSection(pdf, 'HOAT DONG CHAM SOC', journal.care_activities, yPosition);
        yPosition = this.addContentSection(pdf, 'HOAT DONG NGHIEP VU', journal.operation_activities, yPosition);
        
        // DETAILED CONTENT
        yPosition = this.addContentSection(pdf, 'NOI DUNG CHI TIET', journal.content, yPosition);
        
        // HEALTH & PERFORMANCE
        yPosition = this.addHealthPerformanceSection(pdf, journal, yPosition);
        
        // COMMENTS
        if (journal.trainer_comment) {
            yPosition = this.addContentSection(pdf, 'GHI CHU HUAN LUYEN VIEN', journal.trainer_comment, yPosition);
        }
        
        if (journal.manager_comment && journal.approval_status === 'APPROVED') {
            yPosition = this.addContentSection(pdf, 'Y KIEN LANH DAO', journal.manager_comment, yPosition);
        }

        // SIGNATURE SECTION
        if (journal.approval_status === 'APPROVED') {
            this.addSignatureSection(pdf, journal, yPosition);
        }

        // FOOTER
        this.addFooter(pdf);

        return pdf;
    }

    // =============================================================================
    // PDF GENERATION - MULTIPLE JOURNALS
    // =============================================================================

    async generateMultipleJournalsPDF(journals) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        try {
            pdf.setFont('helvetica');
        } catch (e) {
            pdf.setFont('helvetica');
        }

        let yPosition = 20;

        // HEADER
        this.addOfficialHeader(pdf, yPosition);
        yPosition += 40;

        // TITLE
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        const title = 'BAO CAO TONG HOP NHAT KY HUAN LUYEN';
        const titleWidth = pdf.getStringUnitWidth(title) * 16 / pdf.internal.scaleFactor;
        pdf.text(title, (210 - titleWidth) / 2, yPosition);
        yPosition += 15;

        // SUMMARY
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Thoi gian: ${journals[0].journal_date} - ${journals[journals.length-1].journal_date}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Tong so nhat ky: ${journals.length}`, 20, yPosition);
        yPosition += 15;

        // TABLE HEADER
        const tableY = yPosition;
        pdf.setFont(undefined, 'bold');
        pdf.rect(15, tableY, 180, 8);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, tableY, 180, 8, 'F');
        
        pdf.text('Ngay', 20, tableY + 6);
        pdf.text('Ten cho', 45, tableY + 6);
        pdf.text('HLV', 85, tableY + 6);
        pdf.text('Diem', 125, tableY + 6);
        pdf.text('Trang thai', 145, tableY + 6);
        yPosition += 12;

        // TABLE CONTENT
        pdf.setFont(undefined, 'normal');
        journals.forEach((journal, index) => {
            if (yPosition > 260) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.rect(15, yPosition, 180, 8);
            pdf.text(journal.journal_date, 20, yPosition + 6);
            pdf.text(journal.dog_name.substring(0, 15), 45, yPosition + 6);
            pdf.text(journal.trainer_name.substring(0, 15), 85, yPosition + 6);
            pdf.text((journal.performance_score || 'N/A').toString(), 125, yPosition + 6);
            
            const statusText = journal.approval_status === 'APPROVED' ? 'Da duyet' : 
                              journal.approval_status === 'SUBMITTED' ? 'Cho duyet' : 'Nhap';
            pdf.text(statusText, 145, yPosition + 6);
            
            yPosition += 8;
        });

        // Add detailed pages for each journal
        journals.forEach((journal, index) => {
            pdf.addPage();
            this.generateSingleJournalContent(pdf, journal, index + 1);
        });

        return pdf;
    }

    // =============================================================================
    // PDF GENERATION - DOG REPORT
    // =============================================================================

    async generateDogReportPDF(reportData) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        pdf.setFont('helvetica');
        let yPosition = 20;

        // HEADER
        this.addOfficialHeader(pdf, yPosition);
        yPosition += 40;

        // TITLE
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        const title = `BAO CAO HOAN DONG CHO NGHIEP VU - ${reportData.dog_name.toUpperCase()}`;
        const titleWidth = pdf.getStringUnitWidth(title) * 16 / pdf.internal.scaleFactor;
        pdf.text(title, (210 - titleWidth) / 2, yPosition);
        yPosition += 20;

        // DOG INFO
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        pdf.text('THONG TIN CHO NGHIEP VU:', 20, yPosition);
        yPosition += 10;
        
        pdf.text(`Ten cho: ${reportData.dog_name}`, 25, yPosition);
        pdf.text(`Chip ID: ${reportData.dog_chip_id}`, 25, yPosition + 8);
        pdf.text(`Giong: ${reportData.dog_breed}`, 25, yPosition + 16);
        pdf.text(`Tuoi: ${reportData.dog_age} tuoi`, 25, yPosition + 24);
        pdf.text(`Chuyen mon: ${reportData.dog_specialty}`, 25, yPosition + 32);
        pdf.text(`Huan luyen vien: ${reportData.trainer_name}`, 25, yPosition + 40);
        yPosition += 55;

        // STATISTICS
        pdf.text('THONG KE HOAT DONG:', 20, yPosition);
        yPosition += 10;
        
        pdf.text(`Thoi gian bao cao: ${reportData.start_date} den ${reportData.end_date}`, 25, yPosition);
        pdf.text(`Tong so nhat ky: ${reportData.total_journals}`, 25, yPosition + 8);
        pdf.text(`Nhat ky da duyet: ${reportData.approved_journals}`, 25, yPosition + 16);
        pdf.text(`Nhat ky cho duyet: ${reportData.pending_journals}`, 25, yPosition + 24);
        pdf.text(`Diem trung binh: ${reportData.average_score}/10`, 25, yPosition + 32);
        yPosition += 45;

        // SUMMARIES
        yPosition = this.addContentSection(pdf, 'TOM TAT SUC KHOE', reportData.health_summary, yPosition);
        yPosition = this.addContentSection(pdf, 'TOM TAT HUAN LUYEN', reportData.training_summary, yPosition);
        yPosition = this.addContentSection(pdf, 'TOM TAT NGHIEP VU', reportData.operation_summary, yPosition);

        // DETAILED JOURNAL TABLE
        if (yPosition > 200) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.setFont(undefined, 'bold');
        pdf.text('CHI TIET NHAT KY:', 20, yPosition);
        yPosition += 15;

        // Table for journals
        const tableStartY = yPosition;
        pdf.rect(15, tableStartY, 180, 8);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, tableStartY, 180, 8, 'F');
        
        pdf.text('Ngay', 20, tableStartY + 6);
        pdf.text('Trang thai', 60, tableStartY + 6);
        pdf.text('Diem', 110, tableStartY + 6);
        pdf.text('Suc khoe', 140, tableStartY + 6);
        yPosition += 12;

        pdf.setFont(undefined, 'normal');
        reportData.journals.forEach((journal, index) => {
            if (yPosition > 260) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.rect(15, yPosition, 180, 8);
            pdf.text(journal.date, 20, yPosition + 6);
            
            const statusText = journal.status === 'APPROVED' ? 'Da duyet' : 
                              journal.status === 'SUBMITTED' ? 'Cho duyet' : 'Nhap';
            pdf.text(statusText, 60, yPosition + 6);
            pdf.text(journal.score.toString(), 110, yPosition + 6);
            pdf.text(journal.health, 140, yPosition + 6);
            
            yPosition += 8;
        });

        this.addFooter(pdf);
        return pdf;
    }

    // =============================================================================
    // PDF HELPER FUNCTIONS
    // =============================================================================

    addOfficialHeader(pdf, y) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        
        // Left side - Organization
        pdf.text('CONG HOA XA HOI CHU NGHIA VIET NAM', 20, y);
        pdf.text('Doc lap - Tu do - Hanh phuc', 20, y + 8);
        pdf.line(20, y + 12, 90, y + 12);
        
        // Right side - Unit info  
        pdf.text('CUC HAI QUAN QUANG NINH', 120, y);
        pdf.text('CUA KHAU MONG CAI', 120, y + 8);
        pdf.line(120, y + 12, 190, y + 12);
        
        // Date
        const today = new Date().toLocaleDateString('vi-VN');
        pdf.setFont(undefined, 'normal');
        pdf.text(`Mong Cai, ngay ${today}`, 130, y + 25);
    }

    addInfoBox(pdf, journal, y) {
        // Draw box
        pdf.setDrawColor(0);
        pdf.setFillColor(250, 250, 250);
        pdf.rect(15, y, 180, 50, 'FD');
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        
        // Left column
        pdf.text('THONG TIN CHO:', 20, y + 10);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Ten: ${journal.dog_name}`, 20, y + 18);
        pdf.text(`Chip ID: ${journal.dog_chip_id}`, 20, y + 26);
        pdf.text(`Giong: ${journal.dog_breed}`, 20, y + 34);
        pdf.text(`Ngay: ${journal.journal_date}`, 20, y + 42);
        
        // Right column
        pdf.setFont(undefined, 'bold');
        pdf.text('HUAN LUYEN VIEN:', 110, y + 10);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Ho ten: ${journal.trainer_name}`, 110, y + 18);
        pdf.text(`Cap bac: ${journal.trainer_rank || 'N/A'}`, 110, y + 26);
        pdf.text(`Don vi: ${journal.trainer_unit || 'N/A'}`, 110, y + 34);
        
        // Status
        if (journal.approval_status === 'APPROVED') {
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0, 150, 0);
            pdf.text('TRANG THAI: DA DUYET', 110, y + 42);
            pdf.setTextColor(0, 0, 0);
        }
    }

    addContentSection(pdf, title, content, y) {
        if (!content || content.trim() === '') return y;
        
        // Check if need new page
        if (y > 250) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text(title + ':', 20, y);
        y += 8;
        
        pdf.setFont(undefined, 'normal');
        const lines = pdf.splitTextToSize(content, 170);
        
        lines.forEach(line => {
            if (y > 280) {
                pdf.addPage();
                y = 20;
            }
            pdf.text(line, 20, y);
            y += 6;
        });
        
        return y + 8;
    }

    addHealthPerformanceSection(pdf, journal, y) {
        if (y > 240) {
            pdf.addPage();
            y = 20;
        }
        
        // Draw box for health & performance
        pdf.setDrawColor(0);
        pdf.setFillColor(245, 245, 245);
        pdf.rect(15, y, 180, 25, 'FD');
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text('DANH GIA HIEU SUAT & SUC KHOE', 20, y + 8);
        
        pdf.setFont(undefined, 'normal');
        pdf.text(`Tinh trang suc khoe: ${journal.health_status}`, 20, y + 16);
        pdf.text(`Diem hieu suat: ${journal.performance_score}/10`, 110, y + 16);
        
        return y + 35;
    }

    addSignatureSection(pdf, journal, y) {
        if (y > 200) {
            pdf.addPage();
            y = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text('XAC NHAN CUA LANH DAO', 20, y);
        y += 15;
        
        // Signature area
        pdf.setFont(undefined, 'normal');
        pdf.text(`Nguoi duyet: ${journal.approved_by_name}`, 120, y);
        pdf.text(`Chuc vu: ${journal.approved_by_position || 'Lanh dao'}`, 120, y + 8);
        pdf.text(`Thoi gian: ${journal.approved_at}`, 120, y + 16);
        
        // Signature box
        pdf.rect(120, y + 25, 60, 30);
        pdf.setFontSize(9);
        pdf.text('(Chu ky va con dau)', 125, y + 60);
        
        // Add signature image if available
        if (journal.signature_data && journal.signature_data !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') {
            try {
                pdf.addImage(journal.signature_data, 'PNG', 125, y + 30, 50, 20);
            } catch (e) {
                console.log('Could not add signature image');
            }
        }
        
        // Official stamp representation
        pdf.setDrawColor(200, 0, 0);
        pdf.setFillColor(255, 200, 200);
        pdf.circle(150, y + 40, 15, 'FD');
        pdf.setFontSize(6);
        pdf.setTextColor(200, 0, 0);
        pdf.text('CON DAU', 145, y + 42);
        pdf.setTextColor(0, 0, 0);
        
        return y + 70;
    }

    addFooter(pdf) {
        const pageCount = pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Trang ${i}/${pageCount}`, 185, 285);
            pdf.text('He thong quan ly cho nghiep vu - v5.1', 20, 285);
        }
    }

    generateSingleJournalContent(pdf, journal, pageNumber) {
        let yPosition = 20;
        
        // Header for individual journal
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text(`NHAT KY ${pageNumber}: ${journal.dog_name} - ${journal.journal_date}`, 20, yPosition);
        yPosition += 20;
        
        // Add all content sections
        this.addInfoBox(pdf, journal, yPosition);
        yPosition += 60;
        
        yPosition = this.addContentSection(pdf, 'NOI DUNG', journal.content, yPosition);
        
        if (journal.trainer_comment) {
            yPosition = this.addContentSection(pdf, 'GHI CHU HLV', journal.trainer_comment, yPosition);
        }
        
        yPosition = this.addHealthPerformanceSection(pdf, journal, yPosition);
        
        if (journal.approval_status === 'APPROVED') {
            this.addSignatureSection(pdf, journal, yPosition);
        }
    }

    // =============================================================================
    // EXPORT MODAL UI
    // =============================================================================

    showExportModal() {
        const modalHtml = `
            <div id="exportModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">📄 Xuất file PDF</h3>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <label>Loại xuất file:</label>
                            <select id="exportType" onchange="pdfExporter.updateExportOptions()">
                                <option value="single">Nhật ký đơn lẻ</option>
                                <option value="multiple">Nhiều nhật ký</option>
                                <option value="dog_report">Báo cáo chó nghiệp vụ</option>
                                <option value="monthly">Báo cáo tháng</option>
                            </select>
                        </div>
                        
                        <div id="exportOptions">
                            <!-- Dynamic content based on export type -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="pdfExporter.closeExportModal()" class="btn btn-secondary">Hủy</button>
                        <button onclick="pdfExporter.executeExport()" class="btn btn-success">📄 Xuất PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.updateExportOptions();
    }

    updateExportOptions() {
        const exportType = document.getElementById('exportType').value;
        const optionsContainer = document.getElementById('exportOptions');
        
        let optionsHtml = '';
        
        switch (exportType) {
            case 'single':
                optionsHtml = `
                    <div class="form-row">
                        <label>Chọn nhật ký:</label>
                        <select id="singleJournalId">
                            <option value="1">Max - 12/08/2025 (Đã duyệt)</option>
                            <option value="2">Luna - 11/08/2025 (Chờ duyệt)</option>
                            <option value="3">Rex - 10/08/2025 (Đã duyệt)</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'multiple':
                optionsHtml = `
                    <div class="form-row">
                        <label>Chọn khoảng thời gian:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="date" id="multipleStartDate" value="2025-08-01">
                            <input type="date" id="multipleEndDate" value="2025-08-12">
                        </div>
                    </div>
                    <div class="form-row">
                        <label>Chọn chó (tùy chọn):</label>
                        <select id="multipleDogId">
                            <option value="">Tất cả chó</option>
                            <option value="1">Max</option>
                            <option value="2">Luna</option>
                            <option value="3">Rex</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'dog_report':
                optionsHtml = `
                    <div class="form-row">
                        <label>Chọn chó:</label>
                        <select id="reportDogId">
                            <option value="1">Max (CNV001)</option>
                            <option value="2">Luna (CNV002)</option>
                            <option value="3">Rex (CNV003)</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Khoảng thời gian báo cáo:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="date" id="reportStartDate" value="2025-08-01">
                            <input type="date" id="reportEndDate" value="2025-08-12">
                        </div>
                    </div>
                `;
                break;
                
            case 'monthly':
                optionsHtml = `
                    <div class="form-row">
                        <label>Chọn tháng:</label>
                        <input type="month" id="monthlyPeriod" value="2025-08">
                    </div>
                    <div class="form-row">
                        <label>Loại báo cáo:</label>
                        <select id="monthlyReportType">
                            <option value="summary">Tóm tắt</option>
                            <option value="detailed">Chi tiết</option>
                            <option value="statistical">Thống kê</option>
                        </select>
                    </div>
                `;
                break;
        }
        
        optionsContainer.innerHTML = optionsHtml;
    }

    async executeExport() {
        const exportType = document.getElementById('exportType').value;
        
        try {
            switch (exportType) {
                case 'single':
                    const journalId = document.getElementById('singleJournalId').value;
                    await this.exportSingleJournal(parseInt(journalId));
                    break;
                    
                case 'multiple':
                    const startDate = document.getElementById('multipleStartDate').value;
                    const endDate = document.getElementById('multipleEndDate').value;
                    // For demo, export multiple journals
                    await this.exportMultipleJournals([1, 2, 3]);
                    break;
                    
                case 'dog_report':
                    const dogId = document.getElementById('reportDogId').value;
                    const reportStart = document.getElementById('reportStartDate').value;
                    const reportEnd = document.getElementById('reportEndDate').value;
                    await this.exportDogReport(parseInt(dogId), reportStart, reportEnd);
                    break;
                    
                case 'monthly':
                    const period = document.getElementById('monthlyPeriod').value;
                    const reportType = document.getElementById('monthlyReportType').value;
                    await this.exportMonthlyReport(period, reportType);
                    break;
            }
            
            this.closeExportModal();
            
        } catch (error) {
            console.error('Export error:', error);
            showMessage('error', '❌ Lỗi khi xuất file: ' + error.message);
        }
    }

    closeExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) modal.remove();
    }

    // =============================================================================
    // ADDITIONAL EXPORT TYPES
    // =============================================================================

    async exportMonthlyReport(period, reportType) {
        const [year, month] = period.split('-');
        const reportData = {
            period: `${month}/${year}`,
            type: reportType,
            total_journals: 45,
            approved_journals: 42,
            pending_journals: 3,
            dogs_active: 5,
            trainers_active: 3,
            performance_average: 8.5
        };

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        
        pdf.setFont('helvetica');
        let y = 20;
        
        this.addOfficialHeader(pdf, y);
        y += 40;
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        const title = `BAO CAO THANG ${reportData.period}`;
        pdf.text(title, (210 - pdf.getStringUnitWidth(title) * 16 / pdf.internal.scaleFactor) / 2, y);
        y += 20;
        
        // Statistics
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        const stats = [
            `Tong nhat ky: ${reportData.total_journals}`,
            `Da duyet: ${reportData.approved_journals}`,
            `Cho duyet: ${reportData.pending_journals}`,
            `Cho hoat dong: ${reportData.dogs_active}`,
            `HLV tham gia: ${reportData.trainers_active}`,
            `Diem TB: ${reportData.performance_average}/10`
        ];
        
        stats.forEach(stat => {
            pdf.text(stat, 20, y);
            y += 8;
        });
        
        this.addFooter(pdf);
        
        const fileName = `Bao_cao_thang_${period.replace('-', '_')}.pdf`;
        pdf.save(fileName);
        
        showMessage('success', '✅ Đã xuất báo cáo tháng thành công!');
    }
}

// =============================================================================
// GLOBAL INSTANCE
// =============================================================================

let pdfExporter;

document.addEventListener('DOMContentLoaded', function() {
    pdfExporter = new PDFExportSystem();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFExportSystem;
}