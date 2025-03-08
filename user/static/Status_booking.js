
document.addEventListener("DOMContentLoaded", function () {
    let currentProgress = 0;
    
    showDetails();
    function showDetails() {
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

        // Set the status of the clicked button and show its details
        if (statusValue === 'Waiting for Payment') {
            document.getElementById('status1').classList.add('completed');
            updateConnectors(33);
            toggleBox('status1-details');
            // Hide other status boxes
            document.getElementById('status2-details').style.display = 'none';
            document.getElementById('status3-details').style.display = 'none';
        } else if (statusValue === 'Wait') {
            document.getElementById('status1').classList.add('completed');
            document.getElementById('status2').classList.add('completed');
            document.getElementById('connector1').style.backgroundColor = '#4CAF50'; // Change connector line color to green
            updateConnectors(66);
            toggleBox('status2-details');
            // Hide other status boxes
            document.getElementById('status1-details').style.display = 'none';
            document.getElementById('status3-details').style.display = 'none';
        } else if (statusValue === 'Finish') {
            document.getElementById('status1').classList.add('completed');
            document.getElementById('status2').classList.add('completed');
            document.getElementById('status3').classList.add('completed');
            document.getElementById('connector1').style.backgroundColor = '#4CAF50';
            document.getElementById('connector2').style.backgroundColor = '#4CAF50'; // Change last connector line color to green
            updateConnectors(100);
            toggleBox('status3-details');
            // Hide other status boxes
            document.getElementById('status1-details').style.display = 'none';
            document.getElementById('status2-details').style.display = 'none';
        }
    }

    function toggleBox(statusDetailId) {
        const box = document.getElementById(statusDetailId);
        if (box.style.display === 'block') {
            box.style.display = 'none';
        } else {
            box.style.display = 'block';
        }
    }

    function updateConnectors(progress) {
        if (progress >= 33) {
            document.getElementById('connector1').style.backgroundColor = '#4CAF50';
        }
        if (progress >= 66) {
            document.getElementById('connector2').style.backgroundColor = '#4CAF50';
        }
    }
});