'use server';
import { sql } from "@vercel/postgres";
import {Item, ItemHistory} from "@/app/lib/definitions";

export async function createItemHistory({ itemid, agentid, volume, inbound, outsup, createat }: ItemHistory) {
    try {
        if (agentid == ""){
            await sql`
        INSERT INTO itemhistory (itemid, agentid, volume, inbound, outsup, createat)
        VALUES (${itemid}, null, ${volume}, ${inbound}, ${outsup}, ${createat})
        `;
        } else {
        await sql`
        INSERT INTO itemhistory (itemid, agentid, volume, inbound, outsup, createat)
        VALUES (${itemid}, ${agentid}, ${volume}, ${inbound}, ${outsup}, ${createat})
        `;}
        return {
            message: 'Item history created successfully!',
        }
    } catch {
        return {
            message: 'Database Error: Failed to create item history.',
        }
    }
}

export async function createItem({name, unitprice}:Item){
    try {
        await sql`
            INSERT INTO items (name, unitprice)
        VALUES (${name}, ${unitprice})
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