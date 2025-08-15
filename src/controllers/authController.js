import * as authService from "../services/authService.js";
import { redis } from "../config/redis.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.signup(email, password);
    res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = jwt.decode(token);
    if (!decoded?.exp) return res.status(400).json({ message: "Invalid token" });

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    await redis.set(`bl_${token}`, "1", "EX", ttl);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
