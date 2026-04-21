require("dotenv").config();

const requiredEnv = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing`);
  }
});

module.exports = process.env;