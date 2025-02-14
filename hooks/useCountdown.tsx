import { useState, useEffect, useCallback } from 'react';

interface CountdownHookProps {
  initialMinutes: number;
}

interface CountdownHookResult {
  formattedTime: string;
  start: () => void;
  stop: () => void;
  restart: () => void;
  reset: () => void;
  isDone: boolean;
}

const useCountdown = ({ initialMinutes }: CountdownHookProps): CountdownHookResult => {
  const [remainingTime, setRemainingTime] = useState(initialMinutes * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [formattedTime, setFormattedTime] = useState(formatTime(initialMinutes * 60));

  const start = useCallback(() => {
    setIsActive(true);
    setIsDone(false)
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setRemainingTime(initialMinutes * 60);
    setIsDone(false)
    setFormattedTime(formatTime(initialMinutes * 60));
  }, [initialMinutes]);

  const restart = useCallback(() => {
    reset()
    start()
  }, [initialMinutes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const tick = () => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1;
        setFormattedTime(formatTime(newTime));
        return newTime;
      });
    };

    if (isActive && remainingTime > 0) {
      timer = setInterval(tick, 1000);
    } else if (isActive && remainingTime === 0) {
      setIsActive(false);
      setIsDone(true)
    }

    return () => clearInterval(timer);
  }, [isActive, remainingTime]);

  useEffect(() => {
    start();
  }, []);

  return {
    formattedTime,
    start,
    stop,
    restart,
    reset,
    isDone
  };
};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default useCountdown;
