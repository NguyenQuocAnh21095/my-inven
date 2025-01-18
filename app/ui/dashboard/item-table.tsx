import { fetchFilteredItems } from '@/app/lib/data';
import Link from "next/link";
import clsx from "clsx";
import {DeleteItemButton, UpdateItemButton} from "@/app/ui/item/item-button";

export default async function InvoicesTable({ query}: { query: string}) {
    const items = await fetchFilteredItems(query);

    return (
        <div className="mt-3 flow-root">
            <div>Kiểm tra branch</div>
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="max-h-[50vh] overflow-y-auto pt-2">
                        {items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between mb-2 w-full rounded-md bg-white p-3 text-black">
                                <Link href={`/dashboard/${item.id}`}
                                      className={clsx("flex w-full rounded-md bg-white text-black justify-between items-center",
                                          {"text-red-500": item.currentvolume <= 3})}
                                >
                                    <div>
                                        <strong>{item.name}</strong>
                                        <div>Đơn giá: {item.unitprice.toLocaleString()}</div>
                                    </div>
                                    <div>Số lượng hiện tại: {item.currentvolume}</div>

                                </Link>
                                <div className="flex justify-end gap-2 ml-2">
                                    <UpdateItemButton id={item.id}/>
                                    <DeleteItemButton id={item.id}/>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
