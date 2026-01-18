import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/services/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessions = await db.query.chatSessions.findMany({
            orderBy: [desc(chatSessions.last_message_at)],
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Chat Sessions Admin Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
