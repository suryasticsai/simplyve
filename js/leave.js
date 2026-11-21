const leaveModule = {
    data() {
        return {
            selectedEmployee: null,
            newLeave: { type: 'annual', startDate: '', endDate: '', reason: '' },
            isSubmitting: false,
            validationError: '',
            toasts: [] 
        }
    },
    computed: {
        requestedDays() {
            if (!this.newLeave.startDate || !this.newLeave.endDate) return 0;
            const start = new Date(this.newLeave.startDate);
            const end = new Date(this.newLeave.endDate);
            if (end < start) return 0;
            return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
        }
    },
    methods: {
        openLeaveModal() {
            if (!this.selectedEmployee && this.employees.length > 0) {
                this.selectedEmployee = this.employees[0];
            }
            this.newLeave = { type: 'annual', startDate: '', endDate: '', reason: '' };
            this.validationError = '';
            this.isSubmitting = false;
            new bootstrap.Modal(document.getElementById('applyLeaveModal')).show();
        },
        async submitLeave() {
            if (!this.selectedEmployee) return this.validationError = "Please select an employee.";
            if (!this.newLeave.startDate || !this.newLeave.endDate) return this.validationError = "Please select dates.";
            
            this.isSubmitting = true;
            this.validationError = '';

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
                    bootstrap.Modal.getInstance(document.getElementById('applyLeaveModal')).hide();
                    await this.loadData();
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