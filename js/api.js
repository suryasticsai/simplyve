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
                // Base64 encode the payload as expected by your new backend
                const payloadStr = btoa(JSON.stringify(leaveData));
                const url = `${CONFIG.API_URL}?action=addLeave&payload=${payloadStr}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                // If the backend throws a UserError (e.g., overlap, allowance), it returns { success: false, error: '...' }
                if (!data.success && data.error) {
                    return { success: false, error: data.error };
                }
                
                return data;
            } catch (error) {
                console.error("Fetch Error:", error);
                return { success: false, error: "Network error. Check console." };
            }
        }
    }
};