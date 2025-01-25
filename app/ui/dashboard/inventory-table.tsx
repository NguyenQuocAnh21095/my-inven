import {fetchInventory} from '@/app/lib/data';
import {formatDateToLocal} from "@/app/lib/utils";
import {EditInvenItemHistoryButton, NoActionButton} from "@/app/ui/itemdetail/inout-button";

export default async function InventoryTable({
                                                 id,
                                                 startDate,
                                                 endDate,
                                             }: {
    id:string;
    startDate: string;
    endDate: string;
})
{
    const items = await fetchInventory(startDate, endDate);

    return (
        <div className="mt-1 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-100 p-1 md:pt-0">
                    <div className="max-h-[55vh] overflow-y-auto space-y-1">
                        {items?.map((item) => (
                            <div
                                  key={item.id}
                                  className="p-2 w-full rounded-md flex bg-white justify-between text-black items-center
                                  "
                            >
                                <strong className={`min-w-[50px] ${item.agent === 'No Agent' ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.agent === 'No Agent' ? 'Nhập: '+item.volume : 'Xuất: '+item.volume}
                                </strong>
                                <div className="min-w-[70px]">
                                    {item.agent}
                                </div>
                                <div>
                                    {formatDateToLocal(item.createat)}
                                </div>
                                    {item.agent === 'No Agent' ? <EditInvenItemHistoryButton id={id} historyId={item.id}/> : <NoActionButton/>}
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
}
