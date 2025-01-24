import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeleton";
import InventoryTable from "@/app/ui/dashboard/inventory-table";
import Link from "next/link";
import FiltermonthBar3 from "@/app/ui/dashboard/filtermonth-bar3";
import {fetchItemById} from "@/app/lib/data";
import {Item} from "@/app/lib/definitions";

export default async function Page(props: {
    params: Promise<{ id: string }> ,
    searchParams?: Promise<{
        agentId?: string;
        startDate?: string;
        endDate?: string;
    }>;
})
{
    const searchParams = await props.searchParams;
    const params = await props.params;
    const id = params.id;

    const items = await fetchItemById(id);
    const item: Item = {
        id: items[0].id,
        name: items[0].name,
        unitprice: items[0].unitprice,
        currentvolume: items[0].currentvolume,
    };

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

    // Thiết lập các giá trị mặc định
    const startDate = searchParams?.startDate || defaultStartDate;
    const endDate = searchParams?.endDate || defaultEndDate;

    return (
        <div className="text-black">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Tổng quan kho tổng</h1>
            </div>
            <Link href={`/dashboard/${id}`}
                  className="text-blue-500">
                Quay về
            </Link>
            <div className="text-center">Vật phẩm: {item.name}</div>
            <div className="mt-2 flex items-center justify-between gap-2 md:mt-8">
                <FiltermonthBar3 />
            </div>
            <Suspense key={startDate} fallback={<Skeleton />}>
                <InventoryTable id={id} startDate={startDate} endDate={endDate}/>
            </Suspense>
            {/*<div className="mt-5 flex w-full justify-center">*/}
            {/*    <Pagination totalPages={totalPages} />*/}
            {/*</div>*/}
        </div>
    );
}
