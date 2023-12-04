import React from "react";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TodoProps {
  text: string;
  completed: boolean;
  onRemove: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const Todo: React.FC<TodoProps> = ({
  text,
  onRemove,
  completed,
  onToggle,
  onMoveUp,
  onMoveDown,
}) => {
  const [textLengthThreshold, setTextLengthThreshold] = React.useState(50);
  const [isIndented, setIsIndented] = React.useState(false);

  const handleToggle = () => {
    onToggle();
  };

  const toggleIndent = () => {
    setIsIndented(!isIndented);
  };

  const baseThreshold = 50;

  // Scaling factor - determines how much the threshold will increase per pixel
  const scalingFactor = 0.025;

  React.useEffect(() => {
    const handleResize = () => {
      // Calculate the dynamic threshold based on screen width
      const dynamicThreshold =
        baseThreshold + window.innerWidth * scalingFactor;

      // Set the threshold, ensuring it doesn't go below the base threshold
      setTextLengthThreshold(Math.max(baseThreshold, dynamicThreshold));
    };

    // Call handleResize initially to set the threshold based on the current screen width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isTextLong = text.length > textLengthThreshold;

  return (
    <TooltipProvider>
      <Tooltip>
        <div>
          <div
            className={`flex items-center justify-between space-x-2 flex-row w-full ${
              isIndented ? "w-[96%] ml-auto" : ""
            }`}
          >
            <div className="flex flex-row items-center justify-start flex-grow w-9/12">
              <Checkbox id={text} checked={completed} onClick={handleToggle} />
              {isTextLong && (
                <TooltipContent className="w-80">
                  <p>{text}</p>
                </TooltipContent>
              )}
              <TooltipTrigger asChild>
                <div className="flex flex-row w-9/12">
                  <label
                    htmlFor={text}
                    className="text-sm ml-2 select-none whitespace-nowrap overflow-ellipsis overflow-clip"
                  >
                    {text}
                  </label>
                </div>
              </TooltipTrigger>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleIndent}
              className="hover:opacity-100 opacity-20"
            >
              {isIndented ? (
                <ChevronLeftIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              className="hover:opacity-100 opacity-20"
            >
              <ChevronUpIcon className="cursor-pointer" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              className="hover:opacity-100 opacity-20"
            >
              <ChevronDownIcon className="cursor-pointer" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Cross2Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Todo;
