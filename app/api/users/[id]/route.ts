import { db } from "@/db";
import { users } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { eq } from "drizzle-orm";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
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

    return apiResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { username, password, full_name, role } = body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return apiError("No data to update", 400);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        role: users.role,
      });

    if (!updatedUser) return apiError("User not found", 404);

    return apiResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Prevent self-deletion if possible (future enhancement)
    
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
