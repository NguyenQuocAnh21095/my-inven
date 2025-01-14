import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

// POST method handler
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { updateData, historyData } = req.body;

    try {
        await sql`BEGIN`;

        // Cập nhật item
        await sql`
            UPDATE items
            SET name = ${updateData.name},
                unitprice = ${updateData.unitprice},
                currentvolume = ${updateData.currentvolume}
            WHERE id = ${updateData.id}
        `;

        // Thêm lịch sử item
        await sql`
            INSERT INTO item_history (itemid, volume, inbound, outsup, createat)
            VALUES (${historyData.itemid}, ${historyData.volume}, ${historyData.inbound}, ${historyData.outsup}, ${historyData.createat})
        `;

        await sql`COMMIT`;

        return res.status(200).json({ success: true });
    } catch (error) {
        await sql`ROLLBACK`;
        console.error('Transaction failed:', error);
        return res.status(500).json({ success: false, message: 'Transaction failed' });
    }
}
