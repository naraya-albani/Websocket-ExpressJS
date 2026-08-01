import prisma from "../lib/prisma";

export class ChatRepository {
  async createMessage(data: {
    content: string;
    senderId: string;
    recipientId: string;
  }) {
    return prisma.message.create({
      data,
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getMessages(limit = 50) {
    return prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { sender: { select: { id: true, name: true, email: true } } },
    });
  }

  async getConversation(userA: string, userB: string, limit = 50) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userA, recipientId: userB },
          { senderId: userB, recipientId: userA },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
