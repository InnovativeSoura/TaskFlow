import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import socket from "../socket/socket";

function TeamChat() {
  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

  const projectId =
    "YOUR_PROJECT_ID";

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  useEffect(() => {
    loadMessages();

    socket.emit(
      "joinProject",
      projectId
    );

    socket.on(
      "newMessage",
      (
        message
      ) => {
        setMessages(
          (
            prev
          ) => [
            ...prev,
            message,
          ]
        );
      }
    );

    return () => {
      socket.off(
        "newMessage"
      );
    };
  }, []);

  const loadMessages =
    async () => {
      const res =
        await axios.get(
          `http://localhost:5000/api/messages/${projectId}`
        );

      setMessages(
        res.data.messages
      );
    };

  const sendMessage =
    () => {
      socket.emit(
        "sendMessage",
        {
          project:
            projectId,
          sender:
            user._id,
          text,
        }
      );

      setText("");
    };

  return (
    <div>
      <h1>
        Team Chat
      </h1>

      <div>
        {messages.map(
          (
            msg
          ) => (
            <div
              key={
                msg._id
              }
            >
              <strong>
                {
                  msg.sender
                    ?.name
                }
              </strong>

              <p>
                {
                  msg.text
                }
              </p>
            </div>
          )
        )}
      </div>

      <input
        value={text}
        onChange={(
          e
        ) =>
          setText(
            e.target
              .value
          )
        }
      />

      <button
        onClick={
          sendMessage
        }
      >
        Send
      </button>
    </div>
  );
}

export default TeamChat;