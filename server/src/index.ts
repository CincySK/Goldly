import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { env } from './config/env';
import { registerChatSocket } from './sockets/chat.socket';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
registerChatSocket(io);

httpServer.listen(env.port, () => {
  console.log(`Goldly API listening on ${env.port}`);
});
