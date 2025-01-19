'use client';

import { useState } from 'react';
import { createItemHistory } from '@/app/lib/actions';
import { Agent, Item } from '@/app/lib/definitions';
import Link from "next/link";

export default function TransForm({ agents, item }: { agents: Agent[], item: Item }) {
    const [agentid, setAgentid] = useState('');
    const [volume, setVolume] = useState('');
    const [createAtOld, setCreateAtOld] = useState('');
    const [createAtNew, setCreateAtNew] = useState('');
    const [error, setError] = useState(''); // State để lưu thông báo lỗi

    if (!item.id) {
        return null; // Render nothing if no item ID
    }

    const itemOld = {
        itemid: item.id,
        agentid: agentid,
        volume: -parseInt(volume),
        inbound: true,
        outsup: false,
        createat: createAtOld
    };

    const itemNew = {
        itemid: item.id,
        agentid: agentid,
        volume: parseInt(volume),
        inbound: true,
        outsup: true,
        createat: createAtNew
    };

    const validateInputs = () => {
        if (!agentid) return 'Vui lòng chọn agent.';
        if (!volume || isNaN(parseInt(volume)) || parseInt(volume) <= 0) {
            return 'Vui lòng nhập số lượng hợp lệ (lớn hơn 0).';
        }
        if (!createAtOld) return 'Vui lòng chọn ngày tồn.';
        if (!createAtNew) return 'Vui lòng chọn ngày chuyển tồn.';
        return ''; // Không có lỗi
    };

    const handleSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError); // Hiển thị lỗi nếu có
            return;
        }

        try {
            // Xóa lỗi nếu đã nhập đúng
            setError('');
            // Gọi createItemHistory cho itemOld và itemNew
            await createItemHistory(itemOld);
            await createItemHistory(itemNew);

            // Reset giá trị các trường sau khi thành công
            setAgentid('');
            setVolume('');
            setCreateAtOld('');
            setCreateAtNew('');

            alert('Chuyền tồn thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo lịch sử chuyển tồn:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };
    // Tìm Agent hiện tại dựa trên selectedAgentId
    const currentAgent = agents.find((agent) => agent.id === agentid);

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <Link className="text-blue-500" href={`/dashboard/${item.id}?agent=${currentAgent?.agent || ''}`}>Quay về</Link>
            <div className="text-center p-2">
                <div>
                    Bạn đang thực hiện chuyền tồn cho:
                    <br />{item.name}
                </div>
                <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                    {error && (
                        <div className="text-red-500 mb-2 text-sm">
                            {error}
                        </div>
                    )}
                    <label className="flex justify-between items-center">
                        <span>Agent:</span>
                        <select
                            className="bg-white rounded-md p-1 m-2"
                            value={agentid}
                            onChange={(e) => setAgentid(e.target.value)}
                        >
                            <option value="" disabled>Select An Agent</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.agent}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex justify-between items-center w-full">
                        <span>Số lượng:</span>
                        <input
                            className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                            type="text"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span>Ngày tồn:</span>
                        <input
                            className="bg-white rounded-md p-1 m-2"
                            type="date"
                            value={createAtOld}
                            onChange={(e) => setCreateAtOld(e.target.value)}
                        />
                    </label>
                    <label className="flex justify-between items-center">
                        <span>Ngày chuyển tồn:</span>
                        <input
                            className="bg-white rounded-md p-1 m-2"
                            type="date"
                            value={createAtNew}
                            onChange={(e) => setCreateAtNew(e.target.value)}
                        />
                    </label>
                    <div className="flex justify-end m-2">
                        <button
                            className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                            type="button"
                            onClick={handleSubmit}
                        >
                            OK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
