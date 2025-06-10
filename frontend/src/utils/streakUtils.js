import { format, subDays } from "date-fns";

export function calculateStudyStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  const formattedDates = new Set(dates); // Faster lookup
  let streak = 0;

  for (let i = 0; i < 100; i++) {
    const dateToCheck = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (formattedDates.has(dateToCheck)) {
      streak++;
    } else {
      // Allow skipping today
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}
