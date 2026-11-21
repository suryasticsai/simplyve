const leaveModule = {
    data() {
        return {
            selectedEmployee: null,
            newLeave: { type: 'annual', startDate: '', endDate: '', reason: '' },
            isSubmitting: false,
            toasts: [] 
        }
    },
    methods: {
        openLeaveModal() {
            if (!this.selectedEmployee && this.employees.length > 0) {
                this.selectedEmployee = this.employees[0];
            }
            this.newLeave = { type: 'annual', startDate: '', endDate: '', reason: '' };
            this.isSubmitting = false;
            new bootstrap.Modal(document.getElementById('leaveModal')).show();
        },
        async submitLeave() {
            if (!this.selectedEmployee) return;
            
            this.isSubmitting = true;
            const payload = {
                employeeId: this.selectedEmployee.id,
                employeeName: this.selectedEmployee.name,
                type: this.newLeave.type,
                startDate: this.newLeave.startDate,
                endDate: this.newLeave.endDate,
                reason: this.newLeave.reason,
                status: 'Pending'
            };

            try {
                const payloadStr = btoa(JSON.stringify(payload));
                const res = await fetch(`${CONFIG.API_URL}?action=addLeave&payload=${payloadStr}`);
                const data = await res.json();

                if (data.success) {
                    bootstrap.Modal.getInstance(document.getElementById('leaveModal')).hide();
                    await this.loadData(); // Syncs FullCalendar, Gantt, and Panels
                    this.showToast(`Leave request submitted successfully.`, 'success');
                } else {
                    this.showToast(data.error || "Failed to save.", 'error');
                }
            } catch (error) {
                this.showToast("Network error.", 'error');
            } finally {
                this.isSubmitting = false;
            }
        },
        showToast(msg, type) {
            const id = Date.now();
            this.toasts.push({ id, message: msg, type });
            setTimeout(() => this.toasts = this.toasts.filter(t => t.id !== id), 4000);
        }
    }
};