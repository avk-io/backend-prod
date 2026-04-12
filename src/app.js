require("dotenv").config();
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(cookieParser())

const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const User = require("./models/user.model");
const { error } = require("./utils/response"); // 

// Routes
const authRoutes = require("./routes/auth.routes");
const asyncHandler = require("./utils/asyncHandler");
app.use("/auth", authRoutes);

// Ping route
app.get("/ping", (req, res) => {
  res.json({
    msg: "ping"
  });
});

// Profile route (cleaned)
app.get("/profile", authMiddleware, asyncHandler(async(req, res) => {
  const user = await User.findById(req.userId);

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


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("MONGO_URI:", process.env.MONGO_URI);