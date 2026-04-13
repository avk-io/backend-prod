const express = require("express")
const router = express.Router()

const{
    signup,
    login,
    refresh,
    logout
} = require("../controllers/auth.controller")

const validUserCredentials = require("../middleware/middleware2")
const asyncHandler = require("../utils/asyncHandler");


router.post("/signup",validUserCredentials,asyncHandler(signup))
router.post("/login",validUserCredentials,asyncHandler(login))
router.post("/refresh", asyncHandler(refresh));
router.post("/logout",logout)

module.exports = router