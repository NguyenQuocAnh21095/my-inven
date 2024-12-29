// import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/dashboard/search-box'
import {Suspense} from "react";
import {Skeleton} from "@/app/ui/skeleton";
// import Table from '@/app/ui/dashboard/item-table'
import InvoicesTable from "@/app/ui/dashboard/item-table";
// import { CreateInvoice } from '@/app/ui/invoices/buttons';
// import { fetchInvoicesPages } from '@/app/lib/data';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
})
{
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    // const currentPage = Number(searchParams?.page) || 1;
    // const totalPages = await fetchInvoicesPages(query);
    console.log(searchParams);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Items</h1>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..."/>
                {/*<CreateInvoice />*/}
            </div>
            <div>Chọn vật phẩm để vào trang chi tiết!</div>
            <Suspense key={query} fallback={<Skeleton/>}>
                <InvoicesTable query={query}/>
            </Suspense>
            {/*<div className="mt-5 flex w-full justify-center">*/}
            {/*    <Pagination totalPages={totalPages} />*/}
            {/*</div>*/}
        </div>
    );
}