import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { User, Room } from "../types/LobbyTypes";

import LobbyScreen from "../components/lobbyScreen";

const WheelSpinner = dynamic(
  () => {
    return import("../components/wheelSpinner");
  },
  { ssr: false }
);

type UserDisconnectingData = {
  roomName: string;
  currentSocketID: string;
};

type RoomInfo = {
  room: Room;
};

const socket = io({ path: "/api/socketio" });

const Room: NextPage = () => {
  const router = useRouter();
  const { socketID } = router.query;

  const [users, setUsers] = useState<User[]>([]);

  // *ISSUE: host does not rejoin if page reloads because socketID from query hasn't loaded yet
  // I can just make a custom button for host to rejoin when query has loaded
  useEffect((): any => {
    socket.on("connect", () => {
      console.log("socket connected!", socket.id);

      const userID = localStorage.getItem("hostID");
      // console.log(`userID: ${userID}`);
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
        const username = localStorage.getItem("name");
        socket.emit("userJoin", {
          roomName: socketID,
          currentSocketID: socket.id,
          username: username ? username : null,
        });
      }
    });

    socket.on("roomInfo", (data: RoomInfo) => {
      console.log(data);
      setUsers(data?.room?.users);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const [showSpinner, setShowSpinner] = useState(false);

  const btnClass =
    "outline-none border border-white p-2 rounded-lg hover:bg-gray-500";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex mb-4 space-x-2">
        <button className={btnClass}>Show Rules</button>
        <button
          className={btnClass}
          onClick={() => setShowSpinner((prev) => !prev)}
        >
          Show Spinner
        </button>
      </div>
      {!showSpinner && <LobbyScreen socketID={socketID} users={users} />}
      {showSpinner && <WheelSpinner />}
    </div>
  );
};

export default Room;
