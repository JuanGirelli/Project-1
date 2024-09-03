const clockEl = document.querySelector('#clock');
const addTaskButton = document.querySelector('#add-Task');
const removeTaskButton = document.querySelector('#remove-Task');
const timerButton = document.querySelector('#timer-Button');
const taskParent = document.querySelector('#to-Do');
const resetTimer = document.querySelector('#timer-Reset')


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

function startTimer() {
    timer();
    timerRunning = true;
}

function stopTimer() {
    clearInterval(timerInstance);
    timerRunning = false;
}

function alternateTimer() {
    if (selectedTask == null)
    {
        alert('No task selected');
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
    }
    else
    {
        alert('No task selected');
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

    const addTaskInput = prompt("Add Task");
    taskElement.textContent = addTaskInput;
    taskObject.taskName = addTaskInput;

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

// removes the last task from the list of tasks and updates local storage
function removeLastTask(){
    if (taskParent.lastChild != null)
    {
        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks.pop();
        localStorage.setItem('allTasks', JSON.stringify(tasks));
        if (taskParent.lastChild.classList.contains('selected-Task'))
        {
            stopTimer();
            selectedTask = null;
            //localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
            clockEl.textContent = '0:00';
        }
        taskParent.removeChild(taskParent.lastChild);
    }
    else
    {
        alert('No tasks to remove');
    }
}

// removes the selected task from the list of tasks and updates local storage
/*function removeSelectedTask() {
    if (selectedTask != null)
    {
        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        let index = tasks.indexOf(selectedTask);
        index++;
        tasks.splice(index, 1);
        localStorage.setItem('allTasks', JSON.stringify(tasks));
   
        selectedTask = null;
        stopTimer();

        clockEl.textContent = '0:00';
        
        taskParent.removeChild(taskParent.children[index]);
    }
    else
    {
        alert('No task selected');
    }
    
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
    stopTimer();
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
        createTask(tasks[i]);
    }
}

// physically creates the task element
function createTask(object, _taskElement) {
    if (_taskElement == null) {
        _taskElement = document.createElement('li');
    }
    _taskElement.textContent = object.taskName;

    _taskElement.setAttribute("type", "button");
    _taskElement.classList.add("miniTask");
    taskParent.appendChild(_taskElement);

    // Create the remove button and initially hide it
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.classList.add('remove-btn');
    removeButton.style.display = 'none'; // Initially hidden

    // Create the done button and initially hide it
    const doneButton = document.createElement('button');
    doneButton.textContent = "Done";
    doneButton.classList.add('done-btn');
    doneButton.style.display = 'none'; // Initially hidden

    // Append the remove and done buttons to the task item
    _taskElement.appendChild(removeButton);
    _taskElement.appendChild(doneButton);

    // Function to clear the selected state from all tasks and hide remove and done buttons
    function clearSelectedTask() {
        const allTasks = taskParent.querySelectorAll('li');
        allTasks.forEach(task => {
            task.classList.remove('selected-Task');
            task.querySelector('.remove-btn').style.display = 'none'; // Hide the remove button
            task.querySelector('.done-btn').style.display = 'none'; // Hide the done button
        });
    }

    // Show the remove and done buttons when the task is selected
    _taskElement.addEventListener('click', function () {
        if (_taskElement.classList.contains('selected-Task')) {
            clearSelectedTask(); // Deselect the task and hide the buttons if already selected
        } else {
            clearSelectedTask(); // Clear any other selections
            _taskElement.classList.add('selected-Task');
            removeButton.style.display = 'inline-block'; // Show the remove button for the selected task
            doneButton.style.display = 'inline-block'; // Show the done button for the selected task
            selectTask(object, _taskElement);
        }
    });

    // Add the event listener to the remove button
    removeButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the task from being reselected
        taskParent.removeChild(_taskElement);

        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== object.taskName);
        localStorage.setItem('allTasks', JSON.stringify(tasks));

        stopTimer();
        selectedTask = null;
        clockEl.textContent = '0:00';
    });

    // Add the event listener to the done button
    doneButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the task from being reselected
        _taskElement.classList.add('completed-Task'); // Add a class to indicate the task is completed
        _taskElement.style.textDecoration = "line-through"; // Optionally strike through the text

        // Move the task to the completed list
        document.getElementById('completed').appendChild(_taskElement);
        removeButton.style.display = 'none'; // Hide the remove button after marking as done
        doneButton.style.display = 'none'; // Hide the done button after marking as done

        // Optionally remove the task from the active list in local storage
        let tasks = JSON.parse(localStorage.getItem("allTasks"));
        tasks = tasks.filter(task => task.taskName !== object.taskName);
        localStorage.setItem('allTasks', JSON.stringify(tasks));
    });


   // _taskElement.addEventListener('click', function () {
    //selectTask(object, _taskElement)});  
}

addTaskButton.addEventListener('click', addTask);
timerButton.addEventListener('click', alternateTimer);
resetTimer.addEventListener('click', resetTime);
removeTaskButton.addEventListener('click', removeLastTask);

