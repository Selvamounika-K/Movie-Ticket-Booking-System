export const seatSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("seatLocked", (data) => {
      socket.broadcast.emit("seatUpdate", data);
    });
  });
};
