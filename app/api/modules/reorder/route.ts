import { db } from '@/db';
import { modules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { apiResponse, apiError } from '@/utils/api-response';
import { withAuth, isAdmin } from '@/middlewares/middleware';
import { auditService } from '@/services/audit-service';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '@/constants/audit';

export const PATCH = withAuth(
    async (request, session) => {
        try {
            const body = await request.json();
            const { items } = body; // Array of { id: string, order: number }

            if (!items || !Array.isArray(items)) {
                return apiError('Dữ liệu không hợp lệ', 400);
            }

            // High-privilege check: Only Admins/SuperAdmins can reorder modules
            if (!isAdmin(session.user)) {
                return apiError('Bạn không có quyền thay đổi thứ tự module', 403);
            }

            // Update in transaction
            await db.transaction(async (tx) => {
                for (const item of items) {
                    if (!item.id) {
                        console.warn('Skipping item with missing ID in reorder');
                        continue;
                    }
                    await tx
                        .update(modules)
                        .set({ order: item.order, updated_at: new Date() })
                        .where(eq(modules.id, item.id));
                }
            });

            // Audit Log
            auditService.logAction({
                userId: session.user.id,
                action: AUDIT_ACTIONS.UPDATE,
                module: AUDIT_MODULES.MODULES,
                description: 'Cập nhật thứ tự các modules',
                request,
            });

            return apiResponse({ message: 'Cập nhật thứ tự thành công' });
        } catch (error: any) {
            console.error('Error reordering modules:', error);
            return apiError(error.message || 'Lỗi máy chủ nội bộ', 500);
        }
    },
    // Requirement for module management is usually ROLES_VIEW in this system
    { requiredPermissions: [] },
);
