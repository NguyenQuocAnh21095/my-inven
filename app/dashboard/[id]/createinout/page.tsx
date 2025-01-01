import Link from "next/link";
import {fetchAgents} from "@/app/lib/data";
import InOutForm from "@/app/ui/itemdetail/inout-form";
import {Agent} from "@/app/lib/definitions";

export default async function Page(props: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{isImport:string}>
})
{
    const params = await props.params;
    const searchParams = await props.searchParams;
    const isImport = searchParams.isImport;
    const id = params.id;
    const isImportType = isImport === 'true';

    const agentsData  = await fetchAgents();
    const agents: Agent[] = agentsData.map(agentData => ({ id: agentData.id, agent: agentData.agent }));

    console.log(isImportType);

    return(
        <div>
            <Link className="text-blue-500" href={`/dashboard/${id}`}>Quay về</Link>
            <div className="flex justify-center">{isImportType? "Bạn đang mở Form NHẬP":"Bạn đang mở Form XUẤT"}</div>
            <InOutForm itemid={id} agents={agents} isImport={isImportType}/>
        </div>
    )
}