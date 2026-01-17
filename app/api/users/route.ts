import { db } from "@/db";
import { users, user_roles, roles } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { desc, eq } from "drizzle-orm";
// @ts-ignore
import bcrypt from "bcryptjs";
import { withAuth } from "@/middlewares/middleware";
import { NextRequest } from "next/server";
import { PERMISSIONS } from "@/constants/rbac";
import { AUTH } from "@/constants/app";

// GET /api/users - List all users with their roles
export const GET = withAuth(async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(desc(users.created_at));

    // Fetch roles for each user
    const usersWithRoles = await Promise.all(
      allUsers.map(async (user) => {
        const userRoles = await db
          .select({
            id: roles.id,
            name: roles.name,
          })
          .from(user_roles)
          .innerJoin(roles, eq(user_roles.role_id, roles.id))
          .where(eq(user_roles.user_id, user.id));
        
        return { ...user, roles: userRoles };
      })
    );

    return apiResponse(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.USERS_READ] });

// POST /api/users - Create a new user
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { username, password, full_name, role, roleIds } = await request.json();

    if (!username || !password) {
      return apiError("Username and password are required", 400);
    }

    const hashedPassword = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS);

    const newUser = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          full_name,
          role: role || AUTH.DEFAULT_ROLE, // Keep for backward compatibility
        })
        .returning({
          id: users.id,
          username: users.username,
          full_name: users.full_name,
          role: users.role,
        });

      if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
        await tx.insert(user_roles).values(
          roleIds.map((rId: string) => ({
            user_id: user.id,
            role_id: rId,
          }))
        );
      }

      return user;
    });

    return apiResponse(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return apiError("Username already exists", 400);
    }
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.USERS_WRITE] });
