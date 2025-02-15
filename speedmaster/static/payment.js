document.addEventListener("DOMContentLoaded", function () {
    // ฟังก์ชันแสดงรูปแบบวันที่และเวลา
    function formatDateTime(day, time) {
        const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
        const monthsOfYear = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

        const currentDate = new Date();
        const dayOfWeek = daysOfWeek[currentDate.getDay()]; // วันในสัปดาห์จากเครื่อง
        const dayOfMonth = currentDate.getDate(); // วันที่ในเดือนจากเครื่อง
        const month = monthsOfYear[currentDate.getMonth()]; // เดือนจากเครื่อง
        const year = currentDate.getFullYear() + 543; // พ.ศ.

        return `${dayOfWeek}ที่ ${dayOfMonth} ${month} ${year} เวลา ${time}`;
    }

    // แสดงวันที่และเวลาจองจาก Local Storage
    const selectedDay = localStorage.getItem('selectedDay') || "จันทร์";
    const selectedTime = localStorage.getItem('selectedTime') || "10:30";
    document.getElementById('booking-time-display').innerText = formatDateTime(selectedDay, selectedTime);

    // ค่าบริการ
    const servicePrices = {
        "เคลือบแก้ว": 500,
        "ติดฟิล์มกันรอย": 200,
        "ล้างรถ": 100
    };

    // แสดงบริการที่เลือก
    let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const servicePriceTable = document.getElementById('service-price-table');
    servicePriceTable.innerHTML = selectedServices.length > 0 ? 
        selectedServices.map(service => `<li>${service} ${servicePrices[service] || 0} THB</li>`).join('') + 
        `<li>ค่าบริการ 50 THB</li>` : 
        '<li>ยังไม่ได้เลือกบริการ</li>';

    // คำนวณราคารวม
    function calculateFinalPrice() {
        let totalPrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0) + 50;
        const vat = totalPrice * 0.07;
        document.getElementById('final-price').innerText = `${(totalPrice + vat).toFixed(2)} THB`;
    }
    calculateFinalPrice();

    // ฟังก์ชันเลือกช่องทางชำระเงิน
    function showPaymentForm(formId) {
        document.querySelectorAll('.payment-form').forEach(form => form.style.display = 'none');
        document.getElementById(formId).style.display = 'block';
    }

    document.getElementById('credit-card-btn').addEventListener("click", () => showPaymentForm('credit-card-form'));
    document.getElementById('qr-code-btn').addEventListener("click", () => showPaymentForm('qr-code'));
    document.getElementById('store-payment-btn').addEventListener("click", () => showPaymentForm('store-payment'));

    // ใช้โค้ดส่วนลด
    document.getElementById('apply-discount-btn').addEventListener("click", function () {
        const discountCode = document.getElementById('discount-code').value;
        let finalPrice = parseFloat(document.getElementById('final-price').innerText.replace(" THB", ""));
        if (discountCode === "speedmaster") {
            finalPrice *= 0.8;
        }
        document.getElementById('final-price').textContent = `${finalPrice.toFixed(2)} THB`;
    });

    // การชำระเงิน
    document.getElementById('payment-btn').addEventListener("click", function () {
        alert('กำลังดำเนินการชำระเงิน...');
    });
});
