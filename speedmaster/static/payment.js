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


    const qrCodeBtn = document.getElementById('qr-code-btn');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener("click", function() {
            showPaymentForm('qr-code');
        });
    }
});
