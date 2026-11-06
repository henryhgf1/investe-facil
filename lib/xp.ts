export const XP_PER_LESSON = 20;
export const XP_PER_CORRECT_ANSWER = 5;
export const XP_PER_MISSION = 15;

const LEVEL_THRESHOLDS = [0, 40, 100, 180, 280, 360, 420, 480];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;
export const MAX_XP = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

export type LevelInfo = {
  level: number;
  xpInLevel: number;
  xpToNextLevel: number | null;
  progressPercent: number;
};

export function levelForXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));

  let index = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (safeXp >= LEVEL_THRESHOLDS[i]) {
      index = i;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[index];
  const nextThreshold = LEVEL_THRESHOLDS[index + 1] ?? null;

  if (nextThreshold === null) {
    return {
      level: index + 1,
      xpInLevel: safeXp - currentThreshold,
      xpToNextLevel: null,
      progressPercent: 100,
    };
  }

  const span = nextThreshold - currentThreshold;

  return {
    level: index + 1,
    xpInLevel: safeXp - currentThreshold,
    xpToNextLevel: nextThreshold - safeXp,
    progressPercent: Math.min(100, Math.round(((safeXp - currentThreshold) / span) * 100)),
  };
}

export function totalXpForLessons(lessonCount: number) {
  return lessonCount * XP_PER_LESSON;
}
