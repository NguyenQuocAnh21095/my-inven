'use client';

import { Agent, Item, ItemHistory } from '@/app/lib/definitions';
import { useState } from 'react';
import {UpdateFullItemHistoryById} from "@/app/lib/actions";
import Link from "next/link";

export default function EditItemHistoryInForm({
                                                  item,
                                                  itemHistory,
                                                  agents
                                              }: {
    item: Item;
    itemHistory: ItemHistory;
    agents: Agent[];
}) {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date.toISOString().split('T')[0];
    };

    const [selectedAgentId, setSelectedAgentId] = useState(itemHistory.agentid);
    const [volume, setVolume] = useState<number>(itemHistory.volume);
    const [date, setDate] = useState(formatDate(itemHistory.createat));
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');

        // Kiểm tra nếu không có thay đổi
        if (
            volume === itemHistory.volume &&
            selectedAgentId === itemHistory.agentid &&
            date === formatDate(itemHistory.createat)
        ) {
            setMessage('Vui lòng cập nhật trường muốn sửa');
            setIsLoading(false);
            return;
        }

        // Kiểm tra nếu các giá trị cần thiết không tồn tại
        if (!item.id || !itemHistory.id || !selectedAgentId) {
            setMessage('Có lỗi xảy ra! Vui lòng kiểm tra lại thông tin.');
            setIsLoading(false);
            return;
        }
        // Kiểm tra số lượng không được vượt quá Max
        if (volume > item.currentvolume + itemHistory.volume) {
            setMessage('Số lượng vượt quá số lượng trong Kho');
            setIsLoading(false);
            return;
        }
        // Chuẩn bị dữ liệu gửi đến API
        const iData = {
            id: item.id,
            curentVolume: item.currentvolume + itemHistory.volume - volume, // Đảm bảo dùng đúng trường `curentVolume`
            historyId: itemHistory.id,
            volume: volume,
            agentId: selectedAgentId, // Đảm bảo dùng `agentId` thay vì `agentid`
            inbound: true,
            outsup: false,
            createat: date,
        };

        try {
            // Gọi API cập nhật
            const result = await UpdateFullItemHistoryById(iData);
            console.log('Result:', result);

            // setMessage('Cập nhật thành công!');
            alert('Cập nhật thành công!');
        } catch (error) {
            setMessage('Cập nhật thất bại!');
            console.error('Failed to update item history:', error);
        } finally {
            setIsLoading(false); // Đảm bảo isLoading luôn được set về false
        }
    };
    // Tìm Agent hiện tại dựa trên selectedAgentId
    const currentAgent = agents.find((agent) => agent.id === selectedAgentId);

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <Link className="text-blue-500" href={`/dashboard/${item.id}?agent=${currentAgent?.agent || ''}`}>Quay về</Link>
            <div className="text-center p-2">
                Bạn đang cập nhật thông lịch sử cho Nhập Item
                <br />
                {item.name}
                <br />
                KHO: {item.currentvolume}
                <br />
                <span className="text-red-500">Lưu ý về số lượng Nhập Xuất của Agent khi thay đổi lịch sử!</span>
                <br />
                Vui lòng cập nhật số lượng nhỏ hơn {item.currentvolume + itemHistory.volume}
            </div>
            <form className="flex-col" onSubmit={handleSubmit}>
                {/* Agent ID field */}
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select
                        className="bg-white rounded-md p-1 m-2"
                        value={selectedAgentId} // Dùng value ở đây
                        onChange={(e)=>setSelectedAgentId(e.target.value)}
                    >
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.agent}
                            </option>
                        ))}
                    </select>
                </label>
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
                    <span>Ngày:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
