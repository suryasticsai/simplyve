// api.js
// Use the URL you provided
const API_URL = "https://script.google.com/macros/s/AKfycbzszUUBrSooEOtEwZWqOyj-IudQerf_wOgL8SuWd6En4dd0K3nqYZNIsv76NIcb_LrS/exec";

const apiModule = {
    methods: {
        async fetchLeavesFromSheet() {
            try {
                const response = await fetch(`${API_URL}?action=getLeaves`);
                return await response.json();
            } catch (error) {
                console.error("Error fetching leaves:", error);
                return [];
            }
        },
        async fetchEmployeesFromSheet() {
            try {
                const response = await fetch(`${API_URL}?action=getEmployees`);
                return await response.json();
            } catch (error) {
                console.error("Error fetching employees:", error);
                return [];
            }
        },
        async saveLeaveToSheet(leaveData) {
            try {
                const response = await fetch(API_URL, {
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
        },
        async updateLeaveStatusInSheet(leaveId, newStatus) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'updateLeaveStatus',
                        payload: { id: leaveId, status: newStatus }
                    })
                });
                return await response.json();
            } catch (error) {
                console.error("Error updating status:", error);
                return { success: false };
            }
        }
    }
};