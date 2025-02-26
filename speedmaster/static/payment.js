document.addEventListener("DOMContentLoaded", function () {
    // ฟังก์ชันแสดงฟอร์มช่องทางการชำระเงิน
    function showPaymentForm(formId) {
        document.querySelectorAll('.payment-form').forEach(function(form) {
            form.style.display = 'none'; // ซ่อนฟอร์มทั้งหมด
        });

        const selectedForm = document.getElementById(formId);
        if (selectedForm) {
            selectedForm.style.display = 'block'; // แสดงฟอร์มที่เลือก
        }
    }

    // ตรวจสอบว่าปุ่มแต่ละปุ่มมีอยู่หรือไม่ก่อนเพิ่ม event listener
  /*  const creditCardBtn = document.getElementById('credit-card-btn');
    if (creditCardBtn) {
        creditCardBtn.addEventListener("click", function() {
            showPaymentForm('credit-card-form');
        });
    }*/

    const qrCodeBtn = document.getElementById('qr-code-btn');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener("click", function() {
            showPaymentForm('qr-code');
        });
    }

    /*const storePaymentBtn = document.getElementById('store-payment-btn');
    if (storePaymentBtn) {
        storePaymentBtn.addEventListener("click", function() {
            showPaymentForm('store-payment');
        });
    }*/

    // คำนวณราคาจาก LocalStorage และแสดงราคาสุทธิ
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        const finalPrice = localStorage.getItem('finalPrice') || '0'; // ใช้ค่า '0' ถ้าไม่มีใน LocalStorage
        totalPriceElement.innerText = `${finalPrice} บาท`;
    }

    // // Handle submission of each payment form
    // document.querySelectorAll('.payment-form').forEach(function(form) {
    //     form.addEventListener('submit', function(event) {
    //         event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง

    //         // แสดงข้อความแจ้งเตือนว่าการชำระเงินสำเร็จ
    //         alert("ชำระเงินสำเร็จ! กำลังกลับไปยังหน้าแรก...");

    //         // Redirect ไปยังหน้าหลัก
    //         window.location.href = '/';
    //     });
    // });
    
});
