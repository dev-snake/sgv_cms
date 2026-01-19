import { NextRequest } from 'next/server';
import { chatStreamManager } from '@/services/chat-stream';
import { withHybridAuth } from '@/middlewares/middleware';
import { PERMISSIONS } from '@/constants/rbac';
import { apiResponse, apiError } from '@/utils/api-response';

export const POST = withHybridAuth(
    async (req: NextRequest, session) => {
        try {
            const { sessionId, senderType, isTyping } = await req.json();

            if (!sessionId || !senderType) {
                return apiError('Missing sessionId or senderType', 400);
            }

            // If admin is typing, verify permissions
            if (senderType === 'admin') {
                if (!session?.user || !session.user.permissions?.includes(PERMISSIONS.CHAT_VIEW)) {
                    return apiError('Unauthorized', 403);
                }
            }

            chatStreamManager.broadcastTyping(sessionId, senderType, isTyping);

            return apiResponse({ success: true });
        } catch (error) {
            console.error('Typing API Error:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.CHAT_VIEW] },
);
