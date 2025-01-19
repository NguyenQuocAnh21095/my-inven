'use server';
import { sql } from "@vercel/postgres";
import {Item, ItemHistory} from "@/app/lib/definitions";
import {revalidatePath} from "next/cache";

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

export async function deleteFullItemById({ id }: { id: string }) {
    const client = sql;  // Dùng đối tượng sql mặc định của @vercel/postgres
    try {
        // Bắt đầu transaction
        await client`
            BEGIN;
        `;

        // Xóa record từ bảng itemhistory
        await client`
            DELETE FROM itemhistory
            WHERE itemid = ${id};
        `;

        // Xóa record từ bảng items
        await client`
            DELETE FROM items
            WHERE id = ${id};
        `;

        // Commit transaction nếu không có lỗi
        await client`
            COMMIT;
        `;
        revalidatePath('/dashboard/invoices');
        // redirect('/dashboard/invoices');
        return { success: true, message: 'Xóa thành công!' };
    } catch (error) {
        // Rollback nếu có lỗi
        await client`
            ROLLBACK;
        `;
        console.error('Lỗi khi xóa record:', error);
        return { success: false, message: 'Lỗi khi xóa record.', error };
    }
}

export async function UpdateFullItemHistoryById({
                                                    id,
                                                    curentVolume,
                                                    historyId,
                                                    volume,
                                                    agentId,
                                                    inbound,
                                                    outsup,
                                                    createat,
                                                }: {
    id: string;
    curentVolume: number;
    historyId: string;
    volume: number;
    agentId: string;
    inbound:boolean;
    outsup: boolean;
    createat: string;
}) {
    const client = await sql.connect();

    try {
        // Bắt đầu transaction
        await client.query('BEGIN');

        // Cập nhật bảng items
        await client.query(
            `
            UPDATE items
            SET currentvolume = $1
            WHERE id = $2
        `,
            [curentVolume, id] // Sử dụng tham số hóa để truyền giá trị
        );

        // Cập nhật bảng itemhistory
        await client.query(
            `
            UPDATE itemhistory
            SET agentid = $1, volume = $2, outsup = $3, createat = $4
            WHERE id = $5
        `,
            [agentId, volume, outsup, createat, historyId] // Tham số hóa
        );

        // Commit transaction nếu không có lỗi
        await client.query('COMMIT');
        if (inbound) {
            revalidatePath(`dashboard/${id}/${historyId}/edit-inhistory`);
        } else {revalidatePath(`dashboard/${id}/${historyId}/edit-outhistory`);}
        return {
            message: 'Item updated successfully!',
        };
    } catch (err) {
        // Nếu có lỗi, rollback transaction
        await client.query('ROLLBACK');
        console.error('Database Error:', err);
        throw new Error('Failed to update item and item history');
    } finally {
        client.release(); // Đảm bảo kết nối được đóng
    }
}
