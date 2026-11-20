const apiModule = {
    methods: {
        async fetchLeavesFromSheet() {
            try {
                const response = await fetch(`${CONFIG.API_URL}?action=getLeaves`);
                return await response.json();
            } catch (error) {
                console.error("Error fetching leaves:", error);
                return [];
            }
        },
        async fetchEmployeesFromSheet() {
            try {
                const response = await fetch(`${CONFIG.API_URL}?action=getEmployees`);
                return await response.json();
            } catch (error) {
                console.error("Error fetching employees:", error);
                return [];
            }
        },
        async saveLeaveToSheet(leaveData) {
            try {
                // Encode the JSON object to pass it via URL parameter
                const payloadStr = encodeURIComponent(JSON.stringify(leaveData));
                const url = `${CONFIG.API_URL}?action=addLeave&payload=${payloadStr}`;
                
                // Use GET request to avoid CORS preflight issues in Google Apps Script
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                return await response.json();
            } catch (error) {
                console.error("Error saving to Google Sheets:", error);
                return { success: false };
            }
        }
    }
};