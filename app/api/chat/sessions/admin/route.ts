import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { withAuth, hasPermission } from '@/middlewares/middleware';
import { PERMISSIONS } from '@/constants/rbac';
import { apiResponse, apiError } from '@/utils/api-response';

export const GET = withAuth(async (req: NextRequest, session) => {
    // Check for either CHAT_VIEW or CHAT_MANAGEMENT_VIEW
    const canViewChat =
        hasPermission(session.user, PERMISSIONS.CHAT_VIEW) ||
        hasPermission(session.user, PERMISSIONS.CHAT_MANAGEMENT_VIEW);

    if (!canViewChat) {
        return apiError('Forbidden - Required chat permission', 403);
    }

    try {
        const sessions = await db.query.chatSessions.findMany({
            orderBy: [desc(chatSessions.last_message_at)],
        });

        return apiResponse(sessions);
    } catch (error) {
        console.error('Chat Sessions Admin Error:', error);
        return apiError('Internal Server Error', 500);
    }
});
