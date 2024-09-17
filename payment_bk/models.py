# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel
# Create your models here.

class Payment(BaseModel):
    name = models.CharField(max_length=100, blank=True, null=True)
    input_file = models.FileField(upload_to="payment_input", blank=True, null=True)
    output_file1 = models.CharField(max_length=100, blank=True, null=True)
    output_file2 = models.CharField(max_length=100, blank=True, null=True)
    output_file3 = models.CharField(max_length=100, blank=True, null=True)
    output_file4 = models.CharField(max_length=100, blank=True, null=True)
    output_file5 = models.CharField(max_length=100, blank=True, null=True)
    output_file6 = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "payment"
