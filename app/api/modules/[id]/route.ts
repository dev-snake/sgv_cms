import { db } from '@/db';
import { modules } from '@/db/schema';
import { apiResponse, apiError } from '@/utils/api-response';
import { PERMISSIONS, PROTECTED_MODULES } from '@/constants/rbac';
import { eq } from 'drizzle-orm';
import { withAuth } from '@/middlewares/middleware';

export const GET = withAuth(
    async (request, session, { params }) => {
        try {
            const { id } = await params;
            const [module] = await db.select().from(modules).where(eq(modules.id, id));

            if (!module) {
                return apiError('Không tìm thấy module', 404);
            }

          return apiResponse(module);
        } catch (error) {
            console.error('Error fetching module:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);

export const PATCH = withAuth(
    async (request, session, { params }) => {
        try {
            const { id } = await params;
            const body = await request.json();
            const { name, code, icon, route, order } = body;

            const [updatedModule] = await db
                .update(modules)
                .set({
                    ...(name && { name }),
                    ...(code && {
                        code: code
                            .toUpperCase()
                            .replace(/\s+/g, '_')
                            .replace(/[^A-Z0-9_]/g, ''),
                    }),
                    ...(icon !== undefined && { icon: icon || null }),
                    ...(route !== undefined && { route: route || null }),
                    ...(order !== undefined && { order: parseInt(order) || 0 }),
                    updated_at: new Date(),
                })
                .where(eq(modules.id, id))
                .returning();

            if (!updatedModule) {
                return apiError('Không tìm thấy module', 404);
            }

            return apiResponse(updatedModule);
        } catch (error) {
            console.error('Error updating module:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);

export const DELETE = withAuth(
    async (request, session, { params }) => {
        try {
            const { id } = await params;

            // Fetch module info
            const [module] = await db.select().from(modules).where(eq(modules.id, id));

            if (!module) {
                return apiError('Không tìm thấy module', 404);
            }

            // Protection: Check if it's a hardcoded protected module (System Module)
            if (PROTECTED_MODULES.includes(module.code)) {
                return apiError('Đây là module hệ thống, không thể xóa', 403);
            }

            const [deletedModule] = await db.delete(modules).where(eq(modules.id, id)).returning();

            return apiResponse(null, { status: 200 });
        } catch (error) {
            console.error('Error deleting module:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);
