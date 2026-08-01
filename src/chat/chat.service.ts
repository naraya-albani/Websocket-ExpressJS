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

  async getRecentMessages(limit?: number) {
    const messages = await this.chatRepository.getMessages(limit);
    return messages.reverse(); // urutkan dari lama ke baru
  }

  async getConversation(userA: string, userB: string, limit?: number) {
    const messages = await this.chatRepository.getConversation(
      userA,
      userB,
      limit,
    );
    return messages.reverse();
  }
}
