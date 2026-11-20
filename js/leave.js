// leave.js 
const leaveModule = {
    data() {
        return {
            newLeave: {
                employeeId: 'EMP-006',
                employeeName: 'Rachel Smith',
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
            this.newLeave = {
                employeeId: 'EMP-006',
                employeeName: 'Rachel Smith',
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

            const hasOverlap = this.leaves.some(leave => {
                if (leave.emp !== this.newLeave.employeeName) return false;
                const newStart = parseInt(this.newLeave.startDate.split('-')[2]);
                const newEnd = parseInt(this.newLeave.endDate.split('-')[2]);
                return (newStart >= leave.start && newStart <= leave.end) || 
                       (newEnd >= leave.start && newEnd <= leave.end);
            });

            if (hasOverlap) {
                this.validationError = "You already have an approved leave during this period.";
                return false;
            }

            return true;
        },

        async submitLeave() {
            if (!this.validateForm()) return;

            this.isSubmitting = true;

            try {
                const response = await this.saveLeaveToSheet(this.newLeave);

                if(response.success) {
                    const modalEl = document.getElementById('applyLeaveModal');
                    bootstrap.Modal.getInstance(modalEl).hide();

                    // Reload data from Google Sheets
                    await this.loadData();

                    this.showToast(`Successfully applied for ${this.requestedDays} days of ${this.newLeave.type} leave.`, 'success');

                    this.notifications.unshift({
                        id: Date.now(),
                        text: `Your ${this.newLeave.type} leave request was successfully submitted.`,
                        time: "Just now",
                        type: "success",
                        icon: "bi-check-circle-fill",
                        read: false
                    });
                } else {
                    this.showToast("Failed to save to database. Try again.", 'error');
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
            
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id);
            }, 4000);
        }
    }
};
