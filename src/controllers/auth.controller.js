const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('node:crypto');
const User = require("../models/user.model");

const { success, error } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return error(res, 400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  return success(res, {
    userId: user._id,
    email: user.email
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return error(res, 404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return error(res, 401, "Invalid credentials");
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id},
      process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: "168h"}
  )

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  user.refreshTokenHash = refreshTokenHash
  await user.save()

  res.cookie("refreshToken",refreshToken,{
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7*24*60*60*1000
  })

  return success(res, { accessToken });
};

exports.refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return error(res, 401, "Missing Refresh Token");
  }

  let decoded;  
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return error(res, 401, "Invalid/Expired refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return error(res, 404, "User not found");
  }

  const incomingHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  if (incomingHash !== user.refreshTokenHash) {
    return error(res, 401, "Refresh Token mismatch");
  }

  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "168h" }
  );

  const newHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");


  user.refreshTokenHash = newHash;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  return success(res, { accessToken });
});

exports.logout = asyncHandler(async(req,res)=>{
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken){
    return success(res,{msg:"Logged Out"})
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

  const user = await User.findById(decoded.userId)

  if(user){
    user.refreshTokenHash = null
    await user.save()
  }

  res.clearCookie("refreshToken")

  return success(res,{msg:"Logged Out"})
})