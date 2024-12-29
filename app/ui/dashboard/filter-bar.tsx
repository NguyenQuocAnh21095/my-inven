'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Agent} from "@/app/lib/definitions";

export default function FilterBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(() => {
        // const today = new Date();
        // const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfMonth = new Date(new Date().getFullYear(), 10, 1);
        firstDayOfMonth.setHours(firstDayOfMonth.getHours() + 7);
        console.log(firstDayOfMonth);
        return firstDayOfMonth;
    })
    const [endDate, setEndDate] = useState<Date>(()=> {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        console.log(today);
        return today;
    });


    const handleChange = (value: string) => {
        setSelectedValue(value);
        const newSearchParams = new URLSearchParams(searchParams.toString());

        if (value) {
            newSearchParams.set('query', value); // Cập nhật query param
            replace(`${pathname}?${newSearchParams.toString()}`);
        } else {
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
            console.log(startDate);
        }

        if (endDate) {
            newSearchParams.set('endDate', endDate.toISOString().split('T')[0]);
        }

        // Cập nhật URL với các tham số ngày
        replace(`${pathname}?${newSearchParams.toString()}`);
    }, [startDate, endDate, pathname, searchParams, replace]);

    return (
        <div className="flex flex-1 justify-between items-center bg-green-500 rounded-md py-[9px] px-4">
            <div className="flex flex-1 justify-start">
                <select
                    className="rounded-md"
                    id="agents"
                    value={selectedValue}
                    onChange={(e) => {
                        handleChange(e.target.value);
                    }}>
                    <option value="all">All Agent</option>
                    {options?.map((option:Agent) => (
                        <option key={option.id} value={option.agent}>
                            {option.agent}
                        </option>
                    ))}
                </select>
                {/*<p>Selected Agent: {selectedValue}</p>*/}
            </div>
            <div className="flex flex-1 justify-end">
                <DatePicker
                    className="rounded-md"
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(dates) => {
                        const [start, end] = dates;
                        if (start){
                            start.setHours(start.getHours()+7);
                            setStartDate(start);
                        };
                        if (end) {
                            end.setHours(end.getHours()+7);
                            setEndDate(end);
                        };
                    }}
                    isClearable
                />
            </div>
        </div>
    );
}
