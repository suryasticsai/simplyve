// calendar.js
const calendarModule = {
    data() {
        return {
            employees: [], // Populated dynamically from your Employees sheet
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
            
            // Fetch employees and leaves simultaneously for speed
            const [empData, leaveData] = await Promise.all([
                this.fetchEmployeesFromSheet(),
                this.fetchLeavesFromSheet()
            ]);

            // Map the 31 employees from the Google Sheet
            this.employees = empData.map(emp => ({
                id: emp.ID,       // e.g., 'EMP-001'
                name: emp.Name,   // e.g., 'Prashant'
                role: emp.Role    // e.g., 'Employee'
            }));

            // Color mapping matching your legend
            const typeMap = {
                'annual': { class: 'bg-annual', label: 'Annual Leave' },
                'sick': { class: 'bg-sick', label: 'Sick Leave' },
                'casual': { class: 'bg-maternity', label: 'Casual Leave' },
                'unpaid': { class: 'bg-unpaid', label: 'Unpaid Leave' },
                'bereavement': { class: 'bg-bereavement', label: 'Bereavement' }
            };

            // Map the leaves from the Google Sheet
            this.leaves = leaveData.map(row => {
                // Safety check: Skip if dates are missing
                if (!row.StartDate || !row.EndDate) return null;
                
                // Extract day numbers from YYYY-MM-DD
                const startDay = parseInt(row.StartDate.split('-')[2]);
                const endDay = parseInt(row.EndDate.split('-')[2]);
                
                // Safety check: Ensure the dates fall within March (1-31)
                if (isNaN(startDay) || isNaN(endDay)) return null;

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
            }).filter(Boolean); // Remove any nulls
            
            this.isLoading = false;
        },
        generateDays() {
            const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            // Generate 31 days for the month of March
            for (let i = 1; i <= 31; i++) {
                // March 2026 starts on a Sunday (Day 0)
                const dayOfWeek = (i - 1) % 7; 
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = i === 14; // Mocking today as March 14th
                
                this.days.push({
                    date: i,
                    dayName: dayNames[dayOfWeek],
                    isWeekend,
                    isToday
                });
            }
        },
        getLeavesForEmp(empName) {
            // Only show leaves that match the employee's name
            return this.leaves.filter(l => l.emp === empName);
        },
        calculateBarStyle(leave) {
            const totalDays = this.days.length; 
            // Calculate start position as a percentage
            const startPct = ((leave.start - 1) / totalDays) * 100;
            // Calculate width as a percentage
            const widthPct = ((leave.end - leave.start + 1) / totalDays) * 100;
            
            return {
                left: `calc(220px + (100% - 220px) * ${startPct / 100})`,
                width: `calc((100% - 220px) * ${widthPct / 100} - 4px)` 
            };
        }
    }
};