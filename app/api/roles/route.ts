import { db } from "@/db";
import { roles, role_permissions } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { desc, eq } from "drizzle-orm";
import { withAuth } from "@/middlewares/middleware";

export const GET = withAuth(async () => {
  try {
    const allRoles = await db
      .select()
      .from(roles)
      .orderBy(desc(roles.created_at));

    return apiResponse(allRoles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });

export const POST = withAuth(async (request) => {
  try {
    const { name, description, permissionIds } = await request.json();

    if (!name) {
      return apiError("Role name is required", 400);
    }

    // Use a transaction to create role and its permissions
    const newRole = await db.transaction(async (tx) => {
      const [insertedRole] = await tx
        .insert(roles)
        .values({ name, description })
        .returning();

      if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
        await tx.insert(role_permissions).values(
          permissionIds.map((pId: string) => ({
            role_id: insertedRole.id,
            permission_id: pId,
          }))
        );
      }

      return insertedRole;
    });

    return apiResponse(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return apiError("Role name already exists", 400);
    }
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });
