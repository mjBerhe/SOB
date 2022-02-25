export type User = {
  isHost: boolean;
  hostID?: string;
  id: string;
  username: string;
  currentRoom: string;
};

export type Room = {
  name: string;
  users: User[];
};
