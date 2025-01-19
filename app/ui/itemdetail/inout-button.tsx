'use client';
import {
    ArrowsUpDownIcon,
    HandRaisedIcon,
    MinusIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {useState} from "react";
import {DeleteFullInItemhistoryById, DeleteOutItemHistoryById} from "@/app/lib/actions";
import {Item} from "@/app/lib/definitions";

export function ImportItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createimport`}
            className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Nhập Kho</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function ImportAgentItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createagentimport`}
            className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Nhập Agent</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function ExportItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createagentexport`}
            className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Xuất</span>
            <MinusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function TransformItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/transform`}
            className="flex h-10 items-center rounded-lg bg-yellow-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Chuyển tồn</span>
            <ArrowsUpDownIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function EditItemHistoryButton({ id, historyId, inbound }: { id: string; historyId: string; inbound: boolean }) {
    return (
        <Link
            href={`/dashboard/${id}/${historyId}/${inbound ? 'edit-inhistory' : 'edit-outhistory'}`}
            className="rounded-md border p-2 border-blue-500 text-blue-500 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteItemHistoryButton({item, historyId, inbound, newVolume}: { item: Item, historyId: string; inbound: boolean, newVolume:number }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Hàm xử lý delete
    const handleDelete = async () => {
        try {
            if (inbound){
                await DeleteFullInItemhistoryById({item,historyId,newVolume});
                setIsPopupOpen(false); // Đóng popup sau khi xóa thành công
            } else {
                await DeleteOutItemHistoryById({item,historyId});
                setIsPopupOpen(false); // Đóng popup sau khi xóa thành công
            }
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
                    <div className="bg-white p-5 rounded-lg shadow-lg text-black">
                        <p>Bạn có chắc chắn muốn xóa không?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-300 p-2 rounded-md"
                                onClick={() => setIsPopupOpen(false)} // Đóng popup khi nhấn Cancel
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-500 p-2 text-white rounded-md"
                                onClick={handleDelete}
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

export function NoActionButton() {
    return (
        <div
            className="rounded-md border p-2 border-gray-500"
        >
            <span className="sr-only">No Action</span>
            <HandRaisedIcon className="w-5 text-gray-500"/>
        </div>
    )
}