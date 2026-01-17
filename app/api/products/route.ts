import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, sql, and, or, ilike, gte, lte, isNull } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";
import { createProductSchema, productFilterSchema } from "@/validations/product.schema";
import { validateQuery, validateBody, withAuth } from "@/middlewares/middleware";
import { ZodError } from "zod";
import { NextRequest } from "next/server";
import { PERMISSIONS } from "@/constants/rbac";
import { PAGINATION } from "@/constants/app";

// GET /api/products - List products with pagination (Public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const filterValidation = validateQuery(searchParams, productFilterSchema);
    if (filterValidation instanceof Response) {
      return filterValidation;
    }
    
    const {
      categoryId,
      status,
      isFeatured,
      search,
      startDate,
      endDate,
      includeDeleted,
      page = 1,
      limit = 12
    } = filterValidation;
    
    const offset = calculateOffset(page, limit);

    // Build where conditions
    const conditions = [];
    
    // Soft delete filter (exclude deleted by default)
    if (!includeDeleted) {
      conditions.push(isNull(products.deleted_at));
    }
    if (categoryId) {
      conditions.push(eq(products.category_id, categoryId));
    }
    if (status) {
      conditions.push(eq(products.status, status));
    }
    if (isFeatured) {
      conditions.push(eq(products.is_featured, true));
    }
    if (search) {
      conditions.push(or(
        ilike(products.name, `%${search}%`),
        ilike(products.sku, `%${search}%`)
      ));
    }
    if (startDate) {
      conditions.push(gte(products.created_at, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(products.created_at, end));
    }

    // Count total items
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(products);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Build main query with pagination
    let query = db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      sku: products.sku,
      stock: products.stock,
      status: products.status,
      image_url: products.image_url,
      is_featured: products.is_featured,
      tech_specs: products.tech_specs,
      features: products.features,
      gallery: products.gallery,
      tech_summary: products.tech_summary,
      catalog_url: products.catalog_url,
      warranty: products.warranty,
      origin: products.origin,
      availability: products.availability,
      delivery_info: products.delivery_info,
      category: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.category_id, categories.id))
    .orderBy(desc(products.created_at))
    .limit(limit)
    .offset(offset);

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle type issue with dynamic conditions
      query = query.where(and(...conditions));
    }

    const results = await query;
    
    return apiResponse(results, {
      meta: createPaginationMeta(page, limit, Number(total)),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return apiError("Internal Server Error", 500);
  }
}


// POST /api/products - Create a new product
export const POST = withAuth(async (request) => {
  try {
    // Validate request body
    const dataOrError = await validateBody(request, createProductSchema);
    if (dataOrError instanceof Response) {
      return dataOrError;
    }

    // Check for duplicate SKU
    const existingSku = await db.select().from(products)
      .where(eq(products.sku, dataOrError.sku))
      .limit(1);
    
    if (existingSku.length > 0) {
      return apiError("SKU already exists", 409);
    }

    // Check for duplicate slug
    const existingSlug = await db.select().from(products)
      .where(eq(products.slug, dataOrError.slug))
      .limit(1);
    
    if (existingSlug.length > 0) {
      return apiError("Slug already exists", 409);
    }

    // Verify category exists
    const [category] = await db.select().from(categories)
      .where(eq(categories.id, dataOrError.category_id))
      .limit(1);
    
    if (!category) {
      return apiError("Category not found", 404);
    }

    const [newProduct] = await db.insert(products).values(dataOrError).returning();

    return apiResponse(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError("Validation failed", 400, { errors: error.issues });
    }
    
    // Handle database constraint errors
    if ((error as any).code === '23505') { // Unique violation
      return apiError("Duplicate value - SKU or Slug already exists", 409);
    }
    if ((error as any).code === '23503') { // Foreign key violation
      return apiError("Invalid category_id", 404);
    }
    
    console.error("Error creating product:", error);
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.PRODUCTS_WRITE] });
