# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from .LoadDataFile import importTask
from django.core import serializers
from .models import Task
import json
import sqlite3



def index(request):
    temp =  Task.objects.values('id', 'name', 'parent_id', 'start_time', 'end_time', 'status', 'assignee__username').all()
    temp = list(temp)
    for task in temp:
        task['start_time'] = task['start_time'].strftime("%Y-%m-%d")
        task['end_time'] = task['end_time'].strftime("%Y-%m-%d")
    return render(request, 'dashboard/index.html', {"myVar" : json.dumps(temp)})


def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        #content_type = uploaded_file.content_type.split('/')[0]
        #if content_type == 'json':
        fs.delete('data.json')
        fs.save('data.json', uploaded_file)
        temp = importTask()
        
    return render(request, 'dashboard/upload_file.html')