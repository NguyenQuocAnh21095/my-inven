import Image from "next/image";

export default function MienLogo() {
    return (
        <div className="flex flex-row items-center leading-none text-white">
            <Image
                src="/logo.png"
                className="h-[40px] w-[40px] rounded-md mr-2"
                width={40}
                height={40}
                alt="No logo"
            />
            <p className="text-[24px]">Hiệu giặt thơm</p>
        </div>
    );
}
