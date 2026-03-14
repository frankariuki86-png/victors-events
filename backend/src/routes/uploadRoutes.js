import express from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import { config } from "../config.js";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
    }
    return callback(null, true);
  }
});

const extensionByType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

async function uploadToBucket({ bucket, path, file }) {
  return supabase.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
    cacheControl: "3600"
  });
}

router.post("/image", requireAuth, (req, res) => {
  upload.single("image")(req, res, async (uploadError) => {
    if (uploadError) {
      if (uploadError.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image must be 5MB or smaller" });
      }
      return res.status(400).json({ message: uploadError.message || "Invalid upload payload" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please choose an image file to upload" });
    }

    const bucket = config.supabaseStorageBucket;
    const extension = extensionByType[req.file.mimetype] || ".jpg";
    const path = `admin-uploads/${Date.now()}-${randomUUID()}${extension}`;

    try {
      let { error } = await uploadToBucket({ bucket, path, file: req.file });

      if (error && /bucket.*not found/i.test(error.message || "")) {
        const { error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024,
          allowedMimeTypes: [...allowedMimeTypes]
        });

        if (createError) {
          return res.status(500).json({ message: createError.message });
        }

        ({ error } = await uploadToBucket({ bucket, path, file: req.file }));
      }

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return res.status(201).json({ image_url: data.publicUrl, path });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to upload image" });
    }
  });
});

export default router;
