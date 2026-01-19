import 'dotenv/config';
import { db } from './index';
import { modules } from './schema';
import { eq } from 'drizzle-orm';

// Module data with icon, route, and order
const MODULE_DATA = [
    { code: 'DASHBOARD', name: 'Dashboard', icon: 'LayoutDashboard', route: '/portal', order: 0 },
    {
        code: 'BLOG',
        name: 'Quản lý Tin tức',
        icon: 'FileText',
        route: '/portal/cms/news',
        order: 1,
    },
    {
        code: 'PROJECTS',
        name: 'Quản lý Dự án',
        icon: 'Briefcase',
        route: '/portal/cms/projects',
        order: 2,
    },
    {
        code: 'PRODUCTS',
        name: 'Quản lý Sản phẩm',
        icon: 'Box',
        route: '/portal/cms/products',
        order: 3,
    },
    { code: 'MEDIA', name: 'Thư viện Media', icon: 'Images', route: '/portal/cms/media', order: 4 },
    {
        code: 'CONTACTS',
        name: 'Quản lý Liên hệ',
        icon: 'Mail',
        route: '/portal/contacts',
        order: 5,
    },
    {
        code: 'COMMENTS',
        name: 'Quản lý Bình luận',
        icon: 'ClipboardList',
        route: '/portal/cms/comments',
        order: 6,
    },
    {
        code: 'CHAT',
        name: 'Hỗ trợ trực tuyến',
        icon: 'MessageCircle',
        route: '/portal/cms/chat',
        order: 7,
    },
    {
        code: 'RECRUITMENT',
        name: 'Quản lý Tuyển dụng',
        icon: 'UserRoundSearch',
        route: '/portal/cms/jobs',
        order: 8,
    },
    {
        code: 'APPLICATIONS',
        name: 'Danh sách Ứng viên',
        icon: 'ClipboardList',
        route: '/portal/cms/applications',
        order: 9,
    },
    {
        code: 'USERS',
        name: 'Tài khoản Admin',
        icon: 'ShieldCheck',
        route: '/portal/users',
        order: 10,
    },
    {
        code: 'ROLES',
        name: 'Phân quyền & Vai trò',
        icon: 'Lock',
        route: '/portal/users/roles',
        order: 11,
    },
    {
        code: 'MODULES',
        name: 'Quản lý Module',
        icon: 'Layers',
        route: '/portal/users/modules',
        order: 12,
    },
    {
        code: 'SETTINGS',
        name: 'Cài đặt hệ thống',
        icon: 'Settings',
        route: '/portal/settings',
        order: 13,
    },
];

async function updateModules() {
    console.log('🔄 Updating modules with icon, route, and order...');

    for (const moduleData of MODULE_DATA) {
        try {
            // Check if module exists
            const existing = await db
                .select()
                .from(modules)
                .where(eq(modules.code, moduleData.code));

            if (existing.length > 0) {
                // Update existing module
                await db
                    .update(modules)
                    .set({
                        name: moduleData.name,
                        icon: moduleData.icon,
                        route: moduleData.route,
                        order: moduleData.order,
                        updated_at: new Date(),
                    })
                    .where(eq(modules.code, moduleData.code));
                console.log(`✅ Updated: ${moduleData.code}`);
            } else {
                // Insert new module
                await db.insert(modules).values({
                    code: moduleData.code,
                    name: moduleData.name,
                    icon: moduleData.icon,
                    route: moduleData.route,
                    order: moduleData.order,
                });
                console.log(`✅ Created: ${moduleData.code}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${moduleData.code}:`, error);
        }
    }

    console.log('✅ Module update completed!');
    process.exit(0);
}

updateModules().catch((err) => {
    console.error('Update failed:', err);
    process.exit(1);
});
