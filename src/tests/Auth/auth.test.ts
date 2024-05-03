import request from "supertest";
import dotenv from "dotenv";
import app from "../../..";

dotenv.config();

describe("POST /auth/signup", () => {
  it.each([
    [400, "Aziza", "azizagmail.com", "password123", "password123"], // Invalid email format
    [201, "Aziza", "azizakarakra7@gmail.com", "password123", "password123"], // Valid input
    [
      400,
      "Existing User",
      "azizakarakra7@gmail.com",
      "existingpassword",
      "existingpassword",
    ], // Email already exists
    [400, "User", "user@example.com", "password123", "password456"], // Passwords don't match
    [400, "User", "user@example.com", "abc", "abc"], // Password too short
    [400, "", "user@example.com", "abcabcabcabc", "abcabcabcabc"], //Empty username
    [400, "User", "", "password123", "password123"], //Empty email
    [400, "User", "user@example.com", "", "password456"], //Empty password
    [400, "User", "user@example.com", "password123", ""],//Empty Cpassword
    [400, "User", "user@example.com", "", ""], //Empty password & empty Cpassword
    [400, "", "", "", ""], //Empty fileds 
    [400, "", "", "password123", "password123"], //Empty username & email
  ])(
    "should return %i when given %s, %s, %s, %s",
    async (expected, userName, email, password, cPassword) => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ userName, email, password, cPassword });
      expect(res.statusCode).toBe(expected);
    }
  );
});
