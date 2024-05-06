import request from "supertest";
import dotenv from "dotenv";
import app from "../../..";

dotenv.config();

describe("POST /session/message", () => {
  let variables: any = {};
  beforeAll(async () => {
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
