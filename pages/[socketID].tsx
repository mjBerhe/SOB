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

type User = {
  isHost: boolean;
  hostID?: string;
  id: string;
  username: string;
  currentRoom: string;
};

type Room = {
  name: string;
  users: User[];
};

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

  const removeUser = (userID: string, users: User[]) => {
    console.log(users);
    const tempUsers = users;
    console.log(tempUsers);
    const userIndex = tempUsers.findIndex((user) => user.id === userID);
    console.log(userIndex);
    if (userIndex >= 0) {
      tempUsers.splice(userIndex, 1);
      // setUsers(tempUsers);
    } else {
      console.log(`ERROR, can not remove [user]: ${userID} from room`);
    }
  };

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

    socket.on("userDisconnecting", (data: UserDisconnectingData) => {
      // removeUser function
      console.log(data.roomName);
      removeUser(data.currentSocketID, users);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2>Room Name: {socketID}</h2>
      {/* <WheelSpinner /> */}
      <div>
        <span>Users in room:</span>
        <div className="flex flex-col">
          {users.map((user) => (
            <div key={user.id}>{user.username}</div>
          ))}
        </div>
        <button
          className="outline-none border border-white"
          onClick={() => console.log(users)}
        >
          Check Users
        </button>
      </div>
    </div>
  );
};

export default Room;
