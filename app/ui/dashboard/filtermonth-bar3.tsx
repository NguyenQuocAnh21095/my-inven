'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FiltermonthBar3() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Hàm tính toán đầu tháng và cuối tháng hiện tại
    const getDefaultDates = () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startOfMonth.setHours(startOfMonth.getHours() + 7); // Cộng thêm 7 giờ
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endOfMonth.setHours(endOfMonth.getHours() + 7); // Cộng thêm 7 giờ

        return { startOfMonth, endOfMonth };
    };

    // Sử dụng hàm tính toán để khởi tạo state
    const { startOfMonth, endOfMonth } = getDefaultDates();
    const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth);
    const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth);

    // Cập nhật searchParams với startDate và endDate
    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (startDate) {
            newSearchParams.set('startDate', startDate.toISOString().split('T')[0]);
        } else {
            newSearchParams.delete('startDate');
        }

        if (endDate) {
            newSearchParams.set('endDate', endDate.toISOString().split('T')[0]);
        } else {
            newSearchParams.delete('endDate');
        }

        // Cập nhật URL với các tham số ngày
        replace(`${pathname}?${newSearchParams.toString()}`);
    }, [startDate, endDate, pathname, searchParams, replace]);

    return (
        <div className="flex flex-1 justify-center items-center bg-green-500 rounded-md py-[9px] px-2 text-black">
            <DatePicker
                className="rounded-md h-7 max-w-[170px]"
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    if (start) {
                        start.setHours(start.getHours() + 7);
                        setStartDate(start);
                    } else {
                        setStartDate(undefined);
                    }
                    if (end) {
                        const endMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0);
                        endMonth.setHours(endMonth.getHours() + 7);
                        setEndDate(endMonth);
                    } else {
                        setEndDate(undefined);
                    }
                }}
                isClearable
                customInput={<input type="text" className="rounded-md" readOnly />}
                showMonthYearPicker
                dateFormat="MM/yyyy"
            />
        </div>
    );
}
