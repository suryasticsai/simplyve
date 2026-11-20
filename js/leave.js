// leave.js
const leaveModule = {
    data() {
        return {
            selectedEmployee: null, // Stores the selected { id, name, role } object
            newLeave: {
                type: 'annual',
                startDate: '',
                endDate: '',
                reason: ''
            },
            isSubmitting: false,
            validationError: '',
            toasts: [] 
        }
    },
    computed: {
        // Automatically calculates the number of days requested
        requestedDays() {
            if (!this.newLeave.startDate || !this.newLeave.endDate) return 0;
            const start = new Date(this.newLeave.startDate);
            const end = new Date(this.newLeave.endDate);
            if (end < start) return 0;
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
    },
    methods: {
        openLeaveModal() {
            // Default to the first employee in the list if none selected yet
            if (!this.selectedEmployee && this.employees.length > 0) {
                this.selectedEmployee = this.employees[0];
            }
            
            // Reset form
            this.newLeave = {
                type: 'annual',
                startDate: '',
                endDate: '',
                reason: ''
            };
            this.validationError = '';
            this.isSubmitting = false;
            
            const modal = new bootstrap.Modal(document.getElementById('applyLeaveModal'));
            modal.show();
        },
        
        validateForm() {
            this.validationError = '';
            
            if (!this.selectedEmployee) {
                this.validationError = "Please select an employee.";
                return false;
            }

            if (!this.newLeave.startDate || !this.newLeave.endDate) {
                this.validationError = "Please select both start and end dates.";
                return false;
            }

            const start = new Date(this.newLeave.startDate);
            const end = new Date(this.newLeave.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                this.validationError = "Cannot request leave in the past.";
                return false;
            }

            if (end < start) {
                this.validationError = "End date cannot be before start date.";
                return false;
            }

            return true;
        },

        async submitLeave() {
            if (!this.validateForm()) return;

            this.isSubmitting = true;

            // Build the payload using the selected employee's ID from the sheet
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
                // Calls the function in api.js
                const response = await this.saveLeaveToSheet(payload);

                if(response.success) {
                    const modalEl = document.getElementById('applyLeaveModal');
                    bootstrap.Modal.getInstance(modalEl).hide();

                    // Refresh the calendar grid to show the new bar immediately
                    await this.loadData(); 

                    // Show elite floating toast
                    this.showToast(`Successfully applied for ${this.requestedDays} days of ${this.newLeave.type} leave.`, 'success');

                    // Add to the bell notification panel
                    this.notifications.unshift({
                        id: Date.now(),
                        text: `${this.selectedEmployee.name}'s ${this.newLeave.type} leave request was submitted.`,
                        time: "Just now",
                        type: "success",
                        icon: "bi-check-circle-fill",
                        read: false
                    });
                } else {
                    // Show exact error from backend (e.g. "Overlaps existing leave")
                    this.showToast(response.error || "Failed to save to database.", 'error');
                }
            } catch (error) {
                this.showToast("A network error occurred.", 'error');
            } finally {
                this.isSubmitting = false;
            }
        },

        showToast(message, type = 'success') {
            const id = Date.now();
            this.toasts.push({ id, message, type });
            
            // Auto-remove toast after 4 seconds
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id);
            }, 4000);
        }
    }
};