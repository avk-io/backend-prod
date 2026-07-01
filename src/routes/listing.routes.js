const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const {
  getListings,
  getListing,
  createListing,
  deleteListing
} = require("../controllers/listing.controller");

/**
 * @swagger
 * /api/v1/listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: List of all listings
 */
router.get("/", asyncHandler(getListings));

/**
 * @swagger
 * /api/v1/listings/{id}:
 *   get:
 *     summary: Get a single listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing found
 *       404:
 *         description: Listing not found
 */
router.get("/:id", asyncHandler(getListing));

/**
 * @swagger
 * /api/v1/listings:
 *   post:
 *     summary: Create a new listing (sellers only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listing created
 *       403:
 *         description: Only sellers can create listings
 */
router.post("/", authMiddleware, asyncHandler(createListing));

/**
 * @swagger
 * /api/v1/listings/{id}:
 *   delete:
 *     summary: Delete a listing (seller only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing deleted
 *       403:
 *         description: Not authorized
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteListing));

module.exports = router;