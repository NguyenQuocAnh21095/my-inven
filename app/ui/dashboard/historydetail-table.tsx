import {fetchHistoryById} from '@/app/lib/data';
import {formatDateToLocal} from "@/app/lib/utils";
import clsx from 'clsx';

export default async function HistoryDetailTable({id, agentId, startDate, endDate}:{
    id:string,
    agentId:string,
    startDate:string,
    endDate:string}) {
    const items = await fetchHistoryById(id, agentId, startDate, endDate);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className={clsx(
                                    "mb-2 w-full rounded-md p-4 flex justify-between text-black",
                                    {
                                        'bg-white': item.inbound,
                                        'bg-yellow-400': item.outsup,
                                        'bg-white text-red-500': !item.inbound && !item.outsup,
                                    }
                                )}
                            >
                                <div className="flex justify-between w-full">
                                    <strong>{item.inbound ? 'Nhập' : 'Xuất'}: {item.volume}</strong>
                                    <div>Ngày: {formatDateToLocal(item.createat)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
