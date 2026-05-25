import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import protectedRoutes from "./routes/protectedRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.use(errorHandler);

app.use("api/v1/protected", protectedRoutes);

export default app;
