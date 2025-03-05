# Generated by Django 5.1.5 on 2025-03-05 03:55

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
                ('time_slot', models.IntegerField(choices=[(0, '10:30'), (1, '11:30'), (2, '12:30'), (3, '13:30'), (4, '14:30'), (5, '15:30'), (6, '16:30')])),
                ('date', models.DateTimeField()),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.booking')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.service')),
            ],
            options={
                'unique_together': {('booking', 'service', 'time_slot', 'date')},
            },
        ),
        migrations.CreateModel(
            name='BookingDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('car_license_plate', models.CharField(max_length=20, unique=True)),
                ('car_type', models.CharField(max_length=50)),
                ('car_brand', models.CharField(max_length=50)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('detailing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.cardetailingservice')),
                ('billNo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speedmaster.payment')),
            ],
            options={
                'unique_together': {('detailing', 'billNo')},
            },
        ),
    ]
