import mongoose, { ConnectOptions } from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../..";

dotenv.config();

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
