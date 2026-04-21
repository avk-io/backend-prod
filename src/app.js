require("dotenv").config();
require("./config/env");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

const connectDB = require("./config/db");
connectDB();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, try again later"
  }
});

app.use("/auth", authLimiter);

const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const User = require("./models/user.model");
const { error } = require("./utils/response");

const authRoutes = require("./routes/auth.routes");
const asyncHandler = require("./utils/asyncHandler");

app.use("/auth", authRoutes);

app.get("/profile", authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("email");

  if (!user) {
    return error(res, 404, "User not found");
  }

  return res.json({
    success: true,
    data: {
      userId: user._id,
      email: user.email
    }
  });
}));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorMiddleware);

const initSocket = require("./sockets");
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});