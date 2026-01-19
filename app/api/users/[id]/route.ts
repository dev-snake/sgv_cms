import { db } from '@/db';
import { users, user_roles, roles } from '@/db/schema';
import { apiResponse, apiError } from '@/utils/api-response';
import { eq } from 'drizzle-orm';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { withAuth } from '@/middlewares/middleware';
import { NextRequest } from 'next/server';
import { AUTH } from '@/constants/app';
import { PERMISSIONS } from '@/constants/rbac';

// GET /api/users/[id] - Get a single user
export const GET = withAuth(
    async (request: Request, session, { params }) => {
        try {
            const { id: userId } = await params;
            const [user] = await db
                .select({
                    id: users.id,
                    username: users.username,
                    fullName: users.full_name,
                    email: users.email,
                    phone: users.phone,
                    isActive: users.is_active,
                    createdAt: users.created_at,
                })
                .from(users)
                .where(eq(users.id, userId));

            if (!user) return apiError('User not found', 404);

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
            console.error('Error fetching user:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.USERS_VIEW] },
);

// PATCH /api/users/[id] - Update a user
export const PATCH = withAuth(
    async (request: Request, session, { params }) => {
        try {
            const { id: userId } = await params;
            const body = await request.json();
            const { username, password, fullName, email, phone, roleIds } = body;

            const updatedUser = await db.transaction(async (tx) => {
                const updateData: any = {};
                if (username) updateData.username = username;
                if (fullName !== undefined) updateData.full_name = fullName;
                if (email !== undefined) updateData.email = email;
                if (phone !== undefined) updateData.phone = phone;
                if (password) {
                    updateData.password = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS);
                }
                updateData.updated_at = new Date();

                const [user] = await tx
                    .update(users)
                    .set(updateData)
                    .where(eq(users.id, userId))
                    .returning({
                        id: users.id,
                        username: users.username,
                        fullName: users.full_name,
                        email: users.email,
                        phone: users.phone,
                    });

                if (!user) throw new Error('User not found');

                if (roleIds && Array.isArray(roleIds)) {
                    await tx.delete(user_roles).where(eq(user_roles.user_id, userId));
                    if (roleIds.length > 0) {
                        await tx.insert(user_roles).values(
                            roleIds.map((rId: string) => ({
                                user_id: userId,
                                role_id: rId,
                            })),
                        );
                    }
                }

                return user;
            });

            return apiResponse(updatedUser);
        } catch (error: any) {
            console.error('Error updating user:', error);

            if (error.message === 'User not found') {
                return apiError('Không tìm thấy người dùng', 404);
            }

            // Handle PostgreSQL unique constraint violations
            if (error?.code === '23505') {
                const detail = error?.detail || '';
                if (detail.includes('email')) {
                    return apiError('Email này đã được sử dụng bởi một tài khoản khác', 400);
                }
                if (detail.includes('username')) {
                    return apiError('Tên đăng nhập này đã được sử dụng', 400);
                }
                return apiError('Dữ liệu đã tồn tại (trùng lặp)', 400);
            }

            return apiError('Lỗi máy chủ nội bộ', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.USERS_UPDATE] },
);

// DELETE /api/users/[id] - Delete a user
export const DELETE = withAuth(
    async (request: Request, session, { params }) => {
        try {
            const { id: userId } = await params;

            // Prevent self-deletion
            if (userId === session.user.id) {
                return apiError('Bạn không thể xóa chính tài khoản của mình', 400);
            }

            const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning();

            if (!deletedUser) return apiError('User not found', 404);

            return apiResponse({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return apiError('Internal Server Error', 500);
        }
    },
    { requiredPermissions: [PERMISSIONS.USERS_DELETE] },
);
