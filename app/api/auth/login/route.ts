import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { login, generateTokens } from '@/services/auth';
import { apiResponse, apiError } from '@/utils/api-response';
import { validateBody } from '@/middlewares/middleware';
import { loginSchema } from '@/validations/auth.schema';
import { checkRateLimit } from '@/utils/rate-limiter';
import { auditService } from '@/services/audit-service';

export async function POST(request: Request) {
    try {
        // 1. Rate Limiting Check
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const { isLimited, retryAfter } = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 mins

        if (isLimited) {
            return apiError(
                `Quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau ${retryAfter} giây.`,
                429,
            );
        }

        // Validate request body
        const dataOrError = await validateBody(request, loginSchema);
        if (dataOrError instanceof Response) {
            return dataOrError;
        }

        const { username, password } = dataOrError;

        const [user] = await db.select().from(users).where(eq(users.username, username));

        if (!user) {
            auditService.logAction({
                action: 'AUTH_FAILURE',
                module: 'AUTH',
                description: `Thử đăng nhập thất bại với username: ${username}`,
                request,
            });
            return apiError('Tên đăng nhập hoặc mật khẩu không đúng', 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            auditService.logAction({
                userId: user.id,
                action: 'AUTH_FAILURE',
                module: 'AUTH',
                description: 'Mật khẩu không chính xác',
                request,
            });
            return apiError('Tên đăng nhập hoặc mật khẩu không đúng', 401);
        }

        // Success
        const sessionUser = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            is_super: user.is_super,
        };

        // Generate Tokens (now includes roles/permissions)
        const { accessToken, refreshToken, sessionPayload } = await generateTokens(sessionUser);

        // Set Cookies
        const { setAuthCookies } = await import('@/services/auth');
        await setAuthCookies(accessToken, refreshToken);

        // Prepare session for cookie (backward compatibility for middleware)
        await login(sessionPayload);

        // Audit Log Success
        auditService.logAction({
            userId: user.id,
            action: 'LOGIN',
            module: 'AUTH',
            description: 'Đăng nhập thành công',
            request,
        });

        return apiResponse({
            user: sessionPayload,
        });
    } catch (error) {
        console.error('Login Error:', error);
        return apiError('Lỗi máy chủ nội bộ', 500);
    }
}
