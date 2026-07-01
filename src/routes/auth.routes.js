const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/auth.validator");

const { signup, login, refresh, logout } = require("../controllers/auth.controller");
const asyncHandler = require("../utils/asyncHandler");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts" }
});

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller]
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", validate(signupSchema), asyncHandler(signup));

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns access token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(login));

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns new access token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", asyncHandler(refresh));

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", asyncHandler(logout));

module.exports = router;