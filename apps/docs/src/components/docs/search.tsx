import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Dialog, Input, cn } from "@deskui/ui";

import { getComponentManifest } from "../../content/manifest";
import { useI18n } from "../../i18n/provider";
import { NoteIcon } from "../icons";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

export function ComponentSearch({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
}) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const optionId = useId();

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) {
      return getComponentManifest(locale);
    }

    return getComponentManifest(locale).filter((doc) =>
      normalize(`${doc.title} ${doc.slug} ${doc.description}`).includes(term),
    );
  }, [locale, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [locale, query]);

  function select(index: number) {
    const doc = results[index];
    if (!doc) {
      return;
    }

    onNavigate(`/componentes/${doc.slug}`);
    onOpenChange(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : (index + 1) % results.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0
          ? 0
          : (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      select(activeIndex);
    }
  }

  const activeDoc = results[activeIndex];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("search.title")}
      icon={<NoteIcon />}
      className="max-w-xl"
    >
      <div className="grid gap-2">
        <label htmlFor={`${listId}-input`} className="text-[11px] font-bold">
          {t("search.field")}
        </label>
        <Input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("search.placeholder")}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeDoc ? `${optionId}-${activeDoc.slug}` : undefined
          }
        />

        <ul
          id={listId}
          role="listbox"
          aria-label={t("search.results")}
          className="w95-scrollbar bevel-field max-h-72 overflow-y-auto bg-surface-sunken p-1"
        >
          {results.length === 0 ? (
            <li className="px-2 py-2 text-[11px] leading-[15px] text-ink-muted">
              {t("search.noResults", { query })}
            </li>
          ) : (
            results.map((doc, index) => {
              const selected = index === activeIndex;
              return (
                <li
                  key={doc.slug}
                  id={`${optionId}-${doc.slug}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(index)}
                  className={cn(
                    "flex cursor-default items-center gap-2 px-2 py-[3px]",
                    "text-[11px] leading-[15px]",
                    selected
                      ? "bg-accent text-ink-inverse"
                      : "text-ink",
                  )}
                >
                  <NoteIcon />
                  <span className="min-w-0 flex-1 truncate">{doc.title}</span>
                  <span
                    className={cn(
                      "hidden truncate sm:block",
                      selected ? "text-ink-inverse" : "text-ink-muted",
                    )}
                  >
                    {doc.description}
                  </span>
                </li>
              );
            })
          )}
        </ul>

        <p className="text-[10px] leading-[13px] text-ink-muted">
          {results.length === 1
            ? t("search.summaryOne")
            : t("search.summaryMany", { count: results.length })}
        </p>
      </div>
    </Dialog>
  );
}
