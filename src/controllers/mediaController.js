import * as mediaService from "../services/mediaService.js";
import { verifyStreamToken } from "../utils/signer.js";

export async function addMedia(req, res) {
  try {
    const { title, type } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File required" });
    const media = await mediaService.addMedia(title, type, file);
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
