import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signup(email, password) {
  const exists = await prisma.adminUser.findUnique({ where: { email } });
  if (exists) throw new Error("User already exists");
  const hashed = await bcrypt.hash(password, 12);
  return prisma.adminUser.create({ data: { email, hashedPassword: hashed } });
}

export async function login(email, password) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) throw new Error("Invalid credentials");
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return { token };
}
