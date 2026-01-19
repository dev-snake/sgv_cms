import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/services/auth';
import { chatStreamManager } from '@/services/chat-stream';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { adminLastSeen, guestLastSeen } = await req.json();

        const updateData: any = { updated_at: new Date() };
        if (adminLastSeen) updateData.admin_last_seen_at = new Date();
        if (guestLastSeen) updateData.guest_last_seen_at = new Date();

        const [updatedSession] = await db
            .update(chatSessions)
            .set(updateData)
            .where(eq(chatSessions.id, id))
            .returning();

        // Broadcast session update if needed (e.g., seen status)
        chatStreamManager.broadcastSessionUpdate(updatedSession);

        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error('Update Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Hard delete the session (messages are deleted via cascade reference)
        await db.delete(chatSessions).where(eq(chatSessions.id, id));

        // Notify admins about session removal
        chatStreamManager.broadcastSessionRemoval(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
