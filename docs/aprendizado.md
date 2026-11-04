# Notas de aprendizado — Next.js

Registro dos conceitos usados neste projeto, com o arquivo onde cada um aparece. Serve como
material de estudo e como referência para as próximas etapas.

## App Router e rotas

- `app/layout.tsx` é o layout raiz: envolve todas as páginas, define fontes, metadata e o
  esqueleto de navegação.
- Cada pasta dentro de `app/` vira uma rota. `app/trilha/page.tsx` responde por `/trilha/`.
- Rotas dinâmicas usam colchetes: `app/trilha/[modulo]/[licao]/page.tsx`.

## Server Components x Client Components

Por padrão, tudo é Server Component: roda no build, não envia JavaScript para o navegador.

Um arquivo só vira Client Component com a diretiva `"use client"` no topo. Usamos isso apenas
onde há interação ou estado:

- `components/learn/quiz.tsx` — respostas e correção
- `components/learn/trilha-list.tsx` — lê o progresso do localStorage
- `components/sim/*.tsx` — sliders com estado
- `components/charts/projection-chart.tsx` — usa `useId`

Regra prática: mantenha a página como Server Component e isole a interação no menor componente
possível. Foi o que fizemos na lição: o texto em MDX é renderizado no build, e só o botão de
concluir e o quiz são client.

## Export estático

`next.config.ts` define `output: "export"`. O build gera HTML em `out/`, sem servidor Node.

Consequências:

- Não há API routes nem ISR — todo dado precisa existir em build time.
- Rotas dinâmicas precisam de `generateStaticParams` para dizer quais páginas existirão.
- `trailingSlash: true` gera pastas com `index.html`, o que funciona em qualquer CDN.
- Imagens precisam de `unoptimized: true`, porque o otimizador do Next depende de servidor.

## MDX

`@next/mdx` transforma arquivos `.mdx` em componentes React. O arquivo `mdx-components.tsx`
mapeia elementos (`h2`, `p`, `table`...) para o nosso estilo e registra componentes próprios
(`Callout`, `KeyIdea`, `Formula`).

O conteúdo é importado por um registry explícito em `content/registry.ts`. Preferimos isso a
import dinâmico porque o build falha cedo se um arquivo sumir.

## Hidratação e localStorage

O HTML é gerado no servidor sem acesso ao `localStorage`. Se o primeiro render do cliente já
mostrasse os dados salvos, o React acusaria divergência de hidratação.

Solução em `lib/hooks/use-hydrated.ts`:

1. `useSyncExternalStore` retorna `false` no servidor e no primeiro render do cliente.
2. Depois da hidratação, retorna `true` e os componentes mostram o progresso real.
3. `ensureHydrated()` chama `persist.rehydrate()` uma única vez.

## Zustand com persist

`lib/store/progress.ts` usa `persist` com `skipHydration: true` para controlar quando o
localStorage é lido. O estado tem `version: 1` e uma função `migrate`, para que uma mudança de
formato no futuro não apague o progresso de quem já usa o site.

## Testes

- `vitest.config.mts` com ambiente `jsdom` e alias `@/`.
- Testes de funções puras não precisam de DOM: `lib/finance.test.ts`, `lib/xp.test.ts`.
- O teste do store precisa de `localStorage`, por isso roda em `jsdom`.
- Playwright sobe o build estático (`npm run preview`) e testa fluxos reais em desktop e mobile.

## O que eu faria diferente em um app com login

Com autenticação e banco, o progresso sairia do localStorage e viraria uma tabela
`LessonProgress` por usuário. O motor de simulação continuaria puro — só a persistência mudaria.
