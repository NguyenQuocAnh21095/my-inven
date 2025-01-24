'use server';
import {sql} from '@vercel/postgres';

export async function fetchFilteredItems(query:string) {
    try {
        const data = await sql`
            SELECT
                items.id,
                items.name,
                items.unitprice,
                items.currentvolume
            FROM items
            WHERE name ILIKE ${`%${query}%`} 
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch items data.');
    }
}

export async function fetchItemById(id:string) {
    try {
        const data = await sql`
            SELECT
                items.id,
                items.name,
                items.unitprice,
                items.currentvolume
            FROM items
            WHERE id = ${id}
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch item ${id}.`);
    }
}

export async  function fecthAgents(){
    try {
        const data = await sql`
            SELECT agents.id, agents.name
            FROM agents
        `;
        return data.rows;
    } catch(error){
        console.error('Database Error:', error);
        throw new Error('Failed to fetch agents data.');
    }
}

export async function fetchHistory(query: string, startDate: string, endDate: string) {
    try {
        if (query === 'all'){
        const data = await sql`
        SELECT ih.id,
            i.name,
            i.unitprice,
            COALESCE(a.agent, 'Unknown') AS agent_name,
            ih.volume,
            ih.inbound,
            ih.outsup,
            ih.createat
        FROM itemhistory ih
        JOIN items i ON ih.itemid = i.id
        JOIN agents a ON a.id = ih.agentid
        WHERE ih.createat >= ${startDate}
        AND ih.createat <= ${endDate}
       
        `;
        return data.rows;}
        const data = await sql`
        SELECT ih.id,
            i.name,
            i.unitprice,
            a.agent,
            ih.volume,
            ih.inbound,
            ih.outsup,
            ih.createat
        FROM itemhistory ih
        JOIN items i ON ih.itemid = i.id
        JOIN agents a ON a.id = ih.agentid
        WHERE a.agent = ${query}
        AND ih.createat >= ${startDate}
        AND ih.createat <= ${endDate}
       
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch agents data.');
    }
}

// Lấy item detail history
export async function fetchHistoryById(
    id: string,
    agent: string, // agent có thể là rỗng
    startDate: string,
    endDate: string
) {
    try {
        // Nếu agent rỗng, không thực hiện query và trả về mảng rỗng
        if (!agent) {
            console.warn('Agent is empty. No results will be returned.');
            return []; // Trả về mảng rỗng
        }

        // Thực hiện truy vấn nếu agent có giá trị
        const data = await sql`
            SELECT
                ih.id,
                COALESCE(a.agent, 'No Agent') AS agent,
                volume,
                inbound,
                outsup,
                createat
            FROM itemhistory ih
            LEFT JOIN agents a ON ih.agentid = a.id
            WHERE ih.itemid = ${id}
            AND a.agent = ${agent}
            AND ih.createat BETWEEN ${startDate} AND ${endDate}
            ORDER BY createat DESC
        `;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item history by Id.');
    }
}

export async function fetchItemHistoryById(id:string) {
    try {
        const data = await sql`
            SELECT ih.id,
                ih.itemid,
                ih.agentid,
                ih.volume,
                ih.inbound,
                ih.outsup,
                ih.createat
            FROM itemhistory ih
            WHERE ih.id = ${id};
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item history by Id.');
    }

}

// Dùng để lấy Tổng nhập xuất theo agent, ngày cho phần header
export async function fetchCurrentInOutById(
    id: string,
    agent: string, // Agent có thể là rỗng, bỏ giá trị mặc định
    startDate: string,
    endDate: string
) {
    try {
        // Nếu agent rỗng, không thực hiện query và trả về mảng rỗng
        if (!agent) {
            console.warn('Agent is empty. No results will be returned.');
            return []; // Trả về mảng rỗng
        }

        // Thực hiện truy vấn khi agent có giá trị
        const data = await sql`
            SELECT
                COALESCE(a.agent, 'No Agent') AS agent,
                SUM(CASE WHEN ih.inbound = true THEN ih.volume ELSE 0 END) AS total_inbound,
                SUM(CASE WHEN ih.inbound = false THEN ih.volume ELSE 0 END) AS total_outbound
            FROM itemhistory ih
            LEFT JOIN agents a ON ih.agentid = a.id
            WHERE ih.itemid = ${id}
            AND a.agent = ${agent}
            AND ih.createat BETWEEN ${startDate} AND ${endDate}
            GROUP BY a.agent
            ORDER BY agent
        `;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item current volume by Id.');
    }
}

export async function fetchSummary(
    agentId?: string, // Agent ID
    startDate?: string, // Ngày bắt đầu
    endDate?: string // Ngày kết thúc
) {
    // Trả về mảng rỗng nếu thiếu tham số
    if (!agentId || !startDate || !endDate) {
        return [];
    }

    try {
        const query = `
            SELECT 
                i.id,
                i.name,
                SUM(
                    CASE 
                        WHEN ih.inbound = true THEN ih.volume 
                        WHEN ih.inbound = false THEN -ih.volume 
                        ELSE 0 
                    END
                ) AS current_stock,
                SUM(
                    CASE 
                        WHEN ih.inbound = true AND ih.volume < 0 THEN -ih.volume 
                        ELSE 0 
                    END
                ) AS next_stock,
                i.unitprice
            FROM 
                items i
            INNER JOIN 
                itemhistory ih ON i.id = ih.itemid
            WHERE 
                ih.agentid = $1
                AND ih.createat BETWEEN $2 AND $3
            GROUP BY 
                i.id, i.name, i.unitprice;
        `;

        // Execute query
        const { rows } = await sql.query(query, [agentId, startDate, endDate]);
        return rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch items summary data.");
    }
}


export async function fetchAgents(){
    try {
        const data = await sql`
          SELECT
            id,
            agent
          FROM agents
          ORDER BY agent ASC
        `;
        return data.rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all agents.');
    }
}
//Tính tổng số lượng hàng hiện có dựa trên itemId, agentId
export async function fetchTotalVolumeByIdAgentId(
    itemId: string,
    agentId: string
): Promise<number> {
    try {
        const result = await sql`
          SELECT 
                COALESCE(SUM(CASE WHEN inbound = true THEN volume ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN inbound = false THEN volume ELSE 0 END), 0) AS total_difference
            FROM itemhistory
            WHERE itemid = ${itemId}
            AND agentid = ${agentId}
        `;

        // Truy cập vào giá trị đầu tiên của rows
        if (result.rows.length > 0) {
            return result.rows[0].total_difference || 0;
        }

        // Trả về 0 nếu không có kết quả nào
        return 0;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch total volume for the agent.');
    }
}

export async function fetchSumExportByItemAgent(itemid: string, agentid: string): Promise<number> {
    try {
        const data = await sql`
          SELECT SUM(volume) as export_total FROM itemhistory
            WHERE itemid = ${itemid}
            AND agentid = ${agentid}
            AND inbound = false
        `;

        // Trả về giá trị export_total
        return data.rows[0]?.export_total ?? 0;  // Trả về 0 nếu không có kết quả
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to total export of current Agent');
    }
}

export async function fetchInventory(startDate: string, endDate: string){
    try {
        const data = await sql`
          SELECT 
                i.id, 
                COALESCE(a.agent, 'No Agent') AS agent,
                i.volume,
                i.createat 
            FROM 
                itemhistory i
            LEFT JOIN 
                agents a 
            ON 
                a.id = i.agentid
            WHERE 
                i.inbound = true
                AND i.createat BETWEEN ${startDate} AND ${endDate}
            ORDER BY createat DESC
        `;
        return data.rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch inventory items');
    }
}

export async function fetchTotalInOutInventoryByItemId(id:string){
    try {
        const data = await sql`
        SELECT 
            SUM(CASE WHEN inbound = true AND agentid IS NULL THEN volume ELSE 0 END) AS total_in,
            SUM(CASE WHEN inbound = true AND agentid IS NOT NULL THEN volume ELSE 0 END) AS total_out
        FROM 
            itemhistory
        where itemid = ${id}`;
        const total_in = Number(data.rows[0].total_in ?? '0')
        const total_out = Number(data.rows[0].total_out ?? '0')
        return {total_in,total_out};
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch fetchTotalInOutInventoryByItemId');
    }
}