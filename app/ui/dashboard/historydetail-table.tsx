import {fetchHistoryById} from '@/app/lib/data';
import {formatDateToLocal} from "@/app/lib/utils";
import clsx from 'clsx';

export default async function HistoryDetailTable({id}: { id: string}) {
    const items = await fetchHistoryById(id);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="max-h-[60vh] overflow-y-auto">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className={clsx(
                                    "mb-2 w-full rounded-md p-4",
                                    {
                                        'bg-green-400': item.inbound,
                                        'bg-yellow-400': item.outsup,
                                        'bg-white': !item.inbound && !item.outsup,
                                    }
                                )}
                            >
                                SL: {item.volume} - Ngày: {formatDateToLocal(item.createat)}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
