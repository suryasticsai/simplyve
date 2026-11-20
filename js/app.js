const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',
            isMobileSidebarOpen: false,
            ...notificationModule.data(),
            ...calendarModule.data(),
            ...leaveModule.data(),
        }
    },
    computed: {
        ...notificationModule.computed,
        ...leaveModule.computed,
        pendingApprovalsCount() { return 2; }
    },
    methods: {
        ...notificationModule.methods,
        ...apiModule.methods, 
        ...calendarModule.methods,
        ...leaveModule.methods,
    },
    mounted() {
        // CRITICAL FIX: Actually trigger the calendar generation and data fetch!
        this.generateDays();
        this.loadData();
    }
});

app.mount('#app');