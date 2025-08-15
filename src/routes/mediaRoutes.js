import { Router } from "express";
import multer from "multer";
import { addMedia, getStreamUrl, streamMedia, logView, getAnalytics } from "../controllers/mediaController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { uploadMedia } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post("/", requireAuth, uploadMedia.single("file"), addMedia);
router.get("/:id/stream-url", requireAuth, getStreamUrl);
router.get("/:id/stream", streamMedia);
router.post("/:id/view", requireAuth, logView);
router.get("/:id/analytics", requireAuth, getAnalytics);

export default router;
