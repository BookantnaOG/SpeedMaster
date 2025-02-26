from django.db import models

class CarInfo(models.Model):
    car_no = models.CharField(max_length=20, primary_key=True)
    car_plate = models.CharField(max_length=20, unique=True)
    car_name = models.CharField(max_length=100)
    car_size = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.car_name} ({self.car_plate})"

class DetailingService(models.Model):
    detailing_id = models.AutoField(primary_key=True)
    detailing_type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cleanness = models.CharField(max_length=50)

    def __str__(self):
        return self.detailing_type

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    status_on = models.CharField(max_length=50)
    user_id = models.IntegerField()  # Assuming foreign key to a User model
    detailing = models.ForeignKey(DetailingService, on_delete=models.CASCADE)

    def __str__(self):
        return f"Booking {self.booking_id} - {self.status_on}"

class BookingDetail(models.Model):
    detailing = models.ForeignKey(DetailingService, on_delete=models.CASCADE)
    car = models.ForeignKey(CarInfo, on_delete=models.CASCADE)
    bill_no = models.CharField(max_length=50, unique=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Bill {self.bill_no} - {self.total_price}"

class Payment(models.Model):
    bill_no = models.OneToOneField(BookingDetail, on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=50)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment for {self.bill_no} - {self.payment_type}"
