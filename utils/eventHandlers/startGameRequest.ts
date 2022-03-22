import { Socket, Server } from "socket.io";

type gameRequestData = {
  id: string;
  room: string;
  message: string;
};

const startGameHandler = (io: Server, socket: Socket, hostID: string) => {
  const startGameRequest = (data: gameRequestData) => {
    if (data.id === hostID) {
      io.to(data.room).emit("startGameResponse", {
        status: true,
      });
    }
  };

  socket.on("startGameRequest", startGameRequest);
};

const resetGameHandler = (io: Server, socket: Socket, hostID: string) => {
  const resetGameRequest = (data: gameRequestData) => {
    if (data.id === hostID) {
      io.to(data.room).emit("resetGameResponse", {
        status: true,
      });
    }
  };

  socket.on("resetGameRequest", resetGameRequest);
};

const showQuestionHandler = () => {};

export { startGameHandler, resetGameHandler };
