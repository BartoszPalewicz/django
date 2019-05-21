import json
import sqlite3
from django.db import models

JSON_FILE = 'media/data.json'
DB_FILE = 'db.sqlite3'

traffic = json.load(open(JSON_FILE))
conn = sqlite3.connect(DB_FILE)

name = traffic[0]["name"]
start_time = traffic[0]["start_time"]
end_time = traffic[0]["end_time"]
status = traffic[0]["status"]
parent_id = traffic[0]["parent_id"]
id = traffic[0]["id"]
assignee = traffic[0]["assignee"]

data = [name, start_time,end_time ,status , parent_id, id, assignee]

c = conn.cursor()
c.execute('create table table_name (foo, bar)')
c.execute('insert into table_name values (?,?)', data)

conn.commit()
c.close()