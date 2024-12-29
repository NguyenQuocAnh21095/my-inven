import { fetchFilteredItems } from '@/app/lib/data';
import Link from "next/link";

export default async function InvoicesTable({ query}: { query: string}) {
    const items = await fetchFilteredItems(query);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="max-h-[50vh] overflow-y-auto">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex mb-2 w-full rounded-md bg-white p-4 text-black"
                            >
                                <Link href={`/dashboard/${item.id}`}>
                                    <strong>{item.name}</strong>
                                    <div>Đơn giá: {item.unitprice}</div>
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
