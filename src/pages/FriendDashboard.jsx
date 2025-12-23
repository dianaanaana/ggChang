import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";

export default function FriendDashboard() {
  const { friendId } = useParams();

  return <Dashboard userId={friendId} isFriend />;
}
