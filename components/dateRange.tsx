"use client";

import * as DateFns from "date-fns";
import { CalendarIcon } from "lucide-react";
import { date } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRangeOptions } from "@/lib/types/date";
import { cn } from "@/lib/utils";

interface DateRangeProps {
  setDateRange: (value: Date, type: DateRangeOptions) => void;
  startDate: Date;
  endDate: Date;
}

export function DateRange({
  setDateRange,
  startDate,
  endDate,
}: DateRangeProps) {
  const isDateRangeValid = endDate > startDate;

  const handleSetDate = (value: Date | undefined, type: DateRangeOptions) => {
    if (value === undefined) return;
    if (type === "start") {
      setDateRange(value, type);
    } else {
      setDateRange(value, type);
    }
  };

  return (
    <div className="flex gap-4 items-end flex-col md:flex-row ml-auto">
      <div className="flex flex-row items-center sm:items-center gap-2">
        <span>Start</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              aria-label="start-date"
              variant={isDateRangeValid ? "outline" : "destructive"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {startDate ? (
                DateFns.format(startDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(value) => handleSetDate(value, "start")}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row items-center sm:items-center gap-2">
        <span>End</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              data-testid="end-date"
              variant={isDateRangeValid ? "outline" : "destructive"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {endDate ? (
                DateFns.format(endDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(value) => handleSetDate(value, "end")}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
