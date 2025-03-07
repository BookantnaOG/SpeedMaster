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
    status_on = models.CharField(max_length=50)
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
    cleanness = models.CharField(max_length=50)
    timeslot = models.IntegerField(choices=TIMESLOT_LIST) # slot ที่จอง
    date = models.DateTimeField() # วันที่จอง

    class Meta:
        unique_together = ('booking', 'service', 'timeslot', "date")

    def __str__(self):
        return f"{self.booking} ({self.service}) cleanness: {self.cleanness}"

class CarInfo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    car_license_plate = models.CharField(max_length=20, primary_key=True)
    car_type = models.CharField(max_length=50)  # big, small, van
    car_brand = models.CharField(max_length=50)  # brands
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'car_license_plate')

    def __str__(self):
        return f"{self.car_brand} ({self.car_license_plate}) user: {self.user}"

class Payment(models.Model):
    billNo = models.AutoField(primary_key=True)
    payment_type = models.CharField(max_length=10)
    paid_status = models.BooleanField(default=False)

    def __str__(self):
        return f"BillNo: {self.billNo} PaymentType: {self.payment_type} paid_status: {self.paid_status}"
    
class BookingDetail(models.Model):
    detailing = models.ForeignKey(CarDetailingService, on_delete=models.CASCADE)
    car_info = models.ForeignKey(CarInfo, on_delete=models.CASCADE)
    billNo = models.ForeignKey(Payment, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ('detailing', 'car_info')

    def __str__(self):
        return f"Detail for Booking {self.detailing.booking.booking_id} - {self.detailing.service} cleanness: {self.detailing.cleanness}"


