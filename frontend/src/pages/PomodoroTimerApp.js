import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button.js";
import '../style/PomodoroTimerApp.css'
// Constants
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 20 * 60;

// hook for timer
function useTimer(initialTime, onTick,) {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((pervTime) => {
                    const newTime = pervTime -1;
                    if (newTime >= 0) {
                        onTick(newTime);
                        return newTime;
                    }
                    clearInterval(interval);
                    return 0;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, onTick])

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = (newTime) => {
        setTime(newTime);
        setIsRunning(false);
    };

    return { time, isRunning, start, pause, reset };
}

//basic display component
const TimerDisplay = ({ seconds, mode }) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = String(seconds % 60).padStart(2, "0");
    return (
        <div className="timer-display">
            <h2>{mode.toUpperCase()}</h2>
            <p style={{ fontSize: "3rem" }}>{`${minutes}:${seconds}`}</p>
        </div>
    );
}

//Basic controls components
const TimeControls = ({ isRunning, onStart, onStop, onReset, isResetDisabled }) => {
    <div className="time-controls">
        { isRunning ? (
            <button onClick={onStop}>Stop</button>
        ) : (
            <button onClick={onStart}>Start</button>
        )}
        <Button onClick={onReset} disabled={isResetDisabled}>Reset</Button>
    </div>
};

const PomodoroTimerApp = () => {
    const [mode, setMode] = useState('pomodoro');
    const [settings] = useState({
        pomodoro: POMODORO_TIME / 60,
        shortBreak: SHORT_BREAK_TIME / 60,
        longBreak: LONG_BREAK_TIME / 60,
        }

    );
    const [time, isRunning, start, pause, reset] = useTimer(POMODORO_TIME, (seconds) => {
        if (seconds === 0) {
            playSound();
        }
        }
    )
};

export default PomodoroTimerApp;