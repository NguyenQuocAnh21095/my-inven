import {sql} from '@vercel/postgres';

export async function fetchFilteredItems(query:string) {
    try {
        const data = await sql`
            SELECT
                items.id,
                items.name,
                items.unitprice
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
                items.unitprice
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

// lấy item detail history
export async function fetchHistoryById(
    id: string,
    agent: string = 'all', // tham số cho agent, mặc định là 'all'
    startDate: string, // tham số cho startDate
    endDate: string // tham số cho endDate
) {
    try {
        let data;

        if (agent === 'all') {
            data = await sql`
        SELECT
          ih.id,
          'All agents' as agent,
          volume,
          inbound,
          outsup,
          createat
        FROM itemhistory ih
        LEFT JOIN agents a ON ih.agentid = a.id
        WHERE ih.itemid = ${id}
          AND ih.createat BETWEEN ${startDate} AND ${endDate}
        ORDER BY createat DESC
      `;
        } else {
            data = await sql`
        SELECT
          ih.id,
          CASE 
            WHEN a.agent IS NULL THEN 'No Agent'
            ELSE a.agent
          END AS agent,
          volume,
          inbound,
          outsup,
          createat
        FROM itemhistory ih
        LEFT JOIN agents a ON ih.agentid = a.id
        WHERE ih.itemid = ${id}
          AND (
            a.agent = ${agent} OR (${agent} = 'No Agent' AND a.agent IS NULL)
          )
          AND ih.createat BETWEEN ${startDate} AND ${endDate}
        ORDER BY createat DESC
      `;
        }

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item history by Id.');
    }
}

// Dùng để lấy Tổng nhập xuất theo agent, ngày cho phần header
export async function fetchCurrentInOutById(
    id: string,
    agent: string = 'all', // tham số cho agent, mặc định là 'all'
    startDate: string, // tham số cho startDate
    endDate: string // tham số cho endDate
) {
    try {
        let data;

        if (agent === 'all') {
            data = await sql`
        SELECT
          'All agents' as agent,
          SUM(CASE WHEN ih.inbound = true THEN ih.volume ELSE 0 END) AS total_inbound,
          SUM(CASE WHEN ih.inbound = false THEN ih.volume ELSE 0 END) AS total_outbound
        FROM itemhistory ih
        LEFT JOIN agents a ON ih.agentid = a.id
        WHERE ih.itemid = ${id}
          AND ih.createat BETWEEN ${startDate} AND ${endDate}
      `;
        } else {
            data = await sql`
        SELECT
          CASE 
            WHEN a.agent IS NULL THEN 'No Agent'
            ELSE a.agent
          END AS agent,
          SUM(CASE WHEN ih.inbound = true THEN ih.volume ELSE 0 END) AS total_inbound,
          SUM(CASE WHEN ih.inbound = false THEN ih.volume ELSE 0 END) AS total_outbound
        FROM itemhistory ih
        LEFT JOIN agents a ON ih.agentid = a.id
        WHERE ih.itemid = ${id}
          AND (
            a.agent = ${agent} OR (${agent} = 'No Agent' AND a.agent IS NULL)
          )
          AND ih.createat BETWEEN ${startDate} AND ${endDate}
        GROUP BY a.agent
        ORDER BY agent
      `;
        }

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
