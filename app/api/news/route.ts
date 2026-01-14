import { db } from "@/db";
import { newsArticles, categories, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/api-response";

// GET /api/news - List news articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "published" | null;
    const categoryId = searchParams.get("categoryId");

    let query = db.select({
      id: newsArticles.id,
      title: newsArticles.title,
      slug: newsArticles.slug,
      summary: newsArticles.summary,
      status: newsArticles.status,
      published_at: newsArticles.published_at,
      created_at: newsArticles.created_at,
      category: categories.name,
      author: authors.name,
    })
    .from(newsArticles)
    .innerJoin(categories, eq(newsArticles.category_id, categories.id))
    .innerJoin(authors, eq(newsArticles.author_id, authors.id))
    .orderBy(desc(newsArticles.created_at));

    if (status) {
      // @ts-ignore - Drizzle enum type check can be tricky with string params
      query = query.where(eq(newsArticles.status, status));
    }

    if (categoryId) {
      // @ts-ignore
      query = query.where(eq(newsArticles.category_id, categoryId));
    }

    const results = await query;
    return apiResponse(results);
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
