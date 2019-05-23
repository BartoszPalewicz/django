# -*- coding: utf-8 -*-
import datetime
import json
import types
import sqlite3
from .models import Task
from operator import itemgetter
from django.contrib.auth.models import User



class importTask:
    def __init__(self):
        
        file = 'media/data.json'
        tasks = json.load(open(file, "r", encoding='utf-8'))
        id_tab = {}
        Task.objects.all().delete()
        tasks = self._sort(tasks)
        for i in tasks:
            task = self._create_task(i)
            task = self._parenties(i, task)
            old_id = int(i["id"])
            task.save()
            id_tab[old_id]= task.id
            task = self._calculate_parents(task, id_tab)
            task.save()

    @staticmethod
    def format_date(d):
        d = datetime.datetime.strptime(d, "%Y-%m-%d").date()
        return d

    def _create_task(self, i):
        st = self.format_date(i["start_time"])
        et = self.format_date(i["end_time"])
        u = self._users(i)
        task = Task()
        task.name = i["name"]
        task.start_time = st
        task.end_time = et
        task.status = i["status"]
        task.assignee = u
        return(task)
    

    def _users(self, obj):
        print("test")
        username = obj["assignee"][0]
        j = 0
        char = ""
        while char != " ":
            char=obj["assignee"][j]
            j+=1
        l = len(obj["assignee"])
        firstname = obj["assignee"][0:(j-1)]
        lastname = obj["assignee"][j:l]
        username += lastname

        if User.objects.filter(username=username).exists():
            un = User.objects.get(username=username)
        else:
            user = User.objects.create_user(username=username)
            user.first_name = firstname
            user.last_name = lastname
            user.save()
            un = user
        return un

    def _parenties(self, i, task):
        task.parent_id = i["parent_id"]
        if i["parent_id"] == "":
            i["parent_id"] = None
        if i["parent_id"] == None:
            task.parent_id =None
        else:
            task.parent_id = int(i["parent_id"])
        return(task)
    

    def _calculate_parents(self, obj, id_tab):
        if obj.parent_id:
            print(obj.parent_id)
            temp = obj.parent_id
            obj.parent_id = id_tab[temp]
        return (obj)

    def _sort(self, arr):
        for obj in arr:
            obj["id"]=int(obj["id"])
        i =0
        while i < len(arr)-1:
            min = i
            j=(i+1)
            while j < len(arr):
                if arr[min]["id"]>arr[j]["id"]:
                    min = j
                j+=1
            if min != i:
                temp = arr[i]
                arr[i] = arr[min]
                arr[min] = temp
            i+=1
        return(arr)