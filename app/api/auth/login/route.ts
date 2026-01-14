import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { login, generateTokens } from "@/services/auth";
import { apiResponse, apiError } from "@/utils/api-response";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return apiError("Username and password are required", 400);
    }

    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
      return apiError("Invalid username or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return apiError("Invalid username or password", 401);
    }

    // Success
    const sessionUser = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    };

    // Generate Tokens
    const { accessToken, refreshToken } = await generateTokens(sessionUser);

    // Set Cookies
    const { setAuthCookies } = await import("@/services/auth");
    await setAuthCookies(accessToken, refreshToken);

    // Prepare session for cookie (backward compatibility for middleware)
    await login(sessionUser);

    return apiResponse({ 
      user: sessionUser
    });
  } catch (error) {
    console.error("Login Error:", error);
    return apiError("Internal Server Error", 500);
  }
}
