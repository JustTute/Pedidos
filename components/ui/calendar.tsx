// components/ui/calendar.tsx
"use client";

import React from "react";
import {
  DayPicker,
  type DayPickerProps,
  type CustomComponents,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// shadcn's helper – adjust the import if your path differs
import { cn } from "@/lib/utils";

/**
 * Calendar component – shadcn-style, updated for **react-day-picker v9** and **React 19**.
 *
 * It keeps the original shadcn class names so all the Tailwind theming works as expected.
 * The only breaking change compared to the v8 file is the `components` prop: v9
 * now expects a single `Chevron` component instead of `IconLeft/IconRight`.
 */
export type CalendarProps = DayPickerProps & {
  className?: string;
};

export function Calendar({
  className,
  showOutsideDays = true,
  classNames,
  components,
  ...props
}: CalendarProps) {
  // Custom chevron renderer that swaps icons according to orientation
  const Chevron = React.useCallback<CustomComponents["Chevron"]>(
    ({ orientation, ...chevronProps }) =>
      orientation === "left" ? (
        <ChevronLeft className="h-4 w-4" {...chevronProps} />
      ) : (
        <ChevronRight className="h-4 w-4" {...chevronProps} />
      ),
    []
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex gap-1 absolute right-1 top-1",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed rounded-md transition",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 [aria-disabled='true']:text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        ...classNames,
      }}
      components={{
        Chevron,
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * Quick install guide (React 19 / Next 15):
 *
 * ```bash
 * npm install react-day-picker@^9 date-fns lucide-react
 * # if you are using npm v9+ you might need:
 * # npm install --force react-day-picker@^9
 * ```
 *
 * - Place this file in `components/ui/calendar.tsx`.
 * - Import it anywhere with `import { Calendar } from "@/components/ui/calendar"`.
 */
