import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function ImportItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createimport`}
            className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Nhập Kho</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function ImportAgentItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createagentimport`}
            className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Nhập Agent</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function ExportItem({ id }: { id: string}) {
    return (
        <Link
            href={`/dashboard/${id}/createagentexport`}
            className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Xuất</span>
            <MinusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
