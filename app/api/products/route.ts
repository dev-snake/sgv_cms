import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, sql, and, or, ilike, gte, lte } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";

// GET /api/products - List products with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") as "active" | "inactive" | null;
    const isFeatured = searchParams.get("isFeatured") === "true";
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    // Parse pagination params
    const { page, limit } = parsePaginationParams(searchParams, { limit: 12 });
    const offset = calculateOffset(page, limit);

    // Build where conditions
    const conditions = [];
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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      price, 
      sku, 
      stock, 
      category_id, 
      status, 
      image_url 
    } = body;

    if (!name || !slug || !description || !price || !sku || !category_id) {
      return apiError("Missing required fields", 400);
    }

    const [newProduct] = await db.insert(products).values({
      name,
      slug,
      description,
      price: price.toString(),
      sku,
      stock: stock || 0,
      category_id,
      status: status || 'active',
      image_url: image_url || null,
      is_featured: body.is_featured || false,
      tech_specs: body.tech_specs || null,
      features: body.features || null,
      gallery: body.gallery || null,
      tech_summary: body.tech_summary || null,
      catalog_url: body.catalog_url || null,
      warranty: body.warranty || null,
      origin: body.origin || null,
      availability: body.availability || null,
      delivery_info: body.delivery_info || null,
    }).returning();

    return apiResponse(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return apiError("Internal Server Error", 500);
  }
}
