import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const [project] = await db.select().from(projects).where(eq(projects.id, id));

    if (!project) {
      return apiError("Project not found", 404);
    }

    return apiResponse(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return apiError("Internal Server Error", 500);
  }
}

// PATCH /api/projects/[id] - Update a project
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
    if (updates.start_date) updates.start_date = new Date(updates.start_date);
    if (updates.end_date) updates.end_date = new Date(updates.end_date);

    const [updatedProject] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    if (!updatedProject) {
      return apiError("Project not found", 404);
    }

    return apiResponse(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return apiError("Internal Server Error", 500);
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const [deletedProject] = await db.delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (!deletedProject) {
      return apiError("Project not found", 404);
    }

    return apiResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return apiError("Internal Server Error", 500);
  }
}
