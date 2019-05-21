# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.conf import settings

from django.contrib.auth.models import User


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    start_time = models.DateField()
    end_time = models.DateField()
    status = models.CharField(max_length=20)
    parent_id = models.IntegerField(default=-1, blank=True, null=True);
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default="xd")
    name = models.CharField(max_length=300)