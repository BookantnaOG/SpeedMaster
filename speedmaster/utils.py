from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import os

def generate_receipt_pdf(filename, items, payment_method, total, receipt_number, timestamp):
    try:
        # สร้างเส้นทางสำหรับไฟล์ PDF
        pdf_path = os.path.join('media/receipts', f'{filename}.pdf')
        c = canvas.Canvas(pdf_path, pagesize=letter)

        # ชื่อใบเสร็จและหมายเลขใบเสร็จ
        c.setFont("Helvetica-Bold", 16)
        c.drawString(200, 750, "ใบเสร็จรับเงิน")
        c.setFont("Helvetica", 12)
        c.drawString(400, 750, f"เลขที่ใบเสร็จ: {receipt_number}")

        # วันที่และเวลา
        c.drawString(400, 730, f"วันที่: {timestamp}")

        # หัวข้อรายการ
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30, 700, "รายการบริการ")
        c.drawString(250, 700, "จำนวน")
        c.drawString(350, 700, "ราคา")
        c.drawString(450, 700, "รวม")

        # รายละเอียดสินค้า (บริการ)
        y_position = 680
        for item in items:
            c.setFont("Helvetica", 10)
            c.drawString(30, y_position, item["name"])
            c.drawString(250, y_position, str(item["quantity"]))
            c.drawString(350, y_position, f"{item['price']} บาท")
            c.drawString(450, y_position, f"{item['quantity'] * item['price']} บาท")
            y_position -= 20

        # รวมราคารวมทั้งหมด
        c.setFont("Helvetica-Bold", 12)
        c.drawString(350, y_position - 10, "ราคารวม:")
        c.drawString(450, y_position - 10, f"{total} บาท")

        # วิธีการชำระเงิน
        c.drawString(30, y_position - 30, f"วิธีการชำระเงิน: {payment_method}")

        # บันทึก PDF
        c.save()
        return pdf_path
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการสร้าง PDF: {e}")
        return None


from django.core.mail import EmailMessage

def send_email(to_email, subject, body, attachment_path):
    email = EmailMessage(subject, body, to=[to_email])
    email.attach_file(attachment_path)
    email.send()
