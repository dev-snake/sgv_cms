import { logout } from "@/lib/auth";
import { apiResponse } from "@/lib/api-response";

export async function POST() {
  await logout();
  return apiResponse({ message: "Logged out successfully" });
}
