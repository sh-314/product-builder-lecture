const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const themeToggle = document.getElementById('theme-toggle');
const alarmSound = document.getElementById('alarm-sound');

let timer;
const WORK_TIME = 40 * 60;
const BREAK_TIME = 20 * 60;
const TOTAL_CYCLES = 4;

let timeLeft = WORK_TIME;
let currentCycle = 1;
let isWorking = true;
let isPaused = true;

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
    
    const mode = isWorking ? 'Work' : 'Break';
    statusDisplay.textContent = `${mode} Session ${currentCycle}/${TOTAL_CYCLES}`;
}

function playAlarm() {
    alarmSound.play().catch(e => console.log('Audio play blocked:', e));
}

function switchMode() {
    playAlarm();
    if (isWorking) {
        isWorking = false;
        timeLeft = BREAK_TIME;
    } else {
        isWorking = true;
        currentCycle++;
        if (currentCycle > TOTAL_CYCLES) {
            resetTimer();
            alert('Congratulations! You completed all 4 cycles!');
            return;
        }
        timeLeft = WORK_TIME;
    }
    updateTimerDisplay();
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                switchMode();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    timeLeft = WORK_TIME;
    currentCycle = 1;
    isWorking = true;
    updateTimerDisplay();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateTimerDisplay();
