import {fetchHistoryById, fetchItemById} from '@/app/lib/data';
import { formatDateToLocal } from "@/app/lib/utils";
import clsx from 'clsx';
import {DeleteItemHistoryButton, EditItemHistoryButton} from "@/app/ui/itemdetail/inout-button";
import {Item} from "@/app/lib/definitions";

export default async function HistoryDetailTable({ id, agentId, startDate, endDate }: {
    id: string,
    agentId: string,
    startDate: string,
    endDate: string
}) {
    const items = await fetchHistoryById(id, agentId, startDate, endDate);
    const itemsData = await fetchItemById(id);
    const ite:Item ={
        id:itemsData[0].id,
        name: itemsData[0].name,
        unitprice: itemsData[0].unitprice,
        currentvolume: itemsData[0].currentvolume,
    }

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
                    <div className="max-h-[60vh] overflow-y-auto pt-4">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className={clsx("mb-2 w-full rounded-md p-2 flex justify-between text-black",
                                    {
                                        'bg-white': item.inbound,
                                        'bg-yellow-400': !item.inbound && item.outsup,
                                        'bg-white text-red-500': !item.inbound && !item.outsup,
                                        'bg-orange-300': item.volume < 0,
                                        'text-green-500': item.inbound && item.outsup,
                                    }
                                )}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <strong>{item.inbound ? 'Nhập' : 'Xuất'}: {item.volume}</strong>
                                    <div>Ngày: {formatDateToLocal(item.createat)}</div>
                                </div>
                                <div className="flex justify-end gap-2 ml-2">
                                    {/* Điều kiện ẩn nút */}
                                    {!(item.inbound && item.outsup) && item.volume >= 0 && (
                                        <EditItemHistoryButton id={id} historyId={item.id} inbound={item.inbound} />
                                    )}
                                    <DeleteItemHistoryButton item={ite} historyId={item.id} inbound={item.inbound} newVolume={item.volume} />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
