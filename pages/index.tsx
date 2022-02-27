import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

type roomData = {
  host: string;
  roomName: string;
};

// const socket = io({ path: "/api/socketio" });

const Home: NextPage = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): any => {
    const socket = io({ path: "/api/socketio" });
    setSocket(socket);

    if (socket) return () => socket.disconnect();
  }, []);

  useEffect((): any => {
    if (socket) {
      socket.on("connect", () => {
        console.log("socket connected!", socket.id);
      });

      socket.on("roomCreated", (roomData: roomData) => {
        localStorage.setItem("hostID", roomData.host);

        console.log(roomData);
        const { roomName } = roomData;
        router.push(`/${roomName}`);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
    }

    if (socket) return () => socket.disconnect();
  }, [socket]);

  // console.log(localStorage);

  const handleCreateRoom = () => {
    if (socket) {
      socket.emit("createRoomRequest", {
        id: socket.id,
        message: "trying to create room",
      });
    } else {
      console.log(`ERROR, cannot create room, socket does not exist`);
    }
  };

  const handleJoinRoom = () => {
    router.push("/join");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex space-x-4">
        <button
          className="outline-none border border-white p-4 rounded-lg"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          className="outline-none border border-white p-4 rounded-lg"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
