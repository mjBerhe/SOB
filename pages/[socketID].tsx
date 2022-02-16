import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

type socketInfo = {
  host: string;
  roomName: string;
};

const Room: NextPage = () => {
  const router = useRouter();
  const { socketID } = router.query;

  useEffect(() => {
    const userID = localStorage.getItem("hostID");
    if (userID?.slice(0, 4) === socketID) {
      console.log("This is the host");
    } else {
      console.log("Not host");
    }
  }, [socketID]);

  return <div>Room Name: {socketID}</div>;
};

export default Room;
