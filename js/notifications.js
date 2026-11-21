const notificationModule = {
    data() {
        return {
            showNotifications: false,
            notifications: [
                { id: 1, text: "Rachel Smith approved your Annual Leave request.", time: "2 mins ago", type: "success", icon: "bi-check-circle", read: false }
            ]
        }
    },
    computed: {
        unreadNotifications() {
            return this.notifications.filter(n => !n.read).length;
        }
    },
    methods: {
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
            if (this.showNotifications) {
                setTimeout(() => {
                    this.notifications.forEach(n => n.read = true);
                }, 1500);
            }
        }
    }
};