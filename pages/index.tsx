import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

type roomData = {
  host: string;
  roomName: string;
};

const socket = io({ path: "/api/socketio" });

const Home: NextPage = () => {
  const router = useRouter();

  useEffect((): any => {
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

    if (socket) return () => socket.disconnect();
  }, []);

  // console.log(localStorage);

  const handleCreateRoom = async () => {
    socket.emit("createRoomRequest", {
      id: socket.id,
      message: "trying to create room",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        className="outline-none border border-white p-4 rounded-lg"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
    </div>
  );
};

export default Home;
