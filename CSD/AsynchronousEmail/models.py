# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your AsynchronousEmail models here.
class AsynchronousEmail(models.Model):
    project_name = models.TextField(null=True)
    subject = models.TextField(null=True)
    sender_name= models.TextField(null=True)
    to_address = models.TextField(null=True)
    from_address = models.TextField(null=True)
    mail_content = models.TextField(null=True)
    mail_status = models.TextField(null=True)
    created_by = models.IntegerField(null=True)
    created_date = models.DateTimeField(null=True)
    modified_by = models.IntegerField(null=True)
    modified_date = models.DateTimeField(null=True)

    class Meta:
        db_table = 'asyn_email'
        ordering = ['id']
