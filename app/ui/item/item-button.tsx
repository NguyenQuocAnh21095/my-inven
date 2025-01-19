'use client';
import {PencilIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {deleteFullItemById} from "@/app/lib/actions";
import { useState } from 'react';

export function CreateItemButton() {
    return (
        <Link
            href="/dashboard/createitem"
            className="flex h-10 items-center rounded-lg bg-blue-400 hover:bg-blue-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Thêm</span>
            <PlusIcon className="h-5 md:ml-4"/>
        </Link>
    );
}
export function UpdateItemButton({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/${id}/edit-item`}
            className="rounded-md border border-blue-500 text-blue-500 p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteItemButton({ id }: { id: string }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Hàm xử lý delete
    const handleDelete = async () => {
        try {
            await deleteFullItemById({ id });
            setIsPopupOpen(false); // Đóng popup sau khi xóa thành công
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <button
                className="rounded-md border p-2 border-red-500 hover:bg-gray-100"
                onClick={() => setIsPopupOpen(true)} // Mở popup khi nhấn delete button
            >
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5 text-red-500" />
            </button>

            {/* Popup cảnh báo */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <p>1. Bạn có chắc chắn muốn xóa không?
                        <br/>2. Tất cả dữ liệu lịch sử liên quan sẽ bị xóa cùng vật phẩm!</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-300 p-2 rounded-md"
                                onClick={() => setIsPopupOpen(false)} // Đóng popup khi nhấn Cancel
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-500 p-2 text-white rounded-md"
                                onClick={handleDelete} // Gọi hàm xóa khi nhấn Delete
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
