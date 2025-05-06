import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button.js";
import '../style/PomodoroTimerApp.css';

// Constants
const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 20 * 60;

// Timer hook
function useTimer(initialTime, onTick) {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    const newTime = prevTime - 1;
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
    }, [isRunning, onTick]);

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = (newTime) => {
        setTime(newTime);
        setIsRunning(false);
    };

    return { time, isRunning, start, pause, reset };
}

// Timer display component
const TimerDisplay = ({ seconds, mode }) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = String(seconds % 60).padStart(2, "0");
    return (
        <div className="timer-display">
            <h2>{mode.toUpperCase()}</h2>
            <p style={{ fontSize: "3rem" }}>{`${minutes}:${secondsLeft}`}</p>
        </div>
    );
};

// Control buttons
const TimeControls = ({ isRunning, onStart, onStop, onReset, isResetDisabled }) => (
    <div className="time-controls">
        {isRunning ? (
            <button onClick={onStop}>Stop</button>
        ) : (
            <button onClick={onStart}>Start</button>
        )}
        <Button onClick={onReset} disabled={isResetDisabled}>Reset</Button>
    </div>
);

const PomodoroTimerApp = () => {
    const [mode, setMode] = useState('pomodoro');
    const [settings] = useState({
        pomodoro: POMODORO_TIME / 60,
        shortBreak: SHORT_BREAK_TIME / 60,
        longBreak: LONG_BREAK_TIME / 60,
    });

    const { time, isRunning, start, pause, reset } = useTimer(POMODORO_TIME, (seconds) => {
        if (seconds === 0) {
            playSound();
        }
    });

    const [isResetDisabled, setIsResetDisabled] = useState(true);
    const audioContextRef = useRef(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playSound = () => {
        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    const handleStart = () => {
        setIsResetDisabled(false);
        start();
    };

    const handleStop = () => {
        setIsResetDisabled(true);
        pause();
    };

    const handleReset = () => {
        reset(
            mode === 'pomodoro'
                ? settings.pomodoro * 60
                : mode === 'shortBreak'
                    ? settings.shortBreak * 60
                    : settings.longBreak * 60
        );
        setIsResetDisabled(true);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        pause();
        setIsResetDisabled(true);
        switch (newMode) {
            case 'pomodoro':
                reset(settings.pomodoro * 60);
                break;
            case 'shortBreak':
                reset(settings.shortBreak * 60);
                break;
            case 'longBreak':
                reset(settings.longBreak * 60);
                break;
            default:
                break;
        }
    };

    return (
        <div className="pomodoro-timer-app">
            <h1 className="pomodoro">Pomodoro Timer</h1>

            <div className="mode-selection">
                <button
                    onClick={() => handleModeChange('pomodoro')}
                    className={`mode-button ${mode === "pomodoro" ? 'active' : ''}`}
                >
                    Pomodoro
                </button>
                <button
                    onClick={() => handleModeChange('shortBreak')}
                    className={`mode-button ${mode === "shortBreak" ? 'active' : ''}`}
                >
                    Short Break
                </button>
                <button
                    onClick={() => handleModeChange('longBreak')}
                    className={`mode-button ${mode === "longBreak" ? 'active' : ''}`}
                >
                    Long Break
                </button>
            </div>

            <TimerDisplay seconds={time} mode={mode} />
            <TimeControls
                isRunning={isRunning}
                onStart={handleStart}
                onStop={handleStop}
                onReset={handleReset}
                isResetDisabled={isResetDisabled}
            />
        </div>
    );
};

export default PomodoroTimerApp;
