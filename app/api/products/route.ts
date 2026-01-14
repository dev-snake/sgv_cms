import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/products - List products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") as "active" | "inactive" | null;
    const isFeatured = searchParams.get("isFeatured") === "true";

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
    .orderBy(desc(products.created_at));

    if (categoryId) {
      // @ts-ignore
      query = query.where(eq(products.category_id, categoryId));
    }

    if (status) {
      // @ts-ignore
      query = query.where(eq(products.status, status));
    }

    if (isFeatured) {
      // @ts-ignore
      query = query.where(eq(products.is_featured, true));
    }

    const results = await query;
    return apiResponse(results);
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
