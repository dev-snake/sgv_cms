import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getSession } from '@/services/auth';
import { chatStreamManager } from '@/services/chat-stream';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const messages = await db.query.chatMessages.findMany({
        where: eq(chatMessages.session_id, sessionId),
        orderBy: [asc(chatMessages.created_at)],
    });

    return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
    try {
        const { sessionId, content, isFromWidget, replyToId } = await req.json();

        if (!sessionId || !content) {
            return NextResponse.json(
                { error: 'sessionId and content are required' },
                { status: 400 },
            );
        }

        // Nếu tin nhắn từ widget thì luôn là guest, ngược lại kiểm tra session
        let senderType = 'guest';
        let senderId = null;

        if (!isFromWidget) {
            const adminSession = await getSession();
            if (adminSession?.user) {
                senderType = 'admin';
                senderId = adminSession.user.id;
            }
        }

        // Save message
        const [newMessage] = await db
            .insert(chatMessages)
            .values({
                session_id: sessionId,
                content,
                sender_type: senderType,
                sender_id: senderId,
                reply_to_id: replyToId,
            })
            .returning();

        // Update session last_message_at
        await db
            .update(chatSessions)
            .set({ last_message_at: new Date(), updated_at: new Date() })
            .where(eq(chatSessions.id, sessionId));

        // Broad-cast message via SSE
        chatStreamManager.broadcastMessage(newMessage);

        // If it's a new guest message, notify admins about session update (for ordering)
        if (senderType === 'guest') {
            const session = await db.query.chatSessions.findFirst({
                where: eq(chatSessions.id, sessionId),
            });
            chatStreamManager.broadcastSessionUpdate(session);
        }

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Chat Message Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
