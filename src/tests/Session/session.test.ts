import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import { after, before } from "node:test";

dotenv.config();

let mongoServer: MongoMemoryServer;

before(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
