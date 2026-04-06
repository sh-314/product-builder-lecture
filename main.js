const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const increaseButton = document.getElementById('increase-time');
const decreaseButton = document.getElementById('decrease-time');
const themeToggle = document.getElementById('theme-toggle');

let timer;
let initialTime = 25 * 60; // Default 25 minutes
let timeLeft = initialTime;

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', toggleTheme);

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null;
                alert('Pomodoro session finished!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = initialTime;
    updateTimerDisplay();
}

function increaseTime() {
    if (!timer) {
        initialTime += 60;
        timeLeft = initialTime;
        updateTimerDisplay();
    }
}

function decreaseTime() {
    if (!timer && initialTime > 60) {
        initialTime -= 60;
        timeLeft = initialTime;
        updateTimerDisplay();
    }
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
increaseButton.addEventListener('click', increaseTime);
decreaseButton.addEventListener('click', decreaseTime);

updateTimerDisplay(); // Initial display
