import { User, Room } from "../types/LobbyTypes";

interface Props {
  socketID: string | string[] | undefined;
  users: User[];
}

const LobbyScreen: React.FC<Props> = ({ socketID, users }) => {
  return (
    <div className="border-2 border-white rounded-lg px-12 py-6">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">Room - {socketID}</span>
        <span className="text-xl font-bold mb-6">({users.length})</span>
        <div className="flex flex-col w-full mb-12">
          {users.map((user) => (
            <span key={user.id} className="text-xl">
              {user.username}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;
