import {fetchItemById} from "@/app/lib/data";
import {notFound} from "next/navigation";
import HistoryDetailTable from "@/app/ui/dashboard/historydetail-table";
import FilterBar from "@/app/ui/dashboard/filter-bar";
import ItemDetailHeader from "@/app/ui/dashboard/itemdetail-header";
import {ImExportItem} from "@/app/ui/itemdetail/inout-button";

export default async function Page(props: {
    params: Promise<{ id: string }> ,
    searchParams?: Promise<{
        agent?: string;
        startDate?: string;
        endDate?: string;
    }>
    }) {
    // Tính toán các giá trị mặc định cho startDate và endDate
    const currentDate = new Date();

    // Đầu tháng hiện tại với cộng thêm 7 giờ
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startOfMonth.setHours(startOfMonth.getHours() + 7);
    const defaultStartDate = startOfMonth.toISOString().slice(0, 10);

    // Cuối tháng hiện tại với cộng thêm 7 giờ
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    endOfMonth.setHours(endOfMonth.getHours() + 7);
    const defaultEndDate = endOfMonth.toISOString().slice(0, 10);

    const params = await props.params;
    const searchParams = await props.searchParams;

    const id = params.id;
    const agent = searchParams?.agent || 'All agents';
    const startDate = searchParams?.startDate || defaultStartDate;
    const endDate = searchParams?.endDate || defaultEndDate;

    const item = await fetchItemById(id)

    console.log(defaultStartDate,defaultEndDate, startDate, endDate);
    if (!item[0]) {
        notFound();
    }
    return (
        <div>
            <div>Tên: {item[0].name} - {item[0].unitprice}</div>
            <ItemDetailHeader id={id} agentId={agent} startDate={startDate} endDate={endDate} />
            <FilterBar/>
            <div className="flex justify-between gap-2 my-2">
                <ImExportItem id={id} isImport={true}/>
                <ImExportItem id={id} isImport={false}/>
            </div>
            <HistoryDetailTable id={id} agentId={agent} startDate={startDate} endDate={endDate} />
        </div>
    )
}