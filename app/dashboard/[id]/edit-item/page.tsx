import Link from "next/link";
import {fetchItemById} from "@/app/lib/data";
import {Item} from "@/app/lib/definitions";
import EditItemForm from "@/app/ui/item/edititem-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const itemsData = await fetchItemById(id);
    const item: Item = {
        id: itemsData[0].id,
        name: itemsData[0].name,
        unitprice: itemsData[0].unitprice,
        currentvolume: itemsData[0].currentvolume,
    };
    return (
        <div>
            <Link className="text-blue-500" href="/dashboard">Quay về</Link>
            <div className="flex justify-center text-black">Chỉnh sửa vật phẩm</div>
            <EditItemForm item={item}/>
        </div>
    )
}