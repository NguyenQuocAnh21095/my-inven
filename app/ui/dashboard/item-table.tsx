import { fetchFilteredItems } from '@/app/lib/data';

export default async function InvoicesTable({ query}: { query: string}) {
    const items = await fetchFilteredItems(query);

    return (
        <div className="mt-3 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div>
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                {item.name} - Đơn giá: {item.unitprice}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
