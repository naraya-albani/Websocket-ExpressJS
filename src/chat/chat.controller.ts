import { Router, type Request, type Response } from "express";
import { Server, type Socket } from "socket.io";
import { ChatService } from "./chat.service";

const router = Router();
const chatService = new ChatService();

// REST endpoint: ambil riwayat chat (misal untuk load awal sebelum connect socket)
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const { userA, userB } = req.query;

    if (
      !userA ||
      !userB ||
      typeof userA !== "string" ||
      typeof userB !== "string"
    ) {
      res.status(400).json({ message: "userA dan userB wajib diisi" });
      return;
    }

    const messages = await chatService.getConversation(userA, userB);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Registrasi event socket.io untuk fitur chat real-time
export function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`[chat] client terhubung: ${socket.id}`);

    // client join dengan userId -> masuk ke room pribadi bernama userId-nya sendiri
    socket.on("chat:join", (payload: { userId: string }) => {
      socket.data.userId = payload.userId;
      socket.join(payload.userId); // room = userId, supaya bisa ditarget langsung
      console.log(`[chat] ${socket.id} join sebagai user ${payload.userId}`);
    });

    // ambil riwayat percakapan spesifik dengan 1 user lain
    socket.on("chat:history", async (payload: { withUserId: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) {
        socket.emit("chat:error", {
          message: "Belum join, panggil chat:join dulu",
        });
        return;
      }

      const history = await chatService.getConversation(
        currentUserId,
        payload.withUserId,
      );
      socket.emit("chat:history", history);
    });

    // kirim pesan ke user tertentu (bukan broadcast ke semua)
    socket.on(
      "chat:message",
      async (payload: { recipientId: string; content: string }) => {
        const senderId = socket.data.userId;

        if (!senderId) {
          socket.emit("chat:error", {
            message: "Belum join, panggil chat:join dulu",
          });
          return;
        }

        try {
          const message = await chatService.sendMessage(
            senderId,
            payload.recipientId,
            payload.content,
          );

          // kirim ke room pengirim & penerima saja (bukan semua client)
          io.to(senderId).to(payload.recipientId).emit("chat:message", message);
        } catch (err) {
          socket.emit("chat:error", { message: (err as Error).message });
        }
      },
    );

    socket.on("disconnect", (reason) => {
      console.log(`[chat] client terputus: ${socket.id}, alasan: ${reason}`);
    });
  });
}

export default router;
