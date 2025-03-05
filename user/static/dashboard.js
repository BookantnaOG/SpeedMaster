let isEditing = false;  // ตัวแปรที่ใช้เก็บสถานะการแก้ไขโปรไฟล์

// ฟังก์ชันสำหรับสลับสถานะการแก้ไขโปรไฟล์
function toggleEdit() {
    fetch("/edit/", {
        method: "POST",
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/edit";  // Redirect to /telephone
        } else {
            console.error("Error with the request");
        }
    })
    .catch(error => {
        console.error("Network error:", error);
    });
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
    fetch("/password/", {
        method: "GET",
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/password";  // Redirect to /telephone
        } else {
            console.error("Error with the request");
        }
    })
    .catch(error => {
        console.error("Network error:", error);
    });
}

// ฟังก์ชันลบบัญชี
function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
}

function addTel() {
    fetch("/telephone/", {
        method: "GET",
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/telephone";  // Redirect to /telephone
        } else {
            console.error("Error with the request");
        }
    })
    .catch(error => {
        console.error("Network error:", error);
    });
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


