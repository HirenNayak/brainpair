import { hasCommonInterest } from "../utils/matchUtils";

describe("hasCommonInterest", () => {
  test("should return true if users share one interest", () => {
    const userA = { interests: ["JavaScript", "Cybersecurity"] };
    const userB = { interests: ["Cybersecurity", "Data Structures"] };
    expect(hasCommonInterest(userA, userB)).toBe(true); 
  });

  test("should return false if no interests match", () => {
    const userA = { interests: ["Java"] };
    const userB = { interests: ["React"] };
    expect(hasCommonInterest(userA, userB)).toBe(false); 
  });

  test("should return false if one user has no interests", () => {
    const userA = { interests: [] };
    const userB = { interests: ["Machine Learning"] };
    expect(hasCommonInterest(userA, userB)).toBe(false); 
  });

  test("should return false if interests are missing", () => {
    const userA = {};
    const userB = {};
    expect(hasCommonInterest(userA, userB)).toBe(false); 
  });
});
