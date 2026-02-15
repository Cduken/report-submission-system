'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils'; // You may need to add this utility

interface FilterBtnProps {
    onSelect: (year: number | null) => void;
    selectedYear?: number | null;
}

export default function FilterBtn({ onSelect, selectedYear }: FilterBtnProps) {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();

    const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i,
    );

    // Button text based on selected year
    const buttonText = selectedYear ? `Filter: ${selectedYear}` : 'Filter';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {buttonText}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Filter by Year</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* All option */}
                <DropdownMenuItem
                    onClick={() => onSelect(null)}
                    className={cn(
                        "flex items-center justify-between",
                        !selectedYear && "bg-accent"
                    )}
                >
                    <span>All</span>
                    {!selectedYear && <Check className="h-4 w-4" />}
                </DropdownMenuItem>

                {years.map((year) => (
                    <DropdownMenuItem
                        key={year}
                        onClick={() => onSelect(year)}
                        className={cn(
                            "flex items-center justify-between",
                            selectedYear === year && "bg-accent"
                        )}
                    >
                        <span>{year}</span>
                        {selectedYear === year && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
