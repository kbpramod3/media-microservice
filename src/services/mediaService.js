import { prisma } from "../config/prisma.js";
import path from "path";
import fs from "fs";
import mime from "mime";
import { createStreamToken } from "../utils/signer.js";

export async function addMedia(file, mediaId, ownerId) {
  const title = path.basename(file.originalname, path.extname(file.originalname));
  const mimeType = mime.getType(file.originalname) || "application/octet-stream";

  let type;
  if (mimeType.startsWith("video/")) {
    type = "video";
  } else if (mimeType.startsWith("audio/")) {
    type = "audio";
  } else {
    throw new Error("Only video or audio files are allowed");
  }
  const fileUrl = `/uploads/media/${mediaId}${path.extname(file.originalname)}`;
  return prisma.mediaAsset.create({
    data: { title, type, fileUrl, ownerId }
  });
}

export async function getStreamUrl(mediaId) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");
  const token = createStreamToken(mediaId);
  const backendUrl = process.env.BASE_URL || "http://localhost:5000";
  return { url: `${backendUrl}/media/${mediaId}/stream?token=${token}` };
}

export async function streamMedia(mediaId, res) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");

  const filePath = path.join(process.cwd(), media.fileUrl);
  if (!fs.existsSync(filePath)) throw new Error("File missing");

  const fileStream = fs.createReadStream(filePath);
  res.setHeader("Content-Type", mime.getType(filePath) || "application/octet-stream");
  res.setHeader("Content-Disposition", `inline; filename="${media.title}"`);
  fileStream.pipe(res);
}

export async function logView(mediaId, ip) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");
  await prisma.mediaViewLog.create({
    data: { mediaId, viewedByIp: ip }
  });
  return { ok: true };
}

export async function getAnalytics(mediaId) {
  const media = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
  if (!media) throw new Error("Media not found");
  const totalViews = await prisma.mediaViewLog.count({ where: { mediaId } });
  const distinctIps = await prisma.mediaViewLog.findMany({
    where: { mediaId },
    select: { viewedByIp: true },
    distinct: ["viewedByIp"]
  });
  const perDayRows = await prisma.$queryRaw`
    SELECT DATE(timestamp) AS day, COUNT(*) AS views
    FROM MediaViewLog
    WHERE mediaId = ${mediaId}
    GROUP BY day
    ORDER BY day
  `;
  const viewsPerDay = Object.fromEntries(
    perDayRows.map(r => [new Date(r.day).toISOString().slice(0,10), Number(r.views)])
  );
  return {
    total_views: totalViews,
    unique_ips: distinctIps.length,
    views_per_day: viewsPerDay
  };
}
