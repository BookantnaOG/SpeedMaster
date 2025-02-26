from django.db import models
from django.conf import settings  # To reference custom User model

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    booking_date = models.DateTimeField(auto_now_add=True)
    status_on = models.CharField(max_length=50)
    bill = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Booking {self.booking_id} - {self.status_on}"

class CarInfo(models.Model):
    car_license_plate = models.CharField(max_length=20, primary_key=True)
    car_type = models.CharField(max_length=50)
    car_name = models.CharField(max_length=100)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.car_name} ({self.car_license_plate})"

class CarDetailingService(models.Model):
    detailing_id = models.AutoField(primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    detailing_type = models.CharField(max_length=50)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.detailing_type} - ${self.price}"

class BookingDetail(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    detailing = models.ForeignKey(CarDetailingService, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detail for Booking {self.booking.booking_id} - {self.detailing.detailing_type}"

class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    service_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField()

    def __str__(self):
        return self.service_name
