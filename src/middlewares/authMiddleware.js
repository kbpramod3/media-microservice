import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redis } from "../config/redis.js";
dotenv.config();

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
