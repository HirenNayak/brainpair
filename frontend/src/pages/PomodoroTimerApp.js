import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";

function useTimer(initialTime, onTick) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
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
      <h2 className="text-xl font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        {mode === "pomodoro"
          ? "Pomodoro"
          : mode === "shortBreak"
          ? "Short Break"
          : "Long Break"}
      </h2>
      <p className="text-7xl md:text-8xl lg:text-9xl font-extrabold">{`${minutes}:${secondsLeft}`}</p>
    </div>
  );
};

const TimeControls = ({ isRunning, onStart, onStop, onReset, isResetDisabled }) => (
  <div className="flex justify-center gap-4 mt-4">
    {isRunning ? (
      <button
        onClick={onStop}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
      >
        Stop
      </button>
    ) : (
      <button
        onClick={onStart}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
      >
        Start
      </button>
    )}
    <button
      onClick={onReset}
      disabled={isResetDisabled}
      className={`px-4 py-2 rounded-lg shadow-md ${
        isResetDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Reset
    </button>
  </div>
);

const PomodoroTimerApp = () => {
  const [mode, setMode] = useState("pomodoro");

  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 20,
  });

  const { time, isRunning, start, pause, reset } = useTimer(
    settings.pomodoro * 60,
    (seconds) => {
      if (seconds === 0) {
        playSound();
      }
    }
  );

  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const audioContextRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext)();
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
    reset(settings[newMode] * 60);
  };

  const handleDurationChange = (label, value) => {
    const newSettings = {
      ...settings,
      [label]: Number(value),
    };
    setSettings(newSettings);

    if (label === mode) {
      reset(Number(value) * 60);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main className="flex-grow flex justify-center items-center pt-10">
        <div className="w-full max-w-4xl mx-auto p-10 sm:p-12 md:p-16 lg:p-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-10 tracking-wide drop-shadow-md">
            Pomodoro Timer
          </h1>

          <div className="flex justify-center gap-2 mb-6">
            {["pomodoro", "shortBreak", "longBreak"].map((label) => (
              <button
                key={label}
                onClick={() => handleModeChange(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  mode === label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
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

          <div className="flex justify-center gap-4 mb-6">
            {["pomodoro", "shortBreak", "longBreak"].map((label) => (
              <input
                key={label}
                type="number"
                min="1"
                max="120"
                className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-black dark:text-white"
                value={settings[label]}
                onChange={(e) => handleDurationChange(label, e.target.value)}
                placeholder={`${label} (min)`}
              />
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
    </div>
  );
};

export default PomodoroTimerApp;
