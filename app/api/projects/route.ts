import { db } from "@/db";
import { projects, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/projects - List projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") as "ongoing" | "completed" | null;

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
    .orderBy(desc(projects.created_at));

    if (categoryId) {
      // @ts-ignore
      query = query.where(eq(projects.category_id, categoryId));
    }

    if (status) {
      // @ts-ignore
      query = query.where(eq(projects.status, status));
    }

    const results = await query;
    return apiResponse(results);
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
