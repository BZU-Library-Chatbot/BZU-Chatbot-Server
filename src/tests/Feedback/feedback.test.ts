import request from "supertest";
import dotenv from "dotenv";
import app from "../../..";

dotenv.config();

afterAll(async () => {
    app.close(() => {
      console.log("Feedback Tests Completed");
    });
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

describe("DELETE /feedback/:feedbackId", () => {
    let variables: any = {};
    beforeAll(async () => {
      const r = await request(app).post("/auth/login").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      let res = await request(app).post("/auth/login").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      variables.token = process.env.BEARERKEY + res.body.token;
  
      res = await request(app).post("/session/message").set("Authorization", `${variables.token}`).send({
        message : "Hi there !"
      });
      
      variables.interactionId = res.body._id;
      
      res = await request(app).post(`/feedback/${variables.interactionId}`).set("Authorization", `${variables.token}`).send({
        text:"nice",
        rating:3
      });
   
      variables.feedbackId = res.body.feedback._id;
    });
  
    it("should return 400 if feedback does not exist", async () => {
      await request(app)
        .delete(`/feedback/98765ml24567890f`)
        .set("Authorization", `${variables.token}`)
        .expect(400);
    });
  
    it("should delete feedback and return status 200", async () => {
      const response = await request(app)
        .delete(`/feedback/${variables.feedbackId}`)
        .set("Authorization", `${variables.token}`)
        .expect(200);
      
      expect(response.body.message).toEqual("Feedback deleted successfully");
    });
  });