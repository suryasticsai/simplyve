// app.js
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',
            ...notificationModule.data(),
            ...calendarModule.data(),
            ...leaveModule.data(),
        }
    },
    computed: {
        ...notificationModule.computed,
        ...leaveModule.computed, // Fixes requestedDays live counter
        pendingApprovalsCount() { return 2; }
    },
    methods: {
        ...notificationModule.methods,
        ...apiModule.methods, 
        ...calendarModule.methods, // Fixes isLoading / loadData warnings
        ...leaveModule.methods,
    },
    mounted() {
        // Initialization handled by calendarModule.mounted()
    }
});

app.mount('#app');