// leave.js
const leaveModule = {
    data() {
        return {
            newLeave: {
                type: 'annual',
                start: '',
                end: '',
                reason: ''
            }
        }
    },
    methods: {
        openLeaveModal() {
            // Reset form
            this.newLeave = { type: 'annual', start: '', end: '', reason: '' };
            const modal = new bootstrap.Modal(document.getElementById('applyLeaveModal'));
            modal.show();
        },
        submitLeave() {
            if (!this.newLeave.start || !this.newLeave.end) {
                alert("Please select both start and end dates.");
                return;
            }

            // Calculate day indices (Mocking mapping to March 2026 calendar)
            // Assuming start/end dates are inputted as '2026-03-05'
            const startDay = parseInt(this.newLeave.start.split('-')[2]);
            const endDay = parseInt(this.newLeave.end.split('-')[2]);

            // Map types to CSS classes and labels
            const typeMap = {
                'annual': { class: 'bg-annual', label: 'Annual Leave' },
                'sick': { class: 'bg-sick', label: 'Sick Leave' },
                'casual': { class: 'bg-maternity', label: 'Casual Leave' }, // Using orange
                'unpaid': { class: 'bg-unpaid', label: 'Unpaid Leave' }
            };

            const typeInfo = typeMap[this.newLeave.type] || { class: 'bg-annual', label: 'Leave' };

            // Create the new leave object
            const newLeaveObj = {
                id: Date.now(),
                emp: 'Rachel Smith', // Hardcoded to current user (Admin)
                start: startDay,
                end: endDay,
                typeClass: typeInfo.class,
                label: typeInfo.label
            };

            // Push to the shared state (found in calendarModule data)
            this.leaves.push(newLeaveObj);

            // Close modal
            const modalEl = document.getElementById('applyLeaveModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // Trigger notification
            this.notifications.unshift({
                id: Date.now(),
                text: `Your ${typeInfo.label} request for March ${startDay}-${endDay} was submitted.`,
                time: "Just now",
                type: "success",
                icon: "bi-send-check",
                read: false
            });

            // Show toast/alert (simulated)
            alert("Leave request submitted successfully!");
        }
    }
};