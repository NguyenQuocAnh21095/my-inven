'use server';
import { sql } from "@vercel/postgres";
import { ItemHistory } from "@/app/lib/definitions";

export async function createItemHistory({ itemid, agentid, volume, inbound, outsup, createat }: ItemHistory) {
    try {
        await sql`
        INSERT INTO itemhistory (itemid, agentid, volume, inbound, outsup, createat)
        VALUES (${itemid}, ${agentid}, ${volume}, ${inbound}, ${outsup}, ${createat})
        `;
        return {
            message: 'Item created successfully!',
        }
    } catch {
        return {
            message: 'Database Error: Failed to create item.',
        }
    }
}
