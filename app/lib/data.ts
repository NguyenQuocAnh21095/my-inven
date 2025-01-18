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
    agent?: string, // tham số cho agent
    startDate?: string, // tham số cho startDate (định dạng tháng-năm)
    endDate?: string // tham số cho endDate (định dạng tháng-năm)
) {
    try {
        let data;

        if (agent === 'All agents') {
            data = await sql`
        SELECT 
          ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('month', ih.createat) DESC, ih.itemid) AS id,
          ih.itemid,
          i.name,
          i.unitprice,
          COALESCE(a.agent, 'Unknown') AS agent_name,
          DATE_TRUNC('month', ih.createat) AS month,
          ih.inbound,
          SUM(ih.volume) AS total_volume
        FROM 
          itemhistory ih
        LEFT JOIN 
          agents a ON ih.agentid = a.id
        LEFT JOIN
          items i ON ih.itemid = i.id
        WHERE 
          ih.createat BETWEEN ${startDate} AND ${endDate}
        GROUP BY 
          ih.itemid,
          i.name,
          i.unitprice,
          ih.agentid,
          a.agent,
          ih.inbound,
          DATE_TRUNC('month', ih.createat)
        ORDER BY 
          month DESC, ih.itemid;
      `;
        } else {
            data = await sql`
        SELECT 
          ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('month', ih.createat) DESC, ih.itemid) AS id,
          ih.itemid,
          i.name,
          i.unitprice,
          COALESCE(a.agent, 'Unknown') AS agent_name,
          DATE_TRUNC('month', ih.createat) AS month,
          ih.inbound,
          SUM(ih.volume) AS total_volume
        FROM 
          itemhistory ih
        LEFT JOIN 
          agents a ON ih.agentid = a.id
        LEFT JOIN
          items i ON ih.itemid = i.id
        WHERE 
          (a.agent = ${agent} OR (${agent} = 'No Agent' AND a.agent IS NULL))
          AND ih.createat BETWEEN ${startDate} AND ${endDate}
        GROUP BY 
          ih.itemid,
          i.name,
          i.unitprice,
          ih.agentid,
          a.agent,
          ih.inbound,
          DATE_TRUNC('month', ih.createat)
        ORDER BY 
          month DESC, ih.itemid;
      `;
        }

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch Items summary data.');
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

