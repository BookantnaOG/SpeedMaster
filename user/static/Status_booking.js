document.addEventListener("DOMContentLoaded", function () {
    let currentProgress = 0;
    
    // Function to start the auto-update process
    function autoUpdateStatus() {
        const statusValue = document.getElementsByClassName("status");
        const statuses = ['status1', 'status2', 'status3'];
        const connectors = ['connector1', 'connector2'];

        // Reset all status items to their initial state
        statuses.forEach(status => {
            document.getElementById(status).classList.remove('completed');
            document.getElementById(status).classList.remove('active');
            document.getElementById(status).classList.add('pending');
        });

        // Reset connector lines
        connectors.forEach(connector => {
            document.getElementById(connector).style.backgroundColor = '#ccc';
        });

        // Set the status after each timeout
        setTimeout(() => {
            // Status 1: Waiting for Payment
            document.getElementById('status1').classList.add('completed');
            updateConnectors(33);
            toggleBox('status1-details');
            document.getElementById('status2-details').style.display = 'none';
            document.getElementById('status3-details').style.display = 'none';
        }, 0);  // Immediately show status1 (0ms delay)

        setTimeout(() => {
            // Status 2: Wait (After 30 seconds)
            document.getElementById('status1').classList.add('completed');
            document.getElementById('status2').classList.add('completed');
            document.getElementById('connector1').style.backgroundColor = '#4CAF50'; // Change connector line color to green
            updateConnectors(66);
            toggleBox('status2-details');
            document.getElementById('status1-details').style.display = 'none';
            document.getElementById('status3-details').style.display = 'none';
        }, 30000); // After 30 seconds, show status2

        setTimeout(() => {
            // Status 3: Finish (After 60 seconds)
            document.getElementById('status1').classList.add('completed');
            document.getElementById('status2').classList.add('completed');
            document.getElementById('status3').classList.add('completed');
            document.getElementById('connector1').style.backgroundColor = '#4CAF50';
            document.getElementById('connector2').style.backgroundColor = '#4CAF50'; // Change last connector line color to green
            updateConnectors(100);
            toggleBox('status3-details');
            document.getElementById('status1-details').style.display = 'none';
            document.getElementById('status2-details').style.display = 'none';
        }, 60000); // After 60 seconds, show status3
    }

    // Start auto-updating status once page is loaded
    autoUpdateStatus();

    // Function to toggle the visibility of status detail boxes
    function toggleBox(statusDetailId) {
        const box = document.getElementById(statusDetailId);
        if (box.style.display === 'block') {
            box.style.display = 'none';
        } else {
            box.style.display = 'block';
        }
    }

    // Function to update connector colors based on progress
    function updateConnectors(progress) {
        if (progress >= 33) {
            document.getElementById('connector1').style.backgroundColor = '#4CAF50';
        }
        if (progress >= 66) {
            document.getElementById('connector2').style.backgroundColor = '#4CAF50';
        }
    }
});
