from django.db import models
from django.conf import settings

class Carinfo(models.Model):
    carno = models.AutoField(primary_key=True)
    car_plate = models.CharField(max_length=15)
    carname = models.CharField(max_length=255)
    car_size = models.CharField(max_length=50)

class CarDetailingService(models.Model):
    detailing_id = models.AutoField(primary_key=True)
    detailing_type = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cleanness = models.CharField(max_length=255)

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    status_on = models.DateTimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    detailing = models.ForeignKey(CarDetailingService, on_delete=models.CASCADE)

class BookingDetail(models.Model):
    detailing = models.ForeignKey(CarDetailingService, on_delete=models.CASCADE)
    carno = models.ForeignKey(Carinfo, on_delete=models.CASCADE)
    bill_no = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

class Payment(models.Model):
    bill_no = models.OneToOneField(BookingDetail, on_delete=models.CASCADE, primary_key=True)
    payment_type = models.CharField(max_length=50)
    paid = models.BooleanField()