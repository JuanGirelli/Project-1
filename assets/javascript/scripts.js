const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const removeTaskButton = document.querySelector('#remove-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset')

//loadAllTasks();
rendTask();

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
    
    if (!timerRunning && selectedTask != null)
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


function resetTime(){
    clearInterval(timerInstance); 
    timerRunning = false;

    selectedTask.time1 = 0;
    selectedTask.time2 = 0;
    selectedTask.time3 = 0;
    clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1; 
}

// adds a task to the list of tasks, creates a task object for the task that stores all the time values
function addTask() {

    let taskObject = {
        taskName: '',
        time1: 0,
        time2: 0,
        time3: 0
    };

    const addTaskInput = prompt("Add Task");
    taskElement.textContent = addTaskInput;
    taskObject.taskName = addTaskInput;

    /*taskElement.setAttribute("type", "button");
    taskElement.classList.add("miniTask");

    taskParent.appendChild(taskElement);

    taskElement.addEventListener('click', function () {
    selectTask(taskObject, taskElement)});*/
    createTask(taskObject);

    let existingData = localStorage.getItem('allTasks');
    let taskData;

    if (existingData) 
    {
      taskData = JSON.parse(existingData);
    } 
    else 
    {
      taskData = [];
    }

    taskData.push(taskObject);

    localStorage.setItem('allTasks', JSON.stringify(taskData));
}

/*function removeTask(){
    task.remove();
}*/

// checks how many tasks there are and removes their selected task class, only called once a task is selected
function clearSelectedTask() {
    task = taskParent.querySelectorAll('li');
    for (let i = 0; i < task.length; i++) 
    {
        if (task[i].classList.contains('selected-Task'))
        {
            task[i].classList.remove('selected-Task');
        }
    }
}

// sets the selected task to the task that was clicked, updates timer accordingly
function selectTask(_taskObject, _taskElement) {
    clearSelectedTask();
    _taskElement.classList.add('selected-Task');
    selectedTask = _taskObject; 

    localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
    clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1;
}

// returns all the tasks from local storage
function loadAllTasks() {
    let tasks = JSON.parse(localStorage.getItem('allTasks'));

    if (tasks == null)
    {
        return [];
    }
    else if (Array.isArray(tasks))
    {   
        return tasks;
    }
    else
    {
        return [tasks];
    }
}

// renders all the tasks to the page
function rendTask() {
    let tasks = loadAllTasks();
    for (let i = 0; i < tasks.length; i++)
    {
        /*taskElement = document.createElement('li');
        taskElement.textContent = tasks[i].taskName;
        
        taskElement.setAttribute("type", "button");
        taskElement.classList.add("miniTask");
        taskParent.appendChild(taskElement);

        taskElement.addEventListener('click', function () {
        selectTask(tasks[i], taskElement)});*/
        createTask(tasks[i]);
    }
}

// physically creates the task element
function createTask(object) {
    taskElement = document.createElement('li');
    taskElement.textContent = object.taskName;
    
    taskElement.setAttribute("type", "button");
    taskElement.classList.add("miniTask");
    taskParent.appendChild(taskElement);

    taskElement.addEventListener('click', function () {
    selectTask(object, taskElement)});
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);
//removeTaskButton.addEventListener('click', removeTask);

