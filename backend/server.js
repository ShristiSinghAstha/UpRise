import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import courseRoutes from './routes/courseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import userStatsRoutes from './routes/userStatsRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import seedDatabase from './seedData.js';
import { metricsMiddleware, metricsEndpoint } from './utils/metrics.js';
import morgan from 'morgan';
import { logger, morganStream } from './utils/logger.js';

dotenv.config();

// Ensure required environment variables are set
if (!process.env.JWT_SECRET) {
    logger.error("FATAL ERROR: JWT_SECRET is not defined in the environment variables.");
    process.exit(1);
}

logger.info("Initializing database connection...");
connectDB().then(() => {
    logger.info("Database connection completed, checking/running database seeding...");
    seedDatabase();
});

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus metrics middleware (placed early to measure all routes)
app.use(metricsMiddleware);

// Expose metrics route
app.get('/api/v1/metrics', metricsEndpoint);

// Morgan HTTP Request Logger (piped into Winston stream)
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', { stream: morganStream }));

// Security Middlewares
app.use(helmet());
app.use(compression());

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});
app.use('/api', apiLimiter);


// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://up-craft-a-skill-learning-platform.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());

app.use(express.json());

// Routes
app.use('/api/v1/users', authRoutes); // Changed from /api/v1 meant for auth, let's keep it clean or alias
app.use('/api/v1', authRoutes); // Keep legacy /api/v1/login working
app.use('/api/v1/protected', protectedRoutes); // Add protected routes

app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/user', userStatsRoutes);

app.get('/', (req, res) => {
    res.send('UpRise API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});