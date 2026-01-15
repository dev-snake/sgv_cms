import { db } from "@/db";
import { contacts } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { sendThankYouEmail } from "@/services/mail";
import { desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name, email, phone, address, message } = await request.json();

    if (!name || !email || !phone || !address || !message) {
      return apiError("Họ tên, email, số điện thoại, địa chỉ và yêu cầu là bắt buộc", 400);
    }

    const [newContact] = await db
      .insert(contacts)
      .values({
        name,
        email,
        phone,
        address,
        message,
        status: "new",
      })
      .returning();

    // Send emails asynchronously (don't block the response)
    Promise.all([
      sendThankYouEmail(email, name),
      import("@/services/mail").then(m => m.sendAdminNotificationEmail({ name, email, phone, address, message }))
    ]).catch((error) => {
      console.error("Failed to send emails:", error);
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
