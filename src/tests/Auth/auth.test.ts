import request from "supertest";
import dotenv from "dotenv";
import app from "../../..";

dotenv.config();

afterAll(async () => {
  app.close(() => {
    console.log("Auth Tests Completed");
  });
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("POST /auth/login", () => {
  let variables: any = {};
  it.each([
    [400, "Aziza", "azizagmail.com", "password123", "password123"], // Invalid email format
    [201, "Aziza", "azizakarakra7@gmail.com", "Password123", "Password123"], // Valid input
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
    [400, "User", "user@example.com", "password123", ""], //Empty Cpassword
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

  it.each([
    [400, "azizagmail.com", "password123"], // Invalid email format
    [400, "mayarkarakra@gmail.com", "password123"], // Invalid credentials (email not registered)
    [400, "azizakarakra7@gmail.com", ""], // Password is not provided
    [400, "", "aziza0000000"], // Email is not provided
    [400, "azizakarakra7@gmail.com", "Password123"], // Registered but not confirmed
    [200, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD], // Valid input
    [400, process.env.ADMIN_EMAIL, "password123765"], // Incorrect Password
  ])(
    "should return %i when given %s, %s",
    async (expected, email, password) => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email, password });
      expect(res.statusCode).toBe(expected);
      if (expected == 200) {
        variables.refreshToken = res.body.refreshToken;
      }
    }
  );
  it.each([
    [400, ""], // Empty refreshToken
    [
      400,
      process.env.BEARERKEY +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MjZhNGNhMGU5NTdlMjY4ggggggggggggggggggggggggggoxNzEzODEzOTY2fQ.pvEPu437RLxr5euEit3RBRTX4bQZ46OvAceJKj0b1Bo",
    ], // Invalid refreshToken format
    [200, variables["refreshToken"]], // Valid refreshToken
  ])("should return %i when given %s", async (expected, refreshToken) => {
    if (expected == 200) {
      refreshToken = process.env.BEARERKEY + variables.refreshToken;
    }
    const res = await request(app).post("/auth/refresh").send({ refreshToken }); // sending refreshToken in the request body
    expect(res.statusCode).toBe(expected);
  });
});

describe("PATCH /auth/sendCode", () => {
  it.each([
    [200, process.env.ADMIN_EMAIL], // Valid input
    [404, "tariqquraan@gmail.com"], // Email does not exist
  ])("should return status %i for email: %s", async (expected, email) => {
    const response = await request(app)
      .patch("/auth/sendCode")
      .send({ email })
      .expect(expected);

    if (expected == 200) {
      expect(response.body.message).toEqual("success");
    } else {
      expect(response.body.message).toEqual("catch error");
    }
  });
});

describe("GET /admin", () => {
  let variables: any = {};
  beforeAll(async () => {
    const r = await request(app).post("/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    const res = await request(app).post("/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    variables.token = res.body.token;
  });

  it.each([
    // Valid inputs
    [200, 10, 1, true],
    [200, 10, 1, false],
    [200, 10, 2, null],
    // Invalid inputs
    [400, 10, 0, true],
    [400, 0, 1, true],
    [400, 0, 0, true],
    [400, -1, 1, true],
    [400, 10, -1, true],
    [400, "invalid", 1, true],
    [400, 10, "invalid", true],
    // Edge cases
    [200, 1, 1, true],
    [200, 100, 1, true],
    [200, 10, 1, false],
  ])(
    "should return %i when given limit: %i, page: %i, active: %s",
    async (expected, limit, page, active) => {
      const token: any = process.env.BEARERKEY + variables.token;
      let res;
      if (active) {
        res = await request(app)
          .get("/auth/admin")
          .set("Authorization", `${token}`)
          .query({ limit, page, active });
      } else {
        res = await request(app)
          .get("/auth/admin")
          .set("Authorization", `${token}`)
          .query({ limit, page });
      }
      expect(res.statusCode).toBe(expected);

      if (expected === 200) {
        expect(res.body).toHaveProperty("message", "success");
        expect(res.body).toHaveProperty("admins");
        expect(Array.isArray(res.body.admins)).toBe(true);
        expect(res.body).toHaveProperty("totalPages");
        expect(res.body).toHaveProperty("totalAdmins");
        expect(res.body).toHaveProperty("currentPage", page);
      }
    }
  );
});
