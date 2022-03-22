import { Socket, Server } from "socket.io";

type gameRequestData = {
  id: string;
  room: string;
  message: string;
};

const startGameHandler = (io: Server, socket: Socket, hostID: string) => {
  const startGameRequest = (data: gameRequestData) => {
    if (data.id === hostID) {
      io.to(data.room).emit("response:startGame", {
        status: true,
      });
    }
  };

  socket.on("request:startGame", startGameRequest);
};

const resetGameHandler = (io: Server, socket: Socket, hostID: string) => {
  const resetGameRequest = (data: gameRequestData) => {
    if (data.id === hostID) {
      io.to(data.room).emit("response:resetGame", {
        status: true,
      });
    }
  };

  socket.on("request:resetGame", resetGameRequest);
};

const nextQuestionHandler = (io: Server, socket: Socket, hostID: string) => {
  const nextQuestionRequest = (data: gameRequestData) => {
    if (data.id === hostID) {
      io.to(data.room).emit("response:nextQuestion", {
        status: true,
      });
    }
  };

  socket.on("request:nextQuestion", nextQuestionRequest);
};

export { startGameHandler, resetGameHandler, nextQuestionHandler };
