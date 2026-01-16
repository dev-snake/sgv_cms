import { db } from "@/db";
import { users, roles, permissions, role_permissions, user_roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
// @ts-ignore
import bcrypt from "bcryptjs";

/**
 * GET /api/debug/seed-admin
 * Seeds a Super Admin account with the admin role and ALL permissions.
 * WARNING: This endpoint should be removed in production!
 */
export async function GET() {
  try {
    // 1. Define all permissions
    const allPermissions = [
      // Dashboard
      { name: 'dashboard:read', description: 'View dashboard statistics', module: 'dashboard' },
      // News
      { name: 'news:read', description: 'View news articles', module: 'news' },
      { name: 'news:write', description: 'Create and edit news articles', module: 'news' },
      { name: 'news:delete', description: 'Delete news articles', module: 'news' },
      // Products
      { name: 'products:read', description: 'View products', module: 'products' },
      { name: 'products:write', description: 'Create and edit products', module: 'products' },
      { name: 'products:delete', description: 'Delete products', module: 'products' },
      // Projects
      { name: 'projects:read', description: 'View projects', module: 'projects' },
      { name: 'projects:write', description: 'Create and edit projects', module: 'projects' },
      { name: 'projects:delete', description: 'Delete projects', module: 'projects' },
      // Media
      { name: 'media:read', description: 'View media library', module: 'media' },
      { name: 'media:write', description: 'Upload media files', module: 'media' },
      { name: 'media:delete', description: 'Delete media files', module: 'media' },
      // Jobs
      { name: 'jobs:read', description: 'View job postings', module: 'jobs' },
      { name: 'jobs:write', description: 'Create and edit job postings', module: 'jobs' },
      { name: 'jobs:delete', description: 'Delete job postings', module: 'jobs' },
      // Applications
      { name: 'applications:read', description: 'View job applications', module: 'applications' },
      { name: 'applications:write', description: 'Update application status', module: 'applications' },
      { name: 'applications:delete', description: 'Delete applications', module: 'applications' },
      // Contacts
      { name: 'contacts:read', description: 'View contact submissions', module: 'contacts' },
      { name: 'contacts:write', description: 'Update contact status', module: 'contacts' },
      { name: 'contacts:delete', description: 'Delete contact submissions', module: 'contacts' },
      // Users
      { name: 'users:read', description: 'View admin users', module: 'users' },
      { name: 'users:write', description: 'Create and edit admin users', module: 'users' },
      { name: 'users:delete', description: 'Delete admin users', module: 'users' },
      // RBAC
      { name: 'rbac:manage', description: 'Manage roles and permissions', module: 'rbac' },
      // System
      { name: 'system:manage', description: 'Manage system settings and master data', module: 'system' },
    ];

    // 2. Insert or update permissions
    for (const perm of allPermissions) {
      const existing = await db.select().from(permissions).where(eq(permissions.name, perm.name));
      if (existing.length === 0) {
        await db.insert(permissions).values(perm);
      }
    }
    console.log('Permissions seeded.');

    // 3. Create 'admin' role if it doesn't exist
    let [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin'));
    if (!adminRole) {
      [adminRole] = await db.insert(roles).values({
        name: 'admin',
        description: 'Super Administrator with all permissions',
      }).returning();
    }
    console.log('Admin role created/verified.');

    // 4. Assign ALL permissions to admin role
    const allDbPerms = await db.select().from(permissions);
    for (const perm of allDbPerms) {
      const existing = await db.select().from(role_permissions)
        .where(eq(role_permissions.role_id, adminRole.id))
        .where(eq(role_permissions.permission_id, perm.id));
      if (existing.length === 0) {
        await db.insert(role_permissions).values({
          role_id: adminRole.id,
          permission_id: perm.id,
        }).onConflictDoNothing();
      }
    }
    console.log('Permissions assigned to admin role.');

    // 5. Create super admin user
    const adminUsername = 'superadmin';
    const adminPassword = 'Super@123'; // Change this immediately after first login!

    let [adminUser] = await db.select().from(users).where(eq(users.username, adminUsername));
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      [adminUser] = await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        full_name: 'Super Administrator',
        role: 'admin',
      }).returning();
      console.log('Super admin user created.');
    }

    // 6. Assign admin role to admin user
    const existingUserRole = await db.select().from(user_roles)
      .where(eq(user_roles.user_id, adminUser.id))
      .where(eq(user_roles.role_id, adminRole.id));
    
    if (existingUserRole.length === 0) {
      await db.insert(user_roles).values({
        user_id: adminUser.id,
        role_id: adminRole.id,
      }).onConflictDoNothing();
    }
    console.log('Admin role assigned to super admin user.');

    return apiResponse({
      message: 'Super Admin seeded successfully!',
      credentials: {
        username: adminUsername,
        password: adminPassword,
        note: 'CHANGE THIS PASSWORD IMMEDIATELY!'
      }
    });
  } catch (error) {
    console.error('Error seeding super admin:', error);
    return apiError('Failed to seed super admin', 500);
  }
}
