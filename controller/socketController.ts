// socketController.ts

import { Server, Socket } from "socket.io";

const socketController = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("message", (data: any) => {
      // Handle message logic here
      console.log("Message received:", data);
      // Emit message to other clients
      io.emit("message", data);
    });
  });
};

export default socketController;
