'use client';

import { ClipboardDocumentIcon, ListBulletIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// import * as console from "node:console";

const links = [
    {   name: 'Home',
        href: '/dashboard',
        icon: ListBulletIcon },
    {
        name: 'Summary',
        href: '/summary',
        icon: ClipboardDocumentIcon,
    },
    // {   name: 'Customers',
    //     href: '/dashboard/customers',
    //     icon: UserGroupIcon },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium ' +
                            'hover:bg-green-400 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-green-500 text-white': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
