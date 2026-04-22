const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWU4ZGYwMDE2NmZiYmM0ZTczMTM5MmYiLCJpYXQiOjE3NzY4Njk4OTQsImV4cCI6MTc3Njg3MDc5NH0.JN-iaVKgI-GEqc1twXix24HZG7mGu_RNYpHRAdCeGOg";

try {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log("VALID:", decoded);
} catch (err) {
  console.log("INVALID:", err.message);
}