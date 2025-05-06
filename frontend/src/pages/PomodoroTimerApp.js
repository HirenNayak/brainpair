import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 20 * 60;

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

const TimerDisplay = ({ seconds, mode }) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = String(seconds % 60).padStart(2, "0");
    return (
        <div className="text-center my-6">
            <h2 className="text-xl font-semibold uppercase">{mode}</h2>
            <p className="text-7xl md:text-8xl lg:text-9xl font-extrabold">{`${minutes}:${secondsLeft}`}</p>
        </div>
    );
};

const TimeControls = ({ isRunning, onStart, onStop, onReset, isResetDisabled }) => (
    <div className="flex justify-center gap-4 mt-4">
        {isRunning ? (
            <button onClick={onStop} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                Stop
            </button>
        ) : (
            <button onClick={onStart} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                Start
            </button>
        )}
        <button
            onClick={onReset}
            disabled={isResetDisabled}
            className={`px-4 py-2 rounded-lg shadow-md ${
                isResetDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
            Reset
        </button>
    </div>
);

const PomodoroTimerApp = () => {
    const [mode, setMode] = useState("pomodoro");
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
            mode === "pomodoro"
                ? settings.pomodoro * 60
                : mode === "shortBreak"
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
            case "pomodoro":
                reset(settings.pomodoro * 60);
                break;
            case "shortBreak":
                reset(settings.shortBreak * 60);
                break;
            case "longBreak":
                reset(settings.longBreak * 60);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex justify-center items-center pt-10">
                <div className="w-full max-w-4xl mx-auto p-10 sm:p-12 md:p-16 lg:p-20 bg-white rounded-2xl shadow-lg text-center mt-10">
                    <div className="flex justify-center gap-2 mb-4">
                        {["pomodoro", "shortBreak", "longBreak"].map((label) => (
                            <button
                                key={label}
                                onClick={() => handleModeChange(label)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    mode === label ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                {label === "pomodoro"
                                    ? "Pomodoro"
                                    : label === "shortBreak"
                                    ? "Short Break"
                                    : "Long Break"}
                            </button>
                        ))}
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
            </main>
            <Footer />
        </div>
    );
};

export default PomodoroTimerApp;
