import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BookmarkedNavigationProps {
  className?: string;
}

export default function BookmarkedNavigation({
  className,
}: BookmarkedNavigationProps) {
  const [bookmarkDates, setBookmarkDates] = useState([]);

  useEffect(() => {
    const storedDates = JSON.parse(
      localStorage.getItem("bookmarkDates") || "[]"
    );
    setBookmarkDates(storedDates);
  }, []);

  function formatDateForUrl(dateString: string) {
    // Split the date string into parts
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);

    // Create a new date object with local time
    const date = new Date(year, month, day);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  return (
    <div className={className}>
      {" "}
      <ul>
        {bookmarkDates.map((date, index) => (
          <NavLink
            key={index}
            to={`/${formatDateForUrl(date)}`}
            className={({ isActive }) =>
              cn(
                "block justify-start py-1 h-auto font-normal hover:text-primary",
                isActive ? "text-foreground" : "text-foreground/60"
              )
            }
          >
            {formatDateForUrl(date)}
          </NavLink>
        ))}
      </ul>
    </div>
  );
}
