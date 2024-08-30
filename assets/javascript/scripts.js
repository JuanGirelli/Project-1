const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');

let selectedTask;

let timerRunning = false;

let timerInstance;

function timer(object) { timerInstance = setInterval(function () {
    selectedTask.time1++;
    if (selectedTask.time1 == 10)
    {
        selectedTask.time2 = 0;
        selectedTask.time2++;
        if (selectedTask.time2 == 6)
        {
            selectedTask.time2 = 0;
            selectedTask.time3++;
        }
    }      
    clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1;     
}, 1000);
}

function alternateTimer() {
    
    if (!timerRunning)
        {
            timer();
            timerRunning = true;       
        }
        else
        {
            clearInterval(timerInstance);         
            timerRunning = false;           
        }
}

function addTask() 
{  
    let taskObject = {
        taskName: '',
        time1: 0,
        time2: 0,
        time3: 0
    };
    const addTask = prompt("Add Task");
    taskElement = document.createElement('li');
    taskElement.textContent = addTask;
    taskElement.setAttribute("type", "button");
    taskElement.classList.add("miniTask");
    taskParent.appendChild(taskElement);

    taskElement.addEventListener('click', function () {
    selectTask(taskObject)});

    checkTasks();
}

function checkTasks() {
    task = taskParent.querySelectorAll('li');
    console.log(task);
}

function selectTask(taskObject) {
    selectedTask = taskObject;
    console.log(taskObject.time3 + ':' + taskObject.time2 + '' + taskObject.time1);
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
