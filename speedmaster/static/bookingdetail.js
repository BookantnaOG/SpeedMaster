document.addEventListener("DOMContentLoaded", function () {
    // ฟังก์ชันในการแสดงวันและเวลาในรูปแบบที่ต้องการ
    function formatDateTime(day, time) {
        const monthsOfYear = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const month = monthsOfYear[currentDate.getMonth()];
        const year = currentDate.getFullYear() + 543;
        return `${day} ที่ ${dayOfMonth} ${month} ${year} เวลา ${time}`;
    }

    // ฟังก์ชันในการดึงวันที่ถูกเลือกจาก localStorage หรือวันที่ปัจจุบัน
    function getSelectedDayFromLocalStorage() {
        const selectedDay = localStorage.getItem('selectedDate');
        if (selectedDay) {
            return selectedDay;
        } else {
            const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
            const currentDay = new Date().getDay();
            return daysOfWeek[currentDay];
        }
    }

    // ดึงวันและเวลาและแสดงบนหน้าจอ
    const selectedDay = getSelectedDayFromLocalStorage();
    const selectedTime = localStorage.getItem('selectedTime') || "12:30";
    document.getElementById('booking-time-display').innerText = formatDateTime(selectedDay, selectedTime);

    // ราคาของบริการต่างๆ
    const servicePrices = {
        "เคลือบแก้ว": 500,
        "ฟิล์มกันรอย": 200,
        "ทำความสะอาด": 100
    };

    // ดึงรายการบริการที่เลือกจาก localStorage
    let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const servicePriceTable = document.getElementById('service-price-table');
    servicePriceTable.innerHTML = selectedServices.length > 0 ? 
        `<ul>` + selectedServices.map(service => ` 
            <li>
                <span class="service-name">${service}</span> 
                <span class="service-price">${servicePrices[service] || 0} บาท</span>
            </li>`).join('') + 
        `<li>
            <span class="service-name">ค่าบริการ</span> 
            <span class="service-price">50 บาท</span>
        </li>` + 
        `</ul>` : 
        '<ul><li>ยังไม่ได้เลือกบริการ</li></ul>';

    // ฟังก์ชันในการคำนวณราคาสุทธิ
    function calculateFinalPrice(discount = 0) {
        let totalPrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0) + 50;
        const vat = totalPrice * 0.07;
        const finalPrice = totalPrice + vat - discount;

        localStorage.setItem('finalPrice', finalPrice.toFixed(2));

        if (isNaN(finalPrice)) {
            document.getElementById('final-price').innerText = 'ราคาไม่ถูกต้อง';
        } else {
            document.getElementById('final-price').innerText = `${finalPrice.toFixed(2)} THB`;
        }
    }

    // ฟังก์ชันในการคำนวณส่วนลดและราคาหลังจากส่วนลด
    function applyDiscount() {
        const discountCode = document.getElementById('discount-code').value.trim().toLowerCase();
        let discountAmount = 0;

        // คำนวณส่วนลดเมื่อกดปุ่ม "ใช้ส่วนลด"
        if (discountCode === "speedmaster") {
            const basePrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0) + 50;
            discountAmount = basePrice * 0.20;  // 20% discount
        }

        calculateFinalPrice(discountAmount);  // คำนวณราคาใหม่หลังจากใช้ส่วนลด
    }

    // ฟังก์ชันในการเลือกบริการ
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            const service = event.target.innerText;
            if (!selectedServices.includes(service)) {
                selectedServices.push(service);
                localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            }
            calculateFinalPrice();  // คำนวณราคาหลังจากเลือกบริการ
        });
    });

    // ฟังก์ชันที่เรียกเมื่อกรอกรหัสส่วนลด
    document.getElementById('discount-code').addEventListener('input', function () {
        document.getElementById('apply-discount-btn').disabled = false;  // เปิดใช้งานปุ่ม "ใช้ส่วนลด"
    });

    // เมื่อกดปุ่ม "ใช้ส่วนลด" ให้คำนวณราคาใหม่
    document.getElementById('apply-discount-btn').addEventListener('click', function () {
        applyDiscount();
    });

    // การยืนยันการทำรายการและเก็บข้อมูลที่ต้องการส่งไปยังหน้า Payment
    document.getElementById("payment-btn").addEventListener("click", function(event) {
        event.preventDefault();

        const carReg = document.getElementById("car-reg").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const carBrand = document.getElementById("car-brand").value;  // ดึงยี่ห้อรถที่เลือก
        const validationMessage = document.querySelector('.validation-message');

        if (!carReg || !mobile || !carBrand) {
            validationMessage.style.display = 'block';
            return;
        }

        validationMessage.style.display = 'none';
        
        // เก็บข้อมูลใน localStorage เพื่อส่งไปยังหน้า payment.html
        localStorage.setItem('carReg', carReg);
        localStorage.setItem('mobile', mobile);
        localStorage.setItem('carBrand', carBrand);

        // เปลี่ยนหน้าไปยัง payment.html
        window.location.href = '/payment/';  
    });

    // ในหน้า payment.html, สามารถดึงข้อมูลนี้จาก localStorage ได้
    if (window.location.pathname.includes("payment.html")) {
        const carReg = localStorage.getItem('carReg');
        const mobile = localStorage.getItem('mobile');
        const carBrand = localStorage.getItem('carBrand');
        const finalPrice = localStorage.getItem('finalPrice');

        // แสดงข้อมูลในหน้า payment
        document.getElementById('payment-car-reg').innerText = carReg;
        document.getElementById('payment-mobile').innerText = mobile;
        document.getElementById('payment-car-brand').innerText = carBrand;
        document.getElementById('payment-final-price').innerText = `${finalPrice} THB`;
    }

    // เรียกใช้ฟังก์ชันคำนวณราคาครั้งแรกเพื่อให้แสดงผลทันที
    calculateFinalPrice();
});
