import { db } from "@/db";
import { newsArticles, categories, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/news - List news articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "draft" | "published" | null;
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");

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
    
    // Transform results to include derived fields
    const transformedResults = results.map((article) => {
      // Calculate read time: ~200 words per minute
      const wordCount = article.content ? article.content.split(/\s+/).length : 0;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        ...article,
        readTime: `${readTimeMinutes} PHÚT`,
        // Use a placeholder image if none exists (would need image_url column in future)
        image: `https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png`,
      };
    });
    
    return apiResponse(transformedResults);
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
