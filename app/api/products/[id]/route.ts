import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/api-response";

// GET /api/products/[id] - Get a single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return apiError("Internal Server Error", 500);
  }
}

// PATCH /api/products/[id] - Update a product
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Prepare updates
    const updates: any = { ...body };
    if (updates.id) delete updates.id;
    if (updates.created_at) delete updates.created_at;
    if (updates.updated_at) updates.updated_at = new Date();
    if (updates.price) updates.price = updates.price.toString();

    const [updatedProduct] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return apiError("Product not found", 404);
    }

    return apiResponse(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return apiError("Internal Server Error", 500);
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const [deletedProduct] = await db.delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct) {
      return apiError("Product not found", 404);
    }

    return apiResponse({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return apiError("Internal Server Error", 500);
  }
}
