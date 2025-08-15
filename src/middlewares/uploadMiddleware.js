import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = "uploads/media";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    req.mediaId = id;
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  }
});

export const uploadMedia = multer({ storage });
