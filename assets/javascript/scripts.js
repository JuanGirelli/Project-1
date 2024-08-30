const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const removeTaskButton = document.querySelector('#remove-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset')

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


function resetTime(){
    
    clearInterval(timerInstance); 
    timeFirst = 0;
    timeSecond = 0;
    timeThird = 0;
    timerRunning = false;
    clockEl.textContent = "0:00";
}

function addTask() {

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

function removeTask(){
    task.remove();
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
removeTaskButton.addEventListener('click', removeTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);
