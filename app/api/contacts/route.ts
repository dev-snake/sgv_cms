import { db } from "@/db";
import { contacts } from "@/db/schema";
import { apiResponse, apiError } from "@/utils/api-response";
import { sendThankYouEmail } from "@/services/mail";
import { desc, ilike, or, gte, lte, and, sql } from "drizzle-orm";
import { parsePaginationParams, calculateOffset, createPaginationMeta } from "@/utils/pagination";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    // Parse pagination params
    const { page, limit } = parsePaginationParams(searchParams, { limit: 10 });
    const offset = calculateOffset(page, limit);

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(or(
        ilike(contacts.name, `%${search}%`),
        ilike(contacts.email, `%${search}%`),
        ilike(contacts.address, `%${search}%`)
      ));
    }

    if (startDate) {
      conditions.push(gte(contacts.created_at, new Date(startDate)));
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(contacts.created_at, end));
    }

    if (status) {
      conditions.push(sql`${contacts.status} = ${status}`);
    }

    // Count total items
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(contacts);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Fetch paginated data
    let query = db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.created_at))
      .limit(limit)
      .offset(offset);

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle type issue with dynamic conditions
      query = query.where(and(...conditions));
    }

    const allContacts = await query;

    return apiResponse(allContacts, {
      meta: createPaginationMeta(page, limit, Number(total))
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return apiError("Internal Server Error", 500);
  }
}
