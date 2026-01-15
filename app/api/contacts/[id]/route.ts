import { db } from "@/db";
import { contacts } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return apiError("Status is required", 400);
    }

    const [updatedContact] = await db
      .update(contacts)
      .set({ 
        status,
        updated_at: new Date()
      })
      .where(eq(contacts.id, id))
      .returning();

    if (!updatedContact) {
      return apiError("Contact not found", 404);
    }

    return apiResponse(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deletedContact] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    if (!deletedContact) {
      return apiError("Contact not found", 404);
    }

    return apiResponse({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return apiError("Internal Server Error", 500);
  }
}
