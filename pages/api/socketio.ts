import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "../../types/NextApiResponseServerIO";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

import { addUser, findRoom } from "../../utils/socketio/users";

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

type Room = {
  name: string;
  users: User[];
};

type User = {
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
    const rooms: Room[] = [];
    const users: User[] = [];

    // *usersList EMIT MUST BE A BROADCAST?? EVERYONE ON SOCKET MUST RECIEVE SOMEHOW

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
        const user: User = {
          isHost: true,
          hostID: data.hostID,
          id: data.currentSocketID,
          currentRoom: data.roomName,
        };
        addUser(data.roomName, user, rooms);

        socket.emit("usersList", {
          room: findRoom(data.roomName, rooms),
        });
      });

      socket.on("userJoin", (data: userJoinData) => {
        const user: User = {
          isHost: false,
          id: data.currentSocketID,
          currentRoom: data.roomName,
        };
        addUser(data.roomName, user, rooms);

        socket.emit("usersList", {
          room: findRoom(data.roomName, rooms),
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
