import * as React from "react";

import { cn } from "../lib/utils";

export interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div
      data-slot="table-container"
      className={cn(
        "bevel-window w95-scrollbar overflow-auto bg-surface p-[3px]",
        containerClassName,
      )}
    >
      <table
        ref={ref}
        data-slot="table"
        className={cn(
          "w-full border-collapse bg-surface-sunken text-left",
          "font-ui text-[11px] leading-[15px] text-ink",
          className,
        )}
        {...props}
      />
    </div>
  ),
);

Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn("bg-surface", className)}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn("[&_tr+tr]:border-t [&_tr+tr]:border-bevel-light", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tfoot">
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      "border-t border-bevel-light bg-surface font-bold",
      className,
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.ComponentProps<"tr"> {
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      data-selected={selected || undefined}
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-ink-inverse",
        className,
      )}
      {...props}
    />
  ),
);

TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th">
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="table-head"
    className={cn(
      "bevel-raised sticky top-0 bg-surface px-2 py-1 text-left font-normal",
      className,
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td">
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn("px-2 py-[1px] align-top", className)}
    {...props}
  />
));

TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption">
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn("px-2 py-1 text-left text-[10px] text-ink-muted", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";
