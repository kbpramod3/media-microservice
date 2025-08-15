import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
//import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/resumes", express.static(path.join(__dirname, "uploads", "resumes")));

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Media Backend API is running 🚀" });
});

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
//app.use("/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
