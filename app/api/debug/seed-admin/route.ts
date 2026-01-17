import { db } from "@/db";
import { users, roles, permissions, modules, user_roles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
// @ts-ignore
import bcrypt from "bcryptjs";
import { apiResponse, apiError } from "@/utils/api-response";
import { SEED_DEFAULTS, AUTH } from "@/constants/app";

/**
 * GET /api/debug/seed-admin
 * Seeds a Super Admin account with the admin role and ALL permissions.
 * WARNING: This endpoint should be removed in production!
 */
export async function GET() {
  try {
    // 1. Create 'admin' role if it doesn't exist
    let [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin'));
    if (!adminRole) {
      [adminRole] = await db.insert(roles).values({
        name: 'admin',
        code: 'ADMIN',
        description: 'Super Administrator with all permissions',
      }).returning();
    }

    // 2. Fetch all modules
    const allModules = await db.select().from(modules);
    
    // 3. Assign permissions to admin role for each module
    for (const moduleItem of allModules) {
      const existing = await db.select()
        .from(permissions)
        .where(
          and(
            eq(permissions.role_id, adminRole.id),
            eq(permissions.module_id, moduleItem.id)
          )
        );
      
      if (existing.length === 0) {
        await db.insert(permissions).values({
          role_id: adminRole.id,
          module_id: moduleItem.id,
          can_view: true,
          can_create: true,
          can_update: true,
          can_delete: true,
        });
      }
    }

    // 4. Create super admin user
    const adminUsername = SEED_DEFAULTS.SUPER_ADMIN_USERNAME;
    const adminPassword = SEED_DEFAULTS.SUPER_ADMIN_PASSWORD;

    let [adminUser] = await db.select().from(users).where(eq(users.username, adminUsername));
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, AUTH.BCRYPT_SALT_ROUNDS);
      [adminUser] = await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        full_name: 'Super Administrator',
      }).returning();
    }

    // 5. Assign admin role to admin user
    const existingUserRole = await db.select().from(user_roles)
      .where(and(eq(user_roles.user_id, adminUser.id), eq(user_roles.role_id, adminRole.id)));
    
    if (existingUserRole.length === 0) {
      await db.insert(user_roles).values({
        user_id: adminUser.id,
        role_id: adminRole.id,
      });
    }

    return apiResponse({
      message: 'Super Admin seeded successfully!',
      credentials: {
        username: adminUsername,
        password: adminPassword,
      }
    });
  } catch (error) {
    console.error('Error seeding super admin:', error);
    return apiError('Failed to seed super admin', 500);
  }
}

