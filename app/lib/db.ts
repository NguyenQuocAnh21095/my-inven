import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Lấy chuỗi kết nối từ .env
});

export const query = async (text: string, params?: string[]) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows; // Trả về kết quả từ database
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        client.release(); // Giải phóng kết nối
    }
};
