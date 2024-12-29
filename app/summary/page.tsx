
import {Suspense} from "react";
import {Skeleton} from "@/app/ui/skeleton";
import FilterBar from "@/app/ui/dashboard/filter-bar";
import HistoryTable from "@/app/ui/dashboard/history-table";
// import SummaryTable from "@/app/ui/dashboard/summary-table";


export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        startDate?: string;
        endDate?: string;
    }>;
})
{
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const startDate = searchParams?.startDate || new Date(new Date().getFullYear(), 10, 1).toISOString().split('T')[0];
    const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0];
    // const currentPage = Number(searchParams?.page) || 1;
    // const totalPages = await fetchInvoicesPages(query);
    // console.log(searchParams);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Summary</h1>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 md:mt-8">
                <FilterBar />
                {/*<CreateInvoice />*/}
            </div>
            <Suspense key={query} fallback={<Skeleton />}>
                <HistoryTable query={query} start={startDate} end={endDate}/>
                {/*<SummaryTable query={query}/>*/}
            </Suspense>
            {/*<div className="mt-5 flex w-full justify-center">*/}
            {/*    <Pagination totalPages={totalPages} />*/}
            {/*</div>*/}
        </div>
    );
}