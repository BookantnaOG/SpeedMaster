document.addEventListener("DOMContentLoaded", function () {
    // 🛠️ โหลดค่าที่เคยเลือกไว้ใน localStorage
    function loadPreviousSelections() {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
        const selectedDate = localStorage.getItem('selectedDate') || '';
        const selectedTime = localStorage.getItem('selectedTime') || '';

        // ✅ อัปเดตการ์ดบริการที่เคยเลือก
        document.querySelectorAll('.service-card').forEach(card => {
            const service = card.getAttribute('data-service');
            if (selectedServices.includes(service)) {
                card.classList.add('selected', 'active');
            }
        });

        // ✅ อัปเดตปุ่มวันที่
        document.querySelectorAll('.date-btn').forEach(btn => {
            if (btn.innerText === selectedDate) {
                btn.classList.add('selected');
            }
        });

        // ✅ อัปเดตปุ่มเวลา
        document.querySelectorAll('.time-btn').forEach(btn => {
            if (btn.innerText === selectedTime) {
                btn.classList.add('selected');
            }
        });

        // ✅ อัปเดต UI
        document.getElementById('booking-service').innerText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
        document.getElementById('booking-date').innerText = selectedDate || 'ยังไม่ได้เลือก';
        document.getElementById('booking-time').innerText = selectedTime || 'ยังไม่ได้เลือก';
    }

    // 🛠️ อัปเดตบริการที่เลือก
    function updateService() {
        const selectedServices = [];
        document.querySelectorAll('.service-card.active').forEach(card => {
            selectedServices.push(card.getAttribute('data-service'));
        });

        // ✅ เก็บข้อมูลลงใน localStorage
        localStorage.setItem('selectedServices', JSON.stringify(selectedServices));

        // ✅ อัปเดต UI
        document.getElementById('booking-service').innerText = selectedServices.join(', ') || 'ยังไม่ได้เลือก';
        document.getElementById('selected-service').value = selectedServices.join(',');
    }

    // 🛠️ อัปเดตวันที่ที่เลือก (เลือกได้แค่ตัวเดียว)
    function updateDate(event) {
        const date = event.target.innerText;
        
        // ✅ เอาคลาส selected ออกจากปุ่มที่ไม่ได้เลือก
        document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('selected'));
        
        // ✅ เพิ่มคลาส selected ให้ปุ่มที่ถูกคลิก
        event.target.classList.add('selected');

        // ✅ บันทึกใน localStorage
        localStorage.setItem('selectedDate', date);

        // ✅ อัปเดต UI
        document.getElementById('booking-date').innerText = date;
        document.getElementById('selected-date').value = date;
    }

    // 🛠️ อัปเดตเวลาที่เลือก (เลือกได้แค่ตัวเดียว)
    function updateTime(event) {
        const time = event.target.innerText;

        // ✅ เอาคลาส selected ออกจากปุ่มที่ไม่ได้เลือก
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));

        // ✅ เพิ่มคลาส selected ให้ปุ่มที่ถูกคลิก
        event.target.classList.add('selected');

        // ✅ บันทึกใน localStorage
        localStorage.setItem('selectedTime', time);

        // ✅ อัปเดต UI
        document.getElementById('booking-time').innerText = time;
        document.getElementById('selected-time').value = time;
    }

    // 🛠️ เพิ่ม Event Listener ให้กับการ์ดบริการ (เลือกได้หลายใบ)
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            // ✅ สลับคลาส active เพื่อให้กดแล้วค้างไว้
            card.classList.toggle('active');
            card.classList.toggle('selected');

            // ✅ อัปเดตบริการที่เลือก
            updateService();
        });
    });

    // 🛠️ เพิ่ม Event Listener ให้ปุ่มวัน (เลือกได้แค่ 1 วัน)
    document.querySelectorAll('.date-btn').forEach(button => {
        button.addEventListener('click', updateDate);
    });

    // 🛠️ เพิ่ม Event Listener ให้ปุ่มเวลา (เลือกได้แค่ 1 เวลา)
    document.querySelectorAll('.time-btn').forEach(button => {
        button.addEventListener('click', updateTime);
    });

    // 🛠️ ตรวจสอบการเลือกบริการ วันที่ และเวลา ก่อนส่งฟอร์ม
    document.getElementById('booking-form').addEventListener('submit', function(event) {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
        const selectedDate = localStorage.getItem('selectedDate');
        const selectedTime = localStorage.getItem('selectedTime');

        if (selectedServices.length === 0 || !selectedDate || !selectedTime) {
            alert("กรุณาเลือกบริการ, วันที่ และเวลา ก่อนที่จะยืนยันการจอง");
            event.preventDefault();
        }
    });

    // ✅ โหลดค่าที่เลือกไว้ก่อนหน้า (ถ้ามี)
    loadPreviousSelections();
});
