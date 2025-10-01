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
        
        
        // Test API connectivity
        this.testAPIConnectivity();
    }

    // =============================================================================
    // API CONNECTIVITY TEST
    // =============================================================================
    
    async testAPIConnectivity() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/dogs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            
            if (response.ok) {
                const result = await response.json();
            } else {
                console.error('❌ API connectivity test FAILED - Status:', response.status);
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
            }
        } catch (error) {
            console.error('❌ API connectivity test ERROR:', error);
            console.error('❌ This might be a CORS issue or server not running');
        }
        
        // Test simple endpoint first
        try {
            const simpleResponse = await fetch(`${this.apiBaseUrl}/api/test`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            
            if (simpleResponse.ok) {
            } else {
                console.error('❌ Simple endpoint test FAILED');
            }
        } catch (error) {
            console.error('❌ Simple endpoint test ERROR:', error);
        }
        
        // Also test journal endpoint specifically
        try {
            const testResponse = await fetch(`${this.apiBaseUrl}/api/journals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            
            if (testResponse.ok) {
            } else {
                console.error('❌ Journal endpoint test FAILED');
            }
        } catch (error) {
            console.error('❌ Journal endpoint test ERROR:', error);
        }
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
                throw new Error(`Không tìm thấy chó "${dogName}" trong cơ sở dữ liệu. Vui lòng kiểm tra tên chó.`);
            } else {
                this.currentDogId = dogInfo.id;
                this.currentTrainerId = dogInfo.trainer_id;
                console.log('✅ Loaded dog info:', { dogId: this.currentDogId, trainerId: this.currentTrainerId });
            }

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
            
            const journalData = await this.collectJournalFormData();
            
            // SỬA: More specific error message
            if (!journalData.dog_id || !journalData.trainer_id) {
                console.error('❌ Missing IDs:', { dog_id: journalData.dog_id, trainer_id: journalData.trainer_id });
                throw new Error('Thiếu thông tin chó hoặc huấn luyện viên. Vui lòng thử lại.');
            }

            let result;
            if (this.currentJournalId) {
                // Update existing journal
                // console.log('🔄 Updating existing journal ID:', this.currentJournalId);
                result = await this.updateJournal(this.currentJournalId, journalData);
            } else {
                // Create new journal
                // console.log('➕ Creating new journal...');
                result = await this.createJournal(journalData);
                // console.log('🔍 Create journal result:', result);
                
                // SỬA: Check if result.data exists before accessing id
                // console.log('🔍 Full API response:', JSON.stringify(result, null, 2));
                // console.log('🔍 Response analysis:', {
                //     resultType: typeof result,
                //     hasResult: !!result,
                //     hasSuccess: !!(result && result.success),
                //     successValue: result && result.success,
                //     hasData: !!(result && result.data),
                //     dataValue: result && result.data,
                //     dataType: result && result.data ? typeof result.data : 'undefined'
                // });
                
                // Get the journal ID from the API response
                let journalId = null;
                if (result && result.success && result.data && result.data.id) {
                    journalId = result.data.id;
                } else {
                    console.error('❌ API response structure issue:', {
                        hasResult: !!result,
                        hasSuccess: !!(result && result.success),
                        hasData: !!(result && result.data),
                        hasId: !!(result && result.data && result.data.id),
                        fullResponse: result
                    });
                }
                
                if (journalId) {
                    this.currentJournalId = journalId;
                    // console.log('✅ Journal ID set to:', this.currentJournalId);
                } else {
                    if (!result) {
                        throw new Error('Không nhận được phản hồi từ server');
                    } else if (!result.success) {
                        throw new Error(`Lỗi từ server: ${result.error || 'Không xác định'}`);
                    } else if (!result.data) {
                        throw new Error('Server không trả về dữ liệu nhật ký');
                    } else if (!result.data.id) {
                        throw new Error('Server không trả về ID của nhật ký mới tạo');
                    } else {
                        throw new Error('Lỗi không xác định khi tạo nhật ký');
                    }
                }
            }

            // SỬA: Check result structure more carefully
            if (result && result.success) {
                // Clear temporary signature data after successful save
                if (window.tempSignatureData) {
                    console.log('✅ Clearing temporary signature data after successful save');
                    window.tempSignatureData = null;
                }
                
                this.notifyDashboardUpdate();
                alert('Nhật ký đã được lưu thành công vào cơ sở dữ liệu!');
                // console.log('✅ Journal saved successfully to database:', result.data);
                return result.data || result; // Return result.data if available, otherwise return result
            } else {
                console.error('❌ API returned unsuccessful result:', result);
                throw new Error(result?.error || 'Lỗi không xác định từ API');
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
                // console.log('✅ Journal deleted successfully');
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
                // Try exact match first
                let dog = result.data.find(dog => dog.name === dogName);
                
                // If not found, try case-insensitive match
                if (!dog) {
                    dog = result.data.find(dog => dog.name.toLowerCase() === dogName.toLowerCase());
                }
                
                // If still not found, try partial match
                if (!dog) {
                    dog = result.data.find(dog => dog.name.toLowerCase().includes(dogName.toLowerCase()) || dogName.toLowerCase().includes(dog.name.toLowerCase()));
                }
                
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
        // console.log('🌐 Making API call to create journal...');
        // console.log('🔗 API URL:', `${this.apiBaseUrl}/api/journals`);
        // console.log('📤 Request data:', journalData);
        
        const response = await fetch(`${this.apiBaseUrl}/api/journals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journalData)
        });

        // console.log('📡 API Response status:', response.status);
        // console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        // console.log('📄 API Response:', result);
        // console.log('🔍 API Response structure:', {
        //     success: result.success,
        //     hasData: !!result.data,
        //     dataType: typeof result.data,
        //     dataKeys: result.data ? Object.keys(result.data) : 'no data'
        // });
        return result;
    }

    async updateJournal(journalId, journalData) {
        // console.log('🌐 Making API call to update journal...');
        const response = await fetch(`${this.apiBaseUrl}/api/journals/${journalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journalData)
        });

        // console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        // console.log('📄 API Response:', result);
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

    async collectJournalFormData() {
        const dogName = document.getElementById('journal_dog_name').value;
        const date = document.getElementById('journal_date').value;
        const trainerName = document.getElementById('journal_hlv').value;

        // SỬA: Try to resolve dog and trainer IDs if not already set
        if (!this.currentDogId || !this.currentTrainerId) {
            console.log('🔍 Resolving dog and trainer IDs for:', dogName);
            const dogInfo = await this.getDogByName(dogName);
            if (dogInfo) {
                this.currentDogId = dogInfo.id;
                this.currentTrainerId = dogInfo.trainer_id;
                console.log('✅ Resolved IDs:', { dogId: this.currentDogId, trainerId: this.currentTrainerId });
            } else {
                console.error('❌ Could not find dog in database:', dogName);
                throw new Error(`Không tìm thấy chó "${dogName}" trong cơ sở dữ liệu. Vui lòng kiểm tra tên chó.`);
            }
        }

        // Final check - don't use placeholder IDs
        if (!this.currentDogId || !this.currentTrainerId) {
            console.error('❌ Missing IDs after resolution:', { dogId: this.currentDogId, trainerId: this.currentTrainerId });
            throw new Error('Không thể xác định ID chó hoặc huấn luyện viên. Vui lòng thử lại.');
        }

        console.log('🔍 Using resolved IDs:', { dogId: this.currentDogId, trainerId: this.currentTrainerId });

        // Await the async signature timestamp functions
        const [hlvTimestamp, leaderTimestamp, substituteTimestamp] = await Promise.all([
            this.getSignatureTimestamp('hlv'),
            this.getSignatureTimestamp('leader'),
            this.getSignatureTimestamp('substitute')
        ]);

        // Get signature data - check temp storage first for new journals
        let hlvSignature, leaderSignature, substituteSignature;
        let hlvSigTimestamp, leaderSigTimestamp, substituteSigTimestamp;

        console.log('🔍 Collecting signature data...');
        console.log('🔍 Temp signature data:', window.tempSignatureData);
        console.log('🔍 Current journal ID:', this.currentJournalId);

        if (window.tempSignatureData) {
            // Use temporary signature data if available
            hlvSignature = window.tempSignatureData.hlv?.signature || this.serializeSignatureData(await this.getSignatureData('hlv'));
            leaderSignature = window.tempSignatureData.leader?.signature || this.serializeSignatureData(await this.getSignatureData('leader'));
            substituteSignature = window.tempSignatureData.substitute?.signature || this.serializeSignatureData(await this.getSignatureData('substitute'));
            
            hlvSigTimestamp = window.tempSignatureData.hlv?.timestamp || hlvTimestamp;
            leaderSigTimestamp = window.tempSignatureData.leader?.timestamp || leaderTimestamp;
            substituteSigTimestamp = window.tempSignatureData.substitute?.timestamp || substituteTimestamp;
            
            console.log('🔍 Using temp signature data:', {
                hlv: !!hlvSignature,
                leader: !!leaderSignature,
                substitute: !!substituteSignature
            });
        } else {
            // Use regular signature data collection
            hlvSignature = this.serializeSignatureData(await this.getSignatureData('hlv'));
            leaderSignature = this.serializeSignatureData(await this.getSignatureData('leader'));
            substituteSignature = this.serializeSignatureData(await this.getSignatureData('substitute'));
            
            hlvSigTimestamp = hlvTimestamp;
            leaderSigTimestamp = leaderTimestamp;
            substituteSigTimestamp = substituteTimestamp;
            
            console.log('🔍 Using regular signature collection:', {
                hlv: !!hlvSignature,
                leader: !!leaderSignature,
                substitute: !!substituteSignature
            });
        }

        // Convert form data to database format
        const journalData = {
            dog_id: this.currentDogId,
            trainer_id: this.currentTrainerId,
            journal_date: date,
            training_activities: this.collectTrainingActivities(),
            care_activities: this.collectCareActivities(),
            operation_activities: this.collectOperationActivities(),
            health_status: this.getHealthStatus(),
            behavior_notes: this.collectBehaviorNotes(),
            weather_conditions: this.getWeatherConditions(),
            challenges: document.getElementById('journal_other_issues').value || '',
            next_goals: this.getNextGoals(),
            training_duration: this.calculateTrainingDuration(),
            success_rate: this.calculateSuccessRate(),
            // Add signature data - ensure they are JSON strings or null
            hlv_signature: hlvSignature,
            leader_signature: leaderSignature,
            substitute_signature: substituteSignature,
            hlv_signature_timestamp: hlvSigTimestamp,
            leader_signature_timestamp: leaderSigTimestamp,
            substitute_signature_timestamp: substituteSigTimestamp
        };

        return journalData;
    }

    collectTrainingActivities() {
        const trainingBlocksData = [];
        document.querySelectorAll('#training-blocks-container .training-block').forEach(block => {
            const blockId = block.getAttribute('data-block-id');
            if (!blockId) return;

            const fromTime = document.getElementById(`trainingFromTime-${blockId}`)?.value || '';
            const toTime = document.getElementById(`trainingToTime-${blockId}`)?.value || '';
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

                const result = document.getElementById(`drugDetectionResult-${blockId}-${i}`)?.value || '';
                drugDetectionData.push({
                    selectedDrugs: selectedDrugs,
                    result: result
                });
            }

            trainingBlocksData.push({
                blockId: blockId,
                fromTime: fromTime,
                toTime: toTime,
                locationType: locationType,
                locationOther: locationOther,
                advancedTraining: advancedTraining,
                basicTraining: basicTraining,
                physicalTraining: physicalTraining,
                otherTraining: otherTraining,
                drugDetection: drugDetectionData
            });
        });

        return JSON.stringify(trainingBlocksData);
    }

    collectCareActivities() {
        // Collect meals data
        const mealsData = {
            lunch: {
                time: document.getElementById('lunchTime')?.value || '',
                amount: document.getElementById('lunchAmount')?.value || '',
                food: this.getSelectedFoodItems('lunch'),
                otherFood: document.getElementById('lunchFoodOther')?.value || ''
            },
            dinner: {
                time: document.getElementById('dinnerTime')?.value || '',
                amount: document.getElementById('dinnerAmount')?.value || '',
                food: this.getSelectedFoodItems('dinner'),
                otherFood: document.getElementById('dinnerFoodOther')?.value || ''
            }
        };

        // Collect care activities including care checkboxes
        const careActivities = {
            careBath: document.getElementById('care_bath')?.checked || false,
            careBrush: document.getElementById('care_brush')?.checked || false,
            careWipe: document.getElementById('care_wipe')?.checked || false,
            morning: document.getElementById('care_morning')?.value || '',
            afternoon: document.getElementById('care_afternoon')?.value || '',
            evening: document.getElementById('care_evening')?.value || ''
        };

        return JSON.stringify({
            meals: mealsData,
            activities: careActivities
        });
    }

    getSelectedFoodItems(mealType) {
        const selectedFoods = [];
        const optionsContainer = document.getElementById(`${mealType}FoodOptions`);
        if (optionsContainer) {
            optionsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                selectedFoods.push(checkbox.dataset.foodValue);
            });
        }
        return selectedFoods;
    }

    collectOperationActivities() {
        const operationBlocksData = [];
        document.querySelectorAll('#operation-blocks-container .operation-block').forEach(block => {
            const blockId = block.getAttribute('data-block-id');
            if (!blockId) return;

            const fromTime = document.getElementById(`operationFromTime-${blockId}`)?.value || '';
            const toTime = document.getElementById(`operationToTime-${blockId}`)?.value || '';
            
            // Get selected operation locations using the same method as script.js
            const selectedLocations = [];
            const locationOptionsContainer = document.getElementById(`operationLocationOptions-${blockId}`);
            if (locationOptionsContainer) {
                locationOptionsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                    const locationValue = checkbox.getAttribute('data-location-value');
                    if (locationValue) {
                        selectedLocations.push(locationValue);
                    }
                });
            }

            const otherIssues = document.getElementById(`journal_other_issues`)?.value || '';

            operationBlocksData.push({
                blockId: blockId,
                fromTime: fromTime,
                toTime: toTime,
                selectedLocations: selectedLocations,
                otherIssues: otherIssues
            });
        });

        return JSON.stringify(operationBlocksData);
    }

    getHealthStatus() {
        const healthRadio = document.querySelector('input[name="health_status"]:checked');
        if (healthRadio) {
            return healthRadio.value;
        }
        return 'Tốt'; // Default value
    }

    getWeatherConditions() {
        const weatherInput = document.getElementById('weather_conditions');
        return weatherInput ? weatherInput.value : '';
    }

    collectBehaviorNotes() {
        const trainerComment = document.getElementById('journal_hlv_comment')?.value || '';
        const healthOtherText = document.getElementById('health_other_text')?.value || '';
        
        let notes = trainerComment;
        if (healthOtherText.trim()) {
            notes += (notes ? '\n\n' : '') + `Tình trạng sức khỏe: ${healthOtherText}`;
        }
        
        return notes;
    }

    collectHealthData() {
        const healthStatus = document.querySelector('input[name="health_status"]:checked')?.value || 'Tốt';
        const healthOtherText = document.getElementById('health_other_text')?.value || '';
        
        return JSON.stringify({
            status: healthStatus,
            otherText: healthOtherText
        });
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

    async getSignatureData(signatureType) {
        // For new journals, try to get signature data from UI first
        if (!this.currentJournalId) {
            // console.log('No current journal ID for signature data - checking UI');
            return this.getSignatureDataFromUI(signatureType);
        }
        
        try {
            // Get current journal data from database
            const response = await fetch(`${this.apiBaseUrl}/api/journals/${this.currentJournalId}`);
            if (!response.ok) {
                console.warn('Failed to fetch journal for signature data');
                return this.getSignatureDataFromUI(signatureType);
            }
            
            const result = await response.json();
            if (!result.success) {
                console.warn('Journal fetch failed for signature data');
                return this.getSignatureDataFromUI(signatureType);
            }
            
            const journal = result.data;
            
            switch (signatureType) {
                case 'hlv':
                    return journal.hlv_signature || this.getSignatureDataFromUI(signatureType);
                case 'leader':
                    return journal.leader_signature || this.getSignatureDataFromUI(signatureType);
                case 'substitute':
                    return journal.substitute_signature || this.getSignatureDataFromUI(signatureType);
                default:
                    return null;
            }
        } catch (e) {
            console.warn('Error getting signature data from database:', e);
            return this.getSignatureDataFromUI(signatureType);
        }
    }

    getSignatureDataFromUI(signatureType) {
        // Try to get signature data from UI elements
        try {
            let signatureDisplayElement;
            
            switch (signatureType) {
                case 'hlv':
                    signatureDisplayElement = document.getElementById('hvl-signature-display');
                    break;
                case 'leader':
                    signatureDisplayElement = document.getElementById('leader-signature-display');
                    break;
                case 'substitute':
                    signatureDisplayElement = document.getElementById('substitute-signature-display');
                    break;
                default:
                    return null;
            }
            
            if (signatureDisplayElement && signatureDisplayElement.innerHTML.trim() !== '') {
                // Look for signature display div
                const signatureDisplay = signatureDisplayElement.querySelector('.signature-display');
                
                if (signatureDisplay) {
                    // Extract signature data from the HTML structure
                    const userNameElement = signatureDisplay.querySelector('strong');
                    const userName = userNameElement ? userNameElement.textContent.trim() : '';
                    
                    // Look for timestamp in the "Ký ngày:" div
                    const timestampDivs = signatureDisplay.querySelectorAll('div');
                    let timestamp = '';
                    for (let div of timestampDivs) {
                        if (div.textContent.includes('Ký ngày:')) {
                            timestamp = div.textContent.replace('Ký ngày:', '').trim();
                            break;
                        }
                    }
                    
                    // Look for signature ID in the "ID:" div
                    let signatureId = '';
                    for (let div of timestampDivs) {
                        if (div.textContent.includes('ID:')) {
                            signatureId = div.textContent.replace('ID:', '').trim();
                            break;
                        }
                    }
                    
                    // Look for digital signature in the "Chữ ký số:" div
                    let digitalSignature = '';
                    for (let div of timestampDivs) {
                        if (div.textContent.includes('Chữ ký số:')) {
                            digitalSignature = div.textContent.replace('Chữ ký số:', '').trim();
                            break;
                        }
                    }
                    
                    if (userName) {
                        const signatureInfo = {
                            name: userName,
                            timestamp: timestamp,
                            signatureId: signatureId,
                            digitalSignature: digitalSignature,
                            verified: true,
                            source: 'ui'
                        };
                        
                        console.log(`✅ Extracted ${signatureType} signature from UI:`, signatureInfo);
                        return JSON.stringify(signatureInfo);
                    }
                }
            }
            
            console.log(`ℹ️ No ${signatureType} signature found in UI`);
            return null;
        } catch (e) {
            console.warn('Error getting signature data from UI:', e);
            return null;
        }
    }

    serializeSignatureData(signatureData) {
        // Ensure signature data is properly serialized to JSON string
        if (signatureData === null || signatureData === undefined) {
            return null;
        }
        
        // If it's already a string, try to parse and re-serialize to ensure it's valid JSON
        if (typeof signatureData === 'string') {
            try {
                // Parse and re-serialize to ensure it's valid JSON
                const parsed = JSON.parse(signatureData);
                return JSON.stringify(parsed);
            } catch (e) {
                // If it's not valid JSON, return as is
                return signatureData;
            }
        }
        
        // If it's an object, serialize it
        if (typeof signatureData === 'object') {
            return JSON.stringify(signatureData);
        }
        
        // For other types, convert to string
        return String(signatureData);
    }

    async getSignatureTimestamp(signatureType) {
        // For new journals, return null since no signatures exist yet
        if (!this.currentJournalId) {
            // console.log('No current journal ID for signature timestamp - new journal');
            return null;
        }
        
        try {
            // Get current journal data from database
            const response = await fetch(`${this.apiBaseUrl}/api/journals/${this.currentJournalId}`);
            if (!response.ok) {
                console.warn('Failed to fetch journal for signature timestamp');
                return null;
            }
            
            const result = await response.json();
            if (!result.success) {
                console.warn('Journal fetch failed for signature timestamp');
                return null;
            }
            
            const journal = result.data;
            
            switch (signatureType) {
                case 'hlv':
                    return journal.hlv_signature_timestamp;
                case 'leader':
                    return journal.leader_signature_timestamp;
                case 'substitute':
                    return journal.substitute_signature_timestamp;
                default:
                    return null;
            }
        } catch (e) {
            console.warn('Error getting signature timestamp from database:', e);
            return null;
        }
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
        console.log('🗂️ populateEmptyForm called with:', { dogName, date });
        // Clear form and set basic info
        const dateField = document.getElementById('journal_date');
        const dogField = document.getElementById('journal_dog_name');
        
        if (dateField) dateField.value = date;
        if (dogField) dogField.value = dogName;

        // Add default blocks
        console.log('➕ Adding default training and operation blocks');
        this.addTrainingBlock();
        this.addOperationBlock(); // Add default operation block "Ca 1"
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

        // Ensure at least one block exists - Add default operation block "Ca 1"
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
            // Notify dashboard of journal updates (no localStorage needed)
            // console.log('✅ Journal updated, dashboard will refresh from database');
            
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

    // Migration function removed - database only mode
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
