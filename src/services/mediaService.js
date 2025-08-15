import { prisma } from "../config/prisma.js";
import path from "path";
import fs from "fs";
import { createStreamToken } from "../utils/signer.js";

export async function addMedia(title, type, file) {
  const fileUrl = `/uploads/media/${file.filename}`;
  return prisma.mediaAsset.create({
    data: { title, type, fileUrl }
  });
}

export async function getStreamUrl(mediaId) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");
  const token = createStreamToken(mediaId);
  return { url: `/media/${mediaId}/stream?token=${token}` };
}

export async function streamMedia(mediaId, res) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");

  const filePath = path.join(process.cwd(), media.fileUrl);
  if (!fs.existsSync(filePath)) throw new Error("File missing");

  res.sendFile(filePath);
}
