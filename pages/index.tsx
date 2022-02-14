import type { NextPage } from "next";
import { io } from "socket.io-client";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect((): any => {
    const socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      console.log("socket connected!", socket.id);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button className="outline-none border border-white p-4 rounded-lg">
        Create Room
      </button>
    </div>
  );
};

export default Home;
