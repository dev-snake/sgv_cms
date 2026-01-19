import 'dotenv/config';
import { db } from './index';
import { modules } from './schema';
import { eq } from 'drizzle-orm';

async function fixChatManagement() {
    console.log('🔄 Fixing CHAT_MANAGEMENT module...');

    const result = await db
        .update(modules)
        .set({
            icon: 'MessageCircle',
            route: '/portal/cms/chat',
            order: 7,
            updated_at: new Date(),
        })
        .where(eq(modules.code, 'CHAT_MANAGEMENT'))
        .returning();

    if (result.length > 0) {
        console.log('✅ Updated CHAT_MANAGEMENT:', result[0]);
    } else {
        console.log('❌ CHAT_MANAGEMENT module not found');
    }

    process.exit(0);
}

fixChatManagement().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
