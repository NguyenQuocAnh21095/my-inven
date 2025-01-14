import CreateItemForm from "@/app/ui/item/createitem-form";
import Link from "next/link";

export default function Page(){
    return (
        <div>
            <Link className="text-blue-500" href="/dashboard">Quay về</Link>
            <div className="flex justify-center text-black">Tạo vật phẩm</div>
            <CreateItemForm/>
        </div>
    )
}