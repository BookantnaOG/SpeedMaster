from django import forms 
from django.contrib.auth.models import User 
from django.contrib.auth.forms import UserCreationForm 

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(required=True, max_length=30)
    last_name = forms.CharField(required=True, max_length=150)
    
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "password1", "password2"]
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        if commit:
            user.save()
        return user

class UserUpdateForm(forms.ModelForm):
    # ฟอร์มนี้จะใช้สำหรับการอัปเดตข้อมูลผู้ใช้ เช่น ชื่อ, อีเมล
    email = forms.EmailField(required=True)
    first_name = forms.CharField(required=True, max_length=30)
    last_name = forms.CharField(required=True, max_length=150)


from django import forms

class MembershipForm(forms.Form):
    first_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'First Name', 'required': 'required'})
    )
    last_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Last Name', 'required': 'required'})
    )
    password = forms.CharField(
        max_length=100,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'required': 'required'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'Email', 'required': 'required'})
    )
