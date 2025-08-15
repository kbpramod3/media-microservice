import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createStreamToken(mediaId) {
  return jwt.sign({ m: mediaId }, process.env.STREAM_SECRET, { expiresIn: "10m" });
}

export function verifyStreamToken(token) {
  return jwt.verify(token, process.env.STREAM_SECRET);
}
