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
        WHERE (a.agent ILIKE '%' || ${query} || '%' OR ${query} = '')
        AND ih.createat BETWEEN ${startDate} AND ${endDate}
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch agents data.');
    }

}
