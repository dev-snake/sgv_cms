import { db } from "@/db";
import { categories, newsArticles, products, projects } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { withAuth } from "@/middlewares/middleware";
import { NextRequest } from "next/server";
import { PERMISSIONS } from "@/constants/rbac";

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [category] = await db.select().from(categories).where(eq(categories.id, id));

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiResponse(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return apiError("Internal Server Error", 500);
  }
}

// PATCH /api/categories/[id] - Update a category
export const PATCH = withAuth(async (request: NextRequest, session, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, category_type_id } = body;

    const [updatedCategory] = await db.update(categories)
      .set({ 
        name: name ?? undefined, 
        category_type_id: category_type_id ?? undefined 
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return apiError("Category not found", 404);
    }

    return apiResponse(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.CMS_UPDATE] });

// DELETE /api/categories/[id] - Delete a category
export const DELETE = withAuth(async (request: NextRequest, session, { params }) => {
  try {
    const { id } = await params;

    // Check if category is in use
    const [newsUsage, productUsage, projectUsage] = await Promise.all([
      db.select({ id: newsArticles.id }).from(newsArticles).where(eq(newsArticles.category_id, id)).limit(1),
      db.select({ id: products.id }).from(products).where(eq(products.category_id, id)).limit(1),
      db.select({ id: projects.id }).from(projects).where(eq(projects.category_id, id)).limit(1),
    ]);

    if (newsUsage.length > 0 || productUsage.length > 0 || projectUsage.length > 0) {
      return apiError("Không thể xóa danh mục này vì đang có dữ liệu (Tin tức, Sản phẩm hoặc Dự án) liên kết với nó. Vui lòng xóa hoặc chuyển các dữ liệu đó sang danh mục khác trước.", 400);
    }

    const [deletedCategory] = await db.delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deletedCategory) {
      return apiError("Category not found", 404);
    }

    return apiResponse({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.CMS_DELETE] });
