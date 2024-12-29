import {fetchCurrentInOutById} from "@/app/lib/data";

export default async function ItemDetailHeader({id, agentId, startDate, endDate}:{
    id:string,
    agentId:string,
    startDate:string,
    endDate:string}){

    const currentValue = await fetchCurrentInOutById(id, agentId, startDate, endDate);

    return (
        <div>
            <div>SL: {currentValue[0].agent} - Nhập: {currentValue[0].total_inbound} -
                Xuất: {currentValue[0].total_outbound}</div>
        </div>
    )
}