document.addEventListener("DOMContentLoaded", function () {
    function formatDateTime(day, time) {
        const monthsOfYear = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const month = monthsOfYear[currentDate.getMonth()];
        const year = currentDate.getFullYear() + 543;
        return `${day} ที่ ${dayOfMonth} ${month} ${year} เวลา ${time}`;
    }

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

    const selectedDay = getSelectedDayFromLocalStorage();
    const selectedTime = localStorage.getItem('selectedTime') || "12:30";

    document.getElementById('booking-time-display').innerText = formatDateTime(selectedDay, selectedTime);

    document.querySelectorAll('.date-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const date = event.target.innerText;
            localStorage.setItem('selectedDate', date);
            document.getElementById('booking-date').innerText = date;
            document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
        });

        if (button.innerText === selectedDay) {
            button.classList.add('selected');
        }
    });

    const servicePrices = {
        "เคลือบแก้ว": 500,
        "ติดฟิล์มกันรอย": 200,
        "ล้างรถ": 100
    };

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

    document.getElementById('apply-discount-btn').addEventListener('click', function () {
        const discountCode = document.getElementById('discount-code').value.trim().toLowerCase();
        let discountAmount = 0;

        if (discountCode === "speedmaster") {
            const basePrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0) + 50;
            discountAmount = basePrice * 0.20;
        }

        calculateFinalPrice(discountAmount);
    });

    document.getElementById("payment-btn").addEventListener("click", function(event) {
        event.preventDefault();

        const carReg = document.getElementById("car-reg").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const validationMessage = document.querySelector(".validation-message");

        const carRegPattern = /^(\d{1,2})?[ก-ฮ]{2}-\d{4}$/;
        const mobilePattern = /^0[689]\d{8}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            validationMessage.style.display = "block";
            validationMessage.innerText = "กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com";
            return;
        }

        if (!carRegPattern.test(carReg)) {
            validationMessage.style.display = "block";
            validationMessage.innerText = "กรุณากรอกเลขทะเบียนรถให้ถูกต้อง เช่น กข-1234 หรือ 1กข-1234";
            return;
        }

        if (!mobilePattern.test(mobile)) {
            validationMessage.style.display = "block";
            validationMessage.innerText = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง เช่น 0812345678";
            return;
        }

        validationMessage.style.display = "none";
        window.location.href = '/payment/';
    });

    calculateFinalPrice();
});