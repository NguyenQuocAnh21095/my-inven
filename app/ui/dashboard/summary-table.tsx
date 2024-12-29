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
                                        'bg-green-400': item.inbound,
                                        'bg-yellow-400': item.outsup,
                                        'bg-white': !item.inbound && !item.outsup,
                                    }
                                )}
                            >
                                {item.name} - SL: {item.total_volume}<br/>
                                Đơn Giá: {formatCurrency(item.unitprice)}
                                <div>
                                    Tháng: {formatDateToLocal(item.month).slice(3,10)}<br/>
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
