// document.addEventListener("DOMContentLoaded", function () {
//     function formatDateTime(day, time) {
//         const monthsOfYear = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
//         const currentDate = new Date();
//         const dayOfMonth = currentDate.getDate();
//         const month = monthsOfYear[currentDate.getMonth()];
//         const year = currentDate.getFullYear() + 543;
//         return `${day} ที่ ${dayOfMonth} ${month} ${year} เวลา ${time}`;
//     }

//     function getSelectedDayFromLocalStorage() {
//         const selectedDay = localStorage.getItem('selectedDate');
//         if (selectedDay) {
//             return selectedDay;
//         } else {
//             const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
//             const currentDay = new Date().getDay();
//             return daysOfWeek[currentDay];
//         }
//     }

//     const selectedDay = getSelectedDayFromLocalStorage();
//     const selectedTime = localStorage.getItem('selectedTime') || "12:30";
//     document.getElementById('booking-time-display').innerText = formatDateTime(selectedDay, selectedTime);

//     const servicePrices = {
//         "เคลือบแก้ว": 500,
//         "ฟิล์มกันรอย": 200,
//         "ทำความสะอาด": 100
//     };

//     const carSizePrices = {
//         "S": 50,
//         "M": 100,
//         "L": 150,
//         "XL": 200,
//         "XXL": 250,
//         "sports": 300,
//         "motorcycleSmall": 50,
//         "motorcycleLarge": 100
//     };

//     let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
//     const servicePriceTable = document.getElementById('service-price-table');
//     let carSize = localStorage.getItem('carSize') || "S";

//     // Update service price table
//     function updateServicePriceTable() {
//         const carSizeFee = carSizePrices[carSize] || 0;

//         // Update service price table
//         servicePriceTable.innerHTML = selectedServices.length > 0 ? 
//             `<ul>` + selectedServices.map(service => `
//                 <li>
//                     <span class="service-name">${service}</span>
//                     <span class="service-price">${servicePrices[service] || 0} บาท</span>
//                 </li>`).join('') + 
//             `<li>
//                 <div class="service-name">ค่าบริการ</div>
//                 <div class="service-price">50 บาท</div>
//             </li>
//             <li>
//                 <div class="service-name">ขนาดรถ</div>
//                 <div class="service-price">${carSizeFee} บาท</div>
//             </li>
//             <li>
//                 <div class="service-name">VAT 7%</div>
//                 <div class="service-price">${vat.toFixed(2)} บาท</div>
//             </li>` + 
//             `</ul>` : 
//             '<ul><li>ยังไม่ได้เลือกบริการ</li></ul>';

//         // Save final price to localStorage
//         localStorage.setItem('finalPrice', finalPrice.toFixed(2));
//         document.getElementById('final-price').innerHTML = ` 
//             <p><b>ราคารวมสุทธิ:</b> <span id="final-price-amount">${finalPrice.toFixed(2)} บาท</span></p>
//         `;
//     }

//     // Calculate final price after applying discount
//     function calculateFinalPrice(discount = 0) {
//         const carSizeFee = carSizePrices[carSize] || 0;
//         const totalServicePrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0);
//         const totalPrice = totalServicePrice + 50 + carSizeFee; // Add fixed service fee
//         const vat = totalPrice * 0.07;
//         const finalPrice = totalPrice + vat - discount;

//         if (isNaN(finalPrice)) {
//             document.getElementById('final-price').innerText = 'ราคาไม่ถูกต้อง';
//         } else {
//             document.getElementById('final-price').innerHTML = ` 
//                  <span id="final-price-amount">${finalPrice.toFixed(2)} บาท</span>
//             `;
//         }

//         localStorage.setItem('finalPrice', finalPrice.toFixed(2));
//     }

//     // Apply discount if available
//     function applyDiscount() {
//         const discountCode = document.getElementById('discount-code').value.trim().toLowerCase();
//         let discountAmount = 0;

//         if (discountCode === "speedmaster") {
//             const basePrice = selectedServices.reduce((total, service) => total + (servicePrices[service] || 0), 0) + 50;
//             discountAmount = basePrice * 0.20; // Apply 20% discount
//         }

//         calculateFinalPrice(discountAmount);
//     }

//     // Event listener for car size change
//     document.getElementById('car-size').addEventListener('change', function () {
//         carSize = this.value;
//         localStorage.setItem('carSize', carSize);
//         updateServicePriceTable();
//         calculateFinalPrice();
//     });

//     document.querySelectorAll('.info-icon').forEach(function(icon) {
//         icon.addEventListener('click', function() {
//             this.classList.toggle('active');
//             let tooltip = this.nextElementSibling;
//             if (tooltip) {
//                 tooltip.classList.toggle('active');
//             }
//         });
//     });

//     // Select a service when clicked
//     document.querySelectorAll('.service-btn').forEach(button => {
//         button.addEventListener('click', function(event) {
//             const service = event.target.innerText;
//             if (!selectedServices.includes(service)) {
//                 selectedServices.push(service);
//                 localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
//             }
//             updateServicePriceTable();
//             calculateFinalPrice();
//         });
//     });

//     // Discount button logic
//     document.getElementById('discount-code').addEventListener('input', function () {
//         document.getElementById('apply-discount-btn').disabled = false;
//     });

//     document.getElementById('apply-discount-btn').addEventListener('click', function () {
//         applyDiscount();
//     });

//     // Payment button logic with validation
//     document.getElementById("payment-btn").addEventListener("click", function(event) {
//         event.preventDefault();

//         const carReg = document.getElementById("car-reg").value.trim();
//         const mobile = document.getElementById("mobile").value.trim();
//         const carName = document.getElementById("car-name").value.trim();
//         const validationMessage = document.querySelector('.validation-message');

//         if (!carReg || !mobile || !carBrand) {
//             validationMessage.style.display = 'block';
//             return;
//         }

//         validationMessage.style.display = 'none';

//         // Save payment details to localStorage
//         localStorage.setItem('carReg', carReg);
//         localStorage.setItem('mobile', mobile);
//         localStorage.setItem('carName', carName);

//         window.location.href = '/payment/';  
//     });

//     // If on payment page, display stored details
//     if (window.location.pathname.includes("payment.html")) {
//         const carReg = localStorage.getItem('carReg');
//         const mobile = localStorage.getItem('mobile');
//         const carName = localStorage.getItem('carName');
//         const finalPrice = localStorage.getItem('finalPrice');

//         document.getElementById('payment-car-reg').innerText = carReg;
//         document.getElementById('payment-mobile').innerText = mobile;
//         document.getElementById('payment-car-name').innerText = carName;
//         document.getElementById('payment-final-price').innerText = `${finalPrice} บาท`;
//     }

//     updateServicePriceTable();
//     calculateFinalPrice();
// });

document.addEventListener('DOMContentLoaded', function () {
    const carSizeSelect = document.getElementById('car-size-select');
    const carSizeText = document.getElementById('car-size');
    const carSizeFee = document.getElementById('car-size-price');
    const finalPrice = document.getElementById('final-price');
    const vat = document.getElementById('vat-price');
    const OGPrice = parseFloat(finalPrice.textContent);
    const carSizeFees = {
        S: 100,
        L: 150,
        XXL: 200,
        sports: 250,
        motorcycleSmall: 50,
        motorcycleLarge: 75
    };

    carSizeSelect.addEventListener('change', function () {
        const selectedValue = carSizeSelect.value;

        // Update the car size text
        const selectedText = carSizeSelect.options[carSizeSelect.selectedIndex].text;
        carSizeText.textContent = selectedText;

        // Get the new fee
        const newFee = carSizeFees[selectedValue] || 0; // Default to 0 if fee is not found

        // Update the car size fee text
        carSizeFee.textContent = newFee + " บาท";

        // **Do not use previous final price**; instead, start fresh
        let updatedFinalPrice = OGPrice + newFee;

        // Calculate VAT
        let vatPrice = updatedFinalPrice * 0.07;
        vat.textContent = vatPrice.toFixed(2) + " บาท";

        // Final price calculation
        updatedFinalPrice += vatPrice;
        finalPrice.textContent = updatedFinalPrice.toFixed(2) + " บาท";
        // Get the value inside the span
        const priceText = document.getElementById('final-price').textContent;

        // Set the value of the hidden input field to the span's value
        document.getElementById('price-input').value = priceText;
    });

    // Trigger the change event on page load to initialize correctly
    carSizeSelect.dispatchEvent(new Event('change'));
});
