const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const removeTaskButton = document.querySelector('#remove-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset');
const inputField = document.querySelector('#task-Input');
let dark = localStorage.getItem('darkMode');
const toggleMode = document.getElementById('toggle');
const modal = new bootstrap.Modal(document.getElementById('taskModal'));
const modalMessage = document.getElementById('modalMessage');

renderActiveTask();
renderCompletedTasks();

let selectedTask;
let selectedTaskObject;

let timerRunning = false;

let timerInstance;


function OpenModal(_modalMessage) {
    modalMessage.textContent = _modalMessage;
    modal.show();
}

const darkModeOn = () => {
  document.body.classList.add('darkMode');
  localStorage.setItem('darkMode', 'enabled');
}

const darkModeOff = () => {
  document.body.classList.remove('darkMode');
  localStorage.setItem('darkMode', null);
}

if (dark === 'enabled'){
  darkModeOn();
}

toggleMode.addEventListener('click', () => {
  dark = localStorage.getItem('darkMode');
  if (dark !== 'enabled'){
    darkModeOn();
  }
  else{
    darkModeOff();
  }
  
});


function timer(object) { timerInstance = setInterval(function () {
    selectedTask.time1++;
    if (selectedTask.time1 == 10)
    {
        selectedTask.time1 = 0;
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

function startTimer() {
    timer();
    timerRunning = true;
}

function stopTimer() {
    clearInterval(timerInstance);
    timerRunning = false;

    if (selectedTask != null)
    {
        refreshStorage();
    }
}

function alternateTimer() {
    if (selectedTask == null)
    {
        //alert('No task selected');
        OpenModal('No task selected');
    }
    else if (!timerRunning)
    {
        startTimer();
    }
    else
    {
        stopTimer();
    }
}

// assign the selectedTask's time values to zero and update the clock element
function resetTime(){
    if (selectedTask != null)
    {
        clearInterval(timerInstance); 
        timerRunning = false;

        selectedTask.time1 = 0;
        selectedTask.time2 = 0;
        selectedTask.time3 = 0;
        clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1; 
        refreshStorage();
    }
    else
    {
        //alert('No task selected');    
        OpenModal('No task selected');
    }
}

// adds a task to the list of tasks, creates a task object for the task that stores all the time values
function addTask() {

    let taskObject = {
        taskName: '',
        time1: 0,
        time2: 0,
        time3: 0
    };
    taskElement = document.createElement('li');

    if (inputField.value != '')
    {
        taskElement.textContent = inputField.value;
        taskObject.taskName = inputField.value;
        inputField.value = '';
    }
    else
    {
        OpenModal('Please enter a task name');     
        return;
    }


    createTask(taskObject, taskElement);

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

function refreshStorage() {
    const taskData = JSON.parse(localStorage.getItem('allTasks')) || [];

    const selectedTaskName = selectedTask.taskName;
    const itemToUpdate = taskData.find(object => object.taskName === selectedTaskName);

    if (itemToUpdate) {
        itemToUpdate.time1 = selectedTask.time1;
        itemToUpdate.time2 = selectedTask.time2;
        itemToUpdate.time3 = selectedTask.time3;
    }

    localStorage.setItem('allTasks', JSON.stringify(taskData));
}

// checks how many tasks there are and removes their selected task class, only called once a task is selected
function clearSelectedTask() {
    tasks = taskParent.querySelectorAll('li');
    for (let i = 0; i < tasks.length; i++) 
    {
        if (tasks[i].classList.contains('selected-Task'))
        {
            tasks[i].classList.remove('selected-Task');
            tasks[i].querySelector('.remove-btn').style.display = 'none'; // Hide the remove button
            tasks[i].querySelector('.done-btn').style.display = 'none'; // Hide the done button
        }
    }
}

// sets the selected task to the task that was clicked, updates timer accordingly
function selectTask(_taskObject, _taskElement) {
    selectedTask = _taskObject; 
    stopTimer(selectedTask);
    _taskElement.classList.add('selected-Task');

    clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1;
}

// returns all the tasks from local storage
function loadActiveTasks() {
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

function loadCompletedTasks() {
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

    if (completedTasks == null)
    {
        return [];
    }
    else if (Array.isArray(completedTasks))
    {   
        return completedTasks;
    }
    else
    {
        return [completedTasks];
    }
}   

// renders all active tasks to the page
function renderActiveTask() {
    let tasks = loadActiveTasks();
    for (let i = 0; i < tasks.length; i++)
    {
        createTask(tasks[i]);
    }
}

// renders all completed tasks to the page
function renderCompletedTasks() {
    let _completedTasks = loadCompletedTasks();
    for (let i = 0; i < _completedTasks.length; i++)
    {
        createCompletedTask(_completedTasks[i]);
    }
}

function createTask(object, _taskElement) {
    if (_taskElement == null) {
        _taskElement = document.createElement('li');
    }
    _taskElement.textContent = object.taskName;

    _taskElement.setAttribute("type", "button");
    _taskElement.classList.add("miniTask");
    taskParent.appendChild(_taskElement);

    const removeButton = createRemoveButton();
    const doneButton = createDoneButton();

    // Append the remove and done buttons to the task item
    _taskElement.appendChild(removeButton);
    _taskElement.appendChild(doneButton);

    // Function to clear the selected state from all tasks and hide remove and done buttons
    function _clearSelectedTask() {
        const allTasks = taskParent.querySelectorAll('li');
        allTasks.forEach(task => {
            task.classList.remove('selected-Task');
            task.querySelector('.remove-btn').style.display = 'none'; // Hide the remove button
            task.querySelector('.done-btn').style.display = 'none'; // Hide the done button
        });
    }

    function showRemoveAndDoneButtons() { 
        if (_taskElement.classList.contains('completed-Task')) 
        {
            return; 
        }
        else
        {
            if (_taskElement.classList.contains('selected-Task')) 
            {
                _clearSelectedTask(); // Deselect the task and hide the buttons if already selected
            } 
            else 
            {
                _clearSelectedTask(); // Clear any other selections
                _taskElement.classList.add('selected-Task');
                removeButton.style.display = 'inline-block'; // Show the remove button for the selected task
                doneButton.style.display = 'inline-block'; // Show the done button for the selected task
                selectTask(object, _taskElement);
            }
        }
    }

    function removeTask(event) {
        event.stopPropagation(); // Prevent the task from being reselected
        taskParent.removeChild(_taskElement);

        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== object.taskName);
        localStorage.setItem('allTasks', JSON.stringify(tasks));

        stopTimer();
        selectedTask = null;
        clockEl.textContent = '0:00';
    }

    function completeTask(event) {
        event.stopPropagation(); // Prevent the task from being reselected
        _taskElement.classList.remove('selected-Task'); // Remove the selected class
        _taskElement.classList.remove('miniTask'); // Remove the miniTask class
        _taskElement.removeAttribute("type", "button");

        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== object.taskName);
        localStorage.setItem('allTasks', JSON.stringify(tasks));

        let existingData = localStorage.getItem('completedTasks');
        let completedTaskData;
    
        if (existingData) 
        {
            completedTaskData = JSON.parse(existingData);
        } 
        else 
        {
            completedTaskData = [];
        }
    
        completedTaskData.push(object);
    
        localStorage.setItem('completedTasks', JSON.stringify(completedTaskData));
        resetTime();
        createCompletedTask(object, _taskElement);
    }    
    
    doneButton.addEventListener('click', completeTask);
    removeButton.addEventListener('click', removeTask);
    _taskElement.addEventListener('click', showRemoveAndDoneButtons);
}

function createRemoveButton() {
    const _removeButton = document.createElement('button');
    _removeButton.textContent = "Remove";
    _removeButton.classList.add('remove-btn');
    _removeButton.style.display = 'none'; // Initially hidden
    return _removeButton;
}

function createDoneButton() {
    const _doneButton = document.createElement('button');
    _doneButton.textContent = "Done";
    _doneButton.classList.add('done-btn');
    _doneButton.style.display = 'none'; // Initially hidden
    return _doneButton;
}

function createCompletedTask(object, _taskElement) {
    if (_taskElement == null) {
        _taskElement = document.createElement('li');
    }
    _taskElement.textContent = object.taskName;
    _taskElement.classList.add('completed-Task'); // Add a class to indicate the task is completed
    _taskElement.style.textDecoration = "line-through"; // Optionally strike through the text

    // Move the task to the completed list
    document.getElementById('completed').appendChild(_taskElement);
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);

