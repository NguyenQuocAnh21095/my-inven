import Link from "next/link";
import {fetchAgents, fetchItemById} from "@/app/lib/data";
import {Agent, Item} from "@/app/lib/definitions";
// import InTotalForm from "@/app/ui/itemdetail/intotal-form";
import OutForm from "@/app/ui/itemdetail/out-form";

export default async function Page(props: {
    params: Promise<{ id: string }>
})
{
    const params = await props.params;
    const id = params.id;

    const agentsData  = await fetchAgents();
    const agents: Agent[] = agentsData.map(agentData => ({ id: agentData.id, agent: agentData.agent }));

    const itemsData = await fetchItemById(id);
    const item: Item = {
        id: itemsData[0].id,
        name: itemsData[0].name,
        unitprice: itemsData[0].unitprice,
        currentvolume: itemsData[0].currentvolume,
    };


    return(
        <div>
            <Link className="text-blue-500" href={`/dashboard/${id}`}>Quay về</Link>
            {/*<div className="flex justify-center text-center text-black">Bạn đang mở Form NHẬP<br/>KHO: {item.currentvolume}</div>*/}
            {/*<InTotalForm item={item}/>*/}
            <OutForm agents={agents} item={item}/>
        </div>
    )
}