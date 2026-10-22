import * as React from "react";

import { cn } from "../lib/utils";

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="breadcrumb"
    data-slot="breadcrumb"
    className={cn("font-ui text-ui text-ink", className)}
    {...props}
  />
));

Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    data-slot="breadcrumb-list"
    className={cn("flex flex-wrap items-center gap-1", className)}
    {...props}
  />
));

BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="breadcrumb-item"
    className={cn("inline-flex items-center gap-1", className)}
    {...props}
  />
));

BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    data-slot="breadcrumb-link"
    className={cn(
      "text-link underline-offset-2 hover:underline",
      "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
      className,
    )}
    {...props}
  />
));

BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="breadcrumb-page"
    aria-current="page"
    className={cn("font-bold text-ink", className)}
    {...props}
  />
));

BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn("text-ink-muted", className)}
    {...props}
  >
    {children ?? ">"}
  </span>
));

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
