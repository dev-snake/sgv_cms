import { db } from "@/db";
import { roles, role_permissions, permissions } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { eq, sql } from "drizzle-orm";
import { withAuth } from "@/middlewares/middleware";
import { RBAC_MANAGEMENT_ROLES, PROTECTED_ROLES } from "@/constants/rbac";

export const GET = withAuth(async (request, session, { params }) => {
  try {
    const { id: roleId } = await params;

    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId));

    if (!role) return apiError("Role not found", 404);

    // Fetch associated permissions
    const rolePermissions = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        module: permissions.module
      })
      .from(role_permissions)
      .innerJoin(permissions, eq(role_permissions.permission_id, permissions.id))
      .where(eq(role_permissions.role_id, roleId));

    return apiResponse({ ...role, permissions: rolePermissions });
  } catch (error) {
    console.error("Error fetching role:", error);
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });

export const PATCH = withAuth(async (request, session, { params }) => {
  try {
    const { id: roleId } = await params;
    const { name, description, permissionIds } = await request.json();

    const updatedRole = await db.transaction(async (tx) => {
      const [role] = await tx
        .update(roles)
        .set({ name, description, updated_at: new Date() })
        .where(eq(roles.id, roleId))
        .returning();

      if (!role) throw new Error("Role not found");

      if (permissionIds && Array.isArray(permissionIds)) {
        // Simple strategy: delete all then insert new ones
        await tx.delete(role_permissions).where(eq(role_permissions.role_id, roleId));
        
        if (permissionIds.length > 0) {
          await tx.insert(role_permissions).values(
            permissionIds.map((pId: string) => ({
              role_id: roleId,
              permission_id: pId,
            }))
          );
        }
      }

      return role;
    });

    return apiResponse(updatedRole);
  } catch (error: any) {
    console.error("Error updating role:", error);
    if (error.message === "Role not found") return apiError("Role not found", 404);
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });

export const DELETE = withAuth(async (request, session, { params }) => {
  try {
    const { id: roleId } = await params;

    // Prevent deleting 'admin' role if needed, or check if it's protected
    const [role] = await db.select().from(roles).where(eq(roles.id, roleId));
    if (role && PROTECTED_ROLES.includes(role.name)) {
      return apiError("Không thể xóa vai trò admin hệ thống", 400);
    }

    const [deletedRole] = await db
      .delete(roles)
      .where(eq(roles.id, roleId))
      .returning();

    if (!deletedRole) return apiError("Role not found", 404);

    return apiResponse({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });
