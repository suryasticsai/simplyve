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
                const response = await fetch(CONFIG.API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'addLeave',
                        payload: leaveData
                    })
                });
                return await response.json();
            } catch (error) {
                console.error("Error saving to Google Sheets:", error);
                return { success: false };
            }
        }
    }
};
