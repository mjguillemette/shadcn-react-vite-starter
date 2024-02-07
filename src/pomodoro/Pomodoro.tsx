import React, { useState, useEffect } from "react";
import "./pomodoro.css";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layouts/Header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Pomodoro = () => {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(1500);
    setIsActive(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="pomodoro-container">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pomodoro-timer">{formatTime(time)}</div>
        <div className="pomodoro-controls">
          <Button onClick={startTimer}>Start</Button>
          <Button onClick={stopTimer}>Stop</Button>
          <Button onClick={resetTimer}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pomodoro;
