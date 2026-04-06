const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const autoToggleButton = document.getElementById('auto-toggle');
const increaseBtn = document.getElementById('increase-time');
const decreaseBtn = document.getElementById('decrease-time');
const themeToggle = document.getElementById('theme-toggle');
const miniToggle = document.getElementById('mini-toggle');
const alarmSound = document.getElementById('alarm-sound');

let timer;
let WORK_TIME = 40 * 60;
let BREAK_TIME = 20 * 60;
const TOTAL_CYCLES = 4;

let timeLeft = WORK_TIME;
let currentCycle = 1;
let isWorking = true;
let isPaused = true;
let isAutoMode = true;

// Check if we are in mini mode via URL parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'mini') {
    document.body.classList.add('mini-window');
}

// Sync state with localStorage
function saveState() {
    const state = { 
        timeLeft, currentCycle, isWorking, isPaused, isAutoMode, 
        WORK_TIME, BREAK_TIME, timestamp: Date.now() 
    };
    localStorage.setItem('pomodoro_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('pomodoro_state');
    if (saved) {
        const state = JSON.parse(saved);
        timeLeft = state.timeLeft;
        currentCycle = state.currentCycle;
        isWorking = state.isWorking;
        isPaused = state.isPaused;
        isAutoMode = state.isAutoMode ?? true;
        WORK_TIME = state.WORK_TIME || 40 * 60;
        BREAK_TIME = state.BREAK_TIME || 20 * 60;
        
        updateAutoToggleBtn();
        
        if (!isPaused) {
            const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);
            timeLeft = Math.max(0, timeLeft - elapsed);
            startTimer(true);
        }
        updateTimerDisplay();
    }
}

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

themeToggle?.addEventListener('click', toggleTheme);

miniToggle?.addEventListener('click', () => {
    window.open(window.location.href + '?mode=mini', 'TimerMini', 'width=200,height=100,menubar=no,toolbar=no,location=no,status=no,popup=yes');
});

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const mode = isWorking ? 'Work' : 'Break';
    statusDisplay.textContent = `${mode} ${currentCycle}/${TOTAL_CYCLES}`;
}

function playAlarm() {
    let count = 0;
    const playThreeTimes = () => {
        if (count < 3) {
            alarmSound.play().catch(e => console.log('Audio blocked:', e));
            count++;
            setTimeout(playThreeTimes, 1500); // Wait 1.5s between beeps
        }
    };
    playThreeTimes();
}

function showCompletionPopup() {
    const messages = [
        "Great job! You stayed focused.",
        "Today's work is done. Time to rest!",
        "Incredible effort! You are crushing it.",
        "You've earned this break. Enjoy!"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    alert(`🎉 Sessions Completed: ${TOTAL_CYCLES}\n\n${msg}`);
}

function switchMode() {
    playAlarm();
    if (isWorking) {
        isWorking = false;
        timeLeft = BREAK_TIME;
        if (!isAutoMode) {
            pauseTimer();
        }
    } else {
        isWorking = true;
        currentCycle++;
        if (currentCycle > TOTAL_CYCLES) {
            resetTimer();
            showCompletionPopup();
            return;
        }
        timeLeft = WORK_TIME;
        if (!isAutoMode) {
            pauseTimer();
        }
    }
    saveState();
    updateTimerDisplay();
}

function startTimer(isResuming = false) {
    if (isPaused || isResuming) {
        isPaused = false;
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            if (timeLeft % 5 === 0) saveState();
            updateTimerDisplay();
            if (timeLeft <= 0) {
                switchMode();
            }
        }, 1000);
        if (!isResuming) saveState();
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timer);
    saveState();
}

function resetTimer() {
    pauseTimer();
    timeLeft = isWorking ? WORK_TIME : BREAK_TIME;
    updateTimerDisplay();
}

function updateAutoToggleBtn() {
    autoToggleButton.textContent = isAutoMode ? "Auto: ON" : "Auto: OFF";
}

// Event Listeners
startButton.addEventListener('click', () => startTimer());
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', () => {
    currentCycle = 1;
    isWorking = true;
    resetTimer();
});

autoToggleButton.addEventListener('click', () => {
    isAutoMode = !isAutoMode;
    updateAutoToggleBtn();
    saveState();
});

increaseBtn.addEventListener('click', () => {
    timeLeft += 60;
    if (isWorking) WORK_TIME += 60; else BREAK_TIME += 60;
    updateTimerDisplay();
    saveState();
});

decreaseBtn.addEventListener('click', () => {
    if (timeLeft > 60) {
        timeLeft -= 60;
        if (isWorking) WORK_TIME -= 60; else BREAK_TIME -= 60;
        updateTimerDisplay();
        saveState();
    }
});

// Sync across tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'pomodoro_state') {
        const state = JSON.parse(e.newValue);
        timeLeft = state.timeLeft;
        currentCycle = state.currentCycle;
        isWorking = state.isWorking;
        isAutoMode = state.isAutoMode ?? true;
        WORK_TIME = state.WORK_TIME;
        BREAK_TIME = state.BREAK_TIME;
        
        updateAutoToggleBtn();
        const wasPaused = isPaused;
        isPaused = state.isPaused;
        
        if (wasPaused && !isPaused) {
            startTimer(true);
        } else if (!wasPaused && isPaused) {
            clearInterval(timer);
        }
        updateTimerDisplay();
    }
});

loadState();
updateTimerDisplay();
