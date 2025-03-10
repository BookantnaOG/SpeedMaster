// Function to handle task cancellation
function cancelTask(employeeId, buttonElement) {
    // Change the button text to "เลิกบริการ"
    buttonElement.innerHTML = "เลิกบริการ";
    buttonElement.disabled = true; // Disable the button to prevent further clicks
    
    // You can perform backend actions here, such as sending a request to update the task status
    alert("งานของพนักงานรหัส " + employeeId + " ถูกยกเลิกแล้ว");
}
// Menu_view.js

document.addEventListener("DOMContentLoaded", function () {

    // Select all approval buttons
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    // Event listener for approve button
    approveButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            // Set receipt status to 'ได้รับแล้ว'
            row.querySelector('td:nth-child(4)').textContent = 'ได้รับแล้ว';
            // Set approval status to 'อนุมัติ'
            row.querySelector('td:nth-child(5)').textContent = 'อนุมัติ';
            // Disable buttons after approval
            disableActionButtons(row);
        });
    });

    // Event listener for reject button
    rejectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            // Set receipt status to 'ไม่ได้รับ'
            row.querySelector('td:nth-child(4)').textContent = 'ไม่ได้รับ';
            // Set approval status to 'ไม่อนุมัติ'
            row.querySelector('td:nth-child(5)').textContent = 'ไม่อนุมัติ';
            // Disable buttons after rejection
            disableActionButtons(row);
        });
    });

    // Event listener for cancel button
    cancelButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            // Reset all statuses
            row.querySelector('td:nth-child(4)').textContent = 'ยังไม่ได้';
            row.querySelector('td:nth-child(5)').textContent = ''; // Empty approval status
            // Re-enable action buttons if canceled
            enableActionButtons(row);
        });
    });

    // Function to disable approval/reject buttons after action
    function disableActionButtons(row) {
        row.querySelector('.approve-btn').disabled = true;
        row.querySelector('.reject-btn').disabled = true;
    }

    // Function to re-enable action buttons after cancellation
    function enableActionButtons(row) {
        row.querySelector('.approve-btn').disabled = false;
        row.querySelector('.reject-btn').disabled = false;
    }

});
