import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import clsx from "clsx";

export function ImExportItem({ id, isImport }: { id: string; isImport: boolean }) {
    return (
        <Link
            href={`/dashboard/${id}/createinout?isImport=${isImport}`}
            className={clsx("flex h-10 items-center rounded-lg bg-green-500 px-4 text-bold font-medium text-white transition-colors",
                {'bg-red-500' : isImport == false
                })}
        >
            <span>{isImport ? "Nhập":"Xuất"}</span>
            {isImport === true ? <PlusIcon className="h-5 md:ml-4" /> : <MinusIcon className="h-5 md:ml-4" />}
        </Link>
    );
}
