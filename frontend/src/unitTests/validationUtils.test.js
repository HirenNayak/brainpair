import { isValidEmail } from "../utils/validationUtils";

describe("isValidEmail", () => {
  test("should return true for valid email", () => {
    expect(isValidEmail("student@aut.ac.nz")).toBe(true); 
  });

  test("should return false for missing @ symbol", () => {
    expect(isValidEmail("student.aut.ac.nz")).toBe(false); 
  });

  test("should return false for missing domain", () => {
    expect(isValidEmail("student@")).toBe(false); 
  });

  test("should return false for empty string", () => {
    expect(isValidEmail("")).toBe(false); 
  });

  test("should return false for spaces in email", () => {
    expect(isValidEmail("student @aut.ac.nz")).toBe(false); 
  });
});
