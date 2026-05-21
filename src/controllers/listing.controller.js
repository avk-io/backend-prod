const Listing = require("../models/listing.model");
const { success, error } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

// GET all listings
exports.getListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find()
    .populate("seller", "email")
    .sort({ createdAt: -1 });

  return success(res, listings);
});

// GET single listing
exports.getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("seller", "email");

  if (!listing) {
    return error(res, 404, "Listing not found");
  }

  return success(res, listing);
});

// POST create listing
exports.createListing = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body;

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    seller: req.userId
  });

  return success(res, listing);
});

// DELETE listing
exports.deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return error(res, 404, "Listing not found");
  }

  if (listing.seller.toString() !== req.userId) {
    return error(res, 403, "Not authorized");
  }

  await listing.deleteOne();
  return success(res, { msg: "Listing deleted" });
});