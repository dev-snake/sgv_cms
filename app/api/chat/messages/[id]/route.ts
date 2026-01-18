import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { chatStreamManager } from '@/lib/chat-stream';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // We'll use soft delete (is_deleted flag) so it shows "(Tin nhắn đã bị gỡ)" in UI
        const [updatedMessage] = await db
            .update(chatMessages)
            .set({ is_deleted: true, content: 'Tin nhắn đã được gỡ' })
            .where(eq(chatMessages.id, id))
            .returning();

        // Broadcast message update to notify clients to update UI
        chatStreamManager.broadcastMessageUpdate(updatedMessage);

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.error('Delete Message Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
