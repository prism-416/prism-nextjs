"use client";

import * as React from "react";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/atomics/atoms/Popover";
import { cn } from "@/shared/utils/cn";

type DatePickerProps = {
  id?: string;
  value: string;
  min?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
};

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, month) => format(new Date(2020, month, 1), "MMM"));

function parseDateInputValue(value?: string) {
  if (!value) return undefined;

  const date = parseISO(value);

  return isValid(date) ? date : undefined;
}

export function DatePicker({
  id,
  value,
  min,
  disabled = false,
  onChange,
  placeholder = "Select date",
}: DatePickerProps) {
  const selectedDate = parseDateInputValue(value);
  const minimumDate = parseDateInputValue(min);
  const [open, setOpen] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState(() => startOfMonth(selectedDate ?? new Date()));
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(visibleMonth);
  const monthEnd = endOfMonth(visibleMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
  });

  const selectDate = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  const isTodayDisabled = Boolean(minimumDate && isBefore(today, startOfDay(minimumDate)));

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        if (nextOpen) {
          setVisibleMonth(startOfMonth(selectedDate ?? new Date()));
          setShowMonthPicker(false);
        }
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-field px-3",
            "text-sm text-prism-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className={cn("flex items-center gap-2", !selectedDate && "text-prism-muted")}>
            <CalendarDays className="size-4 shrink-0 text-prism-muted" />
            {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-prism-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[16rem] p-2.5">
        <div className="mb-2 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(previous => (showMonthPicker ? addYears(previous, -1) : addMonths(previous, -1)))
            }
            className="grid size-7 place-items-center rounded-md text-prism-muted transition-colors hover:bg-prism-navy/5 hover:text-prism-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showMonthPicker ? "Previous year" : "Previous month"}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowMonthPicker(previous => !previous)}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-sm font-semibold text-prism-body transition-colors hover:bg-prism-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Choose month and year"
          >
            {showMonthPicker ? visibleMonth.getFullYear() : format(visibleMonth, "MMMM yyyy")}
          </button>
          <button
            type="button"
            onClick={() =>
              setVisibleMonth(previous => (showMonthPicker ? addYears(previous, 1) : addMonths(previous, 1)))
            }
            className="grid size-7 place-items-center rounded-md text-prism-muted transition-colors hover:bg-prism-navy/5 hover:text-prism-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showMonthPicker ? "Next year" : "Next month"}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {showMonthPicker ? (
          <div className="grid grid-cols-3 gap-1 py-1">
            {MONTH_OPTIONS.map((label, month) => {
              const monthDate = new Date(visibleMonth.getFullYear(), month, 1);
              const isSelectedMonth = Boolean(selectedDate && isSameMonth(monthDate, selectedDate));

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setVisibleMonth(monthDate);
                    setShowMonthPicker(false);
                  }}
                  className={cn(
                    "h-8 rounded-md text-xs font-medium text-prism-body transition-colors hover:bg-prism-navy/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelectedMonth && "bg-prism-navy text-white hover:bg-prism-navy",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7">
              {WEEKDAY_LABELS.map(label => (
                <span
                  key={label}
                  className="flex h-7 items-center justify-center text-[0.6875rem] font-medium text-prism-muted"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map(date => {
                const dateDisabled = Boolean(minimumDate && isBefore(date, startOfDay(minimumDate)));
                const isSelected = Boolean(selectedDate && isSameDay(date, selectedDate));
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={dateDisabled}
                    onClick={() => selectDate(date)}
                    className={cn(
                      "mx-auto grid size-8 place-items-center rounded-md text-xs transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !isSameMonth(date, visibleMonth) && "text-prism-muted/45",
                      isSameMonth(date, visibleMonth) && "text-prism-body hover:bg-prism-navy/5",
                      isToday && !isSelected && "font-semibold text-prism-navy ring-1 ring-prism-teal-500/35",
                      isSelected && "bg-prism-navy font-semibold text-white hover:bg-prism-navy",
                      dateDisabled && "cursor-default opacity-35 hover:bg-transparent",
                    )}
                  >
                    {format(date, "d")}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-prism-muted transition-colors hover:bg-prism-navy/5 hover:text-prism-body"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={isTodayDisabled}
            onClick={() => selectDate(today)}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-prism-navy transition-colors hover:bg-prism-navy/5 disabled:cursor-default disabled:opacity-40"
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
