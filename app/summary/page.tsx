import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeleton";
import SummaryTable from "@/app/ui/dashboard/summary-table";
import FiltermonthBar2 from "@/app/ui/dashboard/filtermonth-bar2";

export default async function Page(props: {
    searchParams?: Promise<{
        agentId?: string;
        startDate?: string;
        endDate?: string;
    }>;
})
{
    const searchParams = await props.searchParams;

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
    const agentId = searchParams?.agentId || '';
    const startDate = searchParams?.startDate || defaultStartDate;
    const endDate = searchParams?.endDate || defaultEndDate;
    // console.log(defaultStartDate, defaultEndDate);

    return (
        <div className="w-full text-black">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Tổng quan tồn kho</h1>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 md:mt-8">
                <FiltermonthBar2 />
            </div>
            <Suspense key={agentId} fallback={<Skeleton />}>
                <SummaryTable agentId={agentId} startDate={startDate} endDate={endDate}/>
            </Suspense>
            {/*<div className="mt-5 flex w-full justify-center">*/}
            {/*    <Pagination totalPages={totalPages} />*/}
            {/*</div>*/}
        </div>
    );
}
