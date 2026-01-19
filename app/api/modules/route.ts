import { db } from '@/db';
import { modules } from '@/db/schema';
import { apiResponse, apiError } from '@/utils/api-response';
import {  PERMISSIONS } from '@/constants/rbac';
import { sql, asc } from 'drizzle-orm';
import { withAuth } from '@/middlewares/middleware';

export const GET = withAuth(
    async () => {
        try {
            const allModules = await db.select().from(modules).orderBy(asc(modules.code));

            return apiResponse(allModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);

export const POST = withAuth(
    async (request) => {
        try {
            const body = await request.json();
            const { name, code, icon, route, order } = body;

            if (!name || !code) {
                return apiError('Thiếu tên hoặc mã module', 400);
            }

            // Check if code already exists
            const existing = await db
                .select()
                .from(modules)
                .where(sql`${modules.code} = ${code}`);

            if (existing.length > 0) {
                return apiError('Mã module đã tồn tại', 400);
            }

            const [newModule] = await db
                .insert(modules)
                .values({
                    name,
                    code: code
                        .toUpperCase()
                        .replace(/\s+/g, '_')
                        .replace(/[^A-Z0-9_]/g, ''),
                    icon: icon || null,
                    route: route || null,
                    order: parseInt(order) || 0,
                })
                .returning();

            return apiResponse(newModule, { status: 201 });
        } catch (error) {
            console.error('Error creating module:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);
