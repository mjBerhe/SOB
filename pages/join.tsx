import type { NextPage } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";

import Button from "../components/inputs/Button";

const Join: NextPage = () => {
  const router = useRouter();

  let getName;
  if (typeof window !== "undefined") {
    getName = localStorage?.getItem("name");
  }
  const [name, setName] = useState(getName ? getName : "");
  const [roomCode, setRoomCode] = useState("");

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setName(e.currentTarget.value);
    localStorage.setItem("name", e.currentTarget.value);
  };

  const handleJoinRoom = (): void => {
    router.push(`/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-4 border border-white rounded-lg p-8">
        <div>
          <h2>Enter Name</h2>
          <input
            type="text"
            placeholder="Jimmy"
            className="bg-gray-300 outline-none p-4 h-12 text-black"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <h2>Enter Room Code</h2>
          <input
            type="text"
            placeholder="ABCD"
            className="bg-gray-300 outline-none p-4 h-12 text-black"
            value={roomCode}
            onChange={(e) => setRoomCode(e.currentTarget.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button className="w-full h-12" onClick={handleJoinRoom}>
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Join;
