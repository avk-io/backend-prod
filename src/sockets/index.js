const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("message", (msg) => {
        console.log("msg:", msg);
        socket.broadcast.emit("message", msg);
});

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};