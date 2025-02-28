from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

# Membership ที่เก็บข้อมูลประเภทสมาชิก
class Membership(models.Model):
    membership_id = models.AutoField(primary_key=True)
    membership_name = models.CharField(max_length=255)

    def __str__(self):
        return self.membership_name

class User(AbstractUser):
    # ใช้ related_name ที่แตกต่างสำหรับการเข้าถึงการเชื่อมโยงกับ 'Membership'
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
    # ใช้ ForeignKey ที่มีชื่อ related_name ที่แตกต่าง
    membership_type = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return self.username

# User_Telephone คงเดิม
class User_Telephone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telephones')  
    telephone_number = models.CharField(max_length=15, unique=True)  

    class Meta:
        unique_together = ('user', 'telephone_number')  # Ensures both fields together are unique

    def __str__(self):
        return f"{self.user.username} - {self.telephone_number}"

# แก้ไข class Membership ที่เก็บข้อมูลผู้ใช้ (UserMembership)
class UserMembership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_memberships')  
    member_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - {self.member_type}"
