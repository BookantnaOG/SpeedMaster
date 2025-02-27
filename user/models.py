from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    # Override related_name for the groups and user_permissions relationships to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='user_set_custom', 
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='user_set_custom', 
        blank=True
    )

    def __str__(self):
        return self.username

class User_Telephone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telephones')  
    telephone_number = models.CharField(max_length=15, unique=True)  

    class Meta:
        unique_together = ('user', 'telephone_number')  # Ensures both fields together are unique

    def __str__(self):
        return f"{self.user.username} - {self.telephone_number}"

class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='member')  
    member_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.member_type}"