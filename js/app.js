const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',     // For the horizontal navigation
            currentView: 'timeline',   // 'timeline', 'grid', 'agenda'
            isMobileNavOpen: false,    // Mobile drawer toggle
            ...notificationModule.data(),
            ...calendarModule.data(),
            ...leaveModule.data(),
        }
    },
    computed: {
        ...notificationModule.computed,
        ...calendarModule.computed, // Pulls in filteredEmployees, outTodayCount, etc.
        ...leaveModule.computed,    // Pulls in requestedDays
        pendingApprovalsCount() { return 2; }
    },
    methods: {
        ...notificationModule.methods,
        ...apiModule.methods, 
        ...calendarModule.methods,
        ...leaveModule.methods,
    },
    mounted() {
        this.generateDays();
        this.loadData();
    }
});

app.mount('#app');