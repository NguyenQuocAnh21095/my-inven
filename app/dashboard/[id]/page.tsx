import {fetchItemById} from "@/app/lib/data";
import {notFound} from "next/navigation";
import HistoryDetailTable from "@/app/ui/dashboard/historydetail-table";
import ItemDetailHeader from "@/app/ui/dashboard/itemdetail-header";
import {ExportItem, ImportAgentItem, ImportItem, TransformItem} from "@/app/ui/itemdetail/inout-button";
import {Skeleton} from "@/app/ui/skeleton";
import {Suspense} from "react";
import FilterMonthBar from "@/app/ui/dashboard/filtermonth-bar";
import clsx from "clsx";
import Link from "next/link";

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
    const agent = searchParams?.agent || '';
    const startDate = searchParams?.startDate || defaultStartDate;
    const endDate = searchParams?.endDate || defaultEndDate;

    const item = await fetchItemById(id)

    // console.log(defaultStartDate,defaultEndDate, startDate, endDate);
    if (!item[0]) {
        notFound();
    }
    return (
        <div className="text-black text-center">
            <div>Tên: {item[0].name} - {item[0].unitprice.toLocaleString()}</div>
            <Link
                href={`/dashboard/${item[0].id}/inventory`}
                className={clsx("text-green-500 text-xl",
                {"text-red-500": item[0].currentvolume <= 3})}
                >KHO: {item[0].currentvolume}
            </Link>
            <ItemDetailHeader id={id} agentId={agent} startDate={startDate} endDate={endDate} />
            <FilterMonthBar/>
            <div className="flex justify-between gap-1 my-1">
                <ImportItem id={id}/>
                <ImportAgentItem id={id}/>
                <TransformItem id={id}/>
                <ExportItem id={id}/>
            </div>
            <Suspense key={`${agent}-${startDate}-${endDate}`} fallback={<Skeleton/>}>
                <HistoryDetailTable id={id} agentId={agent} startDate={startDate} endDate={endDate} />
            </Suspense>
        </div>
    )
}