document.addEventListener("DOMContentLoaded", function () {
    // 🛠️ รีเซ็ตค่าต่าง ๆ เมื่อโหลดหน้าเว็บใหม่
    const serviceElements = document.querySelectorAll('.service-card');
    const selectedServiceInput = document.getElementById('selected-service');
    const selectedTimeInput = document.getElementById('selected-time');
    const selectedDateInput = document.getElementById('selected-date');
    const calendarDays = document.getElementById("calendar-days");

    // รีเซ็ตการเลือกบริการ
    serviceElements.forEach(serviceElement => {
        serviceElement.classList.remove('selected'); // ลบคลาส selected ถ้ามี
    });

    selectedServiceInput.value = '';  // รีเซ็ต input ซ่อนสำหรับบริการ
    selectedTimeInput.value = '';     // รีเซ็ต input ซ่อนสำหรับเวลา
    selectedDateInput.value = '';     // รีเซ็ต input ซ่อนสำหรับวันที่

    // อัปเดตข้อมูลการจองในคอลัมน์ขวา
    document.getElementById('booking-service').textContent = "ยังไม่ได้เลือก";
    document.getElementById('booking-date').textContent = "ยังไม่ได้เลือก";
    document.getElementById('booking-time').textContent = "ยังไม่ได้เลือก";

    // ฟังก์ชั่นจัดการการเลือกบริการ
    serviceElements.forEach(serviceElement => {
        serviceElement.addEventListener('click', function () {
            const serviceId = serviceElement.dataset.service;
            const servicePrice = serviceElement.dataset.price;
            let selectedServices = selectedServiceInput.value.split(',').filter(id => id.trim() !== '');  // กรองค่าที่ว่างออก

            // เพิ่มบริการที่เลือกลงใน array ถ้ายังไม่มีในนั้น
            if (!selectedServices.includes(serviceId)) {
                selectedServices.push(serviceId);
                selectedServiceInput.value = selectedServices.join(',');  // เก็บหลายบริการ
            } else {
                // ถ้ามีแล้วให้ลบออกจาก array
                const index = selectedServices.indexOf(serviceId);
                selectedServices.splice(index, 1);
                selectedServiceInput.value = selectedServices.join(',');  // อัปเดตค่า
            }

            // อัปเดตการแสดงข้อมูล
            const selectedServiceText = selectedServices.length > 0 ? selectedServices.join(', ') : "ยังไม่ได้เลือก";
            document.getElementById('booking-service').textContent = selectedServiceText;

            // คำนวณราคาทั้งหมดจากบริการที่เลือก
            const totalPrice = selectedServices.reduce((sum, id) => {
                const serviceElement = document.querySelector(`[data-service="${id}"]`);
                return sum + parseFloat(serviceElement.dataset.price);
            }, 0);

            document.getElementById('booking-price').textContent = totalPrice.toFixed(2);

            // เพิ่มหรือเอาคลาส selected ตามการเลือก
            serviceElement.classList.toggle('selected');
        });
    });

    // ฟังก์ชั่นจัดการการเลือกเวลา
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedTimeInput.value = button.dataset.time;  // เก็บเวลาใน input ซ่อน
            document.getElementById('booking-time').textContent = button.textContent;
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // ฟังก์ชั่นจัดการการเลือกวันที่
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        // Clear current days
        calendarDays.innerHTML = "";

        // Add empty days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const li = document.createElement("li");
            calendarDays.appendChild(li);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const li = document.createElement("li");
            li.textContent = day;
            li.addEventListener("click", () => {
                selectedDateInput.value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                document.getElementById("booking-date").textContent = selectedDateInput.value;
                highlightSelectedDate(li);
            });
            calendarDays.appendChild(li);
        }
    }

    function highlightSelectedDate(li) {
        // Remove previous highlight
        const previousSelected = document.querySelector('.days .selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        li.classList.add('selected');
    }

    // Initialize calendar for current month
    const currentDate = new Date();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Handle next/previous month navigation
    document.getElementById("prev").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    document.getElementById("next").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    // ตรวจสอบการเลือกบริการ วันที่ และเวลา ก่อนส่งฟอร์ม
    document.getElementById('booking-form').addEventListener('submit', function (event) {
        const selectedService = selectedServiceInput.value;
        const selectedDate = selectedDateInput.value;
        const selectedTime = selectedTimeInput.value;

        // ตรวจสอบว่ามีการเลือกบริการ, วันที่ และเวลา หรือไม่
        if (!selectedService || !selectedDate || !selectedTime) {
            alert("กรุณาเลือกบริการ, วันที่ และเวลา ก่อนที่จะยืนยันการจอง");
            event.preventDefault(); // ป้องกันการส่งฟอร์ม
        }
    });
});
