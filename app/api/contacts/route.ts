import { db } from "@/db";
import { contacts } from "@/db/schema";
import { apiResponse, apiError } from "@/lib/api-response";
import { sendThankYouEmail } from "@/lib/mail";
import { desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return apiError("Name, email, and message are required", 400);
    }

    const [newContact] = await db
      .insert(contacts)
      .values({
        name,
        email,
        phone,
        subject,
        message,
        status: "new",
      })
      .returning();

    // Send thank you email asynchronously (don't block the response)
    sendThankYouEmail(email, name).catch((error) => {
      console.error("Failed to send thank you email:", error);
    });

    return apiResponse({ contact: newContact }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function GET() {
  try {
    const allContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.created_at));

    return apiResponse(allContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return apiError("Internal Server Error", 500);
  }
}
