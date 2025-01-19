import TransForm from "@/app/ui/itemdetail/transform-form";
import {Agent, Item} from "@/app/lib/definitions";
import {fetchAgents, fetchItemById} from "@/app/lib/data";

export default async function Page(props: {
    params: Promise<{ id: string }>
}) {
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


    return (
        <div>
            <TransForm agents={agents} item={item}/>
        </div>
    )
}