import React, { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import { Textarea } from "@/components/ui/textarea";
import getRelativeDate from "@/lib/getRelativeDate";
import { Separator } from "@/components/ui/separator";
import { DirectionButton } from "@/components/ui/direction-button";
import { Button } from "@/components/ui/button";
import TodoList from "@/components/ui/todo-list";
import { isToday } from "date-fns";
import { BookmarkIcon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { TodoItem } from "@/components/ui/todo-list";
import { SelectSingleEventHandler } from "react-day-picker";
import { ResetIcon } from "@radix-ui/react-icons";
import { useParams } from "react-router-dom";
import { clear } from "console";

export default function Dashboard() {
  const params = useParams();
  const [date, setDate] = useState(new Date());
  const [dailyText, setDailyText] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [bookmarkDates, setBookmarkDates] = useState<string[]>([]);

  useEffect(() => {
    const newUrlDate = params.date
      ? new Date(params.date + "T00:00")
      : new Date();
    setDate(newUrlDate);

    const localStorageKey = formatDateString(newUrlDate);
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}"
    );
    setDailyText(storedData.text || "");
    setTodos(storedData.todos || []);
  }, [params.date]);

  useEffect(() => {
    const storedDates = JSON.parse(
      localStorage.getItem("bookmarkDates") || "[]"
    );
    setBookmarkDates(storedDates);
  }, [date]);
  console.log(bookmarkDates);
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("bookmarkDates", JSON.stringify(bookmarkDates));
    }
  }, [bookmarkDates, isInitialLoad]);

  const relativeDate = date ? getRelativeDate(date) : "Today";

  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const localStorageKey = formatDateString(date);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}"
    );
    setDailyText(storedData.text || "");
    setTodos(storedData.todos || []);
    setIsInitialLoad(false);
  }, [localStorageKey]);

  useEffect(() => {
    if (!isInitialLoad) {
      const data = JSON.stringify({ text: dailyText, todos });
      localStorage.setItem(localStorageKey, data);
    }
  }, [dailyText, todos, localStorageKey, isInitialLoad]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDailyText(e.target.value);
  };

  const addTodo = (text: string) => {
    const newTodo = { id: generateId(), text, completed: false };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const moveTodo = (id: string, direction: "up" | "down") => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (
      index < 0 ||
      (direction === "up" && index === 0) ||
      (direction === "down" && index === todos.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newTodos = [...todos];
    [newTodos[index], newTodos[newIndex]] = [
      newTodos[newIndex],
      newTodos[index],
    ];
    setTodos(newTodos);
  };

  const handleDateChange: SelectSingleEventHandler = (
    newDate: Date | undefined
  ) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <>
      <PageHeader>
        <PageHeaderHeading />
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-row">
            <div className="flex-col">
              <CardTitle className="text-lg">{relativeDate}</CardTitle>
              <CardDescription>
                Idea - maybe get a quote or date fact here
              </CardDescription>
            </div>

            <Button
              className="ml-auto"
              style={{
                border: bookmarkDates.includes(formatDateString(date))
                  ? "none"
                  : "1px solid #00000010",
                transform: bookmarkDates.includes(formatDateString(date))
                  ? "translateY(-2.46em) scale(1.8)"
                  : "none",
                transition: "all 0.2s ease",
              }}
              size="icon"
              variant={
                bookmarkDates.includes(formatDateString(date))
                  ? "filled"
                  : "outline"
              }
              onClick={() => {
                const newBookmarkDates = bookmarkDates.includes(
                  formatDateString(date)
                )
                  ? bookmarkDates.filter(
                      (bookmarkDate) => bookmarkDate !== formatDateString(date)
                    )
                  : [...bookmarkDates, formatDateString(date)];
                setBookmarkDates(newBookmarkDates);
              }}
            >
              {bookmarkDates.includes(formatDateString(date)) ? (
                <BookmarkFilledIcon />
              ) : (
                <BookmarkIcon />
              )}
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-4">
          <div className="flex flex-row items-center justify-between ">
            <DirectionButton
              direction="left"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(newDate.getDate() - 1);
                setDate(newDate);
              }}
            />
            <div className="flex items-center justify-center mx-2">
              {date && !isToday(date) && (
                <Button
                  variant="outline"
                  className="mr-2"
                  size={"icon"}
                  onClick={() => setDate(new Date())}
                >
                  <ResetIcon />
                </Button>
              )}
              <DatePicker date={date} setDate={handleDateChange} />
            </div>
            <DirectionButton
              direction="right"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(newDate.getDate() + 1);
                setDate(newDate);
              }}
            />
          </div>
        </CardContent>
        <Separator />
        <CardContent>
          <TodoList
            todos={todos}
            onAdd={addTodo}
            onRemove={removeTodo}
            onToggle={toggleTodo}
            moveTodo={moveTodo}
            setTodos={setTodos}
            relativeDate={relativeDate}
          />
        </CardContent>
        <Separator />
        <CardContent>
          <div className="flex-col pt-4 w-full">
            Notes:
            <Textarea
              className="w-full h-32 rounded-md"
              placeholder="What's on your mind?"
              value={dailyText}
              onChange={handleTextChange}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
