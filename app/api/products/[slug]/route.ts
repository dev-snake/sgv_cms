import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { withAuth } from "@/middlewares/middleware";
import { PERMISSIONS } from "@/constants/rbac";

// GET /api/products/[slug] - Get a single product by slug or ID (Public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if slug is a UUID to fetch by ID instead
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const [product] = await db.select().from(products).where(
      and(
        isId ? eq(products.id, slug) : eq(products.slug, slug),
        isNull(products.deleted_at) // Exclude soft deleted
      )
    );

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiResponse(product);
  } catch (error) {
    return apiError("Internal Server Error", 500);
  }
}


// PATCH /api/products/[id] - Update a product
export const PATCH = withAuth(async (request, session, { params }) => {
  try {
    const { slug: id } = await params;
    const body = await request.json();
    
    // Prepare updates
    const updates: any = { ...body };
    if (updates.id) delete updates.id;
    if (updates.created_at) delete updates.created_at;
    if (updates.updated_at) updates.updated_at = new Date();
    
    // Ensure price is string if provided
    if (updates.price !== undefined && updates.price !== null) {
      updates.price = updates.price.toString();
    }

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
}, { requiredPermissions: [PERMISSIONS.PRODUCTS_UPDATE] });

// DELETE /api/products/[id] - Soft delete a product
export const DELETE = withAuth(async (request, session, { params }) => {
  try {
    const { slug: id } = await params;
    
    // Soft delete: set deleted_at timestamp
    const [deletedProduct] = await db.update(products)
      .set({ 
        deleted_at: new Date(),
        updated_at: new Date() 
      })
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
}, { requiredPermissions: [PERMISSIONS.PRODUCTS_DELETE] });
