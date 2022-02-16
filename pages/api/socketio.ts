import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "../../types/NextApiResponseServerIO";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

type roomRequestData = {
  id: string;
  message: string;
};

const socketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      socket.on("createRoomRequest", (data: roomRequestData) => {
        console.log(data);

        const roomName = data.id.slice(0, 4);

        socket.join(roomName);
        socket.emit("roomCreated", {
          host: socket.id,
          roomName: roomName,
        });
      });

      socket.on("disconnect", () => {
        console.log(`disconnecting ${socket.id}`);
      });
    });
  }
  res.end();
};

export default socketHandler;
