"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { glossary, glossaryCategories, type GlossaryCategory } from "@/content/glossary";
import { matchesSearch, normalizeSearch } from "@/lib/search";
import { cn } from "@/lib/utils";

type Filter = "todos" | GlossaryCategory;

const categoryLabel = new Map(glossaryCategories.map((item) => [item.id, item.label]));

export function GlossaryList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");

  const results = useMemo(() => {
    return glossary
      .filter((item) => filter === "todos" || item.category === filter)
      .filter((item) =>
        matchesSearch(query, [
          item.term,
          item.definition,
          ...(item.aliases ?? []),
          categoryLabel.get(item.category) ?? "",
        ]),
      )
      .sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [filter, query]);

  const isFiltering = query.trim().length > 0 || filter !== "todos";

  function reset() {
    setQuery("");
    setFilter("todos");
  }

  return (
    <div>
      <div className="border-line rounded-2xl border bg-white p-4 sm:p-5">
        <div className="relative">
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="glossario-busca" className="sr-only">
            Buscar termo no glossário
          </label>
          <input
            id="glossario-busca"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque por termo, sigla ou assunto…"
            autoComplete="off"
            className="border-line text-ink placeholder:text-muted/80 focus-visible:border-brand-600 focus-visible:outline-brand-600/25 bg-canvas w-full rounded-xl border py-3 pr-10 pl-10 text-sm focus-visible:outline-4"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="text-muted hover:text-ink absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("todos")}
            aria-pressed={filter === "todos"}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === "todos"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line hover:border-brand-600/40 bg-white text-slate-600",
            )}
          >
            Todos
            <span className="ml-1.5 opacity-70">{glossary.length}</span>
          </button>
          {glossaryCategories.map((category) => {
            const count = glossary.filter((item) => item.category === category.id).length;
            const isActive = filter === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line hover:border-brand-600/40 bg-white text-slate-600",
                )}
              >
                {category.label}
                <span className="ml-1.5 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-muted text-sm" aria-live="polite" aria-atomic="true">
          {results.length === 0
            ? "Nenhum termo encontrado"
            : `${results.length} ${results.length === 1 ? "termo" : "termos"}`}
          {normalizeSearch(query) ? ` para “${query.trim()}”` : null}
        </p>
        {isFiltering ? (
          <button
            type="button"
            onClick={reset}
            className="text-brand-700 hover:text-brand-800 text-sm font-semibold"
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="border-line mt-4 rounded-2xl border border-dashed bg-white p-8 text-center">
          <p className="text-ink font-display text-lg font-bold">Ainda não temos esse termo</p>
          <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-6">
            Tente uma palavra mais curta, uma sigla ou remova o filtro de categoria. O glossário
            cresce junto com a trilha.
          </p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((item) => (
            <li
              key={item.slug}
              id={`termo-${item.slug}`}
              className="border-line scroll-mt-24 rounded-2xl border bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-ink text-base font-bold">{item.term}</h3>
                <span className="bg-brand-50 text-brand-800 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                  {categoryLabel.get(item.category)}
                </span>
              </div>
              <p className="text-muted mt-2 text-sm leading-6">{item.definition}</p>

              {item.aliases?.length ? (
                <p className="text-muted mt-2 text-xs">
                  <span className="font-medium text-slate-500">Também: </span>
                  {item.aliases.join(" · ")}
                </p>
              ) : null}

              {item.seeAlso?.length ? (
                <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs">
                  <span className="text-muted">Ver também:</span>
                  {item.seeAlso.map((slug) => {
                    const related = glossary.find((term) => term.slug === slug);
                    if (!related) return null;
                    return (
                      <a
                        key={slug}
                        href={`#termo-${slug}`}
                        className="text-brand-700 hover:text-brand-800 font-semibold underline-offset-2 hover:underline"
                      >
                        {related.term}
                      </a>
                    );
                  })}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
