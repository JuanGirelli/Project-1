const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');


let taskArray = [];


let timeFirst = 0;
let timeSecond = 0;
let timeThird = 0;

let timerRunning = false;

let timerInstance;

function timer() { timerInstance = setInterval(function () {
    timeFirst++;
    if (timeFirst == 10)
    {
        timeFirst = 0;
        timeSecond++;
        if (timeSecond == 6)
        {
            timeSecond = 0;
            timeThird++;
        }
    }      
    clockEl.textContent = timeThird + ':' + timeSecond + timeFirst;     
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

function addTask() {
    let task = document.createElement('li');
    task.classList.add('miniTask');
    task.textContent = 'Task #';
    taskParent.appendChild(task);
    checkTasks();
}

function checkTasks() {
    taskArray = taskParent.querySelectorAll('li');
    console.log(taskArray);
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
