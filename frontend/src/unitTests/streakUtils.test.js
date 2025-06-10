import { calculateStudyStreak } from "../utils/streakUtils";
import { format, subDays } from "date-fns";

describe("calculateStudyStreak", () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const twoDaysAgo = format(subDays(new Date(), 2), "yyyy-MM-dd");

  test("should return 3 for three consecutive days", () => {
    const dates = [twoDaysAgo, yesterday, today];
    expect(calculateStudyStreak(dates)).toBe(3);
  });

  test("should return 1 if only today is present", () => {
    const dates = [today];
    expect(calculateStudyStreak(dates)).toBe(1);
  });

  test("should return 2 if today is missing but yesterday and day before are present", () => {
    const dates = [twoDaysAgo, yesterday];
    expect(calculateStudyStreak(dates)).toBe(2);
  });

  test("should return 0 if no recent dates match", () => {
    const dates = ["2022-01-01"];
    expect(calculateStudyStreak(dates)).toBe(0);
  });

  test("should return 0 for empty input", () => {
    const dates = [];
    expect(calculateStudyStreak(dates)).toBe(0);
  });
});
