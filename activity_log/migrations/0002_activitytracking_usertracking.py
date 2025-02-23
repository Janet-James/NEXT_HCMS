# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2020-08-07 12:26
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('employee_management', '0003_auto_20200807_1226'),
        ('activity_log', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityTracking',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('data', models.TextField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_by_activity_log_activitytracking_related', to=settings.AUTH_USER_MODEL)),
                ('employee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activity_tracking_employee_id', to='employee_management.EmployeeInfo')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='modified_by_activity_log_activitytracking_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'db_table': 'activity_tracking',
            },
)    
]
