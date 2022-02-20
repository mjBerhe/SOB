import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";

const WheelSpinner = dynamic(
  () => {
    return import("../components/wheelSpinner");
  },
  { ssr: false }
);

type user = {
  isHost: boolean;
  hostID?: string;
  id: string;
  currentRoom: string;
};

const socket = io({ path: "/api/socketio" });

const Room: NextPage = () => {
  const router = useRouter();
  const { socketID } = router.query;

  const [users, setUsers] = useState<user[]>([]);

  // *ISSUE: host does not rejoin if page reloads because socketID from query hasn't loaded yet
  // I can just make a custom button for host to rejoin when query has loaded
  useEffect((): any => {
    socket.on("connect", () => {
      console.log("socket connected!", socket.id);

      const userID = localStorage.getItem("hostID");
      console.log(`userID: ${userID}`);
      if (socket?.id && userID?.slice(0, 4) === socketID) {
        // console.log("This is the host");
        socket.emit("hostJoin", {
          hostID: userID,
          roomName: socketID,
          currentSocketID: socket.id,
        });
      }
      if (socket?.id && userID?.slice(0, 4) !== socketID) {
        // console.log("Not host");
        socket.emit("userJoin", {
          roomName: socketID,
          currentSocketID: socket.id,
        });
      }
    });

    socket.on("usersList", (data) => {
      console.log(data);
      setUsers(data.room.users);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    if (socket) return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2>Room Name: {socketID}</h2>
      {/* <WheelSpinner /> */}
      <div>
        <span>Users in room:</span>
        <div className="flex flex-col">{users.map((user) => user.id)}</div>
      </div>
    </div>
  );
};

export default Room;
