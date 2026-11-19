// calendar.js
const calendarModule = {
    data() {
        return {
            employees: [
                { id: 1, name: 'Dan Smith' },
                { id: 2, name: 'Dave Hartley' },
                { id: 3, name: 'Emily Clarke' },
                { id: 4, name: 'George Watson' },
                { id: 5, name: 'Harry Mitchell' },
                { id: 6, name: 'Rachel Smith' },
                { id: 7, name: 'Rosie Jones' },
                { id: 8, name: 'Sarah Hart' },
                { id: 9, name: 'Sophie Turner' }
            ],
            days: [],
            leaves: [
                { id: 1, emp: 'Dan Smith', start: 9, end: 13, typeClass: 'bg-sick', label: 'Sick Leave' },
                { id: 2, emp: 'George Watson', start: 2, end: 13, typeClass: 'bg-annual', label: 'Annual Leave' },
                { id: 3, emp: 'Rachel Smith', start: 2, end: 4, typeClass: 'bg-bereavement', label: 'Bereavement' },
                { id: 4, emp: 'Rosie Jones', start: 9, end: 13, typeClass: 'bg-annual', label: 'Annual Leave' },
                { id: 5, emp: 'Sophie Turner', start: 5, end: 8, typeClass: 'bg-maternity', label: 'Maternity' },
                { id: 6, emp: 'Sophie Turner', start: 11, end: 14, typeClass: 'bg-unpaid', label: 'Unpaid Leave' }
            ]
        }
    },
    mounted() {
        this.generateDays();
    },
    methods: {
        generateDays() {
            const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            // Generating March 1 to March 16, 2026
            // March 1, 2026 is a Sunday (0)
            for (let i = 1; i <= 16; i++) {
                const dayOfWeek = (i - 1) % 7; // 0=Sun, 1=Mon...
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = i === 2; // Mocking today as March 2nd
                
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
            const totalDays = 16;
            // Calculate percentage based on 16 days
            const startPct = ((leave.start - 1) / totalDays) * 100;
            const widthPct = ((leave.end - leave.start + 1) / totalDays) * 100;
            
            // The CSS grid is 220px for name, then repeat(16, 1fr).
            // To overlay perfectly, we calculate from the start of the day columns.
            return {
                left: `calc(220px + (100% - 220px) * ${startPct / 100})`,
                width: `calc((100% - 220px) * ${widthPct / 100} - 4px)` // -4px for small gap
            };
        }
    }
};