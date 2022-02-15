import type { NextPage } from "next";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io({ path: "/api/socketio" });
const Home: NextPage = () => {
  useEffect((): any => {
    socket.on("connect", () => {
      console.log("socket connected!", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    if (socket) return () => socket.disconnect();
  }, [socket]);

  const handleCreateRoom = async () => {
    // const response = await fetch("/api/socketio", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify("created room"),
    // });
    // console.log("clicked");
    socket.emit("test", {
      message: "testinggggg",
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
