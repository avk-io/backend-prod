const express = require("express")
const router = express.Router()

const{
    signup,
    login,
    refresh
} = require("../controllers/auth.controller")

const validUserCredentials = require("../middleware/middleware2")
const asyncHandler = require("../utils/asyncHandler");


router.post("/signup",validUserCredentials,asyncHandler(signup))
router.post("/login",validUserCredentials,asyncHandler(login))
router.post("/refresh", asyncHandler(refresh));

module.exports = router