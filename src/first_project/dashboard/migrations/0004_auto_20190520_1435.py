# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-20 12:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_auto_20190520_1431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='parent_id',
            field=models.IntegerField(blank=True, default='none', null=True),
        ),
    ]
