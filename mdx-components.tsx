import type { MDXComponents } from "mdx/types";

import {
  Callout,
  Formula,
  InterestComparison,
  IofCountdown,
  KeyIdea,
  RiskTypes,
  TaxBrackets,
  TimeComparison,
} from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="font-display text-ink mt-2 mb-6 text-3xl font-extrabold sm:text-4xl"
        {...props}
      />
    ),
    h2: (props) => (
      <h2 className="font-display text-ink mt-12 mb-4 scroll-mt-24 text-2xl font-bold" {...props} />
    ),
    h3: (props) => (
      <h3
        className="font-display text-ink mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        {...props}
      />
    ),
    p: (props) => <p className="text-body my-4 text-[17px] leading-8" {...props} />,
    a: (props) => (
      <a
        className="text-brand-700 decoration-brand-300 hover:text-brand-800 hover:decoration-brand-600 font-medium underline underline-offset-4 transition-colors"
        {...props}
      />
    ),
    strong: (props) => <strong className="text-ink font-semibold" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    ul: (props) => (
      <ul className="text-body my-5 list-disc space-y-2 pl-6 text-[17px] leading-8" {...props} />
    ),
    ol: (props) => (
      <ol className="text-body my-5 list-decimal space-y-2 pl-6 text-[17px] leading-8" {...props} />
    ),
    li: (props) => <li className="marker:text-brand-600 pl-1" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-brand-300 bg-brand-50/50 text-body my-8 border-l-4 py-2 pr-4 pl-5 text-[17px] leading-8 italic"
        {...props}
      />
    ),
    hr: (props) => <hr className="border-line my-10" {...props} />,
    code: (props) => (
      <code
        className="text-ink bg-surface-2 rounded-md px-1.5 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="border-line my-6 overflow-x-auto rounded-2xl border bg-slate-950 p-5 font-mono text-sm text-slate-100 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
        {...props}
      />
    ),
    table: (props) => (
      <div className="border-line bg-surface my-8 overflow-x-auto rounded-2xl border">
        <table className="w-full border-collapse text-left text-[15px]" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-canvas text-ink" {...props} />,
    th: (props) => (
      <th className="border-line border-b px-4 py-3 font-semibold whitespace-nowrap" {...props} />
    ),
    td: (props) => <td className="border-line/70 text-body border-b px-4 py-3" {...props} />,
    tr: (props) => <tr className="last:[&>td]:border-b-0" {...props} />,
    ...components,
    Callout,
    KeyIdea,
    Formula,
    TimeComparison,
    InterestComparison,
    TaxBrackets,
    IofCountdown,
    RiskTypes,
  };
}
