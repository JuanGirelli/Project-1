const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const removeTaskButton = document.querySelector('#remove-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset');
const inputField = document.querySelector('#task-Input');
let dark = localStorage.getItem('darkMode');
const toggleMode = document.getElementById('toggle');

const clearButton = document.getElementById('clearTasks');
const modal = new bootstrap.Modal(document.getElementById('taskModal'));
const modalMessage = document.getElementById('modalMessage');

let selectedTask;
let selectedTaskObject;

let timerRunning = false;

let timerInstance;

// load all tasks from local storage and render them to the page
renderActiveTask();
renderCompletedTasks();

function OpenModal(m_modalMessage) {
    modalMessage.textContent = m_modalMessage;
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


function timer(m_taskObject) { timerInstance = setInterval(function () {
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
        OpenModal('No task selected');
    }
}

// adds a task to the list of tasks, creates a "taskObject" for the task that stores all the time values and the name of the task,
// and updates the local storage with the new task
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

// updates the local storage with the new time values of the selected task
function refreshStorage() {
    const taskData = JSON.parse(localStorage.getItem('allTasks')) || [];

    const selectedTaskName = selectedTask.taskName;
    const itemToUpdate = taskData.find(m_taskObject => m_taskObject.taskName === selectedTaskName);

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
function selectTask(m_taskObject, m_taskElement) {
    selectedTask = m_taskObject; 
    stopTimer(selectedTask);
    m_taskElement.classList.add('selected-Task');

    clockEl.textContent = selectedTask.time3 + ':' + selectedTask.time2 + selectedTask.time1;
}

// returns all the tasks from local storage as an array
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

// returns all the completed tasks from local storage as an array
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


// clear task button functionality
clearButton.addEventListener('click', () => {
    const allTasks = document.getElementById('completed');
    if (allTasks.firstChild == null) 
    {
        OpenModal('No tasks to clear');
    }

    while (allTasks.firstChild) 
    {
      allTasks.removeChild(allTasks.firstChild);
    }
    localStorage.removeItem('completedTasks')
});


// this handles all aspects of task creation, including the creation of the task element, 
// the remove and done buttons, and the functionality of the buttons
function createTask(m_taskObject, m_taskElement) {    
    if (m_taskElement == null) {
        m_taskElement = document.createElement('li');
    }
    m_taskElement.textContent = m_taskObject.taskName;

    m_taskElement.setAttribute("type", "button");
    m_taskElement.classList.add("miniTask");
    taskParent.appendChild(m_taskElement);

    const removeButton = createRemoveButton();
    const doneButton = createDoneButton();

    // Append the remove and done buttons to the task item
    m_taskElement.appendChild(removeButton);
    m_taskElement.appendChild(doneButton);

    // Function to clear the selected state from all tasks and hide remove and done buttons
    function _clearSelectedTask() {
        const allTasks = taskParent.querySelectorAll('li');
        allTasks.forEach(task => {
            task.classList.remove('selected-Task');
            task.querySelector('.remove-btn').style.display = 'none'; // Hide the remove button
            task.querySelector('.done-btn').style.display = 'none'; // Hide the done button
        });
    }

    // This function is called whenever a task is selected, it shows the remove and done buttons for the selected task,
    // and updates the classes of the task accordingly
    function showRemoveAndDoneButtons() { 
        if (m_taskElement.classList.contains('completed-Task')) 
        {
            return; 
        }
        else
        {
            if (m_taskElement.classList.contains('selected-Task')) 
            {
                _clearSelectedTask(); // Deselect the task and hide the buttons if already selected
                stopTimer(selectedTask);
                selectedTask = null;
                clockEl.textContent = '0:00';
            } 
            else 
            {
                _clearSelectedTask(); // Clear any other selections
                m_taskElement.classList.add('selected-Task');
                removeButton.style.display = 'inline-block'; // Show the remove button for the selected task
                doneButton.style.display = 'inline-block'; // Show the done button for the selected task
                selectTask(m_taskObject, m_taskElement);
            }
        }
    }

    // when remove button is clicked, this function will remove the task from the active task list and update the local storage/timer
    function removeTask(event) {
        event.stopPropagation(); // Prevent the task from being reselected
        taskParent.removeChild(m_taskElement);

        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== m_taskObject.taskName);
        localStorage.setItem('allTasks', JSON.stringify(tasks));

        stopTimer();
        selectedTask = null;
        clockEl.textContent = '0:00';
    }

    // when done button is clicked, this function will update the local storage, 
    // remove the task from active task list, and create a completed task element
    function completeTask(event) {
        event.stopPropagation(); // Prevent the task from being reselected
        m_taskElement.classList.remove('selected-Task'); // Remove the selected class
        m_taskElement.classList.remove('miniTask'); // Remove the miniTask class
        m_taskElement.removeAttribute("type", "button");
        let taskTimeString = m_taskObject.time3 + ":" + m_taskObject.time2 + m_taskObject.time1; // get time values of completed task and store them in a string

        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== m_taskObject.taskName);
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
    
        completedTaskData.push(m_taskObject);
    
        localStorage.setItem('completedTasks', JSON.stringify(completedTaskData));
        resetTime();
        createCompletedTask(m_taskObject, m_taskElement, taskTimeString);
    }    
    
    doneButton.addEventListener('click', completeTask);
    removeButton.addEventListener('click', removeTask);
    m_taskElement.addEventListener('click', showRemoveAndDoneButtons);
}

// return remove button element
function createRemoveButton() {
    const _removeButton = document.createElement('button');
    _removeButton.textContent = "Remove";
    _removeButton.classList.add('remove-btn');
    _removeButton.style.display = 'none'; // Initially hidden
    return _removeButton;
}

// return done button element
function createDoneButton() {
    const _doneButton = document.createElement('button');
    _doneButton.textContent = "Done";
    _doneButton.classList.add('done-btn');
    _doneButton.style.display = 'none'; // Initially hidden
    return _doneButton;
}

// creates a completed task element and appends it to the completed task list
function createCompletedTask(m_taskObject, m_taskElement, m_taskTimeString) {
    if (m_taskElement == null) {
        m_taskElement = document.createElement('li');
    }
    if (m_taskTimeString == null) 
    {
        m_taskTimeString = m_taskObject.time3 + ":" + m_taskObject.time2 + m_taskObject.time1;
    }
    m_taskElement.textContent = m_taskObject.taskName;
    m_taskElement.classList.add('completed-Task'); // Add a class to indicate the task is completed

    let timerStringDisplay = document.createElement('text');
    timerStringDisplay.textContent = m_taskTimeString;
    timerStringDisplay.style.textDecoration = "none";
    timerStringDisplay.id = 'timerStringDisplay';
    document.getElementById('completed').appendChild(m_taskElement);
    m_taskElement.appendChild(timerStringDisplay);

    selectedTask = null;
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);

