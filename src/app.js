require("dotenv").config();
require("./config/env");



const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const server = http.createServer(app);

const connectDB = require("./config/db");
connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
  credentials: true
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use("/api/v1/auth", authLimiter);

const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const User = require("./models/user.model");
const { error } = require("./utils/response");

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const asyncHandler = require("./utils/asyncHandler");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);

app.get("/api/v1/profile", authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("email role");
  
  if (!user) {
    return error(res, 404, "User not found");
  }

  return res.json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      role:user.role
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});