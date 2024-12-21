import {fetchHistory} from '@/app/lib/data';
import {formatDateToLocal} from "@/app/lib/utils";

export default async function HistoryTable({ query, start, end}: { query: string, start: string, end: string }) {
    const items = await fetchHistory(query,start,end);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div>
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                {item.name} - SL: {item.volume} - Ngày: {formatDateToLocal(item.createat)}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
