import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Tarjeta de contenido con marco elevado, pensada para catálogos y
 * showcases. La estructura es opcional: puedes usar solo `Card` o componer
 * con `CardHeader`, `CardContent` y `CardFooter`.
 */
export interface CardProps extends React.ComponentProps<"article"> {}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ className, ...props }, ref) => (
    <article
      ref={ref}
      data-slot="card"
      className={cn(
        "bevel-raised flex min-w-0 flex-col bg-surface p-2 text-ink",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export interface CardHeaderProps extends React.ComponentProps<"div"> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "mb-2 grid gap-1 border-b border-bevel-shadow pb-2",
        className,
      )}
      {...props}
    />
  ),
);

CardHeader.displayName = "Card.Header";

export interface CardTitleProps extends React.ComponentProps<"h3"> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-[12px] font-bold leading-[15px]", className)}
      {...props}
    />
  ),
);

CardTitle.displayName = "Card.Title";

export interface CardDescriptionProps extends React.ComponentProps<"p"> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-[11px] leading-[15px] text-ink-muted", className)}
    {...props}
  />
));

CardDescription.displayName = "Card.Description";

export interface CardContentProps extends React.ComponentProps<"div"> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  ),
);

CardContent.displayName = "Card.Content";

export interface CardFooterProps extends React.ComponentProps<"div"> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "mt-2 flex flex-wrap items-center justify-end gap-2",
        "border-t border-bevel-light pt-2",
        className,
      )}
      {...props}
    />
  ),
);

CardFooter.displayName = "Card.Footer";
