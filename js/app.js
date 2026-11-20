const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeTab: 'calendar',
            isMobileSidebarOpen: false,
            searchQuery: '', // <--- Added for live search
            ...notificationModule.data(),
            ...calendarModule.data(),
            ...leaveModule.data(),
        }
    },
    computed: {
        ...notificationModule.computed,
        ...leaveModule.computed,
        pendingApprovalsCount() { return 2; },
        
        // <--- NEW: Live Search Logic -->
        filteredEmployees() {
            if (!this.searchQuery) return this.employees;
            const q = this.searchQuery.toLowerCase();
            return this.employees.filter(e => 
                e.name.toLowerCase().includes(q) || 
                e.id.toLowerCase().includes(q)
            );
        },
        
        // <--- NEW: Out Today Logic -->
        outTodayCount() {
            const today = 14; // Mocking today as March 14th
            let count = 0;
            this.employees.forEach(emp => {
                // Find approved leaves for this employee
                const empLeaves = this.leaves.filter(l => l.emp === emp.name && l.status === 'Approved');
                // Check if today falls within the leave range
                if (empLeaves.some(l => today >= l.start && today <= l.end)) {
                    count++;
                }
            });
            return count;
        }
    },
    methods: {
        ...notificationModule.methods,
        ...apiModule.methods, 
        ...calendarModule.methods,
        ...leaveModule.methods,
    },
    mounted() {
        // Trigger the data fetch on load
        this.generateDays();
        this.loadData();
    }
});

app.mount('#app');