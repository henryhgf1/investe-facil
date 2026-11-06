import { ArrowLeft, ArrowRight, Clock3, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompleteLesson } from "@/components/learn/complete-lesson";
import { LessonMission } from "@/components/learn/lesson-mission";
import { Quiz } from "@/components/learn/quiz";
import { ReadingProgress } from "@/components/learn/reading-progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  getLesson,
  lessonPath,
  nextReadyLesson,
  previousReadyLesson,
  readyLessons,
} from "@/content/lessons";
import { getModule } from "@/content/modules";
import { getQuiz } from "@/content/quizzes";
import { lessonContent } from "@/content/registry";
import { XP_PER_LESSON } from "@/lib/xp";

type LessonPageProps = {
  params: Promise<{ modulo: string; licao: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return readyLessons.map((lesson) => ({
    modulo: lesson.module,
    licao: lesson.slug,
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { modulo, licao } = await params;
  const lesson = getLesson(modulo, licao);

  if (!lesson) return {};

  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { modulo, licao } = await params;
  const lesson = getLesson(modulo, licao);
  const lessonModule = getModule(modulo);
  const Content = lessonContent[licao];

  if (!lesson || !lessonModule || !Content) {
    notFound();
  }

  const quiz = getQuiz(lesson.slug);
  const previous = previousReadyLesson(lesson.slug);
  const next = nextReadyLesson(lesson.slug);

  return (
    <>
      <ReadingProgress />

      <Container className="max-w-3xl py-10 sm:py-14">
        <nav aria-label="Você está aqui" className="text-muted text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/trilha/" className="hover:text-brand-700">
                Trilha
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{lessonModule.shortTitle}</li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">Lição {lesson.order}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <Badge variant="brand">
            Módulo {String(lessonModule.order).padStart(2, "0")} · {lessonModule.shortTitle}
          </Badge>
          <h1 className="font-display text-ink mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{lesson.summary}</p>

          <div className="text-muted mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" aria-hidden="true" />
              {lesson.durationMin} min de leitura
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-4" aria-hidden="true" />+{XP_PER_LESSON} XP ao concluir
            </span>
            {quiz.length > 0 ? <span>{quiz.length} perguntas no quiz</span> : null}
          </div>
        </header>

        <div className="border-line mt-8 border-t pt-8">
          <article>
            <Content />
          </article>
        </div>

        <div className="border-line mt-10 rounded-2xl border bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-ink text-base font-bold">Terminou a leitura?</p>
              <p className="text-muted mt-1 text-sm">
                Marque como concluída para somar XP e acompanhar seu progresso.
              </p>
            </div>
            <CompleteLesson slug={lesson.slug} xp={XP_PER_LESSON} />
          </div>
        </div>

        <Quiz slug={lesson.slug} questions={quiz} />

        <LessonMission lessonSlug={lesson.slug} />

        <nav
          aria-label="Navegação entre lições"
          className="border-line mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link href={lessonPath(previous)} className="group">
              <Card className="group-hover:border-brand-600/40 h-full p-4 transition-colors">
                <p className="text-muted flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Anterior
                </p>
                <p className="text-ink mt-1 font-semibold">{previous.title}</p>
              </Card>
            </Link>
          ) : (
            <Link href="/trilha/" className="group">
              <Card className="group-hover:border-brand-600/40 h-full p-4 transition-colors">
                <p className="text-muted flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Voltar
                </p>
                <p className="text-ink mt-1 font-semibold">Ver todos os módulos</p>
              </Card>
            </Link>
          )}

          {next ? (
            <Link href={lessonPath(next)} className="group sm:text-right">
              <Card className="group-hover:border-brand-600/40 h-full p-4 transition-colors">
                <p className="text-muted flex items-center gap-1.5 text-xs font-semibold uppercase sm:justify-end">
                  Próxima
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </p>
                <p className="text-ink mt-1 font-semibold">{next.title}</p>
              </Card>
            </Link>
          ) : (
            <Link href="/trilha/" className="group sm:text-right">
              <Card className="group-hover:border-brand-600/40 h-full p-4 transition-colors">
                <p className="text-muted flex items-center gap-1.5 text-xs font-semibold uppercase sm:justify-end">
                  Continuar
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </p>
                <p className="text-ink mt-1 font-semibold">Escolher outro módulo</p>
              </Card>
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
