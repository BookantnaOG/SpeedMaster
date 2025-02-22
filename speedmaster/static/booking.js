document.addEventListener("DOMContentLoaded", function () {
    // 🛠️ โหลดค่าที่เคยเลือกไว้ใน localStorage
    function loadPreviousSelections() {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
        const selectedDate = localStorage.getItem('selectedDate') || '';
        const selectedTime = localStorage.getItem('selectedTime') || '';

        // ✅ อัปเดต Checkbox ที่เคยเลือก
        document.querySelectorAll('.service-checkbox').forEach(checkbox => {
            if (selectedServices.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });

        // ✅ อัปเดตปุ่มวันที่
        document.querySelectorAll('.date-btn').forEach(button => {
            if (button.innerText === selectedDate) {
                button.classList.add('selected');
            }
        });

        // ✅ อัปเดตปุ่มเวลา
        document.querySelectorAll('.time-btn').forEach(button => {
            if (button.innerText === selectedTime) {
                button.classList.add('selected');
            }
        });

        // ✅ อัปเดต UI
        document.getElementById('booking-service').innerText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
        document.getElementById('booking-date').innerText = selectedDate || 'ยังไม่ได้เลือก';
        document.getElementById('booking-time').innerText = selectedTime || 'ยังไม่ได้เลือก';

        // ✅ พิมพ์ค่าลงใน console
        console.log("Services:", selectedServices);
        console.log("Date:", selectedDate);
        console.log("Time:", selectedTime);
    }

    // 🛠️ อัปเดตบริการที่เลือก
    function updateService() {
        const selectedServices = [];
        document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
            selectedServices.push(checkbox.value);
        });

        // ✅ เก็บข้อมูลลงใน localStorage
        localStorage.setItem('selectedServices', JSON.stringify(selectedServices));

        // ✅ อัปเดต UI
        document.getElementById('booking-service').innerText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
        document.getElementById('selected-service').value = selectedServices.join(',');
    }

    // 🛠️ อัปเดตวันที่ที่เลือก
    function updateDate(event) {
        const date = event.target.innerText;
        // ✅ บันทึกใน localStorage
        localStorage.setItem('selectedDate', date);

        // ✅ อัปเดต UI
        document.getElementById('booking-date').innerText = date;
        document.getElementById('selected-date').value = date;

        // ✅ เอาคลาส selected ออกจากปุ่มที่ไม่ได้เลือก
        document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    // 🛠️ อัปเดตเวลาที่เลือก
    function updateTime(event) {
        const time = event.target.innerText;
        // ✅ บันทึกใน localStorage
        localStorage.setItem('selectedTime', time);

        // ✅ อัปเดต UI
        document.getElementById('booking-time').innerText = time;
        document.getElementById('selected-time').value = time;

        // ✅ เอาคลาส selected ออกจากปุ่มที่ไม่ได้เลือก
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    // 🛠️ เพิ่ม Event Listener ให้ Checkbox
    document.querySelectorAll('.service-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateService);
    });

    // 🛠️ เพิ่ม Event Listener ให้ปุ่มวัน
    document.querySelectorAll('.date-btn').forEach(button => {
        button.addEventListener('click', updateDate); // ส่ง event มา
    });

    // 🛠️ เพิ่ม Event Listener ให้ปุ่มเวลา
    document.querySelectorAll('.time-btn').forEach(button => {
        button.addEventListener('click', updateTime); // ส่ง event มา
    });

    // 🛠️ ตรวจสอบการเลือกบริการ วันที่ และเวลา ก่อนส่งฟอร์ม
    document.getElementById('booking-form').addEventListener('submit', function(event) {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
        const selectedDate = localStorage.getItem('selectedDate');
        const selectedTime = localStorage.getItem('selectedTime');

        if (selectedServices.length === 0 || !selectedDate || !selectedTime) {
            alert("กรุณาเลือกบริการ, วันที่ และเวลา ก่อนที่จะยืนยันการจอง");
            event.preventDefault(); // ไม่ให้ส่งฟอร์มหรือไปหน้าถัดไป
        }
    });

    // ✅ โหลดค่าที่เลือกไว้ก่อนหน้า (ถ้ามี)
    loadPreviousSelections();
});
