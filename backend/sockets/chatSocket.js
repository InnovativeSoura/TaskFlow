const Message = require(
  "../models/Message"
);

const chatSocket = (io) => {
  io.on(
    "connection",
    (socket) => {
      socket.on(
        "joinProject",
        (
          projectId
        ) => {
          socket.join(
            projectId
          );
        }
      );

      socket.on(
        "sendMessage",
        async (
          data
        ) => {
          const message =
            await Message.create(
              data
            );

          const populated =
            await Message.findById(
              message._id
            ).populate(
              "sender",
              "name profileImage"
            );

          io.to(
            data.project
          ).emit(
            "newMessage",
            populated
          );
        }
      );

      socket.on(
        "typing",
        (
          projectId
        ) => {
          socket
            .to(
              projectId
            )
            .emit(
              "userTyping"
            );
        }
      );
    }
  );
};

module.exports =
  chatSocket;