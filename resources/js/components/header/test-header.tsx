import DILGLOGO from '../../../images/dilg-main-logo.png';
import { useState, useEffect } from 'react';

const TestHeader = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();
    };

    // Get day of week
    const getDayOfWeek = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long'
        });
    };

    // Split time to separate AM/PM
    const splitTime = (timeString) => {
        const [time, period] = timeString.split(' ');
        return { time, period };
    };

    const { time, period } = splitTime(formatTime(currentTime));

    return (
        <>
            <div className="flex w-full items-center justify-between bg-[#E1E3E6] p-6">
                <div className="flex items-end gap-4">
                    <img src={DILGLOGO} alt="dilglogo" className="h-24 w-24" />
                    <div className="flex flex-col items-start">
                        <h1 className="text-2xl font-bold text-black tracking-tighter">
                            REPUBLIC OF THE PHILIPPINES
                        </h1>

                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full border-t-3 border-gray-800"></div>
                            <h2 className='font-bold text-black text-xl tracking-tighter pt-1'>
                                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
                            </h2>
                        </div>

                        <h3 className='font-md text-black text-lg tracking-tighter'>
                            BOHOL PROVINCE
                        </h3>
                    </div>
                </div>

                {/* Clock Section */}
                <div className="flex flex-col items-start">
                    <h4 className="text-xs font-sm text-gray-500 tracking-tighter">
                        PHILIPPINES
                    </h4>
                    <div className="flex flex-col items-start">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-black">
                                {time}
                            </span>
                            <span className="text-xs font-light text-gray-500 ml-1">
                                {period}
                            </span>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-semibold text-blue-900">
                                {getDayOfWeek(currentTime)}
                            </span>
                            <span className="text-xs font-semibold text-black">
                                {formatDate(currentTime)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestHeader;
