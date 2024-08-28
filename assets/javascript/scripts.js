const clockEl = document.querySelector('#clock');
const timerButton = document.querySelector('button');

console.log(timerButton.textContent);
console.log(clockEl.textContent);

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

//clearInterval(timerInterval);


function alternateTimer() {
    
    if (!timerRunning)
        {
            //timerInstance = timer();
            timer();
            timerRunning = true;         
        }
        else
        {
            clearInterval(timerInstance);         
            timerRunning = false;           
        }
}

timerButton.addEventListener('click', alternateTimer);
