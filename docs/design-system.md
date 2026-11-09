# Design system

Referência interna de cores, tipografia e componentes do Investe Fácil. Não existe rota
pública: esta documentação existe para manter consistência quando o produto crescer.

## Onde os tokens vivem

Todos os tokens estão em `app/globals.css`, dentro do bloco `@theme` do Tailwind CSS 4. Mudar um
valor ali propaga para o site inteiro. Evite valores soltos (`#0f6b4f`, `text-[17px]`) fora
desse arquivo.

```css
@theme {
  --color-brand-600: #0f6b4f;
  --font-display: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
}
```

## Cores

| Token           | Hex       | Uso                                       |
| --------------- | --------- | ----------------------------------------- |
| `brand-600`     | `#0f6b4f` | Ação primária, links, séries de gráfico   |
| `brand-700`     | `#0b5740` | Hover da ação primária                    |
| `brand-800/900` | `#084334` | Blocos de destaque em fundo escuro        |
| `brand-50/100`  | `#ecfdf5` | Fundos suaves, badges, estados concluídos |
| `brand-200/300` | `#a7f3d0` | Detalhes decorativos, bordas de destaque  |
| `accent`        | `#1d4ed8` | Dados, quiz, informação secundária        |
| `accent-soft`   | `#e9efff` | Fundo de badges informativos              |
| `warn`          | `#b45309` | Atenção, avisos financeiros               |
| `warn-soft`     | `#fff7e6` | Fundo de callouts de atenção              |
| `danger`        | `#b91c1c` | Erro, resposta incorreta                  |
| `ink`           | `#0b1220` | Texto principal e títulos                 |
| `muted`         | `#55677a` | Texto secundário e legendas               |
| `line`          | `#e2e9e4` | Bordas e divisores                        |
| `canvas`        | `#f7faf8` | Fundo da página                           |
| `surface`       | `#ffffff` | Fundo de cards                            |

Texto corrido usa `text-slate-700` (cinza-azulado), um tom acima de `muted` em contraste.

## Tipografia

- **Manrope** (`font-display`): títulos, números grandes e navegação de marca
- **Inter** (`font-sans`): corpo, formulários e UI

| Papel      | Classes                                | Tamanho |
| ---------- | -------------------------------------- | ------- |
| Display    | `font-display text-5xl font-extrabold` | 48px    |
| H1         | `font-display text-4xl font-extrabold` | 36px    |
| H2         | `font-display text-3xl font-bold`      | 30px    |
| H3         | `font-display text-xl font-bold`       | 20px    |
| Corpo      | `text-[17px] leading-8 text-slate-700` | 17px    |
| Apoio      | `text-sm text-muted`                   | 14px    |
| Microtexto | `text-xs font-semibold uppercase`      | 12px    |

Títulos usam `letter-spacing: -0.02em` e `text-wrap: balance` (definidos no `@layer base`).

## Forma e espaçamento

| Elemento        | Raio  | Classe         |
| --------------- | ----- | -------------- |
| Botões, inputs  | 12px  | `rounded-xl`   |
| Cards           | 16px  | `rounded-2xl`  |
| Seções, banners | 24px  | `rounded-3xl`  |
| Pílulas         | 999px | `rounded-full` |

- Sombra padrão de card: `0 1px 2px rgba(11, 18, 32, 0.04)` (quase invisível, só para separar do fundo)
- Container: `max-w-6xl` com `px-5 sm:px-6 lg:px-8`
- Ritmo vertical entre seções: `py-16` a `py-20`
- Conteúdo de lição: `max-w-3xl` para manter a linha entre 60 e 75 caracteres

## Componentes

### Button (`components/ui/button.tsx`)

| Variante    | Uso                                |
| ----------- | ---------------------------------- |
| `primary`   | ação principal, uma por tela       |
| `secondary` | ação alternativa em fundo branco   |
| `outline`   | ação terciária com borda colorida  |
| `ghost`     | ações discretas, "zerar progresso" |

Tamanhos: `sm` (36px), `md` (44px), `lg` (48px). Para links com aparência de botão, use
`buttonStyles({ variant, size })` em vez de `<Button>`.

### Badge (`components/ui/badge.tsx`)

Variantes `brand`, `accent`, `warn`, `neutral`, `outline`. Sempre em caixa alta? Não: texto
normal, `font-semibold`, `text-xs`.

### Progress (`components/ui/progress.tsx`)

Exige `label` (vira `aria-label`) e `value` de 0 a 100. Tamanho `sm` para progresso dentro de
cards, `md` para o resumo de nível. A cor da barra pode ser trocada por `barClassName`.

### Card (`components/ui/card.tsx`)

`Card`, `CardTitle` e `CardDescription`. O card não tem padding próprio: quem usa decide
(`p-5`, `p-6`).

### Slider (`components/ui/slider.tsx`)

Slider nativo com `accent-color`, label associado por `htmlFor` e `<output>` mostrando o valor
formatado. Sempre inclua `display` legível ("R$ 200", "0,80% a.m.").

### Blocos de MDX (`components/mdx/index.tsx`)

| Componente           | Uso                                                          |
| -------------------- | ------------------------------------------------------------ |
| `Callout`            | aviso contextual; variantes `info`, `warn`, `success`        |
| `KeyIdea`            | a única ideia que o leitor deve levar da lição               |
| `Formula`            | destaque de fórmula matemática com legenda opcional          |
| `TimeComparison`     | compara dois prazos com o mesmo aporte, calculado no build   |
| `InterestComparison` | juros simples × compostos com valores calculados no build    |
| `TaxBrackets`        | faixas regressivas de IR lidas de `IR_BRACKETS`              |
| `IofCountdown`       | tabela de IOF dos 30 dias lida de `IOF_TABLE`                |
| `RiskTypes`          | cinco tipos de risco em cards, lidos de `content/risk-types` |

Os componentes de comparação e as duas tabelas de regras não recebem números por prop: eles leem
`lib/finance.ts` e recalculam no build, então o texto da lição nunca diverge do simulador.
`RiskTypes` é qualitativo: lê `content/risk-types.ts` para manter nomes, definições e exemplos em
um único lugar.

### Gráficos (`components/charts/projection-chart.tsx`)

SVG próprio, sem biblioteca. Recebe `series` (label, cor, valores, `fill`) e um `ariaLabel`
obrigatório descrevendo o resultado em texto. A primeira série é a linha principal; as demais
aparecem tracejadas.

## Acessibilidade

- Contraste mínimo AA em todo texto; `muted` só para texto de apoio
- Foco visível global: `outline: 2px solid brand-600` com `offset: 2px`
- `prefers-reduced-motion` desliga animações e transições
- Todo gráfico tem `role="img"` e `aria-label` com o resumo numérico
- Quiz usa `input type="radio"` nativo dentro de `<fieldset>`, com feedback textual
- Alvos de toque com no mínimo 44px de altura nas ações principais
- Link "pular para o conteúdo" no topo do layout

## Regras práticas

1. **Token antes de classe solta.** Se a cor ou medida se repete, vire token.
2. **Uma ação primária por tela.** O resto é `secondary`, `outline` ou `ghost`.
3. **Verde é ação, azul é dado.** Não use `accent` em botões de ação.
4. **Números financeiros usam `tabular-nums`** para alinhar colunas.
5. **Todo componente novo entra em `components/ui/`** e é documentado aqui.

## Adicionando um componente

```tsx
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function NovoComponente({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("border-line bg-surface rounded-2xl border", className)} {...props} />;
}
```

Use `ComponentProps<"elemento">` para repassar props, `cn()` para permitir sobrescrita de
classes e variantes declaradas em um `Record` tipado quando houver mais de um estilo.
