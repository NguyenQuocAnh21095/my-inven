'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Agent } from "@/app/lib/definitions";

export default function FilterMonthBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState<string>('');

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

    const handleChange = (value: string) => {
        setSelectedValue(value);
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (value) {
            newSearchParams.set('agent', value); // Cập nhật query param
            replace(`${pathname}?${newSearchParams.toString()}`);
        } else {
            newSearchParams.delete('agent');
            replace(`${pathname}`);
        }
    };

    // Hàm gọi API để lấy dữ liệu từ database
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch('/api/agents'); // Đường dẫn API
                if (!res.ok) throw new Error('Failed to fetch options');
                const data = await res.json();
                setOptions(data); // Gán dữ liệu vào state
            } catch (error) {
                console.error(error);
            }
        };

        fetchOptions();
    }, []);

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
        <div className="flex flex-1 justify-between items-center bg-green-500 rounded-md py-[9px] px-4 text-black">
            <div className="flex flex-1 justify-start">
                <select
                    className="rounded-md"
                    id="agents"
                    value={selectedValue}
                    onChange={(e) => {
                        handleChange(e.target.value);
                    }}>
                    <option value="All agents">All Agent</option>
                    {options?.map((option: Agent) => (
                        <option key={option.id} value={option.agent}>
                            {option.agent}
                        </option>
                    ))}
                    <option value="No Agent">No Agent</option>
                </select>
                {/*<p>Selected Agent: {selectedValue}</p>*/}
            </div>
            <div className="flex flex-1 justify-end">
                    <DatePicker
                        className="rounded-md"
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
                                // Tính toán ngày cuối cùng của tháng của ngày kết thúc đã chọn
                                const endMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0);
                                endMonth.setHours(endMonth.getHours() + 7);
                                setEndDate(endMonth);
                            } else {
                                setEndDate(undefined);
                            }
                        }}
                        isClearable
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                    />
            </div>
        </div>
    );
}
