import { db } from "@/db";
import { newsArticles, categories, authors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/news/[slug] - Get a single article by slug or ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isUUID = UUID_REGEX.test(slug);
    
    const whereCondition = isUUID ? eq(newsArticles.id, slug) : eq(newsArticles.slug, slug);
    const [article] = await db.select().from(newsArticles).where(whereCondition);

    if (!article) {
      return apiError("Article not found", 404);
    }

    return apiResponse(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return apiError("Internal Server Error", 500);
  }
}

// PATCH /api/news/[slug] - Update an article by ID or slug
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const isUUID = UUID_REGEX.test(slug);
    
    // Prepare updates
    const updates: any = { ...body };
    if (updates.id) delete updates.id;
    if (updates.category) delete updates.category;
    if (updates.author) delete updates.author;
    if (updates.created_at) delete updates.created_at;
    updates.updated_at = new Date();
    if (updates.published_at) updates.published_at = new Date(updates.published_at);

    const whereCondition = isUUID ? eq(newsArticles.id, slug) : eq(newsArticles.slug, slug);
    const [updatedArticle] = await db.update(newsArticles)
      .set(updates)
      .where(whereCondition)
      .returning();

    if (!updatedArticle) {
       return apiError("Article not found", 404);
    }

    return apiResponse(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return apiError("Internal Server Error", 500);
  }
}

// DELETE /api/news/[slug] - Delete an article by ID or slug
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isUUID = UUID_REGEX.test(slug);
    
    const whereCondition = isUUID ? eq(newsArticles.id, slug) : eq(newsArticles.slug, slug);
    const [deletedArticle] = await db.delete(newsArticles)
      .where(whereCondition)
      .returning();

    if (!deletedArticle) {
      return apiError("Article not found", 404);
    }

    return apiResponse({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return apiError("Internal Server Error", 500);
  }
}

