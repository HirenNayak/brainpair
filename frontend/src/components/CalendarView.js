import React from "react";
import dayjs from "dayjs";

const CalendarView = ({ dates = [], current }) => {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");
  const daysInMonth = endOfMonth.date();
  const startWeekday = startOfMonth.day(); // 0 = Sunday, 6 = Saturday

  const currentStreakDates = dates.slice(-current);
  const days = [];

  // Fill initial empty slots to align the 1st to correct weekday
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = startOfMonth.date(i).format("YYYY-MM-DD");
    days.push({ day: i, full: dateStr });
  }

  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="grid grid-cols-7 gap-2 w-[320px]">
        {days.map((entry, index) => {
          if (entry === null) {
            return <div key={index} className="w-10 h-10" />; // Empty slot
          }

          const isCurrent = currentStreakDates.includes(entry.full);
          return (
            <div
              key={entry.full}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${isCurrent ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"}`}
            >
              {entry.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
