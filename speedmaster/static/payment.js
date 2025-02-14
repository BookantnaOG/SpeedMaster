document.addEventListener("DOMContentLoaded", function () {
    // ฟังก์ชันในการจัดรูปแบบวันที่และเวลา
    function formatDateTime(date) {
        const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
        const monthsOfYear = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear() + 543; // เพิ่มปีพุทธศักราช
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${dayOfWeek}ที่ ${day} ${month} ${year} เวลา ${hours}:${minutes}`;
    }

    // ได้รับวันที่และเวลาปัจจุบัน
    const currentDate = new Date();

    // แสดงวันที่และเวลาที่จอง
    const bookingDateElement = document.getElementById('booking-time-display');
    if (bookingDateElement) {
        bookingDateElement.innerText = formatDateTime(currentDate);
    }

    // ตัวอย่างการใช้ค่าที่ได้
    const servicePrices = {
        "เคลือบแก้ว": 500,
        "ติดฟิล์มกันรอย": 200,
        "ล้างรถ": 100 // ตัวอย่างบริการอื่น ๆ
    };

    // ดึงค่าบริการที่เลือกจาก localStorage
    let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];

    // กำหนดลำดับของบริการที่ต้องการ
    const serviceOrder = ["ล้างรถ", "เคลือบแก้ว", "ติดฟิล์มกันรอย"];

    // เรียงลำดับบริการที่เลือกตามลำดับที่กำหนด
    selectedServices = selectedServices.sort((a, b) => {
        return serviceOrder.indexOf(a) - serviceOrder.indexOf(b);
    });

    // แสดงรายการบริการพร้อมราคา
    const servicePriceTable = document.getElementById('service-price-table');
    let serviceList = "";
    if (selectedServices.length > 0) {
        serviceList = selectedServices.map(service => {
            const price = servicePrices[service] || 0;
            return `<li>${service} ${price} THB</li>`; // ไม่มีจุดขาว
        }).join('');
        // เพิ่มค่าบริการ 50 บาทลงในบรรทัดสุดท้าย
        serviceList += `<li>ค่าบริการ 50 THB</li>`;
        servicePriceTable.innerHTML = serviceList;
    } else {
        servicePriceTable.innerHTML = '<li>ยังไม่ได้เลือกบริการ</li>';
    }

    // คำนวณราคารวม (รวม VAT และค่าบริการ)
    const calculateFinalPrice = () => {
        let totalPrice = selectedServices.reduce((total, service) => {
            return total + (servicePrices[service] || 0);
        }, 0);

        // เพิ่มค่าบริการ 50 บาท
        const serviceFee = 50;
        totalPrice += serviceFee;

        const vat = totalPrice * 0.07; // คำนวณ VAT 7%
        const finalPrice = totalPrice + vat;

        // แสดงราคาสุดท้าย
        document.getElementById('final-price').innerText = `${finalPrice.toFixed(2)} THB`;
    };

    // คำนวณราคาหลังจากแสดงบริการที่เลือก
    calculateFinalPrice();
    // ฟังก์ชันสำหรับแสดงฟอร์มตามการเลือกช่องทางการชำระเงิน
function showCreditCardForm() {
    // ซ่อนฟอร์มอื่น ๆ
    document.getElementById('credit-card-form').style.display = 'block';
    document.getElementById('qr-code').style.display = 'none';
    document.getElementById('store-payment').style.display = 'none';
}

function showQRCode() {
    // ซ่อนฟอร์มอื่น ๆ
    document.getElementById('credit-card-form').style.display = 'none';
    document.getElementById('qr-code').style.display = 'block';
    document.getElementById('store-payment').style.display = 'none';
}

function showStorePayment() {
    // ซ่อนฟอร์มอื่น ๆ
    document.getElementById('credit-card-form').style.display = 'none';
    document.getElementById('qr-code').style.display = 'none';
    document.getElementById('store-payment').style.display = 'block';
}

// ฟังก์ชันการคำนวณส่วนลด (กรณีที่มีโค้ดส่วนลด)
function applyDiscount() {
    var discountCode = document.getElementById('discount-code').value;
    var finalPrice = 1000; // สมมติราคามาตรฐานก่อนส่วนลด
    if (discountCode === "speedmaster") {
        finalPrice = finalPrice * 0.8; // 20% off
    }
    document.getElementById('final-price').textContent = finalPrice + " THB";
}

// ฟังก์ชันสำหรับการทำการชำระเงิน (จะใส่โค้ดเพิ่มเติมตามความต้องการ)
function processPayment() {
    // ตรวจสอบข้อมูลและทำการชำระเงินที่ต้องการ
    alert('กำลังดำเนินการชำระเงิน...');
}
});
