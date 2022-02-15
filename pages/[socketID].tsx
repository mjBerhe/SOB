import type { NextPage } from "next";
import { useRouter } from "next/router";

const Room: NextPage = () => {
  const router = useRouter();
  const { socketID } = router.query;

  return <div>Room Name: {socketID}</div>;
};

export default Room;
