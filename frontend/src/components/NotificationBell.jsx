import {
  useEffect,
  useState,
} from "react";

import socket from "../socket/socket";

function NotificationBell() {
  const [
    count,
    setCount,
  ] = useState(0);

  useEffect(() => {
    socket.on(
      "taskAssigned",
      () => {
        setCount(
          (prev) => prev + 1
        );
      }
    );

    socket.on(
      "newComment",
      () => {
        setCount(
          (prev) => prev + 1
        );
      }
    );

    return () => {
      socket.off(
        "taskAssigned"
      );

      socket.off(
        "newComment"
      );
    };
  }, []);

  return (
    <div
      style={{
        position:
          "relative",
      }}
    >
      🔔

      {count > 0 && (
        <span
          style={{
            position:
              "absolute",
            top: "-5px",
            right: "-10px",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

export default NotificationBell;