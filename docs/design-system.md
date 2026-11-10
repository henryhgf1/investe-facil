# Design system

Referência interna de cores, temas, tipografia e componentes do Investe Fácil. Não existe rota
pública: esta documentação existe para manter consistência quando o produto crescer.

A direção visual é **fintech premium escuro**: verde profundo para ação, azul para dados,
gradientes radiais discretos, sombras em camadas e hover com leve elevação. O mesmo sistema
funciona nos temas claro e escuro.

## Onde os tokens vivem

Todos os tokens estão em `app/globals.css`. Os valores semânticos ficam em `:root` (claro) e são
sobrescritos em `.dark` (escuro). O bloco `@theme inline` apenas mapeia esses nomes para classes do
Tailwind CSS 4, então trocar um valor em `:root`/`.dark` propaga para o site inteiro.

```css
:root {
  --canvas: #f5faf7;
  --surface: #ffffff;
  --primary: #0f6b4f;
  --on-primary: #ffffff;
}

.dark {
  --canvas: #05100c;
  --surface: #0a1813;
  --primary: #10b981;
  --on-primary: #04150f;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --color-on-primary: var(--on-primary);
}
```

Evite valores soltos (`#0f6b4f`, `text-[17px]`) fora desse arquivo. Use as classes semânticas
(`bg-surface`, `text-body`, `border-line`, `shadow-card`) em vez das cores brutas.

## Tema claro e escuro

O tema inicial acompanha o sistema operacional. A escolha manual (`Claro`, `Escuro` ou `Sistema`)
é salva em `localStorage` na chave `investe-facil:theme`, com os valores `light`, `dark` e
`system`.

- `lib/theme.ts` concentra o store (`useTheme`, `getStoredTheme`, `resolveTheme`, `applyTheme`,
  `setTheme`) e assina `prefers-color-scheme` quando o modo é `system`.
- Um script inline em `app/layout.tsx` roda **antes da pintura**, aplica `.dark` e
  `color-scheme` no `<html>`, e evita o flash de tema errado. O `<html>` usa
  `suppressHydrationWarning` porque a classe é definida fora do React.
- `ThemeToggle` (`components/layout/theme-toggle.tsx`) é o menu acessível do cabeçalho:
  `role="menu"`, itens `menuitemradio` com `aria-checked`, fecha com Escape e devolve o foco ao
  botão.
- `Viewport.themeColor` declara as cores da barra do navegador para os dois esquemas.

Ao criar uma tela nova, não duplique lógica de tema: use os tokens semânticos e as classes
`dark:` só quando precisar de um ajuste pontual que não vira token.

## Cores

### Papéis semânticos

| Token           | Claro      | Escuro     | Uso                                       |
| --------------- | ---------- | ---------- | ----------------------------------------- |
| `canvas`        | `#f5faf7`  | `#05100c`  | Fundo da página                           |
| `surface`       | `#ffffff`  | `#0a1813`  | Fundo de cards e do cabeçalho             |
| `surface-2`     | `#edf4f0`  | `#0f221b`  | Fundo secundário, chips e blocos internos |
| `surface-3`     | `#e2ece6`  | `#142a22`  | Terceiro nível de superfície              |
| `ink`           | `#08130f`  | `#eef7f2`  | Texto principal e títulos                 |
| `body`          | `#33453c`  | `#c3d4ca`  | Texto corrido                             |
| `muted`         | `#5c6f64`  | `#92a79c`  | Texto secundário e legendas               |
| `line`          | `#dde8e1`  | `#1c332a`  | Bordas e divisores                        |
| `line-strong`   | `#c6d8ce`  | `#2a4a3d`  | Bordas de destaque e trilhos              |
| `primary`       | `#0f6b4f`  | `#10b981`  | Ação primária, links, séries de gráfico   |
| `primary-hover` | `#0b5740`  | `#34d399`  | Hover da ação primária                    |
| `on-primary`    | `#ffffff`  | `#04150f`  | Texto sobre `primary`                     |
| `link`          | `#0b5740`  | `#6ee7b7`  | Links em texto corrido                    |
| `link-hover`    | `#084334`  | `#a7f3d0`  | Hover de links                            |
| `accent`        | `#1d4ed8`  | `#7aa2ff`  | Dados, quiz, informação secundária        |
| `accent-soft`   | `#e9efff`  | `#12233f`  | Fundo de badges informativos              |
| `on-accent`     | `#ffffff`  | `#06101f`  | Texto sobre `accent`                      |
| `warn`          | `#b45309`  | `#fbbf24`  | Atenção, avisos financeiros               |
| `warn-soft`     | `#fff7e6`  | `#2a1f0a`  | Fundo de callouts de atenção              |
| `on-warn`       | `#ffffff`  | `#2a1a02`  | Texto sobre `warn`                        |
| `danger`        | `#b91c1c`  | `#f87171`  | Erro, resposta incorreta                  |
| `danger-soft`   | `#fef2f2`  | `#2a1212`  | Fundo de estados de erro                  |
| `danger-strong` | `#7f1d1d`  | `#fca5a5`  | Texto de erro sobre fundo suave           |
| `on-danger`     | `#ffffff`  | `#2a0b0b`  | Texto sobre `danger`                      |
| `cta-from/to`   | verde      | verde      | Gradiente do bloco de chamada final       |
| `cta-ink/muted` | branco     | claro      | Texto e apoio dentro do CTA               |
| `track`         | `#e2e8f0`  | `#1c332a`  | Trilhos de progresso e sliders            |
| `chart-1..6`    | verde/azul | verde/azul | Séries de gráficos, adaptadas ao tema     |
| `chart-muted`   | `#94a3b8`  | `#64748b`  | Série de referência apagada               |
| `card-shadow`   | sombra 2D  | sombra 3D  | Sombra padrão de card (`shadow-card`)     |

A escala `brand-50..950` também muda de valor no tema escuro: no claro ela é verde-clara, no
escuro ela inverte para tons profundos. Isso mantém `bg-brand-50`, `text-brand-700` e
`border-brand-600` legíveis nos dois temas sem `dark:` espalhado.

### Séries de gráfico

Nunca use hex nos componentes de gráfico. Passe `var(--chart-N)` como cor da série. Os
componentes SVG (`components/charts/`) e `lib/portfolio.ts` já seguem essa regra, então a mesma
série muda de tom junto com o tema.

## Tipografia

- **Manrope** (`font-display`): títulos, números grandes e navegação de marca
- **Inter** (`font-sans`): corpo, formulários e UI

| Papel      | Classes                                | Tamanho |
| ---------- | -------------------------------------- | ------- |
| Display    | `font-display text-5xl font-extrabold` | 48px    |
| H1         | `font-display text-4xl font-extrabold` | 36px    |
| H2         | `font-display text-3xl font-bold`      | 30px    |
| H3         | `font-display text-xl font-bold`       | 20px    |
| Corpo      | `text-[17px] leading-8 text-body`      | 17px    |
| Apoio      | `text-sm text-muted`                   | 14px    |
| Microtexto | `text-xs font-semibold uppercase`      | 12px    |

Títulos usam `letter-spacing: -0.02em` e `text-wrap: balance` (definidos no `@layer base`).
Números financeiros usam `tabular-nums`.

## Forma, sombra e espaçamento

| Elemento        | Raio  | Classe         |
| --------------- | ----- | -------------- |
| Botões, inputs  | 12px  | `rounded-xl`   |
| Cards           | 16px  | `rounded-2xl`  |
| Seções, banners | 24px  | `rounded-3xl`  |
| Pílulas         | 999px | `rounded-full` |

- Sombra padrão de card: `shadow-card` (`--card-shadow`); no hover use `shadow-card-hover`.
- Classes utilitárias próprias: `.hero-glow` (brilho radial do topo), `.text-gradient`
  (gradiente verde→azul em texto), `.ring-glow` (borda com brilho suave), `.animate-fade-up`,
  `.reveal` e `.skeleton` (ver seção de animações).
- Container: `max-w-6xl` com `px-5 sm:px-6 lg:px-8`
- Ritmo vertical entre seções: `py-16` a `py-24`
- Conteúdo de lição: `max-w-3xl` para manter a linha entre 60 e 75 caracteres

## Animações e microinterações

As animações são CSS puro, sem biblioteca. A regra é: movimento curto, com propósito, e sempre
com um caminho sem animação.

| Peça                      | Onde vive                          | Uso                                                             |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `.animate-fade-up`        | `app/globals.css`                  | entrada imediata de hero e cabeçalho de lição, uma vez ao abrir |
| `.reveal` + `Reveal`      | `app/globals.css`, `components/ui` | revela blocos quando entram na viewport                         |
| `.skeleton`               | `app/globals.css`                  | placeholder de hidratação, com shimmer                          |
| `transition-*` nos botões | `components/ui/button.tsx`         | hover/active com cor, sombra e 1px de elevação                  |

### Entrada no carregamento (`fade-up`)

Use `animate-fade-up` só no que já está acima da dobra. A animação roda uma vez, dura 0,6s e usa
`cubic-bezier(0.22, 1, 0.36, 1)`. Para escalonar, aplique `style={{ animationDelay: "120ms" }}`
diretamente no elemento (é o que o hero da home faz no card de prévia).

### Reveal ao rolar

`Reveal` (`components/ui/reveal.tsx`) é um client component que observa a entrada do bloco com
`IntersectionObserver`, revela uma única vez e desconecta o observer. Variantes: `up` (padrão),
`fade` e `scale`. `delay` escalona cards em milissegundos e `as` permite renderizar `section`,
`nav` etc. sem perder a semântica.

```tsx
<Reveal delay={index * 70}>
  <Card className="h-full p-6">…</Card>
</Reveal>
```

Regras:

- **Só abaixo da dobra.** Hero e topo de lição usam `animate-fade-up`, não `Reveal`.
- **Nunca esconda conteúdo sem JavaScript.** O estado inicial (`opacity: 0` e `translateY`) só vale
  dentro de `.js .reveal`. O script inline de `app/layout.tsx` adiciona `js` ao `<html>` antes da
  pintura; sem JavaScript, o seletor não casa e tudo aparece normalmente.
- **Não anime texto longo de leitura.** Na página de lição, o artigo fica estático; só quiz,
  conclusão, missão e navegação recebem `Reveal`.
- **Não use `Reveal` para esconder conteúdo interativo acima da dobra.** Prefira `fade-up`, que não
  depende de scroll.

### Loading com skeleton

O site é estático e o progresso vem do `localStorage`, então o estado de carregamento é a
hidratação. Use `.skeleton` (fundo `surface-2` + brilho em `surface-3`) em vez de spinner ou
`animate-pulse`. O shimmer é decorativo: o bloco tem `aria-hidden="true"` e o conteúdo real entra
assim que o perfil hidrata.

### Quando não animar

- `prefers-reduced-motion: reduce`: durações caem para ~0 e o reveal aparece imediatamente
  (`opacity: 1 !important`, `transform: none !important`); o shimmer do skeleton é desligado.
- Movimento que muda layout (largura, altura, posição de conteúdo) fica fora; use opacidade,
  transform e sombra.
- Não anime foco, erro de formulário nem mudança de estado do quiz: o feedback precisa ser
  imediato e legível.
- Não empilhe animações no mesmo elemento (ex.: `fade-up` + `Reveal`).

## Componentes

### Button (`components/ui/button.tsx`)

| Variante    | Uso                               |
| ----------- | --------------------------------- |
| `primary`   | ação principal, uma por tela      |
| `secondary` | ação alternativa sobre `surface`  |
| `outline`   | ação terciária com borda colorida |
| `ghost`     | ações discretas                   |
| `danger`    | apagar ou desfazer progresso      |

Tamanhos: `sm` (36px), `md` (44px), `lg` (48px). Para links com aparência de botão, use
`buttonStyles({ variant, size })` em vez de `<Button>`. Todos usam `primary`/`on-primary`,
`danger-soft`/`on-danger` e `focus-visible` com o anel do tema. A transição é explícita
(`color`, `background-color`, `border-color`, `box-shadow`, `transform`, 200ms, `ease-out`), sem
`transition-all`: o hover sobe 1px (`hover:-translate-y-px`) e o active volta ao lugar.

### Badge (`components/ui/badge.tsx`)

Variantes `brand`, `accent`, `warn`, `neutral`, `outline`. Texto normal, `font-semibold`,
`text-xs`. Cada variante usa `*-soft` como fundo e o tom forte como texto, com contraste AA nos
dois temas.

### Progress (`components/ui/progress.tsx`)

Exige `label` (vira `aria-label`) e `value` de 0 a 100. Tamanho `sm` para progresso dentro de
cards, `md` para o resumo de nível. A barra usa `track` no trilho e pode ser trocada por
`barClassName`.

### Card (`components/ui/card.tsx`)

`Card`, `CardTitle` e `CardDescription`. O card usa `bg-surface`, `border-line` e `shadow-card`.
Não tem padding próprio: quem usa decide (`p-5`, `p-6`). Para cards clicáveis, combine
`group-hover:-translate-y-0.5`, `group-hover:border-brand-600/40` e `group-hover:shadow-card-hover`.

### Slider (`components/ui/slider.tsx`)

Slider nativo estilizado por `input[type="range"].range-slider`, com `accent-color` e trilho em
`--track`, polegar em `--primary` e borda em `--surface`. Tem label associado por `htmlFor` e
`<output>` mostrando o valor formatado. Sempre inclua `display` legível ("R$ 200", "0,80% a.m.").

### Tema (`components/layout/theme-toggle.tsx`)

Botão de 44px no cabeçalho que abre um menu `role="menu"` com três `menuitemradio`: Claro, Escuro
e Sistema. O item ativo mostra check e `aria-checked`. Fecha ao escolher, ao clicar fora ou com
Escape (devolvendo o foco ao botão). Durante a hidratação, ocupa o mesmo espaço com um placeholder
`aria-hidden` para não deslocar o layout.

### Navegação (`components/layout/`)

| Componente   | Uso                                                                        |
| ------------ | -------------------------------------------------------------------------- |
| `Header`     | cabeçalho sticky com logo, nav desktop, seletor de perfil e tema           |
| `DesktopNav` | links com `aria-current="page"` e destaque do item ativo via `usePathname` |
| `MobileMenu` | menu `<details>` abaixo de `lg`, fecha ao navegar, com Escape e fora       |
| `Footer`     | rodapé com linha gradiente, links em grid e aviso educacional              |

O breakpoint da navegação é `lg` (1024px): abaixo disso o menu hambúrguer assume, porque o
cabeçalho agora carrega também o seletor de tema e o de perfil. Os links desktop mantêm `py-3`
para garantir alvo de 44px.

### Perfil (`components/profile/`)

| Componente        | Uso                                                                    |
| ----------------- | ---------------------------------------------------------------------- |
| `ProfileAvatar`   | ícone e tom do avatar; tamanhos `sm`, `md` e `lg`                      |
| `ProfileForm`     | nome e avatar em radio group acessível, nos modos `create` e `edit`    |
| `ProfileSwitcher` | seletor do cabeçalho com o perfil ativo, troca rápida e link de gestão |
| `ProfileList`     | lista dos perfis, selo `Ativo`, troca e exclusão com confirmação       |
| `ResetProgress`   | apagar missão ou lição individual e recomeçar partes do progresso      |

Cada navegador mantém até três perfis, com XP, lições, quizzes, missões e badges independentes.
O `ProfileSwitcher` aparece no cabeçalho em desktop e mobile; no desktop ele substitui o link de
texto `Perfil`, e o menu hambúrguer mantém o atalho para a página. Sem perfil ativo, o controle
vira um convite para criar o primeiro.

`ProfileBanner` (`components/learn/profile-banner.tsx`) convida a criar o perfil nas páginas de
trilha e missões. `ProfileRequiredNotice` bloqueia a ação sem perfil, mantendo o conteúdo
navegável.

Toda ação de apagar pede confirmação em duas etapas. Ações em massa exigem digitar `RECOMEÇAR`
ou `APAGAR`. Apagar um perfil exige digitar `APAGAR` e remove todo o progresso dele; o próximo da
lista vira ativo. O perfil é preservado nos resets de progresso. A importação de backup substitui
todos os perfis e pede confirmação inline antes de aplicar.

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
um único lugar. Os blocos usam os tokens semânticos, então acompanham o tema.

### Gráficos (`components/charts/projection-chart.tsx`)

SVG próprio, sem biblioteca. Recebe `series` (label, cor, valores, `fill`) e um `ariaLabel`
obrigatório descrevendo o resultado em texto. A primeira série é a linha principal; as demais
aparecem tracejadas. As cores vêm de `var(--chart-N)` para trocar junto com o tema.

## Acessibilidade

- Contraste mínimo AA em todo texto nos dois temas; `muted` só para texto de apoio
- Foco visível global: `outline: 2px solid var(--ring)` com `offset: 2px`
- `prefers-reduced-motion` encurta animações/transições e revela o conteúdo imediatamente, sem
  shimmer nos skeletons
- Todo gráfico tem `role="img"` e `aria-label` com o resumo numérico
- Quiz usa `input type="radio"` nativo dentro de `<fieldset>`, com feedback textual
- Alvos de toque com no mínimo 44px de altura nas ações principais, inclusive no seletor de tema
- Link "pular para o conteúdo" no topo do layout, em `bg-primary text-on-primary`

## Regras práticas

1. **Token antes de classe solta.** Se a cor ou medida se repete, vire token.
2. **Nada de hex em componente.** Use os tokens; gráficos usam `var(--chart-N)`.
3. **Uma ação primária por tela.** O resto é `secondary`, `outline` ou `ghost`.
4. **Verde é ação, azul é dado.** Não use `accent` em botões de ação.
5. **Números financeiros usam `tabular-nums`** para alinhar colunas.
6. **Teste nos dois temas.** Toda tela nova precisa funcionar em claro e escuro antes do merge.
7. **Todo componente novo entra em `components/ui/`** e é documentado aqui.

## Adicionando um componente

```tsx
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function NovoComponente({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("border-line bg-surface shadow-card rounded-2xl border", className)}
      {...props}
    />
  );
}
```

Use `ComponentProps<"elemento">` para repassar props, `cn()` para permitir sobrescrita de
classes e variantes declaradas em um `Record` tipado quando houver mais de um estilo.

## Capturas de tela

`scripts/screenshot.mjs` gera as imagens de `screenshots/` nos dois temas e em desktop/mobile:

```bash
npm run dev            # em outro terminal
node scripts/screenshot.mjs
```

O script abre um contexto por combinação, grava o tema em `localStorage` antes do primeiro render
e salva `home.png` (claro), `home-dark.png` (escuro), `home-mobile.png` e `home-mobile-dark.png`.
Ele usa `reducedMotion: "reduce"` no contexto porque o `fullPage` não dispara o
`IntersectionObserver`; assim o reveal já está no estado final na captura. O script também falha se
houver erro de console ou de página.
