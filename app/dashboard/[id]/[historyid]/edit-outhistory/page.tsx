import {fetchAgents, fetchItemById, fetchItemHistoryById} from "@/app/lib/data";
import {Agent, Item, ItemHistory} from "@/app/lib/definitions";
import EditItemHistoryOutForm from "@/app/ui/itemdetail/edit-itemhistory-outform";

export default async function Page(props: {
    params: Promise<{ id: string, historyid: string }> ,
    searchParams?: Promise<{
        inbound?: string;
    }>
})
{
    const params = await props.params;
    const id = params.id;
    const historyid = params.historyid;

    const agentsData  = await fetchAgents();
    const agents: Agent[] = agentsData.map(agentData => ({ id: agentData.id, agent: agentData.agent }));

    const itemsHistory = await fetchItemHistoryById(historyid);
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
            <EditItemHistoryOutForm item={item} itemHistory={itemHistory} agents={agents}/>
        </div>
    )
}