import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "../../types/NextApiResponseServerIO";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

import { addUser, removeUser, findRoom } from "../../utils/socketio/users";
import {
  startGameHandler,
  resetGameHandler,
} from "../../utils/eventHandlers/startGameRequest";
import { User, Room } from "../../types/LobbyTypes";

export const config = {
  api: {
    bodyParser: false,
  },
};

type roomRequestData = {
  id: string;
  message: string;
};

type gameRequestData = {
  id: string;
  message: string;
};

type userJoinData = {
  hostID?: string;
  roomName: string;
  currentSocketID: string;
  username?: string;
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

    let hostID: string;
    let roomName: string;
    const rooms: Room[] = [];

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

      startGameHandler(io, socket, hostID);
      resetGameHandler(io, socket, hostID);

      socket.on("hostJoin", (data: userJoinData) => {
        const user: User = {
          isHost: true,
          hostID: data.hostID,
          id: data.currentSocketID,
          currentRoom: data.roomName,
          username: "Host",
        };
        socket.join(data.roomName);
        addUser(data.roomName, user, rooms);

        io.to(data.roomName).emit("roomInfo", {
          room: findRoom(data.roomName, rooms),
        });
      });

      socket.on("userJoin", (data: userJoinData) => {
        const user: User = {
          isHost: false,
          id: data.currentSocketID,
          currentRoom: data.roomName,
          username: data.username
            ? data.username
            : `Guest ${data.currentSocketID.slice(0, 4)}`,
        };
        socket.join(data.roomName);
        addUser(data.roomName, user, rooms);

        io.to(data.roomName).emit("roomInfo", {
          room: findRoom(data.roomName, rooms),
        });
      });

      // we have to remove the user on the server and relay the updated users
      socket.on("disconnecting", () => {
        const arrRooms = Array.from(socket.rooms);
        for (let i = 0; i < arrRooms.length; i++) {
          if (rooms.map((room) => room.name).includes(arrRooms[i])) {
            removeUser(arrRooms[i], socket.id, rooms);
            io.to(arrRooms[i]).emit("roomInfo", {
              room: findRoom(arrRooms[i], rooms),
            });
          }
        }
      });

      socket.on("disconnect", () => {
        console.log(`[SOCKET]: ${socket.id} has disconnected`);
      });
    });
  }
  res.end();
};

export default socketHandler;
