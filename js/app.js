// app.js
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',
            isMobileSidebarOpen: false, // <--- Added for mobile hamburger menu
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
        // Initialization handled by calendarModule
    }
});

app.mount('#app');