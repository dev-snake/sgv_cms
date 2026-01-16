import { db } from "@/db";
import { jobPostings } from "@/db/schema";
import { eq, desc, ilike, and, SQL, isNull } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";
import { withAuth } from "@/middlewares/middleware";
import { NextRequest } from "next/server";
import { PERMISSIONS } from "@/constants/rbac";

// GET /api/jobs - List all job postings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const offset = (page - 1) * limit;

    // Build filter conditions
    const conditions: SQL[] = [];
    
    // Soft delete filter
    if (!includeDeleted) {
      conditions.push(isNull(jobPostings.deleted_at));
    }
    if (status) {
      conditions.push(eq(jobPostings.status, status as "open" | "closed"));
    }
    if (search) {
      conditions.push(ilike(jobPostings.title, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [jobs, countResult] = await Promise.all([
      db.select()
        .from(jobPostings)
        .where(whereClause)
        .orderBy(desc(jobPostings.created_at))
        .limit(limit)
        .offset(offset),
      db.select().from(jobPostings).where(whereClause),
    ]);

    const total = countResult.length;
    const totalPages = Math.ceil(total / limit);

    return apiResponse(jobs, {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return apiError("Internal Server Error", 500);
  }
}

// POST /api/jobs - Create a new job posting
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { 
      title, 
      slug, 
      description, 
      requirements,
      benefits,
      location,
      employment_type,
      salary_range,
      experience_level,
      department,
      status,
      deadline,
    } = body;

    if (!title || !slug || !description) {
      return apiError("Missing required fields: title, slug, description", 400);
    }

    const [newJob] = await db.insert(jobPostings).values({
      title,
      slug,
      description,
      requirements: requirements || null,
      benefits: benefits || null,
      location: location || null,
      employment_type: employment_type || "full_time",
      salary_range: salary_range || null,
      experience_level: experience_level || null,
      department: department || null,
      status: status || "open",
      deadline: deadline ? new Date(deadline) : null,
    }).returning();

    return apiResponse(newJob, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    if (error.code === "23505") {
      return apiError("A job with this slug already exists", 400);
    }
    return apiError("Internal Server Error", 500);
  }
}, { requiredPermissions: [PERMISSIONS.JOBS_WRITE] });
