import {fetchSummary} from '@/app/lib/data';
import {formatCurrency, formatDateToLocal} from "@/app/lib/utils";
import clsx from 'clsx';

export default async function SummaryTable({agentId, startDate, endDate}:{
    agentId:string,
    startDate:string,
    endDate:string}) {
    const items = await fetchSummary(agentId, startDate, endDate);

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
                                <strong>{item.name}</strong>
                                SL: {item.total_volume}<br/>
                                ĐG: {formatCurrency(item.unitprice)}
                                <div>
                                    T: {formatDateToLocal(item.month).slice(3,10)}<br/>
                                    TT: {formatCurrency(item.unitprice * item.total_volume)}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
