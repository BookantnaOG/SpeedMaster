// อัพเดตบริการที่เลือก
function updateService() {
    const selectedServices = [];
    document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });

    let serviceText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
    document.getElementById('selected-service').value = serviceText;
    document.getElementById('booking-service').innerText = serviceText;
}

// อัพเดตวันที่ที่เลือก
function updateDate(date) {
    document.getElementById('selected-date').value = date;
    document.getElementById('booking-date').innerText = date;
}

// อัพเดตเวลาที่เลือก
function updateTime(time) {
    document.getElementById('selected-time').value = time;
    document.getElementById('booking-time').innerText = time;
}
