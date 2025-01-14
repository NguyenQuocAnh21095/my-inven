'use server';
import { sql } from "@vercel/postgres";
import {Item, ItemHistory} from "@/app/lib/definitions";

export async function createItemHistory({ itemid, agentid, volume, inbound, outsup, createat }: ItemHistory) {
    try {
        await sql`
        INSERT INTO itemhistory (itemid, agentid, volume, inbound, outsup, createat)
        VALUES (${itemid}, ${agentid}, ${volume}, ${inbound}, ${outsup}, ${createat})
        `;
        return {
            message: 'Item history created successfully!',
        }
    } catch {
        return {
            message: 'Database Error: Failed to create item history.',
        }
    }
}

export async function createItem({name, unitprice, currentvolume}:Item){
    try {
        await sql`
            INSERT INTO items (name, unitprice, currentvolume)
        VALUES (${name}, ${unitprice}, ${currentvolume})
        `;
        return {
            message: 'Item created successfully!',
        }
    } catch{
        return {
            message: 'Database Error: Failed to create item.',
        }
    }
}
export async function updateItemById({ id, name, unitprice, currentvolume }: Item) {
    try {
        await sql`
            UPDATE items 
            SET name = ${name}, unitprice = ${unitprice}, currentvolume = ${currentvolume}
            WHERE id = ${id}
        `;
        return {
            message: 'Item updated successfully!',
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: `Database Error: Failed to update item.`,
        };
    }
}
