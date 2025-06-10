import { isMutualMatch } from "../utils/matchHandler";


describe("isMutualMatch", () => {
  test("should return true if both users liked each other", () => {
    const swipeData = {
      userA: ["userB"],
      userB: ["userA"]
    };
    expect(isMutualMatch("userA", "userB", swipeData)).toBe(true); 
  });

  test("should return false if only one user liked the other", () => {
    const swipeData = {
      userA: ["userB"],
      userB: []
    };
    expect(isMutualMatch("userA", "userB", swipeData)).toBe(false);
  });

  test("should return false if neither user liked the other", () => {
    const swipeData = {
      userA: [],
      userB: []
    };
    expect(isMutualMatch("userA", "userB", swipeData)).toBe(false);
  });
});
