document.addEventListener("DOMContentLoaded", function () {
    // Function to start the auto-update process for each booking
    function autoUpdateStatus() {
        const bookings = document.querySelectorAll('.service-status-container');

        bookings.forEach((booking, index) => {
            let currentProgress = 0;
            
            const statusValue = booking.getElementsByClassName("status");
            const statuses = booking.querySelectorAll('.status-item');
            const connectors = booking.querySelectorAll('.connector-line');

            // Reset all status items to their initial state
            statuses.forEach(status => {
                status.classList.remove('completed');
                status.classList.remove('active');
                status.classList.add('pending');
            });

            // Reset connector lines
            connectors.forEach(connector => {
                connector.style.backgroundColor = '#ccc';
            });

            // Set the status after each timeout
            setTimeout(() => {
                // Status 1: Waiting for Payment
                const status1 = booking.querySelector('#status1');
                status1.classList.add('completed');
                updateConnectors(33, booking);
                toggleBox(booking, 'status1-details');
                hideDetails(booking, ['status2-details', 'status3-details']);
            }, 0);  // Immediately show status1 (0ms delay)

            setTimeout(() => {
                // Status 2: Wait (After 30 seconds)
                const status1 = booking.querySelector('#status1');
                const status2 = booking.querySelector('#status2');
                const connector1 = booking.querySelector('#connector1');
                status1.classList.add('completed');
                status2.classList.add('completed');
                connector1.style.backgroundColor = '#4CAF50'; // Change connector line color to green
                updateConnectors(66, booking);
                toggleBox(booking, 'status2-details');
                hideDetails(booking, ['status1-details', 'status3-details']);
            }, 30000); // After 30 seconds, show status2

            setTimeout(() => {
                // Status 3: Finish (After 60 seconds)
                const status1 = booking.querySelector('#status1');
                const status2 = booking.querySelector('#status2');
                const status3 = booking.querySelector('#status3');
                const connector1 = booking.querySelector('#connector1');
                const connector2 = booking.querySelector('#connector2');
                status1.classList.add('completed');
                status2.classList.add('completed');
                status3.classList.add('completed');
                connector1.style.backgroundColor = '#4CAF50';
                connector2.style.backgroundColor = '#4CAF50'; // Change last connector line color to green
                updateConnectors(100, booking);
                toggleBox(booking, 'status3-details');
                hideDetails(booking, ['status1-details', 'status2-details']);
            }, 60000); // After 60 seconds, show status3
        });
    }

    // Start auto-updating status once page is loaded
    autoUpdateStatus();

    // Function to toggle the visibility of status detail boxes
    function toggleBox(booking, statusDetailId) {
        const box = booking.querySelector(`#${statusDetailId}`);
        if (box.style.display === 'block') {
            box.style.display = 'none';
        } else {
            box.style.display = 'block';
        }
    }

    // Function to hide other status detail boxes
    function hideDetails(booking, detailIds) {
        detailIds.forEach(detailId => {
            const box = booking.querySelector(`#${detailId}`);
            box.style.display = 'none';
        });
    }

    // Function to update connector colors based on progress
    function updateConnectors(progress, booking) {
        if (progress >= 33) {
            const connector1 = booking.querySelector('#connector1');
            connector1.style.backgroundColor = '#4CAF50';
        }
        if (progress >= 66) {
            const connector2 = booking.querySelector('#connector2');
            connector2.style.backgroundColor = '#4CAF50';
        }
    }
});
