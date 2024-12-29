import Image from "next/image";

export default function MienLogo() {
    return (
        <div className="flex flex-row items-center leading-none text-white">
            <Image
                src="/logo.png"
                className="h-12 w-12 rounded-md mr-2"
                width={48}
                height={48}
                alt="No logo"
            />
            <p className="text-[44px]">Miên laundry</p>
        </div>
    );
}
