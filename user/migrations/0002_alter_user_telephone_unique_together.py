# Generated by Django 5.1.6 on 2025-02-15 19:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='user_telephone',
            unique_together={('user', 'telephone_number')},
        ),
    ]
