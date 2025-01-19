'use client';

import { useState } from 'react';
import { createItemHistory, updateItemById } from '@/app/lib/actions';
import { Agent, Item } from '@/app/lib/definitions';
import {fetchItemById} from "@/app/lib/data";
import Link from "next/link";

export default function InForm({ agents, item }:
                                   {agents: Agent[], item: Item}) {
    const [agentid, setAgentid] = useState('');
    const [volume, setVolume] = useState('');
    const [outsup, setOutsup] = useState(false);
    const [createat, setCreateat] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);
    const [currentVolume, setCurrentVolume] = useState(item.currentvolume);

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');
        // Kiểm tra số lượng phải lớn hơn 0
        if (!volume || parseInt(volume) <= 0) {
            setIsSuccess(false);
            setMessage('Số lượng phải lớn hơn 0.');
            setIsLoading(false);
            return;
        }
        if (!volume) {
            setIsSuccess(false);
            setMessage('Số lượng không được bỏ trống.');
            setIsLoading(false);
            return;
        }
        if (!agentid) {
            setIsSuccess(false);
            setMessage('Vui lòng chọn agent.');
            setIsLoading(false);
            return;
        }
        if (parseInt(volume) > currentVolume && agentid) {
            setIsSuccess(false);
            setMessage(`Số lượng nhập cho Agent không thể lớn hơn KHO ${currentVolume}`);
            setIsLoading(false);
            return;
        }
        //Dữ liệu đưa vào bảng ItemHistory
        if (!item.id) {
            setMessage('Lỗi: Item không có ID hợp lệ.');
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        const itemData = {
            itemid: item.id,
            agentid: agentid,
            volume: parseInt(volume),
            inbound: true,
            outsup,
            createat
        };

        const currentVolumeData = {
            id: item.id,
            name: item.name,
            unitprice: item.unitprice,
            currentvolume: currentVolume - parseInt(volume),
        }

        console.log('Submitting item history:', itemData);

        try {
            await createItemHistory(itemData);
            await updateItemById(currentVolumeData);
            // Lấy dữ liệu mới từ database
            const updatedItem = await fetchItemById(item.id);
            if (updatedItem) {
                setCurrentVolume(updatedItem[0].currentvolume); // Cập nhật số lượng từ database
            }
            setMessage('Cập nhật thành công!');
            setIsSuccess(true);
            setCurrentVolume(currentVolumeData.currentvolume);
            // Reset các trường về ban đầu
            setAgentid('');
            setVolume('');
            setOutsup(false);
            setCreateat(new Date().toISOString().split('T')[0]);
        } catch (error) {
            setMessage('Tạo thất bại!');
            setIsSuccess(false);
            console.error('Failed to create item history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra và cấm nhập số lượng lớn hơn số lượng trong kho và nhỏ hơn hoặc bằng 0
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = e.target.value;
        if (parseInt(newVolume) <= 0) {
            setMessage('Số lượng phải lớn hơn 0.');
            setIsSuccess(false);
        } else if (parseInt(newVolume) > currentVolume) {
            setMessage(`Số lượng không thể lớn hơn số lượng trong kho (${currentVolume})`);
            setIsSuccess(false);
        } else {
            setMessage('');
        }
        setVolume(newVolume);
    };
    // Tìm Agent hiện tại dựa trên selectedAgentId
    const currentAgent = agents.find((agent) => agent.id === agentid);

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <Link className="text-blue-500" href={`/dashboard/${item.id}?agent=${currentAgent?.agent || ''}`}>Quay về</Link>
            <div className="text-center p-2">Lưu ý! Bạn đang nhập vào Agent.
                <br />{item.name}<br />Số lượng hiện tại trong KHO: {currentVolume}</div>
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select className="bg-white rounded-md p-1 m-2"
                            value={agentid} onChange={(e) => setAgentid(e.target.value)}>
                        <option value="" disabled>Select An Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.agent}</option>
                        ))}
                    </select>
                </label>
                <label className="flex justify-between items-center w-full">
                    <span>Số lượng:</span>
                    <input className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                           type="text"
                           value={volume}
                           onChange={handleVolumeChange}
                    />
                </label>
                <label className="flex justify-between items-center">
                    <span>Ngày:</span>
                    <input className="bg-white rounded-md p-1 m-2"
                           type="date"
                           value={createat}
                           onChange={(e) => setCreateat(e.target.value)}
                    />
                </label>
                <div className="flex justify-end m-2">
                    <button
                        className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || parseInt(volume) <= 0 || parseInt(volume) > currentVolume} // Ngăn không cho nhấn nút khi số lượng không hợp lệ
                    >
                        {isLoading || parseInt(volume) <= 0 || parseInt(volume) > currentVolume ? 'Không khả dụng' : 'OK'}
                    </button>
                </div>
                {message && (<div
                    className={`mt-2 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}> {message} </div>)}
            </form>
        </div>
    );
}
