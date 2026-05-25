import express from "express";
import { submitQuizResult, getQuizResults, getQuizByCourseId, getAdminQuizByCourseId, addQuestionToQuiz, deleteQuestionFromQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitQuizResult);
router.get("/my-results", protect, getQuizResults);

// Admin Routes for Quiz
router.get("/admin/:courseId", protectAdmin, getAdminQuizByCourseId);
router.post("/admin/:courseId/questions", protectAdmin, addQuestionToQuiz);
router.delete("/admin/:courseId/questions/:questionId", protectAdmin, deleteQuestionFromQuiz);

router.get("/:courseId", protect, getQuizByCourseId);

export default router;
