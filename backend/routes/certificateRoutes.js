
import express from "express";
import { createCertificate, getCertificate, getCertificatesByUser } from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, createCertificate);
router.get("/my", protect, getCertificatesByUser);
router.get("/:id", getCertificate);


export default router;
