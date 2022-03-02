import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import dynamic from "next/dynamic";
import { User, Room } from "../types/LobbyTypes";

import Button from "../components/inputs/Button";
import LobbyScreen from "../components/lobbyScreen";
import QuestionScreen from "../components/questionScreen";

const WheelSpinner = dynamic(
  () => {
    return import("../components/wheelSpinner");
  },
  { ssr: false }
);

type RoomInfo = {
  room: Room;
};

type Question = {
  subject: string;
  level: number;
};

const Room: NextPage = () => {
  const router = useRouter();
  const { socketID } = router.query;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect((): any => {
    const socket = io({ path: "/api/socketio" });
    setSocket(socket);

    if (socket) return () => socket.disconnect();
  }, []);

  // *ISSUE: host does not rejoin if page reloads because socketID from query hasn't loaded yet
  // I can just make a custom button for host to rejoin when query has loaded
  useEffect((): any => {
    if (socket) {
      socket.on("connect", () => {
        console.log("socket connected!", socket.id);
        const userID = localStorage.getItem("hostID");

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
        // console.log(data);
        setUsers(data?.room?.users);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
    }

    if (socket) return () => socket.disconnect();
  }, [socket]);

  const [isHost, setIsHost] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(true);

  useEffect(() => {
    console.log(users);
    if (socket) {
      const hostIndex = users.findIndex((user) => user.isHost === true);
      if (hostIndex > -1) {
        if (users[hostIndex].id === socket.id) {
          setIsHost(true);
        }
      } else {
        console.log(`ERROR: no host found in room`);
      }
    }
  }, [users]);

  useEffect(() => {
    console.log(isHost);
  }, [isHost]);

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    subject: "MATH",
    level: 1,
  });

  // send a request to start the game
  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGameRequest", {
        id: socket.id,
        message: "Attempting to start game",
      });
    } else {
      console.log(`ERROR: socket not connected to make start game`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex mb-4 space-x-2">
        <Button>Show Rules</Button>
        <Button onClick={() => setShowSpinner((prev) => !prev)}>
          Show Spinner
        </Button>
        <Button onClick={handleStartGame}>Start Game</Button>
      </div>
      {!showSpinner && <LobbyScreen socketID={socketID} users={users} />}
      {showSpinner && <WheelSpinner />}
      {showQuestion && <QuestionScreen currentQuestion={currentQuestion} />}
    </div>
  );
};

export default Room;
