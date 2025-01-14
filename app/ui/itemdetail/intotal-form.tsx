'use client';

import { useState } from 'react';
import { createItemHistory, updateItemById } from '@/app/lib/actions';
import {Item, ItemHistory} from '@/app/lib/definitions';
import {fetchItemById} from "@/app/lib/data";
// import { fetchItemById } from "@/app/lib/data";

export default function InTotalForm({ item }: { item: Item }) {
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

        if (!volume) {
            setIsSuccess(false);
            setMessage('Số lượng không được bỏ trống.');
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

        const itemData :ItemHistory = {
            itemid: item.id,
            volume: parseInt(volume),
            inbound: true,
            outsup,
            createat
        };
        //Dữ liệu đưa vào bảng Item
        const currentVolumeData = {
            id: item.id!,
            name: item.name,
            unitprice: item.unitprice,
            currentvolume: parseInt(volume) + currentVolume, // Cập nhật số lượng trong kho
        };

        try {
            // Cập nhật kho và lịch sử
            await updateItemById(currentVolumeData);
            await createItemHistory(itemData);
            // Lấy dữ liệu mới từ database
            const updatedItem = await fetchItemById(item.id);
            if (updatedItem) {
                setCurrentVolume(updatedItem[0].currentvolume); // Cập nhật số lượng từ database
            }
            setMessage('Tạo thành công!');
            setIsSuccess(true);

            // Reset form
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
        <div className="bg-gray-200 rounded-md p-4 text-black">
            {item && (
                <>
                    <div className="text-center p-2">
                        Lưu ý! Bạn đang nhập vào KHO, không phải Agent.
                        <br />
                        {item.name}
                        <br />
                        Số lượng hiện tại trong KHO: {currentVolume}
                    </div>
                    <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
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
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'OK'}
                            </button>
                        </div>
                        {message && (
                            <div className={`mt-2 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </>
            )}
        </div>
    );
}
