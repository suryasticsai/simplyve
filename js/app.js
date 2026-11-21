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
        ...calendarModule.computed, // Includes outTodayCount, pendingApprovalsCount, filteredEmployees
        ...leaveModule.computed
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