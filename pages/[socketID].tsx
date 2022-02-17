import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";

const WheelSpinner = dynamic(
  () => {
    return import("../components/wheelSpinner");
  },
  { ssr: false }
);

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

  return (
    <div>
      <h2>Room Name: {socketID}</h2>
      <WheelSpinner />
    </div>
  );
};

export default Room;
