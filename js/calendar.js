// calendar.js
const calendarModule = {
    data() {
        return {
            employees: [],
            days: [],
            leaves: [],
            isLoading: true
        }
    },
    mounted() {
        this.generateDays();
        this.loadData();
    },
    methods: {
        async loadData() {
            this.isLoading = true;
            
            const [empData, leaveData] = await Promise.all([
                this.fetchEmployeesFromSheet(),
                this.fetchLeavesFromSheet()
            ]);

            this.employees = empData.map(emp => ({
                id: emp.ID,
                name: emp.Name,
                role: emp.Role
            }));

            const typeMap = {
                'annual': { class: 'bg-annual', label: 'Annual Leave' },
                'sick': { class: 'bg-sick', label: 'Sick Leave' },
                'casual': { class: 'bg-maternity', label: 'Casual Leave' },
                'unpaid': { class: 'bg-unpaid', label: 'Unpaid Leave' },
                'bereavement': { class: 'bg-bereavement', label: 'Bereavement' }
            };

            this.leaves = leaveData.map(row => {
                const startDay = parseInt(row.StartDate.split('-')[2]);
                const endDay = parseInt(row.EndDate.split('-')[2]);
                const typeInfo = typeMap[row.Type.toLowerCase()] || { class: 'bg-annual', label: row.Type };

                return {
                    id: row.ID,
                    emp: row.EmployeeName,
                    start: startDay,
                    end: endDay,
                    typeClass: typeInfo.class,
                    label: typeInfo.label,
                    status: row.Status
                };
            });
            
            this.isLoading = false;
        },
        generateDays() {
            const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            for (let i = 1; i <= 31; i++) {
                const dayOfWeek = (i + 5) % 7; 
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = i === 14; 
                
                this.days.push({
                    date: i,
                    dayName: dayNames[dayOfWeek],
                    isWeekend,
                    isToday
                });
            }
        },
        getLeavesForEmp(empName) {
            return this.leaves.filter(l => l.emp === empName);
        },
        calculateBarStyle(leave) {
            const totalDays = this.days.length; 
            const startPct = ((leave.start - 1) / totalDays) * 100;
            const widthPct = ((leave.end - leave.start + 1) / totalDays) * 100;
            
            return {
                left: `calc(220px + (100% - 220px) * ${startPct / 100})`,
                width: `calc((100% - 220px) * ${widthPct / 100} - 4px)` 
            };
        }
    }
}; 