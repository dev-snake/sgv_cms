import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

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
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
}
