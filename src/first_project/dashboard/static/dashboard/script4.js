//var json_text = '[{"name":"Import danych do bazy danych","start_time":"2019-05-08","end_time":"2019-05-10","status":"new","parent_id":34,"id":36,"assignee":"Bartłomiej Nowak"},{"name":"Utworzenie modeli bazy danych","start_time":"2019-05-07","end_time":"2019-05-08","status":"new","parent_id":34,"id":35,"assignee":"Justyna Malik"},{"name":"Utworzenie repozytorium git","start_time":"2019-05-06","end_time":"2019-05-06","status":"new","parent_id":29,"id":33,"assignee":"Justyna Malik"},{"name":"Sortowanie bąbelkowe","start_time":"2019-05-01","end_time":"2019-05-02","status":"completed","parent_id":10,"id":11,"assignee":"Jan Kowalski"},{"name":"Sortowanie przez scalanie","start_time":"2019-05-02","end_time":"2019-05-03","status":"pending","parent_id":10,"id":12,"assignee":"Jan Kowalski"},{"name":"Sortowanie mergsort","start_time":"2019-05-04","end_time":"2019-05-05","status":"new","parent_id":10,"id":14,"assignee":"Bartłomiej Nowak"},{"name":"Migracja systemu zadań","start_time":"2019-05-06","end_time":"2019-05-24","status":"new","parent_id":"","id":29,"assignee":"Jan Kowalski"},{"name":"Wyświetlanie zadań na osi czasu","start_time":"2019-05-07","end_time":"2019-05-10","status":"new","parent_id":"29","id":32,"assignee":"Bartłomiej Nowak"},{"name":"Sortowanie zadań wg. czasu wykonania","start_time":"2019-05-06","end_time":"2019-05-07","status":"new","parent_id":29,"id":31,"assignee":"Bartłomiej Nowak"},{"name":"Utowrzenie endpointów dla aplikacji web","start_time":"2019-05-10","end_time":"2019-05-10","status":"new","parent_id":34,"id":"37","assignee":"Justyna Malik"},{"name":"Sortowanie quicksort","start_time":"2019-05-03","end_time":"2019-05-04","status":"new","parent_id":10,"id":13,"assignee":"Bartłomiej Nowak"},{"name":"Integracja z Django","start_time":"2019-05-07","end_time":"2019-05-24","status":"new","parent_id":29,"id":34,"assignee":"Bartłomiej Nowak"},{"name":"Algorytmy sortujące","start_time":"2019-05-01","end_time":"2019-05-06","status":"pending","parent_id":null,"id":10,"assignee":"Jan Kowalski"}]'
var json_text = document.getElementById('variable').value

var tasksArray = JSON.parse(json_text);
var positionArray = [];
for (var i = 0; i < 40; i++) {
    positionArray[i] = [];
    for (var j = 0; j < 30; j++)
        positionArray[i][j] = [];
}
var width = 73;
var height = 40;
var colors = {
    "new": "#79ff8b",
    "pending": "#ffb579",
    "completed": "#798bff"
}
var dayStyle = {
    "color": "#999",
    "zIndex": "-1",
    "borderLeft": "0px",
    "borderRight": "0px",
    "fontSize": "10px",
    "top": "0px"
}

tasksArray = sort(tasksArray);
getTasksLength();
tasksArray = actualySortArray(tasksArray);
createTimeline();
createDays();

function createTimeline() {

    for (i in tasksArray) {

        if (isNaN(tasksArray[i].parent_id)){
            tasksArray[i].isMain = true;
            childSearch(i);
        }
    }

    for (i in tasksArray)
        if (isNaN(tasksArray[i].parent_id)) {
            createDiv(i);
            console.log("test")
        }
}

function childSearch(index) {

    for (i in tasksArray) {
        if (tasksArray[i].parent_id == tasksArray[index].id) {
            childSearch(i)
        }
    }
    getValues(index);
}

function createDays() {
    for (var i = 1; i < 26; i++) {
        var newDay = document.createElement("div");
        newDay.className = "days";
        addDaysStyles(newDay, i)
        addDaysContent(newDay, i);
        document.getElementById("task").appendChild(newDay);
    }
}

function addDaysStyles(element, index) {

    for (s in dayStyle) {
        element.style[s] = dayStyle[s];
    }


    element.style.left = parseFloat((index - 1) * width) + "px";
    element.style.width = width + "px";
    if (index % 2) {
        element.style.backgroundColor = "#222"
    } else {
        element.style.backgroundColor = "#111"
    }

}

function addDaysContent(element, index) {
    var newParagraph = document.createElement("P")
    newParagraph.innerHTML = "2019-05-" + index;
    element.appendChild(newParagraph);

}

function getValues(index) {
    checkingForFreeSpace(index);
    getTasksSize(index)

    claimingSpace(index);
}

function checkingForFreeSpace(index) {
    var y = 0;
    var condition = true;
    while (condition) {
        condition = false;
        if (isNaN(tasksArray[index].parent_id))
            var pid = 0;
        else
            var pid = tasksArray[index].parent_id

        for (var j = tasksArray[index].startTime; j < tasksArray[index].endTime; j++) {
            if (positionArray[pid][y][j] != undefined) {
                condition = true;
                y++;
                break;
            }
        }
    }
    tasksArray[index].y = y;
}

function getTasksSize(index) {
    tasksArray[index].width = tasksArray[index].length * 80;
    tasksArray[index].height = 1;
    var temp = 0;
    
    for (i in tasksArray) {
        if (tasksArray[i].parent_id == index)
            if (tasksArray[i].y + tasksArray[i].height > temp)
                temp = tasksArray[i].y + tasksArray[i].height + 2;

    }

    tasksArray[index].height += temp;

}

function claimingSpace(index) {
    if (isNaN(tasksArray[index].parent_id))
        var pid = 0;
    else
        var pid = tasksArray[index].parent_id
    for (var j = tasksArray[index].startTime; j < tasksArray[index].endTime; j++) {
        for (var k = tasksArray[index].y; k < tasksArray[index].height + tasksArray[index].y; k++)
            if (positionArray[pid][k][j] != undefined) {
                positionArray[pid][k][j] = false;
            }
            else {
                positionArray[pid][k][j] = tasksArray[index].name;
            }
    }
}

function addTasksStyles(element, index) {
    element.style.width = (tasksArray[index].length * width) + "px";
    if (tasksArray[index].length > 1) {
        element.style.height = (tasksArray[index].height * height) + "px";
    }
    var border_color = colors[tasksArray[index].status] || "#f00";
    element.style.borderBottomColor = border_color;
    if (isNaN(tasksArray[index].parent_id)) {
        element.style.left = ((tasksArray[index].startTime - 1) * width) + "px"
    }
    else {
        element.style.left = ((tasksArray[index].startTime - tasksArray[tasksArray[index].parent_id].startTime) * width) + "px";
    }
    element.style.top = (((tasksArray[index].y) * (height + 20)) + height) + "px";
}

function addDivContent(element, index) {
    var newParagraph = document.createElement("P");
    newParagraph.innerHTML = tasksArray[index].name;
    element.appendChild(newParagraph);
}

function placingDiv(element, index) {
    var parentElementId = "task" + tasksArray[index].parent_id;
    if (isNaN(tasksArray[index].parent_id))
        parentElementId = "task"
    document.getElementById(parentElementId).appendChild(element);
}

function createDiv(index) {
    var newDiv = document.createElement("div");
    var idName = "task" + tasksArray[index].id;
    newDiv.setAttribute("id", idName);
    newDiv.className = "tasks";
    if (tasksArray[index].isShort)
        newDiv.className += " short"
    addTasksStyles(newDiv, index)
    addDivContent(newDiv, index)
    placingDiv(newDiv, index)
    for (i in tasksArray) {
        if (tasksArray[i].parent_id == tasksArray[index].id) {
            createDiv(i)
        }
    }
}

function sort(tasksArray) {

    var tempArray = [];
    j=1
    for (i in tasksArray) {
        tempArray[j] = tasksArray[i]
        j++
    }

    return (tempArray);
}

function actualySortArray(arr) {

    for (var i = 1; i < arr.length + 1; i++) {
        min = i;
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[j].startTime < arr[min].startTime) {
                min = j;
            }
        }
        if (i != min) {
            var temp = arr[min]
            arr[min] = arr[i]
            arr[i] = temp
        }
    }


    arr = idChange(arr)



    return (arr)
}

function idChange(arr) {
    oldId = []
    for (i in arr) {
        oldId[i] = arr[i].id
        arr[i].id = parseInt(i)
    }
    for (i in arr) {

        arr[i].id = parseInt(arr[i].id)
        arr[i].parent_id = parseInt(arr[i].parent_id)
    }

    for (var i = 1; i < arr.length; i++) {

        for (j in oldId) {
            if (arr[i].parent_id == oldId[j]) {
                console.log(arr[i].parent_id + " == " + oldId[j] + " is " + j)
                arr[i].parent_id = parseInt(j)
                break

            }
        }
    }
    return (arr)
}

function getTasksLength() {
    for (i in tasksArray) {

        tasksArray[i].startTime = parseInt(tasksArray[i].start_time[8] + tasksArray[i].start_time[9]);
        tasksArray[i].endTime = parseInt(tasksArray[i].end_time[8] + tasksArray[i].end_time[9]) + 1;
        tasksArray[i].length = tasksArray[i].endTime - tasksArray[i].startTime;
        if (tasksArray[i].length < 2) tasksArray[i].isShort = true;
    }
}