import {PlusIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateItemButton() {
    return (
        <Link
            href="/dashboard/createitem"
            className="flex h-10 items-center rounded-lg bg-blue-400 hover:bg-blue-500 px-4 text-bold font-medium text-white transition-colors"
        >
            <span>Thêm</span>
            <PlusIcon className="h-5 md:ml-4"/>
        </Link>
    );
}
