import { db } from '@/db';
import {
    newsArticles,
    projects,
    products,
    contacts,
    jobPostings,
    jobApplications,
    productComments,
    users,
    roles,
    user_roles,
} from '@/db/schema';
import { sql } from 'drizzle-orm';
import { apiResponse, apiError } from '@/utils/api-response';
import { withAuth } from '@/middlewares/middleware';

// GET /api/stats - Dashboard statistics
export const GET = withAuth(async () => {
    try {
        const [newsCount] = await db.select({ count: sql`count(*)` }).from(newsArticles);
        const [projectsCount] = await db.select({ count: sql`count(*)` }).from(projects);
        const [productsCount] = await db.select({ count: sql`count(*)` }).from(products);
        const [contactsCount] = await db.select({ count: sql`count(*)` }).from(contacts);
        const [jobsCount] = await db.select({ count: sql`count(*)` }).from(jobPostings);
        const [applicationsCount] = await db.select({ count: sql`count(*)` }).from(jobApplications);
        const [commentsCount] = await db.select({ count: sql`count(*)` }).from(productComments);
        const [usersCount] = await db
            .select({ count: sql`count(*)` })
            .from(users)
            .where(sql`deleted_at IS NULL`);

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
            .where(sql`deleted_at IS NULL`)
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
            .where(sql`deleted_at IS NULL`)
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
            .where(sql`deleted_at IS NULL`)
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
        (SELECT count(*) FROM products WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as products,
        (SELECT count(*) FROM job_applications WHERE date_trunc('month', created_at) = m.month_date)::int as applications,
        (SELECT count(*) FROM job_postings WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as jobs,
        (SELECT count(*) FROM users WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as users,
        (SELECT count(*) FROM product_comments WHERE date_trunc('month', created_at) = m.month_date AND deleted_at IS NULL)::int as comments,
        (SELECT count(*) FROM contacts WHERE date_trunc('month', created_at) = m.month_date)::int as contacts
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

        // Fetch Application Status Distribution
        const applicationStatsRows = await db
            .select({
                status: jobApplications.status,
                count: sql`count(*)`,
            })
            .from(jobApplications)
            .groupBy(jobApplications.status);

        const applicationStats = applicationStatsRows.reduce((acc: any, row: any) => {
            acc[row.status] = Number(row.count);
            return acc;
        }, {});

        // Fetch Comment Status Distribution
        const commentStatsRows = await db
            .select({
                is_approved: productComments.is_approved,
                count: sql`count(*)`,
            })
            .from(productComments)
            .where(sql`deleted_at IS NULL`)
            .groupBy(productComments.is_approved);

        const commentStats = commentStatsRows.reduce((acc: any, row: any) => {
            acc[row.is_approved ? 'approved' : 'pending'] = Number(row.count);
            return acc;
        }, {});

        // Fetch Job Status Distribution
        const jobStatsRows = await db
            .select({
                status: jobPostings.status,
                count: sql`count(*)`,
            })
            .from(jobPostings)
            .where(sql`deleted_at IS NULL`)
            .groupBy(jobPostings.status);

        const jobStats = jobStatsRows.reduce((acc: any, row: any) => {
            acc[row.status] = Number(row.count);
            return acc;
        }, {});

        // Fetch User Roles Distribution
        const userRolesRows = await db.execute(sql`
            SELECT r.name as role_name, count(ur.user_id)::int as count
            FROM roles r
            LEFT JOIN user_roles ur ON r.id = ur.role_id
            WHERE r.deleted_at IS NULL
            GROUP BY r.name
        `);

        const userStats = userRolesRows.rows.reduce((acc: any, row: any) => {
            acc[row.role_name] = Number(row.count);
            return acc;
        }, {});

        return apiResponse({
            counts: {
                news: Number(newsCount.count),
                projects: Number(projectsCount.count),
                products: Number(productsCount.count),
                contacts: Number(contactsCount.count),
                jobs: Number(jobsCount.count),
                applications: Number(applicationsCount.count),
                comments: Number(commentsCount.count),
                users: Number(usersCount.count),
            },
            recentActivities: activities,
            trends: trendsResult.rows || [],
            contactStats,
            applicationStats,
            commentStats,
            jobStats,
            userStats,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return apiError('Internal Server Error', 500);
    }
}, {});
