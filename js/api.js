const apiModule = {
    methods: {
        async fetchLeavesFromSheet() {
            try {
                const response = await fetch(`${CONFIG.API_URL}?action=getLeaves`);
                const data = await response.json();
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error("Error fetching leaves:", error);
                return [];
            }
        },
        async fetchEmployeesFromSheet() {
            try {
                const response = await fetch(`${CONFIG.API_URL}?action=getEmployees`);
                const data = await response.json();
                // Ensure we always return an array, even if the sheet is empty or errors out
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error("Error fetching employees:", error);
                return [];
            }
        },
        async saveLeaveToSheet(leaveData) {
            try {
                const payloadStr = btoa(JSON.stringify(leaveData));
                const url = `${CONFIG.API_URL}?action=addLeave&payload=${payloadStr}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
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