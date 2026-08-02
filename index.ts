import express, { type Request, type Response } from "express";
import { createServer } from "http";
import userController from "./src/user/user.controller";
import { Server } from "socket.io";
import chatController, { registerChatSocket } from "./src/chat/chat.controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userController);
app.use("/chat", chatController);

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

registerChatSocket(io);

server.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

app.use(express.static("public"));
