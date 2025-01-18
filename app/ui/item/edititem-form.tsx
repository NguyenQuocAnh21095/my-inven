'use client';

import {useState} from "react";
import {updateItemById} from "@/app/lib/actions";
import {Item} from "@/app/lib/definitions";

export default function EditItemForm({item}: {item: Item}) {
    const [name, setName] = useState(item.name);
    const [unitprice, setUnitprice] = useState(item.unitprice.toString());
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');

        if(!name){
            setIsSuccess(false);
            setMessage('Tên không được bỏ trống!');
            setIsLoading(false);
            return;
        }
        if(name === item.name){
            setIsSuccess(false);
            setMessage('Vui lòng cập nhật Tên !');
            setIsLoading(false);
            return;
        }
        if(!unitprice){
            setIsSuccess(false);
            setMessage('Giá tiền không được bỏ trống!');
            setIsLoading(false);
            return;
        }
        if(unitprice === item.unitprice.toString()){
            setIsSuccess(false);
            setMessage('Vui lòng cập nhật giá tiền!');
            setIsLoading(false);
            return;
        }

        const itemData:Item = {
            id: item.id,
            name:name,
            unitprice: parseInt(unitprice),
            currentvolume:item.currentvolume,
        };

        try {
            const result = await updateItemById(itemData);
            console.log('Result:', result);
            setMessage('Cập nhật thành công!');
            setIsSuccess(true);
            // Reset các trường về ban đầu
            // setName('');
            // setUnitprice(0);
            alert('Cập nhật thành công!');
        } catch (error) {
            setMessage('Tạo thất bại!');
            setIsSuccess(false);
            console.error('Failed to create item history:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black">
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center w-full">
                    <span>Tên vật phẩm:</span>
                    <input className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                           type="text"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label className="flex justify-between items-center w-full">
                    <span>Đơn giá:</span>
                    <input className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                           type="number"
                           value={unitprice}
                           onChange={(e) => setUnitprice(e.target.value)}
                    />
                </label>
            </form>
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
            {message && ( <div className={`mt-2 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}> {message} </div> )}
        </div>
    )
}