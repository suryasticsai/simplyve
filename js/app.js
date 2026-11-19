// app.js
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',
            // Merge data from all modules
            ...notificationModule.data(),
            ...calendarModule.data(),
            ...leaveModule.data(),
        }
    },
    computed: {
        ...notificationModule.computed,
        pendingApprovalsCount() {
            // Mock logic for approval badge
            return 2;
        }
    },
    methods: {
        // Merge methods from all modules
        ...notificationModule.methods,
        ...calendarModule.methods,
        ...leaveModule.methods,
    },
    mounted() {
        // Run calendar initialization
        this.generateDays();
        
        // Initialize Bootstrap tooltips if any
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }
});

// Mount the app
app.mount('#app');