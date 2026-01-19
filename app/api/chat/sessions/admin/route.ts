import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { withAuth } from '@/middlewares/middleware';
import { PERMISSIONS } from '@/constants/rbac';
import { apiResponse, apiError } from '@/utils/api-response';

export const GET = withAuth(
    async (req: NextRequest) => {
        try {
            const sessions = await db.query.chatSessions.findMany({
                orderBy: [desc(chatSessions.last_message_at)],
            });

            return apiResponse(sessions);
        } catch (error) {
            console.error('Chat Sessions Admin Error:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.CHAT_VIEW] },
);
