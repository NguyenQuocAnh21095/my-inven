import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-link';
import MienLogo from "@/app/ui/mien-logo";
// import AcmeLogo from '@/app/ui/acme-logo';

// import { signOut } from '@/auth';

export default function SideNav() {
    return (
        <div className="flex h-full flex-col md:px-2">
            <Link
                className="p-1 flex items-center justify-start bg-green-600 md:h-40"
                href="/dashboard"
            >
                <div className="text-white md:w-40">
                    <MienLogo/>
                </div>
            </Link>
            <div className="flex p-1 grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                {/*<form*/}
                {/*    action={async () => {*/}
                {/*        'use server';*/}
                {/*        await signOut();*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">*/}
                {/*        <cli>*/}
                {/*        <div className="hidden md:block">Sign Out</div>*/}
                {/*    </button>*/}
                {/*</form>*/}
            </div>
        </div>
    );
}
