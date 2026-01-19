import { db } from '@/db';
import { roles, permissions, modules } from '@/db/schema';
import { apiResponse, apiError } from '@/utils/api-response';
import { eq, sql } from 'drizzle-orm';
import { withAuth } from '@/middlewares/middleware';
import { PERMISSIONS } from '@/constants/rbac';

export const GET = withAuth(
    async (request, session, { params }) => {
        try {
            const { id: roleId } = await params;

            const [role] = await db.select().from(roles).where(eq(roles.id, roleId));

            if (!role) return apiError('Role not found', 404);

            // Fetch associated permissions (new structure: permissions belong directly to roles)
            const rolePermissions = await db
                .select({
                    id: permissions.id,
                    canView: permissions.can_view,
                    canCreate: permissions.can_create,
                    canUpdate: permissions.can_update,
                    canDelete: permissions.can_delete,
                    module: {
                        id: modules.id,
                        code: modules.code,
                        name: modules.name,
                    },
                })
                .from(permissions)
                .innerJoin(modules, eq(permissions.module_id, modules.id))
                .where(eq(permissions.role_id, roleId));

            return apiResponse({ ...role, permissions: rolePermissions });
        } catch (error) {
            console.error('Error fetching role:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_VIEW] },
);

export const PATCH = withAuth(
    async (request, session, { params }) => {
        try {
            const { id: roleId } = await params;
            const { name, code, description, is_super, permissionsMatrix } = await request.json();

            const [existingRole] = await db.select().from(roles).where(eq(roles.id, roleId));

            // Protection: Prevent renaming the code of system roles (is_super)
            if (existingRole?.is_super && code && code !== existingRole.code) {
                return apiError('Không thể thay đổi mã định danh của vai trò hệ thống', 400);
            }

            const updatedRole = await db.transaction(async (tx) => {
                const [role] = await tx
                    .update(roles)
                    .set({
                        name,
                        ...(existingRole?.is_super ? {} : { code }),
                        description,
                        is_super: is_super !== undefined ? is_super : undefined,
                        updated_at: new Date(),
                    })
                    .where(eq(roles.id, roleId))
                    .returning();

                if (!role) throw new Error('Role not found');

                if (permissionsMatrix && Array.isArray(permissionsMatrix)) {
                    // Delete old permissions for this role
                    await tx.delete(permissions).where(eq(permissions.role_id, roleId));

                    // Insert new ones
                    for (const pm of permissionsMatrix) {
                        await tx.insert(permissions).values({
                            role_id: roleId,
                            module_id: pm.moduleId,
                            can_view: pm.canView || false,
                            can_create: pm.canCreate || false,
                            can_update: pm.canUpdate || false,
                            can_delete: pm.canDelete || false,
                        });
                    }
                }

                return role;
            });

            return apiResponse(updatedRole);
        } catch (error: any) {
            console.error('Error updating role:', error);
            if (error.message === 'Role not found') return apiError('Role not found', 404);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_UPDATE] },
);

export const DELETE = withAuth(
    async (request, session, { params }) => {
        try {
            const { id: roleId } = await params;

            // Prevent deleting protected roles (is_super)
            const [role] = await db.select().from(roles).where(eq(roles.id, roleId));
            if (role && role.is_super) {
                return apiError('Không thể xóa vai trò hệ thống cốt lõi', 400);
            }

            const [deletedRole] = await db.delete(roles).where(eq(roles.id, roleId)).returning();

            if (!deletedRole) return apiError('Role not found', 404);

            return apiResponse({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.ROLES_DELETE] },
);
