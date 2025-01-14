import { fetchFilteredItems } from '@/app/lib/data';
import Link from "next/link";
import clsx from "clsx";

export default async function InvoicesTable({ query}: { query: string}) {
    const items = await fetchFilteredItems(query);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="max-h-[50vh] overflow-y-auto">
                        {items?.map((item) => (
                            <Link href={`/dashboard/${item.id}`}
                                key={item.id}
                                className={clsx("flex mb-2 w-full rounded-md bg-white p-4 text-black justify-between items-center",
                                    {"text-red-500":item.currentvolume<=3})}
                            >
                                <div>
                                    <strong>{item.name}</strong>
                                    <div>Đơn giá: {item.unitprice.toLocaleString()}</div>
                                </div>
                                <div>Số lượng hiện tại: {item.currentvolume}</div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
