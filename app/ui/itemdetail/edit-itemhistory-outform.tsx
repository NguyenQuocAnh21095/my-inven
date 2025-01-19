'use client';

import { Agent, Item, ItemHistory } from '@/app/lib/definitions';
import {useState} from "react";
import Link from "next/link";
import {UpdateOutItemHistoryById} from "@/app/lib/actions";

export default function EditItemHistoryOutForm({
                                                  item,
                                                  itemHistory,
                                                  agents,
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
    // Tìm Agent hiện tại dựa trên selectedAgentId
    const currentAgent = agents.find((agent) => agent.id === itemHistory.agentid);
    const [volume, setVolume] = useState<number>(itemHistory.volume);
    const [outsup, setOutsup] = useState(itemHistory.outsup);
    const [createat, setCreateat] = useState(formatDate(itemHistory.createat));
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSumit = async () => {
        setIsLoading(true);
        setMessage('');
        // Kiểm tra nếu không có thay đổi
        if (
            volume === itemHistory.volume &&
            outsup === itemHistory.outsup &&
            createat === formatDate(itemHistory.createat)
        ) {
            setMessage('Vui lòng cập nhật trường muốn sửa');
            setIsLoading(false);
            return;
        }
        // Kiểm tra nếu các giá trị cần thiết không tồn tại
        if (!itemHistory.id) {
            setMessage('Có lỗi xảy ra! Vui lòng kiểm tra lại thông tin.');
            setIsLoading(false);
            return;
        }
        const itemData:ItemHistory ={
            id: itemHistory.id,
            itemid: itemHistory.itemid,
            agentid: itemHistory.agentid,
            volume: volume,
            inbound: false,
            outsup: outsup,
            createat: createat,
        }

        try {
            const result = await UpdateOutItemHistoryById(itemData);
            console.log('Result:', result);
            alert('Cập nhật thành công!');
        }catch (error) {
            setMessage('Cập nhật thất bại!');
            console.error('Failed to update item history:', error);
        } finally {
            setIsLoading(false); // Đảm bảo isLoading luôn được set về false
        }

    }

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <Link className="text-blue-500" href={`/dashboard/${item.id}?agent=${currentAgent?.agent || ''}`}>Quay về</Link>
            <div className="text-center p-2">
                Bạn đang cập nhật thông tin lịch sử cho Xuất Item.
                <br />
                {item.name}
                <br />
                <span className="text-red-500">Lưu ý về số lượng Nhập Xuất của Agent khi thay đổi lịch sử!</span>
            </div>
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select className="bg-white rounded-md p-1 m-2">
                            <option value={itemHistory.agentid}>{currentAgent?.agent}</option>
                    </select>
                </label>
                <label className="flex justify-between items-center w-full">
                    <span>Số lượng:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                        type="number"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </label>
                <label className="flex justify-between items-center">
                    <span>Xuất bù:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="checkbox"
                        checked={outsup}
                        onChange={(e) => setOutsup(e.target.checked)}
                    />
                </label>
                <label className="flex justify-between items-center">
                    <span>Ngày:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="date"
                        value={createat}
                        onChange={(e) => setCreateat(e.target.value)}
                    />
                </label>
                <div className="flex justify-end m-2">
                    <button
                        className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                        type="button"
                        onClick={handleSumit}
                        disabled={isLoading}
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
