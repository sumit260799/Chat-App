require("dotenv").config();
const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, userInfo, socketId) => {
  const checkUser = users.some((u) => u.userId === userId);
  if (!checkUser) {
    users.push({ userId, userInfo, socketId });
    io.emit("getUsers", users);
  }
};

const userRemove = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
  io.emit("getUsers", users);
};

const findFriend = (receiverId) => {
  return users.find((u) => u.userId === receiverId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, userInfo, socket.id);
  });

  socket.on("sendMessage", (data) => {
    const friend = findFriend(data.receiverId);
    if (friend) {
      io.to(friend.socketId).emit("getMessage", data);
    } else {
      console.log(`User ${data.receiverId} is not online or not found.`);
    }
  });

  socket.on("messageSeen", (msg) => {
    const friend = findFriend(msg.senderId);
    if (friend) {
      io.to(friend.socketId).emit("msgSeenResponse", msg);
    } else {
      console.log(
        `messageSeen: User ${msg.receiverId} is not online or not found.`
      );
    }
  });

  socket.on("seen", (data) => {
    const friend = findFriend(data.senderId);
    if (friend) {
      io.to(friend.socketId).emit("seenSuccess", data);
      console.log(
        `Message delivered by ${data.senderId}, notifying ${data.receiverId}`
      );
    } else {
      console.log(`seen: User ${data.receiverId} is not online or not found.`);
    }
  });

  socket.on("typingMessage", (data) => {
    const friend = findFriend(data.receiverId);
    if (friend) {
      io.to(friend.socketId).emit("typingMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        msg: data.msg,
      });
    }
  });
  socket.on("deleteMessage", (data) => {
    const friend = findFriend(data.receiverId);
    if (friend) {
      io.to(friend.socketId).emit("deleteMessageResponse", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    userRemove(socket.id);
  });
});

console.log("Socket.io server running on port 9000");
