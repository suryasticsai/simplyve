const calendarModule = {
    data() {
        return {
            employees: [],
            days: [],
            leaves: [],
            isLoading: true,
            searchQuery: '' // Moved here for live search
        }
    },
    computed: {
        filteredEmployees() {
            if (!this.searchQuery) return this.employees;
            const q = this.searchQuery.toLowerCase();
            return this.employees.filter(e => 
                e.name.toLowerCase().includes(q) || 
                e.id.toLowerCase().includes(q)
            );
        },
        outTodayCount() {
            const today = 14; // Mocking today as March 14
            let count = 0;
            this.employees.forEach(emp => {
                const empLeaves = this.leaves.filter(l => l.emp === emp.name && l.status === 'Approved');
                if (empLeaves.some(l => today >= l.start && today <= l.end)) count++;
            });
            return count;
        },
        daysWithEvents() {
            // Used by the Agenda view to only show days that have leaves
            return this.days.filter(day => this.getLeavesForDate(day.date).length > 0);
        }
    },
    methods: {
        async loadData() {
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
                    'annual': { class: 'bg-annual', label: 'Annual Leave' },
                    'sick': { class: 'bg-sick', label: 'Sick Leave' },
                    'casual': { class: 'bg-maternity', label: 'Casual Leave' },
                    'unpaid': { class: 'bg-unpaid', label: 'Unpaid Leave' },
                    'bereavement': { class: 'bg-bereavement', label: 'Bereavement' }
                };

                this.leaves = Array.isArray(leaveData) ? leaveData.map(row => {
                    if (!row.StartDate || !row.EndDate) return null;
                    const startDay = parseInt(row.StartDate.split('-')[2]);
                    const endDay = parseInt(row.EndDate.split('-')[2]);
                    const typeInfo = typeMap[row.Type.toLowerCase()] || { class: 'bg-annual', label: row.Type };
                    return { id: row.ID, emp: row.EmployeeName, start: startDay, end: endDay, typeClass: typeInfo.class, label: typeInfo.label, status: row.Status };
                }).filter(Boolean) : [];

            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                this.isLoading = false;
            }
        },
        generateDays() {
            const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            for (let i = 1; i <= 31; i++) {
                const dayOfWeek = (i - 1) % 7; 
                this.days.push({
                    date: i,
                    dayName: dayNames[dayOfWeek],
                    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                    isToday: i === 14
                });
            }
        },
        getLeavesForEmp(empName) {
            return this.leaves.filter(l => l.emp === empName);
        },
        getLeavesForDate(dateNum) {
            return this.leaves.filter(l => dateNum >= l.start && dateNum <= l.end);
        },
        calculateBarStyle(leave) {
            const total = this.days.length; 
            return {
                left: `calc(220px + (100% - 220px) * ${((leave.start - 1) / total) * 100 / 100})`,
                width: `calc((100% - 220px) * ${((leave.end - leave.start + 1) / total) * 100 / 100} - 4px)` 
            };
        }
    }
};