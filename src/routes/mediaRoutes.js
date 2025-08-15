import { Router } from "express";
import multer from "multer";
import { addMedia, getStreamUrl, streamMedia } from "../controllers/mediaController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();
const upload = multer({ dest: "uploads/media" });

router.post("/", requireAuth, upload.single("file"), addMedia);
router.get("/:id/stream-url", requireAuth, getStreamUrl);
router.get("/:id/stream", streamMedia);

export default router;
