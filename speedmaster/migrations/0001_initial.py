# Generated by Django 5.1.5 on 2025-02-27 10:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('billNo', models.AutoField(primary_key=True, serialize=False)),
                ('payment_type', models.CharField(max_length=10)),
                ('paid_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('service_id', models.AutoField(primary_key=True, serialize=False)),
                ('service_name', models.CharField(max_length=100)),
                ('service_name_eng', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('booking_id', models.AutoField(primary_key=True, serialize=False)),
                ('status_on', models.CharField(max_length=50)),
                ('booking_date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CarDetailingService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cleanness', models.CharField(max_length=50)),
                ('time_slot', models.DateTimeField()),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.booking')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.service')),
            ],
            options={
                'unique_together': {('booking', 'service')},
            },
        ),
        migrations.CreateModel(
            name='CarInfo',
            fields=[
                ('car_license_plate', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('car_type', models.CharField(max_length=50)),
                ('car_brand', models.CharField(max_length=50)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.booking')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'car_license_plate')},
            },
        ),
        migrations.CreateModel(
            name='BookingDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.booking')),
                ('detailing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.cardetailingservice')),
                ('car_info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.carinfo')),
            ],
            options={
                'unique_together': {('booking', 'detailing', 'car_info')},
            },
        ),
    ]
