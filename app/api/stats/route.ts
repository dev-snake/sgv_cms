import { db } from '@/db';
import { newsArticles, projects, products, contacts } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { apiResponse, apiError } from '@/utils/api-response';
import { withAuth } from '@/middlewares/middleware';
import { PERMISSIONS } from '@/constants/rbac';

// GET /api/stats - Dashboard statistics
export const GET = withAuth(async () => {
    try {
        const [newsCount] = await db.select({ count: sql`count(*)` }).from(newsArticles);
        const [projectsCount] = await db.select({ count: sql`count(*)` }).from(projects);
        const [productsCount] = await db.select({ count: sql`count(*)` }).from(products);
        const [contactsCount] = await db.select({ count: sql`count(*)` }).from(contacts);

        // Get 5 most recent activities across news, projects, products
        const recentNews = await db
            .select({
                id: newsArticles.id,
                title: newsArticles.title,
                date: newsArticles.created_at,
                status: newsArticles.status,
                type: sql`'Tin tức'`,
            })
            .from(newsArticles)
            .orderBy(sql`${newsArticles.created_at} DESC`)
            .limit(5);

        const recentProjects = await db
            .select({
                id: projects.id,
                title: projects.name,
                date: projects.created_at,
                status: projects.status,
                type: sql`'Dự án'`,
            })
            .from(projects)
            .orderBy(sql`${projects.created_at} DESC`)
            .limit(5);

        const recentProducts = await db
            .select({
                id: products.id,
                title: products.name,
                date: products.created_at,
                status: products.status,
                type: sql`'Sản phẩm'`,
            })
            .from(products)
            .orderBy(sql`${products.created_at} DESC`)
            .limit(5);

        // Combine and sort
        const activities = [...recentNews, ...recentProjects, ...recentProducts]
            .sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 5);

        // Fetch Trends for last 6 months
        const trendsResult = await db.execute(sql`
      WITH months AS (
        SELECT date_trunc('month', now()) - (i || ' month')::interval as month_date
        FROM generate_series(0, 5) i
      )
      SELECT 
        to_char(m.month_date, 'MM') as month_num,
        to_char(m.month_date, 'Mon') as month,
        (SELECT count(*) FROM news_articles WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as news,
        (SELECT count(*) FROM projects WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as projects,
        (SELECT count(*) FROM products WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as products
      FROM months m
      ORDER BY m.month_date ASC
    `);

        // Fetch Contact Status Distribution
        const contactStatsRows = await db
            .select({
                status: contacts.status,
                count: sql`count(*)`,
            })
            .from(contacts)
            .groupBy(contacts.status);

        const contactStats = contactStatsRows.reduce((acc: any, row: any) => {
            acc[row.status] = Number(row.count);
            return acc;
        }, {});

        return apiResponse({
            counts: {
                news: Number(newsCount.count),
                projects: Number(projectsCount.count),
                products: Number(productsCount.count),
                contacts: Number(contactsCount.count),
            },
            recentActivities: activities,
            trends: trendsResult.rows || [],
            contactStats,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return apiError('Internal Server Error', 500);
    }
}, {});
