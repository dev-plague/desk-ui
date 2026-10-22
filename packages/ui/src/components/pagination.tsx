import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface PaginationProps
  extends Omit<React.ComponentProps<"nav">, "onChange"> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
}

type PageToken = number | "ellipsis";

function getPages(page: number, pageCount: number, siblingCount: number): PageToken[] {
  if (pageCount <= 0) {
    return [];
  }

  const totalNumbers = siblingCount * 2 + 5;
  if (pageCount <= totalNumbers) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < pageCount - 1;

  if (!showLeftEllipsis) {
    const count = 3 + siblingCount * 2;
    return [
      ...Array.from({ length: count }, (_, index) => index + 1),
      "ellipsis",
      pageCount,
    ];
  }

  if (!showRightEllipsis) {
    const start = pageCount - (3 + siblingCount * 2) + 1;
    return [
      1,
      "ellipsis",
      ...Array.from({ length: pageCount - start + 1 }, (_, index) => start + index),
    ];
  }

  return [
    1,
    "ellipsis",
    ...Array.from({ length: right - left + 1 }, (_, index) => left + index),
    "ellipsis",
    pageCount,
  ];
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      pageCount,
      onPageChange,
      siblingCount = 1,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.pagination;
    const current = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
    const pages = getPages(current, pageCount, siblingCount);

    function go(next: number) {
      if (disabled) {
        return;
      }
      const target = Math.min(Math.max(next, 1), pageCount);
      if (target !== current) {
        onPageChange?.(target);
      }
    }

    function PageButton({
      target,
      children,
      label,
      active = false,
    }: {
      target: number;
      children: React.ReactNode;
      label?: string;
      active?: boolean;
    }) {
      return (
        <button
          type="button"
          aria-label={label}
          aria-current={active ? "page" : undefined}
          disabled={disabled}
          onClick={() => go(target)}
          className={cn(
            "grid h-[21px] min-w-[23px] place-items-center px-1 max-sm:h-6 max-sm:min-w-[24px]",
            "font-ui text-[10px] leading-[13px] text-ink",
            active
              ? "bg-surface-pressed bevel-sunken"
              : "bg-surface bevel-raised",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            "disabled:pointer-events-none disabled:text-engraved",
          )}
        >
          {children}
        </button>
      );
    }

    return (
      <nav
        ref={ref}
        aria-label={labels.label}
        data-slot="pagination"
        className={cn(
          "flex flex-wrap items-center gap-1 font-ui text-ui",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label={labels.previousLabel}
          disabled={disabled || current <= 1}
          onClick={() => go(current - 1)}
          className={cn(
            "h-[21px] px-2 font-ui text-[10px] leading-[13px] text-ink max-sm:h-6",
            "bg-surface bevel-raised",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            "disabled:pointer-events-none disabled:text-engraved",
          )}
        >
          {"<"} {labels.previous}
        </button>

        {pages.map((token, index) =>
          token === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-ink-muted"
            >
              ...
            </span>
          ) : (
            <PageButton
              key={token}
              target={token}
              active={token === current}
              label={
                token === current
                  ? labels.currentPage(token)
                  : labels.page(token)
              }
            >
              {token}
            </PageButton>
          ),
        )}

        <button
          type="button"
          aria-label={labels.nextLabel}
          disabled={disabled || current >= pageCount}
          onClick={() => go(current + 1)}
          className={cn(
            "h-[21px] px-2 font-ui text-[10px] leading-[13px] text-ink max-sm:h-6",
            "bg-surface bevel-raised",
            "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
            "disabled:pointer-events-none disabled:text-engraved",
          )}
        >
          {labels.next} {">"}
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
