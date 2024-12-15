import { db } from "@vercel/postgres";

const client = await db.connect();

async function itemList(){
    const data = await client.sql`
    SELECT *
    FROM itemhistory
    ORDER BY createat DESC;
  `;
    return data.rows;
}

export async function GET() {
    try {
        return Response.json(await itemList());
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}