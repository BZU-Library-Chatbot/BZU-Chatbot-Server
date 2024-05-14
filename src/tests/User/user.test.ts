import dotenv from "dotenv";
import app from "../../..";
import request from "supertest";

dotenv.config();

afterAll(async () => {
    app.close(() => {
        console.log("Server disconnected");
    });
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("Patch /user/updatePassword", () => {
  let variables: any = {};
  beforeAll(async () => {
    const res = await request(app).post("/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    variables.token = res.body.token;
  });
  it.each([
    // Test case 1: Valid password
    [200, process.env.ADMIN_PASSWORD, "newPassword123", "newPassword123"],
    // Test case 2: Invalid password
    [400, "newPassword123", "newPassword123", "newPassword1234"],
    // Test case 3: Password and confirm password do not match
    [400, "newPassword123", "newPassword123", "newPassword"],
    // Test case 4: No numbers in password
    [400, "newPassword123", "newPassword", "newPassword"],
    // Test case 5: No uppercase in password
    [400, "newPassword123", "newpassword", "newpassword"],
  ])(
    "should return %i when given %s, %s, %s as oldPassword, newPassword, cPassword",
    async (
      expected: any,
      oldPassword: any,
      newPassword: any,
      cPassword: any
    ) => {
      let token: any;
      token = process.env.BEARERKEY + variables.token;
      const res = await request(app)
        .patch("/user/updatePassword")
        .set("Authorization", `${token}`)
        .send({ oldPassword, newPassword, cPassword });
      expect(res.statusCode).toBe(expected);
    }
  );
});
