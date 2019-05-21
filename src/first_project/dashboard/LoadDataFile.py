# -*- coding: utf-8 -*-
import datetime
import json
import types
import sqlite3
from .models import Task
from django.contrib.auth.models import User



def json_to_sql():
    JSON_FILE = 'media/data.json'
    traffic = json.load(open(JSON_FILE), encoding='utf-8')
    print(traffic)
    id_tab = list()
    i = 0
    Task.objects.all().delete()
    while i<len(traffic):
        old_id = int(traffic[i]["id"])
        id_tab.append(old_id)
        st = get_start_date(traffic[i])
        et = get_end_date(traffic[i])
        u = users(traffic[i])
        task = Task()
        task.id = i+1
        task.name = traffic[i]["name"]
        task.start_time = st
        task.end_time = et
        task.status = traffic[i]["status"]
        task.assignee = u
        task.save()
        i += 1
    parents(traffic, id_tab)
    #print(id_tab[1000])
def get_start_date(obj):
    d = obj["start_time"]
    d = datetime.datetime.strptime(d, "%Y-%m-%d").date()
    return d


def get_end_date(obj):
    d = obj["end_time"]
    d = datetime.datetime.strptime(d, "%Y-%m-%d").date()
    return d


def users(obj):
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

def parents(obj, id_tab):

    i=1
    for currentJSONobject in obj:
        currentTask = Task.objects.get(id=i)
        if currentJSONobject["parent_id"] != None:
            if type(currentJSONobject["parent_id"]) == str:
                if len(currentJSONobject["parent_id"])==0:
                    currentTask.parent_id = 0
                    currentTask.save()
                else: 
                    currentJSONobject["parent_id"] = int(currentJSONobject["parent_id"])
                    j=0
                    while j < 13:
                        if currentJSONobject["parent_id"] == id_tab[j]:
                            currentTask.parent_id = j+1
                            currentTask.save()
                        j += 1

            else:
                j=0
                while j < 13:
                    if currentJSONobject["parent_id"] == id_tab[j]:
                        currentTask.parent_id = j+1
                        currentTask.save()
                    j += 1

        else:
            currentTask.parent_id = 0
            currentTask.save()

        i += 1
    currentTask.save()
        