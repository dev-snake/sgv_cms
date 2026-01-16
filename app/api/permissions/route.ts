import { db } from "@/db";
import { permissions } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { asc } from "drizzle-orm";
import { withAuth } from "@/middlewares/middleware";

export const GET = withAuth(async () => {
  try {
    const allPermissions = await db
      .select()
      .from(permissions)
      .orderBy(asc(permissions.module), asc(permissions.name));

    // Group by module for easier UI rendering
    const grouped = allPermissions.reduce((acc: any, perm) => {
      const module = perm.module || 'other';
      if (!acc[module]) acc[module] = [];
      acc[module].push(perm);
      return acc;
    }, {});

    return apiResponse(grouped);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return apiError("Internal Server Error", 500);
  }
}, { allowedRoles: ['admin'] });
