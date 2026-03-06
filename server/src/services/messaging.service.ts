import { prisma } from '../utils/prisma';

export class MessagingService {
  async startConversation(listingId: string, buyerId: string, sellerId: string) {
    return prisma.conversation.upsert({
      where: { id: `${listingId}:${buyerId}` },
      update: {},
      create: { id: `${listingId}:${buyerId}`, listingId, buyerId, sellerId }
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string, attachmentUrl?: string, attachmentType?: string) {
    return prisma.chatMessage.create({
      data: { conversationId, senderId, content, attachmentUrl, attachmentType }
    });
  }
}
