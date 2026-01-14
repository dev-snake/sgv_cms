import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/news/[id] - Get a single article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));

    if (!article) {
      return apiError("Article not found", 404);
    }

    return apiResponse(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return apiError("Internal Server Error", 500);
  }
}

// PATCH /api/news/[id] - Update an article
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Prepare updates
    const updates: any = { ...body };
    if (updates.id) delete updates.id;
    if (updates.created_at) delete updates.created_at;
    if (updates.updated_at) updates.updated_at = new Date();
    if (updates.published_at) updates.published_at = new Date(updates.published_at);

    const [updatedArticle] = await db.update(newsArticles)
      .set(updates)
      .where(eq(newsArticles.id, id))
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

// DELETE /api/news/[id] - Delete an article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deletedArticle] = await db.delete(newsArticles)
      .where(eq(newsArticles.id, id))
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
