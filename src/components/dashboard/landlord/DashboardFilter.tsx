import * as React from "react";
import { format, subDays, startOfYear, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFilterProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export function DashboardFilter({ date, setDate, className }: DashboardFilterProps) {
  // Presets
  const setPreset = (value: string) => {
    const today = new Date();
    switch (value) {
      case "7d":
        setDate({ from: subDays(today, 7), to: today });
        break;
      case "30d":
        setDate({ from: subDays(today, 30), to: today });
        break;
      case "3m":
        setDate({ from: subMonths(today, 3), to: today });
        break;
      case "6m":
        setDate({ from: subMonths(today, 6), to: today });
        break;
      case "ytd":
        setDate({ from: startOfYear(today), to: today });
        break;
      case "1y":
        setDate({ from: subMonths(today, 12), to: today });
        break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
      <Select onValueChange={setPreset} defaultValue="6m">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="3m">Last 3 Months</SelectItem>
          <SelectItem value="6m">Last 6 Months</SelectItem>
          <SelectItem value="ytd">Year to Date</SelectItem>
          <SelectItem value="1y">Last Year</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a custom range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      </div>
    </div>
  );
}
