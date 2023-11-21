import React, { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import { Textarea } from "@/components/ui/textarea";
import getRelativeDate from "@/lib/getRelativeDate";
import { Separator } from "@/components/ui/separator";
import { DirectionButton } from "@/components/ui/direction-button";
import { Button } from "@/components/ui/button";
import { isToday } from "date-fns";

export default function Dashboard() {
  const [date, setDate] = useState(new Date()); // Initialize with the current date
  const [dailyText, setDailyText] = useState("");
  const [todos, setTodos] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // New state to track initial loading

  const relativeDate = date ? getRelativeDate(date) : "Invalid Date";

  // Format the date into a string key for localStorage
  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const localStorageKey = formatDateString(date || new Date());

  console.log(
    "Component Mounted/Rendered. Current localStorageKey:",
    localStorageKey
  );

  // Load data from localStorage
  useEffect(() => {
    console.log(
      "Attempting to load data from localStorage for key:",
      localStorageKey
    );
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}"
    );
    console.log("Retrieved data from localStorage:", storedData);

    setDailyText(storedData.text || "");
    setTodos(storedData.todos || []);

    setIsInitialLoad(false); // Set loading to false after initial data load
  }, [localStorageKey]);

  useEffect(() => {
    if (!isInitialLoad) {
      // Only save to localStorage if it's not the initial load
      const data = JSON.stringify({ text: dailyText, todos });
      localStorage.setItem(localStorageKey, data);
      console.log(
        "Saved data to localStorage for key:",
        localStorageKey,
        "Data:",
        data
      );
    }
  }, [dailyText, todos, localStorageKey]);

  const handleTextChange = (e) => {
    setDailyText(e.target.value);
    console.log("Text changed:", e.target.value);
  };
  return (
    <>
      <PageHeader>
        <PageHeaderHeading></PageHeaderHeading>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <DirectionButton
              direction="left"
              onClick={() => {
                // set date to previous day
                const newDate = new Date(date || new Date());
                newDate.setDate(newDate.getDate() - 1);
                setDate(newDate);
              }}
            ></DirectionButton>
            {/* container to group date picker and today button */}
            <div className="flex items-center justify-center">
              {date && !isToday(date) && (
                <Button variant="outline" onClick={() => setDate(new Date())}>
                  Today
                </Button>
              )}
              <DatePicker
                date={date || new Date()}
                setDate={setDate}
              ></DatePicker>
            </div>
            <DirectionButton
              direction="right"
              onClick={() => {
                // set date to next day
                const newDate = new Date(date || new Date());
                newDate.setDate(newDate.getDate() + 1);
                setDate(newDate);
              }}
            ></DirectionButton>
          </div>
          <Separator className="my-5"></Separator>
          <CardTitle>{relativeDate}</CardTitle>
          <CardDescription>
            Idea - maybe get a quote or date fact here
          </CardDescription>
          <Textarea
            className="w-full h-32 p-2 rounded-md"
            placeholder="What's on your mind?"
            value={dailyText}
            onChange={handleTextChange}
          ></Textarea>
        </CardHeader>
        <CardDescription></CardDescription>
      </Card>
    </>
  );
}
