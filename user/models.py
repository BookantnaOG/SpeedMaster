from django.db import models
from django.contrib.auth.hashers import make_password

class Manager(models.Model):
    manager_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=25, unique=True)
    password = models.CharField(max_length=128)  # Support SHA256 & SHA512

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)  
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
    
class User_Telephone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telephones')  
    telephone_number = models.CharField(max_length=15)  

    def __str__(self):
        return f"{self.user.username} - {self.telephone_number}"