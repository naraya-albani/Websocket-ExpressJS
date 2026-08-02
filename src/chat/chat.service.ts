import { ChatRepository } from "./chat.repository";

export class ChatService {
  private chatRepository = new ChatRepository();

  async sendMessage(senderId: string, recipientId: string, content: string) {
    if (!content?.trim()) throw new Error("Pesan tidak boleh kosong");
    return this.chatRepository.createMessage({
      content,
      senderId,
      recipientId,
    });
  }

  async getConversation(userA: string, userB: string, limit?: number) {
    const messages = await this.chatRepository.getMessages(userA, userB, limit);
    return messages.reverse();
  }

  async getContacts(userId: string) {
    const messages = await this.chatRepository.getMessages(userId);

    const contactsMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        lastMessage: string;
        lastMessageAt: Date;
      }
    >();

    for (const msg of messages) {
      const other = msg.senderId === userId ? msg.recipient : msg.sender;

      if (!contactsMap.has(other.id)) {
        contactsMap.set(other.id, {
          id: other.id,
          name: other.name,
          email: other.email,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
        });
      }
    }

    return Array.from(contactsMap.values());
  }
}
