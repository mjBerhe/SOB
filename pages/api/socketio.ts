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

type userJoinData = {
  hostID?: string;
  roomName: string;
  currentSocketID: string;
};

type room = {
  name: string;
  users: user[];
};

type user = {
  isHost: boolean;
  hostID?: string;
  id: string;
  currentRoom: string;
};

// need to make rooms = { roomName: [users here] }

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

    let hostID: string;
    let roomName: string;
    const rooms: room[] = [];
    const users: user[] = [];

    io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      // we can send back an emit to check if this connection was a host or not?
      // them recieve back the info to add them as host

      socket.on("createRoomRequest", (data: roomRequestData) => {
        console.log(data);

        hostID = socket.id;
        roomName = data.id.slice(0, 4);

        rooms.push({ name: roomName, users: [] });

        socket.join(roomName);
        socket.emit("roomCreated", {
          host: socket.id,
          roomName: roomName,
        });
      });

      socket.on("hostJoin", (data: userJoinData) => {
        // find the room in rooms and then add the user
        // *MAKE FUNCTION FOR THIS LIKE addUser(roomName, user)
        users.push({
          isHost: true,
          hostID: data.hostID,
          id: data.currentSocketID,
          currentRoom: data.roomName,
        });

        socket.emit("usersList", {
          users: users,
        });
      });

      socket.on("userJoin", (data: userJoinData) => {
        users.push({
          isHost: false,
          id: data.currentSocketID,
          currentRoom: data.roomName,
        });

        socket.emit("usersList", {
          users: users,
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
