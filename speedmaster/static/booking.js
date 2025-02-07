// Update the service selection
function updateService() {
    let selectedServices = [];
    let serviceElements = document.querySelectorAll('.service-checkbox:checked');
    serviceElements.forEach(function(checkbox) {
        selectedServices.push(checkbox.value);
    });

    // Update hidden input and display
    document.getElementById('selected-service').value = selectedServices.join(', ');
    document.getElementById('booking-service').innerText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
}

// Update the selected date
function updateDate(date) {
    document.getElementById('selected-date').value = date;
    document.getElementById('booking-date').innerText = date || 'ยังไม่ได้เลือก';
}

// Update the selected time
function updateTime(time) {
    document.getElementById('selected-time').value = time;
    document.getElementById('booking-time').innerText = time || 'ยังไม่ได้เลือก';
}

// Validate the form before submitting
function validateBooking() {
    let service = document.getElementById('selected-service').value;
    let date = document.getElementById('selected-date').value;
    let time = document.getElementById('selected-time').value;

    // Check if all fields are selected
    if (!service || !date || !time) {
        alert("กรุณาเลือกบริการ, วันที่ และเวลาให้ครบถ้วน");
        return false;
    }

    // Show confirmation pop-up
    document.getElementById('popup-modal').style.display = 'block';
    return false; // Prevent form submission for now
}

// Function to submit the booking form after confirmation
function submitBooking() {
    // Submit the form
    document.getElementById('booking-form').submit();

    // แจ้งเตือนการจอง
    alert("จองแล้ว! ขอบคุณสำหรับการจองบริการของเรา");
}

// Go to the next page after confirming the booking
function goToNextPage() {
    // Send form data to the server first
    submitBooking();

    // Redirect to the index.html page after submission
    window.location.href = 'index.html'; // เปลี่ยน URL ไปยัง index.html
}
