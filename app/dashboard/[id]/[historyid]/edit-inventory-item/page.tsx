import {fetchItemById, fetchItemHistoryById, fetchTotalInOutInventoryByItemId} from "@/app/lib/data";
import {Item, ItemHistory} from "@/app/lib/definitions";
import EditInvenItemHistoryForm from "@/app/ui/itemdetail/edit-invenitemhistory-form";

export default async function Page(props: {
    params: Promise<{ id: string, historyid: string }>
})
{
    const params = await props.params;
    const id = params.id;
    const historyid = params.historyid;

    const itemsHistory = await fetchItemHistoryById(historyid);
    const totalInOut = await fetchTotalInOutInventoryByItemId(id);

    const itemHistory: ItemHistory = {
        id: itemsHistory[0].id,
        itemid: itemsHistory[0].itemid,
        agentid: itemsHistory[0].agentid,
        volume: itemsHistory[0].volume,
        inbound: itemsHistory[0].inbound,
        outsup: itemsHistory[0].outsup,
        createat: itemsHistory[0].createat,
    }

    const itemsData = await fetchItemById(id);
    const item: Item = {
        id: itemsData[0].id,
        name: itemsData[0].name,
        unitprice: itemsData[0].unitprice,
        currentvolume: itemsData[0].currentvolume,
    };

    return(
        <div>
            {/*<div className="flex justify-center text-center text-black">Bạn đang mở Form NHẬP<br/>KHO: {item.currentvolume}</div>*/}
            {/*<InTotalForm item={item}/>*/}
            <EditInvenItemHistoryForm item={item} itemHistory={itemHistory} totalInOut={{
                totalIn: totalInOut.total_in,
                totalOut: totalInOut.total_out
            }}/>
        </div>
    )
}