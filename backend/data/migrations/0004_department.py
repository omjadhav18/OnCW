# Generated by Django 5.1.7 on 2025-04-18 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0003_attendance'),
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('code', models.CharField(max_length=10, unique=True)),
            ],
        ),
    ]
