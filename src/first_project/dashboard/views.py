# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from .LoadDataFile import json_to_sql
from django.core import serializers
from .models import Task
import json
import sqlite3



def index(request):
    conn = sqlite3.connect('./db.sqlite3')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    temp = c.execute("SELECT * FROM dashboard_task").fetchall()
    array_data = json.dumps([dict(ix) for ix in temp],ensure_ascii=False)
    return render(request, 'dashboard/index.html', {"myVar" : array_data})


def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs = FileSystemStorage()
        fs.delete('data.json')
        fs.save('data.json', uploaded_file)
        json_to_sql()
    return render(request, 'dashboard/upload_file.html')