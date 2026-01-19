import { NextRequest, NextResponse } from 'next/server';
import { chatStreamManager } from '@/services/chat-stream';

export async function POST(req: NextRequest) {
    try {
        const { sessionId, senderType, isTyping } = await req.json();

        if (!sessionId || !senderType) {
            return NextResponse.json({ error: 'Missing sessionId or senderType' }, { status: 400 });
        }

        chatStreamManager.broadcastTyping(sessionId, senderType, isTyping);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Typing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
