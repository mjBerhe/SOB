import { Server as ServerIO, Socket } from "socket.io";

type gameRequestData = {
  id: string;
  message: string;
};

const startGameHandler = (io: ServerIO, socket: Socket) => {
  const startGameRequest = (data: gameRequestData) => {
    // if (data.id === hostID) {
    // }
  };

  socket.on("startGameRequest", startGameRequest);
};

export default startGameHandler;
