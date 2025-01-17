'use client';

import { useState } from 'react';
import {createItemHistory, updateItemById} from '@/app/lib/actions';
import {Agent, Item} from '@/app/lib/definitions';

export default function InOutForm({ agents, itemid, isImport, itemMain }:
    { agents: Agent[], itemid: string, isImport: boolean, itemMain: Item }) {
    const [agentid, setAgentid] = useState('');
    const [volume, setVolume] = useState('');
    const [outsup, setOutsup] = useState(false);
    const [createat, setCreateat] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);
    const [currentVolume, setCurrentVolume] = useState(itemMain.currentvolume);

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');

        if (!volume) {
            setIsSuccess(false);
            setMessage('Số lượng không được bỏ trống.');
            setIsLoading(false);
            return;
        }
        if (!agentid && !isImport) {
            setIsSuccess(false);
            setMessage('Vui lòng chọn agent.');
            setIsLoading(false);
            return;
        }
        if(isImport && parseInt(volume) > currentVolume && agentid){
            setIsSuccess(false);
            setMessage(`Số lượng nhập cho Agent không thể lớn hơn KHO ${currentVolume}`);
            setIsLoading(false)
            return;
        }

        const itemData = {
            itemid,
            agentid: agentid,
            volume: parseInt(volume),
            inbound: isImport ? true : false,
            outsup,
            createat
        };

        const currentVolumeData ={
            id: itemMain.id,
            name: itemMain.name,
            unitprice: itemMain.unitprice,
            currentvolume:  currentVolume - parseInt(volume),
        }

        console.log('Submitting item history:', itemData);

        try {
            await createItemHistory(itemData);
            await updateItemById(currentVolumeData);
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

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <div className="text-center p-2">Lưu ý! Bạn đang nhập vào Agent.
                <br/>{itemMain.name}<br/>Số lượng hiện tại trong KHO: {itemMain.currentvolume}</div>
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select className="bg-white rounded-md p-1 m-2"
                            value={agentid} onChange={(e) => setAgentid(e.target.value)}>
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
                           onChange={(e) => setVolume(e.target.value)}
                    />
                </label>
                {!isImport && (
                    <>
                        <label className="flex justify-between items-center">
                            <span>Xuất bù:</span>
                            <input className="bg-white rounded-md p-1 m-2"
                                   type="checkbox"
                                   checked={outsup}
                                   onChange={(e) => setOutsup(e.target.checked)}
                            />
                        </label>
                    </>
                )}
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
                        disabled={isLoading} // Ngăn không cho nhấn nút khi đang gọi API
                    >
                        {isLoading ? 'Loading...' : 'OK'}
                    </button>
                </div>
                {message && (<div
                    className={`mt-2 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}> {message} </div>)}
            </form>
        </div>
    );
}
