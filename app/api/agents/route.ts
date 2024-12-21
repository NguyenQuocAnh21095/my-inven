import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db'; // Import hàm query từ file db.ts

export async function GET() {
    try {
        // Query lấy danh sách agents từ database
        const agents = await query('SELECT * FROM agents');

        // Trả về JSON danh sách agents
        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);

        // Trả về lỗi nếu query thất bại
        return NextResponse.json(
            { error: 'Failed to fetch agents' },
            { status: 500 }
        );
    }
}
