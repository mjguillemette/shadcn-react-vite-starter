function getRelativeDate(date: Date) {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date provided to getRelativeDate");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of the day

  const comparisonDate = new Date(date.getTime());
  comparisonDate.setHours(0, 0, 0, 0); // Also reset time for the date to compare

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to format date as 'Day mm/dd/yyyy'
  const formatDate = (date: Date) => {
    return `${dayNames[date.getDay()]} ${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
  };

  if (comparisonDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  console.warn("date", comparisonDate);
  console.warn("today", today);
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const differenceInDays = Math.round(
    (Number(comparisonDate) - Number(today)) / oneDay
  );

  if (differenceInDays === -1) {
    return "Yesterday";
  } else if (differenceInDays === 1) {
    return "Tomorrow";
  } else {
    // Calculate the start and end of the current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Calculate the start and end of the next and last week
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

    if (comparisonDate < today) {
      if (
        comparisonDate >= startOfLastWeek &&
        comparisonDate <= endOfLastWeek
      ) {
        return "Last " + dayNames[comparisonDate.getDay()];
      } else if (
        // If the date is within the current week, return the day name
        comparisonDate >= startOfWeek &&
        comparisonDate <= endOfWeek
      ) {
        // return just Tuesday, Wednesday, etc.
        return dayNames[comparisonDate.getDay()];
      } else {
        return formatDate(comparisonDate);
      }
    } else {
      if (
        comparisonDate >= startOfNextWeek &&
        comparisonDate <= endOfNextWeek
      ) {
        return "Next " + dayNames[comparisonDate.getDay()];
      } else {
        return formatDate(comparisonDate);
      }
    }
  }
}

export default getRelativeDate;
