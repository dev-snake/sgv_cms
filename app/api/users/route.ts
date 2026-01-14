import { db } from "@/db";
import { users } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { desc } from "drizzle-orm";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function GET() {
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

    return apiResponse(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, full_name, role } = await request.json();

    if (!username || !password) {
      return apiError("Username and password are required", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        full_name,
        role: role || "admin",
      })
      .returning({
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        role: users.role,
      });

    return apiResponse(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return apiError("Username already exists", 400);
    }
    return apiError("Internal Server Error", 500);
  }
}
