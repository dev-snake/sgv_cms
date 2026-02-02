import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { withHybridAuth, hasPermission } from '@/middlewares/middleware';
import { chatStreamManager } from '@/services/chat-stream';
import { PERMISSIONS } from '@/constants/rbac';
import { apiResponse, apiError } from '@/utils/api-response';

export const GET = withHybridAuth(async (req: NextRequest, session) => {
    // Check permissions only if from portal
    const referer = req.headers.get('referer') || '';
    const isPortalRequest = referer.includes('/portal');

    if (isPortalRequest && session?.user) {
        const canViewChat =
            hasPermission(session.user, PERMISSIONS.CHAT_VIEW) ||
            hasPermission(session.user, PERMISSIONS.CHAT_MANAGEMENT_VIEW);
        if (!canViewChat) {
            return apiError('Forbidden - Required chat permission', 403);
        }
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return apiError('sessionId is required', 400);
    }

    const messages = await db.query.chatMessages.findMany({
        where: eq(chatMessages.session_id, sessionId),
        orderBy: [asc(chatMessages.created_at)],
    });

    return apiResponse(messages);
});

export const POST = withHybridAuth(async (req: NextRequest, session) => {
    try {
        const { sessionId, content, isFromWidget, replyToId } = await req.json();

        if (!sessionId || !content) {
            return apiError('sessionId and content are required', 400);
        }

        // If message is from widget it's always guest, otherwise check session
        let senderType = 'guest';
        let senderId = null;

        if (!isFromWidget && session?.user) {
            // Check permissions only if from portal
            const referer = req.headers.get('referer') || '';
            const isPortalRequest = referer.includes('/portal');

            if (isPortalRequest) {
                const canViewChat =
                    hasPermission(session.user, PERMISSIONS.CHAT_VIEW) ||
                    hasPermission(session.user, PERMISSIONS.CHAT_MANAGEMENT_VIEW);
                if (!canViewChat) {
                    return apiError('Forbidden - Required chat permission', 403);
                }
            }

            senderType = 'admin';
            senderId = session.user.id;
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
            const sessionData = await db.query.chatSessions.findFirst({
                where: eq(chatSessions.id, sessionId),
            });
            chatStreamManager.broadcastSessionUpdate(sessionData);
        }

        return apiResponse(newMessage);
    } catch (error) {
        console.error('Chat Message Error:', error);
        return apiError('Internal Server Error', 500);
    }
});
