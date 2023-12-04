import React, { useEffect } from "react";
import Todo from "./todo";
import { Progress } from "./progress";
import { Input } from "./input";
import { Button } from "./button";
import { PlusIcon } from "@radix-ui/react-icons";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  moveTodo: (id: string, direction: "up" | "down") => void;
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  relativeDate: string;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAdd,
  onRemove,
  onToggle,
  relativeDate,
  setTodos,
}: TodoListProps) => {
  const [newTodoText, setNewTodoText] = React.useState("");
  const [progress, setProgress] = React.useState(13);

  console.log(relativeDate);
  // Calculate the progress of the todo list
  useEffect(() => {
    const completedTodos = todos.filter((todo) => todo.completed).length;
    const totalTodos = todos.length;
    const progressPercentage = (completedTodos / totalTodos) * 100;
    setProgress(progressPercentage);
  }, [todos]);

  const handleAddTodo = () => {
    onAdd(newTodoText);
    setNewTodoText("");
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

  return (
    <div className="flex flex-col">
      <Progress value={progress} className="mt-4 mb-2" />
      {/* List of todos */}
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          text={todo.text}
          completed={todo.completed}
          onRemove={() => onRemove(todo.id)}
          onToggle={() => onToggle(todo.id)}
          onMoveUp={() => moveTodo(todo.id, "up")}
          onMoveDown={() => moveTodo(todo.id, "down")}
        />
      ))}
      <div className="flex mt-2">
        <Input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder={`Add a new todo for ${relativeDate}` || "Add a new todo"}
          className="p-2 border rounded-md"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        />
        <Button
          onClick={handleAddTodo}
          size={"icon"}
          variant={"outline"}
          className="ml-2 p-2 rounded-md"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
