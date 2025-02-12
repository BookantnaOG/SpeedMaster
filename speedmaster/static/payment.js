document.addEventListener("DOMContentLoaded", function () {
    // รับข้อมูลจาก localStorage
    const service = localStorage.getItem('selected-service');
    const date = localStorage.getItem('selected-date');
    const time = localStorage.getItem('selected-time');
    
    // กำหนดราคาค่าบริการที่เท่ากัน
    const pricePerService = 200; // ราคาต่อบริการที่เท่ากัน

    // คำนวณราคารวมก่อนส่วนลด (คิดจากจำนวนบริการ)
    const totalPrice = pricePerService * 3; // 3 บริการ

    // แสดงรายละเอียดบริการที่เลือก
    document.getElementById("selected-service").textContent = service || 'ยังไม่ได้เลือก';
    document.getElementById("selected-date").textContent = date || 'ยังไม่ได้เลือก';
    document.getElementById("selected-time").textContent = time || 'ยังไม่ได้เลือก';

    // แสดงรายการบริการและราคาทั้งหมด
    const itemList = document.getElementById("item-list");

    // ลูปผ่านรายการ items และสร้างรายการบริการใน HTML
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span class="price">${item.price} บาท</span>
        `;
        itemList.appendChild(itemElement);
    });

    // ฟังก์ชันคำนวณราคาหลังส่วนลด
    function calculateDiscountedPrice() {
        let discountPrice = totalPrice;

        // เช็คส่วนลดโค้ด
        const discountCodeInput = document.getElementById('discount-code');
        if (discountCodeInput.value.trim().toLowerCase() === 'speedmaster') {
            discountPrice = totalPrice * 0.8; // ลด 20%
        }

        // แสดงราคาหลังส่วนลด
        document.getElementById('final-price').textContent = `${discountPrice} THB`;
    }

    // เรียกใช้ฟังก์ชันคำนวณเมื่อกรอกข้อมูลส่วนลด
    const discountCodeInput = document.getElementById('discount-code');
    discountCodeInput.addEventListener('input', calculateDiscountedPrice);

    // คำนวณราคาเริ่มต้น (ไม่มีส่วนลด)
    calculateDiscountedPrice();
});
