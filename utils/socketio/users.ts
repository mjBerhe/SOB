import { User, Room } from "../../types/LobbyTypes";

export const addUser = (roomName: string, newUser: User, rooms: Room[]) => {
  // first check if room exists
  const roomIndex = rooms.findIndex((room) => room.name === roomName);
  if (roomIndex === -1) {
    // room not found
    console.log(`Error, [room]:${roomName} not found `);
    return;
  }
  if (roomIndex >= 0) {
    // room found > check if newUser is already inside the room
    const userIndex = rooms[roomIndex].users.findIndex(
      (user) => user.id === newUser.id
    );
    if (userIndex >= 0) {
      // newUser is already inside room
      console.log(
        `Error, [user]:${newUser.id} is already inside room, cannot join again`
      );
      return;
    }
    if (userIndex === -1) {
      // newUser is not inside room
      rooms[roomIndex].users.push(newUser);
      return;
    }
  }
};

export const removeUser = (
  roomName: string,
  existingUserID: string,
  rooms: Room[]
) => {
  // first check if room exists
  const roomIndex = rooms.findIndex((room) => room.name === roomName);
  if (roomIndex === -1) {
    console.log(`Error, [room]:${roomName} not found `);
    return;
  }
  if (roomIndex >= 0) {
    // find user in room
    const userIndex = rooms[roomIndex].users.findIndex(
      (user) => user.id === existingUserID
    );
    if (userIndex === -1) {
      console.log(`Error, [user]: ${existingUserID} not found`);
      return;
    }
    // if user is found in room, remove user
    if (userIndex >= 0) {
      const tempUsers = rooms[roomIndex].users;
      tempUsers.splice(userIndex, 1);
      rooms[roomIndex].users = tempUsers;
      return;
    }
  }
};

export const findRoom = (roomName: string, rooms: Room[]): Room | null => {
  const roomIndex = rooms.findIndex((room) => room.name === roomName);
  if (roomIndex >= 0) {
    return rooms[roomIndex];
  }
  if (roomIndex === -1) {
    console.log(`Error, [room]:${roomName} cannot be found`);
  }
  return null;
};
