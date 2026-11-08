# Notas de aprendizado: Next.js

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

- `components/learn/quiz.tsx`: respostas e correção
- `components/learn/trilha-list.tsx`: lê o progresso do localStorage
- `components/sim/*.tsx`: sliders com estado
- `components/charts/projection-chart.tsx`: usa `useId`

Regra prática: mantenha a página como Server Component e isole a interação no menor componente
possível. Foi o que fizemos na lição: o texto em MDX é renderizado no build, e só o botão de
concluir e o quiz são client.

## Export estático

`next.config.ts` define `output: "export"`. O build gera HTML em `out/`, sem servidor Node.

Consequências:

- Não há API routes nem ISR: todo dado precisa existir em build time.
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
localStorage é lido. O estado tem `version: 2` e uma função `migrate`, para que uma mudança de
formato no futuro não apague o progresso de quem já usa o site. A migração da versão 1 apenas
adiciona `missions: {}`, então backups antigos continuam válidos.

## Badges derivadas

`lib/badges.ts` não guarda um campo "badge conquistada". Cada badge é uma função que recebe XP,
lições, quizzes e missões e devolve `true` ou `false`. A vantagem é que o estado nunca fica
inconsistente: se o progresso existe, a badge aparece. A desvantagem é recalcular a lista a cada
render, o que é barato para 12 badges.

## Recompensa condicionada

`components/learn/mission-exercise.tsx` mantém o checklist e a pergunta de verificação em estado
local e só chama `completeMission` quando todos os passos estão marcados e a alternativa correta
foi escolhida. `components/learn/complete-lesson.tsx` só libera o botão quando
`state.quizzes[slug]` existe. A conclusão continua no store, então a regra vale para qualquer
página que renderize o componente. Sem backend, a verificação é de compreensão e intenção, não de
execução real da tarefa.

## Dados históricos

`content/history.ts` é uma série anual de CDI, Ibovespa e IPCA de 2000 a 2024, embutida no build.
`lib/history.ts` converte a taxa anual em mensal equivalente, aplica aportes e corrige os valores
pelo índice de inflação acumulado. O componente `ProjectionChart` recebe `xLabels` para trocar o
eixo em meses por anos, sem duplicar o gráfico.

## Busca sem acento

`lib/search.ts` normaliza o texto com `normalize("NFD")`, remove os diacríticos com uma regex
(`[\u0300-\u036f]`), baixa a caixa e limpa pontuação. Assim "inflação", "inflacao" e "INFLACAO"
caem na mesma chave. A busca por várias palavras exige que todas apareçam em algum campo: termo,
definição, sinônimos ou categoria.

## Testes

- `vitest.config.mts` com ambiente `jsdom` e alias `@/`.
- Testes de funções puras não precisam de DOM: `lib/finance.test.ts`, `lib/xp.test.ts`.
- O teste do store precisa de `localStorage`, por isso roda em `jsdom`.
- `content/content.test.ts` lê o sistema de arquivos e o source do registry para garantir que
  toda lição publicada tem MDX, entrada no registry e quiz válido, sem importar os arquivos MDX.
- Playwright sobe o build estático (`npm run preview`) e testa fluxos reais em desktop e mobile.

## O que eu faria diferente em um app com login

Com autenticação e banco, o progresso sairia do localStorage e viraria uma tabela
`LessonProgress` por usuário. O motor de simulação continuaria puro; só a persistência mudaria.
