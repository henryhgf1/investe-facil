# Investe Fácil

![CI](https://github.com/henryhgf1/investe-facil/actions/workflows/ci.yml/badge.svg)

Educação financeira para quem está começando: lições curtas, simuladores interativos e
progresso gamificado, sem cadastro, sem backend e sem dinheiro em risco.

> **Status:** Sprint 2 concluído. A trilha completa (10 lições) e o glossário com mais de 50 termos
> estão no ar. Badges e missões práticas ficaram para a próxima etapa, junto com o simulador
> histórico.

![Página inicial](screenshots/home.png)

## O problema

Quem quer começar a investir esbarra em dois obstáculos: conteúdo cheio de jargão e medo de
errar com dinheiro real. O Investe Fácil resolve os dois com uma trilha que constrói o
vocabulário aos poucos e com simuladores onde errar custa zero.

## O que já funciona

- **Trilha em 3 módulos** com 10 lições publicadas
- **Lições em MDX** com componentes interativos embutidos
- **8 simuladores e gráficos**: juros compostos, inflação, risco × retorno, Tesouro × poupança,
  CDB × LCI, IR/IOF, dividend yield, propriedade e diversificação
- **Glossário com mais de 50 termos**, busca que ignora acentos, filtros por categoria e dados
  estruturados para indexação
- **Quiz com correção e explicação** em cada lição
- **Progresso persistente** no navegador, com XP, níveis e aproveitamento nos quizzes
- **Backup em JSON** para exportar/importar progresso entre dispositivos
- **Documentação de design** em [`docs/design-system.md`](docs/design-system.md)
- **Acessibilidade**: navegação por teclado, contraste AA, gráficos com descrição textual e
  respeito a `prefers-reduced-motion`

## Stack

| Camada    | Escolha                                                 |
| --------- | ------------------------------------------------------- |
| Framework | Next.js 16 (App Router) com `output: 'export'`          |
| Linguagem | TypeScript                                              |
| Estilo    | Tailwind CSS 4 com tokens em CSS variables              |
| Conteúdo  | MDX + registry tipado                                   |
| Estado    | Zustand com `persist` versionado                        |
| Validação | Zod                                                     |
| Testes    | Vitest + Testing Library (unitários) e Playwright (E2E) |
| Deploy    | Estático: Vercel, Netlify ou qualquer CDN               |

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

```bash
npm run build     # gera o site estático em out/
npm run preview   # serve o build estático na porta 3000
npm run lint
npm run typecheck
npm test          # testes unitários
npm run test:e2e  # testes end-to-end (requer o build)
```

Para regenerar as capturas de tela com o servidor rodando:

```bash
node scripts/screenshot.mjs
```

## Estrutura

```
app/                      rotas (landing, trilha, lição, glossário, sobre)
components/
  charts/                 gráficos SVG sem dependências
  learn/                  quiz, progresso, navegação da trilha e glossário
  mdx/                    Callout, KeyIdea, Formula
  sim/                    simuladores interativos
  ui/                     componentes base (botão, card, badge, progresso)
content/
  modules/                lições em MDX, versionadas no Git
  glossary.ts             verbetes, categorias e ligações entre termos
  lessons.ts              metadados e ordenação da trilha
  quizzes.ts              perguntas, respostas e explicações
  registry.ts             mapeamento slug → componente MDX
lib/
  finance.ts              juros, inflação, IR/IOF, dividend yield e risco (funções puras)
  search.ts               normalização de busca sem acento
  xp.ts                   níveis e progressão
  store/progress.ts       Zustand + persist + validação do backup
docs/                     notas de aprendizado e design system
tests/e2e/                fluxos críticos em desktop e mobile
```

## Decisões técnicas

**Sem backend, de propósito.** O progresso vive no `localStorage`, com schema versionado e
exportação em JSON. Isso elimina banco, autenticação, custo de servidor e coleta de dados
pessoais, e deixa o deploy em uma CDN estática. A limitação (progresso por navegador) é
mitigada pelo backup manual.

**Conteúdo em MDX versionado no Git.** Cada lição é um arquivo de texto. Revisar conteúdo é
abrir um pull request, e o build quebra se um componente ou link estiver errado. Sem CMS.

**Motor financeiro separado da interface.** `lib/finance.ts` concentra as contas de juros
compostos, inflação, IR/IOF, dividend yield e risco em funções puras, cobertas por testes. A UI
apenas consome.

**Conteúdo validado no build.** Um teste de integridade garante que toda lição publicada tem
arquivo MDX, entrada no registry e quiz com alternativas válidas. O glossário também é checado:
slugs únicos, categorias existentes e referências cruzadas válidas.

**Gráficos próprios em SVG.** Para os simuladores atuais, um componente de ~100 linhas resolve
sem adicionar 100 kB de biblioteca. Bibliotecas de gráfico entram apenas quando o simulador
histórico exigir interação mais rica.

## Testes

- **51 testes unitários** cobrindo o motor financeiro (IR, IOF, poupança, dividend yield e risco),
  a progressão de XP, o store (idempotência, melhor pontuação e round-trip de backup), a busca sem
  acento e a integridade do conteúdo/glossário
- **9 cenários E2E** em desktop e mobile: navegação, conclusão de lição com persistência, correção
  do quiz, reação dos simuladores, abertura das 10 lições, busca do glossário e ausência de rolagem
  horizontal

## Roadmap

- [x] Sprint 1: base, componentes, 3 lições, quiz, progresso e deploy estático
- [x] Sprint 2: 10 lições publicadas, simuladores de renda fixa/variável e glossário
- [ ] Sprint 3: badges, missões práticas e simulador com dados históricos (máquina do tempo)
- [ ] Sprint 4: carteira, benchmarks (CDI/IBOV) e relatório de evolução

## Aviso

Projeto educacional de portfólio. Nada aqui é recomendação de investimento. Todos os números
são ilustrativos e rentabilidades passadas não garantem resultados futuros.
