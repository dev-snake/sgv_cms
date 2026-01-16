import { db } from "@/db";
import { jobApplications, jobPostings } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { desc, ilike, or, gte, lte, and, sql, eq } from "drizzle-orm";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";
import { validateBody, sanitizeHtml } from "@/middlewares/middleware";
import { jobApplicationSchema } from "@/validations/application.schema";

// POST /api/applications - Submit a new job application (Public)
export async function POST(request: Request) {
  try {
    const dataOrError = await validateBody(request, jobApplicationSchema);
    if (dataOrError instanceof Response) {
      return dataOrError;
    }

    // Check if job exists and is open
    const [job] = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.id, dataOrError.job_id));

    if (!job) {
      return apiError("Công việc không tồn tại", 404);
    }

    if (job.status !== "open") {
      return apiError("Vị trí này đã tạm dừng tuyển dụng", 400);
    }

    const sanitizedData = {
      ...dataOrError,
      cover_letter: dataOrError.cover_letter ? sanitizeHtml(dataOrError.cover_letter) : null,
    };

    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        ...sanitizedData,
        status: "pending",
      })
      .returning();

    // In the future: Send notification emails here

    return apiResponse({ application: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Error saving job application:", error);
    return apiError("Internal Server Error", 500);
  }
}

// GET /api/applications - List all applications (Admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const jobId = searchParams.get("job_id");
    const status = searchParams.get("status");

    const { page, limit } = parsePaginationParams(searchParams, { limit: 10 });
    const offset = calculateOffset(page, limit);

    const conditions = [];

    if (search) {
      conditions.push(or(
        ilike(jobApplications.full_name, `%${search}%`),
        ilike(jobApplications.email, `%${search}%`),
        ilike(jobApplications.phone, `%${search}%`)
      ));
    }

    if (jobId) {
      conditions.push(eq(jobApplications.job_id, jobId));
    }

    if (status) {
      conditions.push(eq(jobApplications.status, status));
    }

    const countQuery = db.select({ count: sql<number>`count(*)` }).from(jobApplications);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    let query = db
      .select({
        id: jobApplications.id,
        job_id: jobApplications.job_id,
        job_title: jobPostings.title,
        full_name: jobApplications.full_name,
        email: jobApplications.email,
        phone: jobApplications.phone,
        status: jobApplications.status,
        created_at: jobApplications.created_at,
      })
      .from(jobApplications)
      .leftJoin(jobPostings, eq(jobApplications.job_id, jobPostings.id))
      .orderBy(desc(jobApplications.created_at))
      .limit(limit)
      .offset(offset);

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(and(...conditions));
    }

    const applications = await query;

    return apiResponse(applications, {
      meta: createPaginationMeta(page, limit, Number(total))
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return apiError("Internal Server Error", 500);
  }
}
