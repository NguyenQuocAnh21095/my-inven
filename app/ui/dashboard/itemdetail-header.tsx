import {fetchCurrentInOutById} from "@/app/lib/data";

export default async function ItemDetailHeader({id, agentId, startDate, endDate}:{
    id:string,
    agentId:string,
    startDate:string,
    endDate:string}){

    const currentValue = await fetchCurrentInOutById(id, agentId, startDate, endDate);
    if (currentValue[0]) {
    return (
        <div className="flex justify-between">
            <div>Cửa hàng: {currentValue[0].agent}</div>
            <div>Nhập: <strong className="text-green-500">{currentValue[0].total_inbound}</strong> -
                Xuất: <strong className="text-red-500">{currentValue[0].total_outbound}</strong></div>
        </div>
    )}
    else return (
        <div>
            Không tìm thấy sản phẩm!
        </div>
    )
}