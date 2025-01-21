import {fetchSummary} from '@/app/lib/data';
import {formatCurrency} from "@/app/lib/utils";

export default async function SummaryTable({agentId, startDate, endDate}:{
    agentId:string,
    startDate:string,
    endDate:string}) {
    const items = await fetchSummary(agentId, startDate, endDate);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
                    <div className="max-h-[60vh] overflow-y-auto pt-2">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className="mb-2 w-full rounded-md p-4 flex bg-white justify-between text-black items-center gap-1"
                            >
                                <strong
                                    className="w-[20vh] break-words" // Giới hạn độ rộng và cho phép tên xuống dòng
                                    title={item.name} // Hiển thị tên đầy đủ khi hover
                                >
                                    {item.name}
                                </strong>
                                <div className="min-w-[70px]">
                                    <span className={item.current_stock > 0 ? 'text-red-500' : ''}>
                                        Tồn: {item.current_stock}
                                    </span>
                                    <br/>
                                    <span className={item.next_stock > 0 ? 'text-green-500' : ''}>
                                        CT: {item.next_stock}
                                    </span>
                                </div>

                                <div>
                                    ĐG: {formatCurrency(item.unitprice)}
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
}
