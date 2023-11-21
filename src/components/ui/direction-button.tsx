import { ArrowRightIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface DirectionButtonProps {
  direction: "left" | "right";
  onClick?: () => void;
}

export function DirectionButton({ direction, onClick }: DirectionButtonProps) {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      {direction === "left" ? (
        <ArrowLeftIcon className="w-4 h-4" />
      ) : (
        <ArrowRightIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
