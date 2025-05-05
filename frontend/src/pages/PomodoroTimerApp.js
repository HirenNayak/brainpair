import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button.js";

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