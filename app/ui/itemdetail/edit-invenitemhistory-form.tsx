'use client';

import { Agent, Item, ItemHistory } from '@/app/lib/definitions';
import { useState } from 'react';
import {UpdateFullItemHistoryById} from "@/app/lib/actions";
import Link from "next/link";

export default function EditInvenItemHistoryForm({
                                                  item,
                                                  itemHistory,
                                                  totalInOut
                                              }: {
    item: Item;
    itemHistory: ItemHistory;
    totalInOut: {totalIn: number, totalOut: number};
}) {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date.toISOString().split('T')[0];
    };

    const [volume, setVolume] = useState<number>(itemHistory.volume);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    console.log(itemHistory.agentid);

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');

        // Kiểm tra nếu không có thay đổi
        if (
            volume === itemHistory.volume
        ) {
            setMessage('Vui lòng cập nhật số lượng');
            setIsLoading(false);
            return;
        }

        // Kiểm tra số lượng không được thấp hơn số lượng đã xuất
        if (volume < totalInOut.totalOut - totalInOut.totalIn + itemHistory.volume) {
            setMessage('Số lượng không thể thấp hơn số lượng đã Xuất (Nhập đi các Agents)');
            setIsLoading(false);
            return;
        }

        if (!item.id || !itemHistory.id) {
            setMessage('Dữ liệu không hợp lệ. Vui lòng thử lại.');
            return;
        }
        // Chuẩn bị dữ liệu gửi đến API
        const iData = {
            id: item.id,
            curentVolume: item.currentvolume - itemHistory.volume + volume,
            historyId: itemHistory.id,
            volume: volume,
            agentId: itemHistory.agentid || null,
            inbound: itemHistory.inbound,
            outsup: itemHistory.outsup,
            createat: formatDate(itemHistory.createat),
        };

        try {
            // Gọi API cập nhật
            const result = await UpdateFullItemHistoryById(iData);
            console.log('Result:', result);

            setMessage('Cập nhật thành công!');
            alert('Cập nhật thành công!');
        } catch (error) {
            setMessage('Cập nhật thất bại!');
            console.error('Failed to update item history:', error);
        } finally {
            setIsLoading(false); // Đảm bảo isLoading luôn được set về false
        }
    };

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <Link className="text-blue-500" href={`/dashboard/${item.id}/inventory`}>Quay về</Link>
            <div className="text-center p-2">
                Bạn đang cập nhật thông lịch sử cho Nhập Kho Tổng
                <br />
                {item.name}
                <br />
                KHO: {item.currentvolume}
                <br />
                <span className="text-red-500">Vui lòng nhập số lớn hơn hoặc bằng {
                    totalInOut.totalOut - totalInOut.totalIn + itemHistory.volume < 1 ?
                        0:totalInOut.totalOut - totalInOut.totalIn + itemHistory.volume}</span>
            </div>
            <form className="flex-col" onSubmit={handleSubmit}>
                {/* Volume field */}
                <label className="flex justify-between items-center w-full">
                    <span>Số lượng:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                        type="number"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </label>
                {/* Date field */}
                <label className="flex justify-between items-center">
                    <span>Ngày (Không thể sửa ngày):</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="date"
                        value={formatDate(itemHistory.createat)}
                        disabled
                    />
                </label>
                {/* Submit button */}
                <div className="flex justify-end m-2">
                    <button
                        className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                        type="submit"
                        onClick={(handleSubmit)}
                        disabled={isLoading} // Ngăn không cho nhấn nút khi số lượng không hợp lệ
                    >
                        {isLoading ? 'Loading...' : 'OK'}
                    </button>
                </div>
            </form>

            {/* Hiển thị thông báo lỗi */}
            {message && <div className="text-red-500 text-center mt-2">{message}</div>}
        </div>
    );
}
