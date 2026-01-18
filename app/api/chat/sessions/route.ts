import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const { guestId, guestName } = await req.json();

        if (!guestId) {
            return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
        }

        // Check if session exists
        let session = await db.query.chatSessions.findFirst({
            where: and(eq(chatSessions.guest_id, guestId), eq(chatSessions.is_active, true)),
        });

        if (!session) {
            const [newSession] = await db
                .insert(chatSessions)
                .values({
                    guest_id: guestId,
                    guest_name: guestName || 'Guest',
                })
                .returning();
            session = newSession;
        } else if (guestName && session.guest_name !== guestName) {
            // Update name if changed
            await db
                .update(chatSessions)
                .set({ guest_name: guestName, updated_at: new Date() })
                .where(eq(chatSessions.id, session.id));
            session.guest_name = guestName;
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Chat Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
        return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
    }

    const session = await db.query.chatSessions.findFirst({
        where: and(eq(chatSessions.guest_id, guestId), eq(chatSessions.is_active, true)),
    });

    return NextResponse.json(session || null);
}
