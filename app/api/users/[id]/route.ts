import { db } from "@/db";
import { users, user_roles, roles } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { eq } from "drizzle-orm";
// @ts-ignore
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/middlewares/middleware";
import { NextRequest } from "next/server";
import { AUTH } from "@/constants/app";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return apiError("User not found", 404);

    // Fetch user roles
    const userRoles = await db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.role_id, roles.id))
      .where(eq(user_roles.user_id, userId));

    return apiResponse({ ...user, roles: userRoles });
  } catch (error) {
    console.error("Error fetching user:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { username, password, full_name, role, roleIds } = body;

    const updatedUser = await db.transaction(async (tx) => {
      const updateData: any = {};
      if (username) updateData.username = username;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (role) updateData.role = role;
      if (password) {
        updateData.password = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS);
      }

      const [user] = await tx
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          username: users.username,
          full_name: users.full_name,
          role: users.role,
        });

      if (!user) throw new Error("User not found");

      if (roleIds && Array.isArray(roleIds)) {
        await tx.delete(user_roles).where(eq(user_roles.user_id, userId));
        if (roleIds.length > 0) {
          await tx.insert(user_roles).values(
            roleIds.map((rId: string) => ({
              user_id: userId,
              role_id: rId,
            }))
          );
        }
      }

      return user;
    });

    return apiResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    
    // Get current user from session
    const session = await verifyAuth(request);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return apiError("Bạn không thể xóa chính tài khoản của mình", 400);
    }
    
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) return apiError("User not found", 404);

    return apiResponse({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return apiError("Internal Server Error", 500);
  }
}
