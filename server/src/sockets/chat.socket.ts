import { Server } from 'socket.io';
import { MessagingService } from '../services/messaging.service';

export const registerChatSocket = (io: Server) => {
  const messagingService = new MessagingService();

  io.on('connection', (socket) => {
    socket.on('chat:join', (conversationId: string) => socket.join(conversationId));

    socket.on('chat:message', async (payload: { conversationId: string; senderId: string; content: string; attachmentUrl?: string; attachmentType?: string }) => {
      const message = await messagingService.sendMessage(payload.conversationId, payload.senderId, payload.content, payload.attachmentUrl, payload.attachmentType);
      io.to(payload.conversationId).emit('chat:new-message', message);
    });
  });
};
