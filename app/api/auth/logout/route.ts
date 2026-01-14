import { logout } from "@/services/auth";
import { apiResponse } from "@/utils/api-response";

export async function POST() {
  await logout();
  return apiResponse({ message: "Logged out successfully" });
}
