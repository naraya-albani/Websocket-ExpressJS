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

  async getMessages(userId: string, withUserId?: string, limit?: number) {
    return prisma.message.findMany({
      where: withUserId
        ? {
            OR: [
              { senderId: userId, recipientId: withUserId },
              { senderId: withUserId, recipientId: userId },
            ],
          }
        : {
            OR: [{ senderId: userId }, { recipientId: userId }],
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
