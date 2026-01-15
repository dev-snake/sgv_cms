import { db } from "@/db";
import { projects, categories } from "@/db/schema";
import { eq, desc, sql, and, or, ilike, gte, lte } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";

// GET /api/projects - List projects with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") as "ongoing" | "completed" | null;
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Parse pagination params
    const { page, limit } = parsePaginationParams(searchParams, { limit: 12 });
    const offset = calculateOffset(page, limit);

    // Build where conditions
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(projects.category_id, categoryId));
    }
    if (status) {
      conditions.push(eq(projects.status, status));
    }
    if (search) {
      conditions.push(or(
        ilike(projects.name, `%${search}%`),
        ilike(projects.client_name, `%${search}%`)
      ));
    }
    if (startDate) {
      conditions.push(gte(projects.created_at, new Date(startDate)));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(projects.created_at, end));
    }

    // Count total items
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(projects);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Build main query with pagination
    let query = db.select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      client_name: projects.client_name,
      start_date: projects.start_date,
      end_date: projects.end_date,
      status: projects.status,
      image_url: projects.image_url,
      category: categories.name,
    })
    .from(projects)
    .innerJoin(categories, eq(projects.category_id, categories.id))
    .orderBy(desc(projects.created_at))
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
    console.error("Error fetching projects:", error);
    return apiError("Internal Server Error", 500);
  }
}


// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      client_name, 
      start_date, 
      end_date, 
      category_id, 
      status, 
      image_url 
    } = body;

    if (!name || !slug || !description || !category_id) {
      return apiError("Missing required fields", 400);
    }

    const [newProject] = await db.insert(projects).values({
      name,
      slug,
      description,
      client_name: client_name || null,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      category_id,
      status: status || 'ongoing',
      image_url: image_url || null,
    }).returning();

    return apiResponse(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return apiError("Internal Server Error", 500);
  }
}
