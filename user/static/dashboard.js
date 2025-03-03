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
function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
}

function deleteAccount() {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?")) {
        fetch("/delete/", {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                alert("บัญชีถูกลบแล้ว!");
                window.location.href = "/";  // Redirect to homepage
            } else {
                alert("เกิดข้อผิดพลาดในการลบบัญชี!");
            }
        })
        .catch(error => console.error("Error:", error));
    }
}


function displayCard(cardId) {
    const card = document.getElementById(cardId);
    card.style.display = 'block';  // แสดงการ์ด

    // Make sure the button stays visible (optional, if you want to ensure button visibility after click)
    const button = card.querySelector('button');
    button.style.display = 'block';  // Ensure the button stays visible after the click
}



// ฟังก์ชันนับถอยหลังสำหรับการบริการ
function startCountdown() {
    let countdown = 40;  // เริ่มจาก 40 นาที
    const countdownElement = document.getElementById('countdown-timer');
    
    const interval = setInterval(function() {
        countdown--;
        countdownElement.textContent = countdown;  // แสดงตัวเลขนับถอยหลัง
        if (countdown <= 0) {
            clearInterval(interval);  // หยุดการนับถอยหลังเมื่อถึง 0
        }
    }, 1000);  // ใช้เวลา 100ms เพื่อให้เทสในเวลา 10 วินาที
}

// เรียกใช้ฟังก์ชันนับถอยหลังเมื่อการ์ด "กำลังบริการอยู่" ถูกแสดง
startCountdown();


