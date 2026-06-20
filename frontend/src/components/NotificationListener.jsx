import { useEffect } from "react";
import socket from "../socket/socket";

function NotificationListener({ userId }) {
  useEffect(() => {
    socket.emit("joinUser", userId);

    socket.on("notification", (data) => {
      alert(`${data.title}: ${data.message}`);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return null;
}

export default NotificationListener;