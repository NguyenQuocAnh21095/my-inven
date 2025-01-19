'use client';

import { Agent, Item, ItemHistory } from '@/app/lib/definitions';

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

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black mt-2">
            <div className="text-center p-2">
                Bạn đang cập nhật thông tin lịch sử cho Xuất Item.
                <br />
                {item.name}
                <br />
            </div>
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select
                        className="bg-white rounded-md p-1 m-2"
                        defaultValue={itemHistory.agentid} // Dùng defaultValue ở đây
                    >
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.agent}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex justify-between items-center w-full">
                    <span>Số lượng:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                        type="text"
                        defaultValue={itemHistory.volume}
                    />
                </label>
                <label className="flex justify-between items-center">
                    <span>Xuất bù:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="checkbox"
                        defaultChecked={itemHistory.outsup}
                    />
                </label>
                <label className="flex justify-between items-center">
                    <span>Ngày:</span>
                    <input
                        className="bg-white rounded-md p-1 m-2"
                        type="date"
                        defaultValue={formatDate(itemHistory.createat)}
                    />
                </label>
                <div className="flex justify-end m-2">
                    <button
                        className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                        type="button"
                    >
                        OK
                    </button>
                </div>
            </form>
        </div>
);
}
