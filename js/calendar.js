const calendarModule = {
    data() {
        return {
            employees: [],
            days: [],
            leaves: [],
            isLoading: true,
            searchQuery: '',
            reportSearch: '', // For the reports tab
            
            currentView: 'calendar',
            fcCalendar: null,
            balanceChart: null,
            
            // Date Selector
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear().toString(),

            // Side Panel Data
            outTodayList: [],
            pendingRequests: []
        }
    },
    computed: {
        filteredEmployees() {
            if (!this.searchQuery) return this.employees;
            const q = this.searchQuery.toLowerCase();
            return this.employees.filter(e => 
                e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
            );
        },
        outTodayCount() {
            return this.outTodayList.length;
        },
        pendingApprovalsCount() {
            return this.pendingRequests.length;
        },
        // DYNAMIC REPORTS TABLE DATA
        filteredReports() {
            let filtered = this.leaves;
            if (this.reportSearch) {
                const q = this.reportSearch.toLowerCase();
                filtered = filtered.filter(l => 
                    l.emp.toLowerCase().includes(q) || 
                    l.label.toLowerCase().includes(q) ||
                    l.status.toLowerCase().includes(q)
                );
            }
            // Sort by newest date first
            return [...filtered].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        }
    },
    methods: {
        async loadData() {
            // ... (Keep existing loadData logic) ...
            this.isLoading = true;
            try {
                const [empRes, leaveRes] = await Promise.all([
                    fetch(`${CONFIG.API_URL}?action=getEmployees`),
                    fetch(`${CONFIG.API_URL}?action=getLeaves`)
                ]);
                const empData = await empRes.json();
                const leaveData = await leaveRes.json();

                this.employees = Array.isArray(empData) ? empData.map(e => ({ id: e.ID, name: e.Name, role: e.Role })) : [];
                
                const typeMap = {
                    'annual': { class: 'bg-annual', label: 'Annual', fcClass: 'evt-annual' },
                    'sick': { class: 'bg-sick', label: 'Sick', fcClass: 'evt-sick' },
                    'casual': { class: 'bg-casual', label: 'Casual', fcClass: 'evt-casual' },
                    'unpaid': { class: 'bg-unpaid', label: 'Unpaid', fcClass: 'evt-unpaid' },
                    'wfh': { class: 'bg-wfh', label: 'WFH', fcClass: 'evt-wfh' }
                };

                this.leaves = Array.isArray(leaveData) ? leaveData.map(row => {
                    if (!row.StartDate || !row.EndDate) return null;
                    const startDay = parseInt(row.StartDate.split('-')[2]);
                    const endDay = parseInt(row.EndDate.split('-')[2]);
                    const typeInfo = typeMap[row.Type.toLowerCase()] || { class: 'bg-annual', label: row.Type, fcClass: 'evt-annual' };
                    
                    return { 
                        id: row.ID, 
                        emp: row.EmployeeName, 
                        start: startDay, 
                        end: endDay, 
                        startDate: row.StartDate,
                        endDate: row.EndDate,
                        typeClass: typeInfo.class, 
                        fcClass: typeInfo.fcClass,
                        label: typeInfo.label, 
                        status: row.Status 
                    };
                }).filter(Boolean) : [];

                this.processSidePanels();
                this.renderFullCalendar();
                this.renderChart();

            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                this.isLoading = false;
            }
        },
        processSidePanels() {
            const todayDay = new Date().getDate();
            this.outTodayList = [];
            this.employees.forEach(emp => {
                const activeLeave = this.leaves.find(l => 
                    l.emp === emp.name && 
                    l.status === 'Approved' && 
                    todayDay >= l.start && todayDay <= l.end
                );
                if (activeLeave) this.outTodayList.push({ name: emp.name, type: activeLeave.label });
            });

            this.pendingRequests = this.leaves
                .filter(l => l.status === 'Pending')
                .map(l => ({ id: l.id, emp: l.emp, label: `${l.label} (${l.startDate} to ${l.endDate})` }));
        },
        renderFullCalendar() {
            const calendarEl = this.$refs.calendarEl;
            if (!calendarEl) return;

            const events = this.leaves.filter(l => l.status !== 'Rejected').map(l => ({
                title: `${l.emp.split(' ')[0]} · ${l.label}`,
                start: l.startDate,
                end: l.endDate,
                className: l.fcClass
            }));

            if (this.fcCalendar) {
                this.fcCalendar.removeAllEvents();
                this.fcCalendar.addEventSource(events);
            } else {
                this.fcCalendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    initialDate: `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-01`,
                    headerToolbar: {
                        left: 'prev,next',
                        center: 'title',
                        right: '' // We moved view switching to custom buttons
                    },
                    height: 'auto',
                    events: events,
                    dayMaxEvents: 3,
                    eventClick: (info) => this.showToast(`${info.event.title}`, 'success')
                });
                this.fcCalendar.render();
            }
        },
        updateCalendarDate() {
            if (this.fcCalendar) {
                const dateStr = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-01`;
                this.fcCalendar.gotoDate(dateStr);
            }
        },
        // ... Keep generateDays, getLeavesForEmp, calculateBarStyle, switchView, renderChart ...
    }
};