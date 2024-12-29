import {fetchItemById} from "@/app/lib/data";
import {notFound} from "next/navigation";
import HistoryDetailTable from "@/app/ui/dashboard/historydetail-table";
import FilterBar from "@/app/ui/dashboard/filter-bar";
import ItemDetailHeader from "@/app/ui/dashboard/itemdetail-header";

export default async function Page(props: {
    params: Promise<{ id: string }> ,
    searchParams?: Promise<{
        query?: string;
        startDate?: string;
        endDate?: string;
    }>
    }) {

    const params = await props.params;
    const searchParams = await props.searchParams;
    const id = params.id;
    const query = searchParams?.query || 'all';
    const startDate = searchParams?.startDate || new Date(new Date().getFullYear(), 10, 1).toISOString().split('T')[0];
    const endDate = searchParams?.endDate || new Date().toISOString().split('T')[0];

    const item = await fetchItemById(id)

    console.log(id);
    if (!item[0]) {
        notFound();
    }
    return (
        <div>
            <div>Tên: {item[0].name} - {item[0].unitprice}</div>
            <ItemDetailHeader id={id} agentId={query} startDate={startDate} endDate={endDate} />
            <FilterBar/>
            <HistoryDetailTable id={id}/>
        </div>
    )
}