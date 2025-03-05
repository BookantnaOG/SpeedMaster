from django.db import models
from django.conf import settings

class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    service_name = models.CharField(max_length=100)
    service_name_eng = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.service_name

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    status_on = models.CharField(max_length=50) # สถานะการทำงาน
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True) # วันสร้าง booking 

    def __str__(self):
        return f"Booking {self.booking_id} - {self.status_on}"

class CarDetailingService(models.Model):
    TIMESLOT_LIST = (
        (0, '10:30'),
        (1, '11:30'),
        (2, '12:30'),
        (3, '13:30'),
        (4, '14:30'),
        (5, '15:30'),
        (6, '16:30')
    )
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    time_slot = models.IntegerField(choices=TIMESLOT_LIST)  # slot ที่จอง
    date = models.DateTimeField()  # วันที่จอง

    class Meta:
        unique_together = ('booking', 'service', 'time_slot', 'date')

    def __str__(self):
        # Fixing the way to retrieve the time slot string based on the integer value
        timeslot_str = next((time for value, time in self.TIMESLOT_LIST if value == self.timeslot), "Unknown time")
        return f"{self.booking} ({self.service}) cleanness: {self.cleanness} time: {timeslot_str}"


class Payment(models.Model):
    billNo = models.AutoField(primary_key=True)
    payment_type = models.CharField(max_length=10)
    paid_status = models.BooleanField(default=False) # False -> ยังไม่จ่าย, True -> จ่ายแล้ว

    def __str__(self):
        return f"BillNo: {self.billNo} PaymentType: {self.payment_type} paid_status: {self.paid_status}"
    
class BookingDetail(models.Model):
    detailing = models.ForeignKey(CarDetailingService, on_delete=models.CASCADE)
    billNo = models.ForeignKey(Payment, on_delete=models.CASCADE)
    car_license_plate = models.CharField(max_length=20, unique=True)
    car_type = models.CharField(max_length=50)  # big, small, van
    car_brand = models.CharField(max_length=50)  # brands
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ('detailing', 'billNo')

    def __str__(self):
        return f"Detail for Booking {self.detailing.booking.booking_id} - {self.detailing.service} cleanness: {self.detailing.cleanness}"


