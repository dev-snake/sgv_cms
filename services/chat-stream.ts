import { Server } from 'socket.io';

class ChatStreamManager {
    private get io(): Server | null {
        return (global as any).chatIo || null;
    }

    private set io(val: Server | null) {
        (global as any).chatIo = val;
    }

    setIo(io: Server) {
        this.io = io;
        console.log('Socket.io instance attached to ChatStreamManager');
    }

    broadcastMessage(message: any) {
        if (!this.io) {
            console.error('Socket.io not initialized in ChatStreamManager');
            return;
        }
        console.log(`Broadcasting message: ${message.id} to session ${message.session_id}`);
        this.io.to(message.session_id).emit('message', message);
        if (message.sender_type === 'guest') {
            this.io.to('admins').emit('message', message);
        }
    }

    broadcastMessageUpdate(message: any) {
        if (!this.io) return;
        this.io.to(message.session_id).emit('message_update', message);
        this.io.to('admins').emit('message_update', message);
    }

    broadcastSessionUpdate(session: any) {
        if (!this.io) return;
        this.io.to(session.id).emit('session_update', session);
        this.io.to('admins').emit('session_update', session);
    }

    broadcastSessionRemoval(sessionId: string) {
        if (!this.io) return;
        this.io.to(sessionId).emit('session_removed', { sessionId });
        this.io.to('admins').emit('session_removed', { sessionId });
    }

    broadcastTyping(sessionId: string, senderType: 'guest' | 'admin', isTyping: boolean) {
        if (!this.io) return;
        this.io.to(sessionId).emit('typing', { sessionId, senderType, isTyping });
        if (senderType === 'guest') {
            this.io.to('admins').emit('typing', { sessionId, senderType, isTyping });
        }
    }
}

export const chatStreamManager = new ChatStreamManager();
