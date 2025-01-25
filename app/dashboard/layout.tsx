import SideNav from "@/app/ui/dashboard/side-nav";

export default function DashboardLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white">
            <div className="w-full flex-none md:w-64">
                <SideNav/>
            </div>
            <div className="flex-grow px-2 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}