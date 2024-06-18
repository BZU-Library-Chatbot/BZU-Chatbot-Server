import request from "supertest";
import dotenv from "dotenv";
import app from "../../..";

dotenv.config();

afterAll(async () => {
  app.close(() => {
    console.log("Session Tests Completed");
  });
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("POST /session/message", () => {
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
    // Test case 1: Valid message without sessionId
    [
      "Valid message", // Message
    ],
  ])("The message is %s", async (message) => {
    let token: any;
    token = process.env.BEARERKEY + variables.token;
    const res = await request(app)
      .post("/session/message")
      .set("Authorization", `${token}`)
      .send({ message });
    expect(res.statusCode).toBe(200);
    const { body } = res;
    variables.sessionId = body.sessionId;
  });
  // Test case 2: Valid message and session ID
  it.each([
    [200, "Valid message", true],
    // Test case 3: null message with token
    [400, null, true],
    // Test case 4: empty message and with token
    [400, "", true],
    // Test case 5: Valid message without token
    [400, "Valid message", false],
  ])(
    "should return %i when given %s, %s",
    async (expected, message, hasToken) => {
      let token: any;
      let { sessionId } = variables;
      if (hasToken) {
        token = process.env.BEARERKEY + variables.token;
      }
      const res = await request(app)
        .post("/session/message")
        .set("Authorization", `${token}`)
        .send({ message, sessionId });
      expect(res.statusCode).toBe(expected);
      if (expected == 200) {
        const { body } = res;
        expect(body.sessionId).toBe(sessionId);
      }
    }
  );
});

describe("PATCH /session/title/${sessionId}", () => {
  let variables: any = {};
  beforeAll(async () => {
    let res = await request(app).post("/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    variables.token = process.env.BEARERKEY + res.body.token;
    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "message" });
    variables.sessionId = res.body.sessionId;
  });

  it.each([
    // Test case 1: title without session id
    [400, "New Title"],
  ])("Should return %i, The title is %s", async (expected, title) => {
    const res = await request(app).patch(`/session/title/abc`).send({ title });
    expect(res.statusCode).toBe(expected);
  });

  it.each([
    // Test case 2: title with session id
    [200, "New Title"],
    [400, ""],
  ])("Should return %i, The title is %s", async (expected, title) => {
    let { sessionId } = variables;
    const res = await request(app)
      .patch(`/session/title/${sessionId}`)
      .set("Authorization", `${variables.token}`)
      .send({ title });
    expect(res.statusCode).toBe(expected);
    if (expected === 200) {
      const { body } = res;
      const { sessionTitle } = body;
      expect(sessionTitle).toBe(title);
    }
  });
});

describe("GET /session && GET /session/${sessionId}", () => {
  let variables: any = {};
  beforeAll(async () => {
    let res: any = await request(app).post("/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    variables.token = process.env.BEARERKEY + res.body.token;
    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "message" });
    variables.sessionId = res.body.sessionId;

    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "hi" });
    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "hi" });
    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "hi" });
    res = await request(app)
      .post("/session/message")
      .set("Authorization", `${variables.token}`)
      .send({ message: "hi" });
    variables.sessionId = res.body.sessionId;
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/session/message")
        .set("Authorization", `${variables.token}`)
        .send({ message: `hi ${i}` });
    }
  });
  it("Should return all sessions with status 200", async () => {
    const res = await request(app)
      .get("/session")
      .set("Authorization", `${variables.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sessions");
    expect(Array.isArray(res.body.sessions)).toBe(true);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage", 1);
    expect(res.body).toHaveProperty("totalSessions");
  });

  it("Should return messages of a specific session with status 200", async () => {
    const res = await request(app)
      .get(`/session/${variables.sessionId}`)
      .set("Authorization", `${variables.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("messages");
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage", 1);
    expect(res.body).toHaveProperty("totalMessages");
    expect(res.body.messages.length).toBeGreaterThanOrEqual(1);
  });

  it("Should return 400 if sessionId does not exist", async () => {
    const res = await request(app)
      .get(`/session/invalidSessionId`)
      .set("Authorization", `${variables.token}`);
    expect(res.statusCode).toBe(400);
  });

  it("Should return paginated sessions", async () => {
    const res = await request(app)
      .get("/session")
      .set("Authorization", `${variables.token}`)
      .query({ page: 1, size: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sessions");
    expect(Array.isArray(res.body.sessions)).toBe(true);
    expect(res.body.sessions.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage", 1);
    expect(res.body).toHaveProperty("totalSessions");
  });

  it("Should return paginated messages of a specific session", async () => {
    const res = await request(app)
      .get(`/session/${variables.sessionId}`)
      .set("Authorization", `${variables.token}`)
      .query({ page: 1, size: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("messages");
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage", 1);
    expect(res.body).toHaveProperty("totalMessages");
  });
});
