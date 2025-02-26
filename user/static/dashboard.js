// script.js

let isEditing = false;  // ตัวแปรที่ใช้เก็บสถานะการแก้ไขโปรไฟล์

// ฟังก์ชันสำหรับสลับสถานะการแก้ไขโปรไฟล์
function toggleEdit() {
    const editButton = document.querySelector('.edit-btn');
    const inputs = document.querySelectorAll('.profile-form input');
    
    // ถ้าอยู่ในโหมดแก้ไข
    if (isEditing) {
        editButton.textContent = "แก้ไขโปรไฟล์";  // เปลี่ยนข้อความกลับ
        // เปลี่ยน input กลับไปเป็น disabled
        inputs.forEach(input => input.disabled = true);
    } else {
        editButton.textContent = "ตกลง";  // เปลี่ยนข้อความเป็นตกลง
        // เปลี่ยน input ให้สามารถแก้ไขได้
        inputs.forEach(input => input.disabled = false);
    }
    
    // เปลี่ยนปุ่มเป็น "ยกเลิก" เมื่อกำลังแก้ไข
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = "ยกเลิก";
    cancelButton.classList.add('cancel-btn');
    cancelButton.onclick = cancelEdit;
    
    const buttonsDiv = document.querySelector('.buttons');
    if (!isEditing) {
        buttonsDiv.appendChild(cancelButton);
    } else {
        const cancelButtonExisting = document.querySelector('.cancel-btn');
        if (cancelButtonExisting) {
            cancelButtonExisting.remove();
        }
    }

    isEditing = !isEditing;  // สลับสถานะ
}

// ฟังก์ชันสำหรับยกเลิกการแก้ไข
function cancelEdit() {
    const editButton = document.querySelector('.edit-btn');
    editButton.textContent = "แก้ไขโปรไฟล์";  // เปลี่ยนข้อความกลับ
    const cancelButton = document.querySelector('.cancel-btn');
    cancelButton.remove();  // ลบปุ่มยกเลิกออก
    const inputs = document.querySelectorAll('.profile-form input');
    inputs.forEach(input => input.disabled = true);  // ทำให้ input กลับเป็น disabled
    isEditing = false;  // สลับสถานะ
}

// ฟังก์ชันเปลี่ยนรหัสผ่าน (ในอนาคต)
function changePassword() {
    alert("กำลังพัฒนาในอนาคต!");  // ยังไม่พัฒนา
}

// ฟังก์ชันลบบัญชี
function deleteAccount() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?")) {
        alert("บัญชีถูกลบแล้ว!");  // สามารถเชื่อมกับ backend ในการลบบัญชี
    }
}
