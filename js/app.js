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
        ...leaveModule.computed, // Merge computed (requestedDays)
        pendingApprovalsCount() { return 2; }
    },
    methods: {
        ...notificationModule.methods,
        ...apiModule.methods, 
        ...calendarModule.methods,
        ...leaveModule.methods,
    },
    mounted() {
        // Data loads via calendarModule.mounted()
    }
});

app.mount('#app');