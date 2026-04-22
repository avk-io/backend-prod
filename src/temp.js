require("dotenv").config();
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWU4ZGYwMDE2NmZiYmM0ZTczMTM5MmYiLCJpYXQiOjE3NzY4NzAyMTksImV4cCI6MTc3Njg3MTExOX0.tDyhZfk3ydx9uayhg4kismB_-ZmVRBbfNgy-SyiwJAw"
  }
});

socket.on("connect", () => {
  console.log("✅ Connected");
});

socket.on("connect_error", (err) => {
  console.log("❌ Failed:", err.message);
});