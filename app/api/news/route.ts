import { db } from "@/db";
import { newsArticles, categories, authors } from "@/db/schema";
import { eq, desc, sql, and, or, ilike, gte, lte } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";

// GET /api/news - List news articles with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "published" | null;
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Parse pagination params
    const { page, limit } = parsePaginationParams(searchParams, { limit: 10 });
    const offset = calculateOffset(page, limit);

    // Build where conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(newsArticles.status, status));
    }
    if (categoryId) {
      conditions.push(eq(newsArticles.category_id, categoryId));
    }
    if (search) {
      conditions.push(or(
        ilike(newsArticles.title, `%${search}%`),
        ilike(newsArticles.summary, `%${search}%`)
      ));
    }
    if (startDate) {
      conditions.push(gte(newsArticles.created_at, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(newsArticles.created_at, end));
    }

    // Count total items
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(newsArticles);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Build main query with pagination
    let query = db.select({
      id: newsArticles.id,
      title: newsArticles.title,
      slug: newsArticles.slug,
      summary: newsArticles.summary,
      content: newsArticles.content,
      status: newsArticles.status,
      published_at: newsArticles.published_at,
      created_at: newsArticles.created_at,
      category_id: newsArticles.category_id,
      category: categories.name,
      author_id: newsArticles.author_id,
      author: authors.name,
    })
    .from(newsArticles)
    .innerJoin(categories, eq(newsArticles.category_id, categories.id))
    .innerJoin(authors, eq(newsArticles.author_id, authors.id))
    .orderBy(desc(newsArticles.created_at))
    .limit(limit)
    .offset(offset);

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle type issue with dynamic conditions
      query = query.where(and(...conditions));
    }

    const results = await query;
    
    // Transform results to include derived fields
    const transformedResults = results.map((article) => {
      const wordCount = article.content ? article.content.split(/\s+/).length : 0;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        ...article,
        readTime: `${readTimeMinutes} PHÚT`,
        image: `https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png`,
      };
    });
    
    return apiResponse(transformedResults, {
      meta: createPaginationMeta(page, limit, Number(total)),
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return apiError("Internal Server Error", 500);
  }
}



// POST /api/news - Create a new article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, summary, content, category_id, author_id, status, published_at } = body;

    if (!title || !slug || !summary || !content || !category_id || !author_id) {
      return apiError("Missing required fields", 400);
    }

    const [newArticle] = await db.insert(newsArticles).values({
      title,
      slug,
      summary,
      content,
      category_id,
      author_id,
      status: status || 'draft',
      published_at: published_at ? new Date(published_at) : null,
    }).returning();

    return apiResponse(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return apiError("Internal Server Error", 500);
  }
}
