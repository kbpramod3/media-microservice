import * as mediaService from "../services/mediaService.js";
import { verifyStreamToken } from "../utils/signer.js";


function getIp(req) {
  const fwd = req.headers["x-forwarded-for"] || req.headers["postman-token"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}
export async function addMedia(req, res) {
  try {
    const file = req.file;
    const { mediaId } = req;
    const ownerId = req.user.id;
    if (!file) return res.status(400).json({ error: "File required" });
    const media = await mediaService.addMedia(file, mediaId, ownerId);
    res.status(201).json(media);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getStreamUrl(req, res) {
  try {
    const { id } = req.params;
    const data = await mediaService.getStreamUrl(Number(id));
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function streamMedia(req, res) {
  try {
    const { id } = req.params;
    const { token } = req.query;
    verifyStreamToken(token);
    await mediaService.streamMedia(Number(id), res);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

export async function logView(req, res) {
  try {
    const id = Number(req.params.id);
    const ip = getIp(req);
    const result = await mediaService.logView(id, ip);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAnalytics(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await mediaService.getAnalytics(id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
