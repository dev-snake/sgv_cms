import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { withAuth, withHybridAuth, hasPermission } from '@/middlewares/middleware';
import { chatStreamManager } from '@/services/chat-stream';
import { PERMISSIONS } from '@/constants/rbac';
import { apiResponse, apiError } from '@/utils/api-response';

export const PATCH = withHybridAuth(async (req: NextRequest, session, context) => {
    try {
        const { id } = await (context as any).params;

        // Check for either CHAT_VIEW or CHAT_MANAGEMENT_VIEW if from portal
        const referer = req.headers.get('referer') || '';
        const isPortalRequest = referer.includes('/portal');

        if (isPortalRequest && session?.user) {
            const canUpdateChat =
                hasPermission(session.user, PERMISSIONS.CHAT_VIEW) ||
                hasPermission(session.user, PERMISSIONS.CHAT_MANAGEMENT_VIEW);
            if (!canUpdateChat) {
                return apiError('Forbidden - Required chat permission', 403);
            }
        }

        const { adminLastSeen, guestLastSeen } = await req.json();

        const updateData: any = { updated_at: new Date() };
        if (adminLastSeen) updateData.admin_last_seen_at = new Date();
        if (guestLastSeen) updateData.guest_last_seen_at = new Date();

        const [updatedSession] = await db
            .update(chatSessions)
            .set(updateData)
            .where(eq(chatSessions.id, id))
            .returning();

        if (!updatedSession) {
            return apiError('Session not found', 404);
        }

        // Broadcast session update if needed (e.g., seen status)
        chatStreamManager.broadcastSessionUpdate(updatedSession);

        return apiResponse(updatedSession);
    } catch (error) {
        console.error('Update Session Error:', error);
        return apiError('Internal Server Error', 500);
    }
});

export const DELETE = withAuth(async (_req: NextRequest, session, context) => {
    try {
        const { id } = await (context as any).params;

        // Check for either CHAT_DELETE or CHAT_MANAGEMENT_DELETE
        const canDeleteChat =
            hasPermission(session.user, PERMISSIONS.CHAT_DELETE) ||
            hasPermission(session.user, PERMISSIONS.CHAT_MANAGEMENT_DELETE);

        if (!canDeleteChat) {
            return apiError('Forbidden - Required chat delete permission', 403);
        }

        // Hard delete the session (messages are deleted via cascade reference)
        await db.delete(chatSessions).where(eq(chatSessions.id, id));

        // Notify admins about session removal
        chatStreamManager.broadcastSessionRemoval(id);

        return apiResponse({ success: true });
    } catch (error) {
        console.error('Delete Session Error:', error);
        return apiError('Internal Server Error', 500);
    }
});
