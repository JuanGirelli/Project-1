const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset')


let taskArray = [];
for (let i = 0; i < 10; i++)
{
    taskArray.push(taskParent.children[i]);
}
console.log(taskArray);


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
    task = document.createElement('li');
    task.textContent = addTask;
    task.setAttribute("type", "button");
    task.classList.add("miniTask");
    taskParent.appendChild(task);
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);
