import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import mediaRoutes from "../src/routes/mediaRoutes.js";
import { redis } from "../src/config/redis.js";
dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
describe("App Test", () => {
  test("dummy test", () => {
    expect(true).toBe(true);
  });
});

export default app;