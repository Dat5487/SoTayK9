/**
 * Journal Database Manager
 * Handles all journal CRUD operations using the database API instead of localStorage
 */

class JournalDatabaseManager {
    constructor() {
        // Fix: Use localhost:5000 for API calls when running locally
        this.apiBaseUrl = window.location.protocol === 'file:' ? 'http://localhost:5000' : window.location.origin;
        this.currentJournalId = null;
        this.currentDogId = null;
        this.currentTrainerId = null;
        
        console.log('🔗 JournalDatabaseManager initialized with API URL:', this.apiBaseUrl);
    }

    // =============================================================================
    // JOURNAL CRUD OPERATIONS
    // =============================================================================

    async loadJournalData(dogName, date, createNew = false) {
        try {
            // First, get dog and trainer information
            const dogInfo = await this.getDogByName(dogName);
            if (!dogInfo) {
                console.error('Dog not found:', dogName);
                return null;
            }

            this.currentDogId = dogInfo.id;
            this.currentTrainerId = dogInfo.trainer_id;

            if (createNew) {
                // Create new journal
                this.currentJournalId = null;
                this.populateEmptyForm(dogName, date);
                return null;
            }

            // Try to find existing journal
            const journals = await this.getJournalsByDogAndDate(this.currentDogId, date);
            
            if (journals.length > 0) {
                const journal = journals[0];
                this.currentJournalId = journal.id;
                this.populateJournalForm(journal);
                return journal;
            } else {
                // No existing journal found
                this.currentJournalId = null;
                this.populateEmptyForm(dogName, date);
                return null;
            }

        } catch (error) {
            console.error('Error loading journal data:', error);
            alert('Có lỗi xảy ra khi tải dữ liệu nhật ký: ' + error.message);
            return null;
        }
    }

    async saveJournalData() {
        try {
            console.log('💾 Attempting to save journal to database...');
            console.log('🔗 API URL:', this.apiBaseUrl);
            
            const journalData = this.collectJournalFormData();
            
            if (!journalData.dog_id || !journalData.trainer_id) {
                throw new Error('Thiếu thông tin chó hoặc huấn luyện viên');
            }

            console.log('📝 Journal data prepared:', journalData);

            let result;
            if (this.currentJournalId) {
                // Update existing journal
                console.log('🔄 Updating existing journal ID:', this.currentJournalId);
                result = await this.updateJournal(this.currentJournalId, journalData);
            } else {
                // Create new journal
                console.log('➕ Creating new journal...');
                result = await this.createJournal(journalData);
                this.currentJournalId = result.data.id;
            }

            if (result.success) {
                this.notifyDashboardUpdate();
                alert('Nhật ký đã được lưu thành công vào cơ sở dữ liệu!');
                console.log('✅ Journal saved successfully to database:', result.data);
                return result.data;
            } else {
                throw new Error(result.error || 'Lỗi không xác định');
            }

        } catch (error) {
            console.error('❌ Error saving journal:', error);
            console.error('❌ Error details:', error.message);
            alert('Có lỗi xảy ra khi lưu nhật ký: ' + error.message);
            throw error;
        }
    }

    async deleteJournal(journalId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/journals/${journalId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                this.notifyDashboardUpdate();
                console.log('✅ Journal deleted successfully');
                return true;
            } else {
                throw new Error(result.error || 'Lỗi không xác định');
            }

        } catch (error) {
            console.error('Error deleting journal:', error);
            alert('Có lỗi xảy ra khi xóa nhật ký: ' + error.message);
            return false;
        }
    }

    // =============================================================================
    // API CALLS
    // =============================================================================

    async getDogByName(dogName) {
        try {
            console.log('🐕 Fetching dog info for:', dogName);
            const response = await fetch(`${this.apiBaseUrl}/api/dogs`);
            
            if (!response.ok) {
                throw new Error(`API Error ${response.status}: ${await response.text()}`);
            }
            
            const result = await response.json();
            console.log('🐕 Dogs API response:', result);
            
            if (result.success) {
                const dog = result.data.find(dog => dog.name === dogName);
                console.log('🐕 Found dog:', dog);
                return dog;
            }
            return null;
        } catch (error) {
            console.error('❌ Error fetching dogs:', error);
            return null;
        }
    }

    async getJournalsByDogAndDate(dogId, date) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/journals/by-dog/${dogId}`);
            const result = await response.json();
            
            if (result.success) {
                return result.data.filter(journal => journal.journal_date === date);
            }
            return [];
        } catch (error) {
            console.error('Error fetching journals by dog and date:', error);
            return [];
        }
    }

    async createJournal(journalData) {
        console.log('🌐 Making API call to create journal...');
        const response = await fetch(`${this.apiBaseUrl}/api/journals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journalData)
        });

        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('📄 API Response:', result);
        return result;
    }

    async updateJournal(journalId, journalData) {
        console.log('🌐 Making API call to update journal...');
        const response = await fetch(`${this.apiBaseUrl}/api/journals/${journalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journalData)
        });

        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('📄 API Response:', result);
        return result;
    }

    async approveJournal(journalId, approverId, approved = true, rejectionReason = null) {
        const response = await fetch(`${this.apiBaseUrl}/api/journals/${journalId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                approver_id: approverId,
                approved: approved,
                rejection_reason: rejectionReason
            })
        });

        return await response.json();
    }

    // =============================================================================
    // DATA CONVERSION AND FORM HANDLING
    // =============================================================================

    collectJournalFormData() {
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const trainerName = document.getElementById('journal_hlv').value;

        // Convert form data to database format
        const journalData = {
            dog_id: this.currentDogId,
            trainer_id: this.currentTrainerId,
            journal_date: date,
            training_activities: this.collectTrainingActivities(),
            care_activities: this.collectCareActivities(),
            operation_activities: this.collectOperationActivities(),
            health_status: this.getHealthStatus(),
            behavior_notes: document.getElementById('journal_hlv_comment').value || '',
            weather_conditions: this.getWeatherConditions(),
            challenges: document.getElementById('journal_other_issues').value || '',
            next_goals: this.getNextGoals(),
            training_duration: this.calculateTrainingDuration(),
            success_rate: this.calculateSuccessRate()
        };

        return journalData;
    }

    collectTrainingActivities() {
        const activities = [];
        const trainingBlocks = document.querySelectorAll('.training-block');
        
        trainingBlocks.forEach(block => {
            const content = block.querySelector('.training-content')?.value;
            if (content && content.trim()) {
                activities.push(content.trim());
            }
        });

        return activities.join('; ');
    }

    collectCareActivities() {
        const careData = {
            morning: document.getElementById('care_morning')?.value || '',
            afternoon: document.getElementById('care_afternoon')?.value || '',
            evening: document.getElementById('care_evening')?.value || ''
        };

        const activities = [];
        if (careData.morning) activities.push(`Sáng: ${careData.morning}`);
        if (careData.afternoon) activities.push(`Chiều: ${careData.afternoon}`);
        if (careData.evening) activities.push(`Tối: ${careData.evening}`);

        return activities.join('; ');
    }

    collectOperationActivities() {
        const activities = [];
        const operationBlocks = document.querySelectorAll('.operation-block');
        
        operationBlocks.forEach(block => {
            const content = block.querySelector('.operation-content')?.value;
            if (content && content.trim()) {
                activities.push(content.trim());
            }
        });

        return activities.join('; ');
    }

    getHealthStatus() {
        const healthSelect = document.getElementById('health_status');
        return healthSelect ? healthSelect.value : 'Tốt';
    }

    getWeatherConditions() {
        const weatherInput = document.getElementById('weather_conditions');
        return weatherInput ? weatherInput.value : '';
    }

    getNextGoals() {
        const nextGoalsInput = document.getElementById('next_goals');
        return nextGoalsInput ? nextGoalsInput.value : '';
    }

    calculateTrainingDuration() {
        // Calculate total training duration from training blocks
        const trainingBlocks = document.querySelectorAll('.training-block');
        let totalMinutes = 0;
        
        trainingBlocks.forEach(block => {
            const durationInput = block.querySelector('.training-duration');
            if (durationInput && durationInput.value) {
                totalMinutes += parseInt(durationInput.value) || 0;
            }
        });

        return totalMinutes;
    }

    calculateSuccessRate() {
        // Calculate average success rate from training blocks
        const trainingBlocks = document.querySelectorAll('.training-block');
        let totalRate = 0;
        let validBlocks = 0;
        
        trainingBlocks.forEach(block => {
            const rateInput = block.querySelector('.success-rate');
            if (rateInput && rateInput.value) {
                totalRate += parseInt(rateInput.value) || 0;
                validBlocks++;
            }
        });

        return validBlocks > 0 ? Math.round(totalRate / validBlocks) : 0;
    }

    populateJournalForm(journalData) {
        // Populate general info
        const dateField = document.getElementById('journal_date');
        const hlvField = document.getElementById('journal_hlv');
        const dogField = document.getElementById('journal_dog_name');
        
        if (dateField) dateField.value = journalData.journal_date || '';
        if (hlvField) hlvField.value = journalData.trainer_name || '';
        if (dogField) dogField.value = journalData.dog_name || '';

        // Populate training activities
        this.populateTrainingActivities(journalData.training_activities);

        // Populate care activities
        this.populateCareActivities(journalData.care_activities);

        // Populate operation activities
        this.populateOperationActivities(journalData.operation_activities);

        // Populate other fields
        if (document.getElementById('health_status')) {
            document.getElementById('health_status').value = journalData.health_status || 'Tốt';
        }
        if (document.getElementById('weather_conditions')) {
            document.getElementById('weather_conditions').value = journalData.weather_conditions || '';
        }
        if (document.getElementById('journal_hlv_comment')) {
            document.getElementById('journal_hlv_comment').value = journalData.behavior_notes || '';
        }
        if (document.getElementById('journal_other_issues')) {
            document.getElementById('journal_other_issues').value = journalData.challenges || '';
        }
        if (document.getElementById('next_goals')) {
            document.getElementById('next_goals').value = journalData.next_goals || '';
        }
    }

    populateEmptyForm(dogName, date) {
        // Clear form and set basic info
        const dateField = document.getElementById('journal_date');
        const dogField = document.getElementById('journal_dog_name');
        
        if (dateField) dateField.value = date;
        if (dogField) dogField.value = dogName;

        // Add default blocks
        this.addTrainingBlock();
        this.addOperationBlock();
    }

    populateTrainingActivities(activities) {
        // Clear existing training blocks
        const trainingContainer = document.getElementById('training-blocks-container');
        if (trainingContainer) {
            trainingContainer.innerHTML = '';
        }

        if (activities) {
            const activityList = activities.split(';').filter(a => a.trim());
            activityList.forEach(activity => {
                this.addTrainingBlock(activity.trim());
            });
        }

        // Ensure at least one block exists
        if (!activities || activities.split(';').filter(a => a.trim()).length === 0) {
            this.addTrainingBlock();
        }
    }

    populateCareActivities(activities) {
        if (activities) {
            const activityList = activities.split(';').filter(a => a.trim());
            
            activityList.forEach(activity => {
                if (activity.includes('Sáng:')) {
                    const morningField = document.getElementById('care_morning');
                    if (morningField) {
                        morningField.value = activity.replace('Sáng:', '').trim();
                    }
                } else if (activity.includes('Chiều:')) {
                    const afternoonField = document.getElementById('care_afternoon');
                    if (afternoonField) {
                        afternoonField.value = activity.replace('Chiều:', '').trim();
                    }
                } else if (activity.includes('Tối:')) {
                    const eveningField = document.getElementById('care_evening');
                    if (eveningField) {
                        eveningField.value = activity.replace('Tối:', '').trim();
                    }
                }
            });
        }
    }

    populateOperationActivities(activities) {
        // Clear existing operation blocks
        const operationContainer = document.getElementById('operation-blocks-container');
        if (operationContainer) {
            operationContainer.innerHTML = '';
        }

        if (activities) {
            const activityList = activities.split(';').filter(a => a.trim());
            activityList.forEach(activity => {
                this.addOperationBlock(activity.trim());
            });
        }

        // Ensure at least one block exists
        if (!activities || activities.split(';').filter(a => a.trim()).length === 0) {
            this.addOperationBlock();
        }
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================

    addTrainingBlock(content = '') {
        // This should integrate with existing addTrainingBlock function
        if (typeof window.addTrainingBlock === 'function') {
            window.addTrainingBlock(content);
        }
    }

    addOperationBlock(content = '') {
        // This should integrate with existing addOperationBlock function
        if (typeof window.addOperationBlock === 'function') {
            window.addOperationBlock(content);
        }
    }

    notifyDashboardUpdate() {
        // Notify dashboard about journal updates
        try {
            localStorage.setItem('dashboard_journal_refresh', Date.now().toString());
            localStorage.setItem('dashboard_refresh_trigger', Date.now().toString());
            
            // Send message to parent window if in iframe
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'JOURNAL_UPDATE',
                    journalId: this.currentJournalId,
                    timestamp: Date.now()
                }, '*');
            }
        } catch (error) {
            console.error('Error notifying dashboard:', error);
        }
    }

    // =============================================================================
    // MIGRATION FUNCTIONS
    // =============================================================================

    async migrateLocalStorageJournals() {
        try {
            const journalsToMigrate = [];
            
            // Collect all localStorage journals
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('journal_')) {
                    try {
                        const journalData = JSON.parse(localStorage.getItem(key));
                        journalsToMigrate.push({
                            key: key,
                            data: journalData
                        });
                    } catch (error) {
                        console.error('Error parsing journal:', key, error);
                    }
                }
            }

            if (journalsToMigrate.length === 0) {
                console.log('No journals to migrate');
                return { success: true, migrated: 0 };
            }

            // Send to migration endpoint
            const response = await fetch(`${this.apiBaseUrl}/api/journals/migrate-from-localstorage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    journals: journalsToMigrate
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ Migrated ${result.migrated_count} journals to database`);
                
                // Optionally clear localStorage journals after successful migration
                if (result.migrated_count === result.total_journals) {
                    journalsToMigrate.forEach(journal => {
                        localStorage.removeItem(journal.key);
                    });
                    console.log('✅ Cleared localStorage journals after successful migration');
                }
                
                return result;
            } else {
                throw new Error(result.error || 'Migration failed');
            }

        } catch (error) {
            console.error('Error migrating journals:', error);
            throw error;
        }
    }
}

// Create global instance
window.journalDBManager = new JournalDatabaseManager();

// Override existing localStorage-based functions
window.loadJournalData = function(dogName, date, createNew = false) {
    return window.journalDBManager.loadJournalData(dogName, date, createNew);
};

window.saveJournalData = function() {
    return window.journalDBManager.saveJournalData();
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalDatabaseManager;
}
