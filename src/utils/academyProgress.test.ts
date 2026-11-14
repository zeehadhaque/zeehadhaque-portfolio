import test from "node:test";
import assert from "node:assert/strict";
import {
  ACADEMY_TWELVE_TOPICS,
  computeLearningStreak,
  evaluateAchievements,
  getRecommendedActions,
  getTopicProgress,
  nextRankForXp,
  rankForXp,
  rankProgressPercent,
} from "./academyProgress";

test("ACADEMY_TWELVE_TOPICS covers all 30 curriculum days exactly once", () => {
  assert.equal(ACADEMY_TWELVE_TOPICS.length, 12);
  const coveredDays = ACADEMY_TWELVE_TOPICS.flatMap((topic) => topic.days);
  assert.equal(coveredDays.length, 30);
  for (let day = 1; day <= 30; day += 1) {
    assert.ok(coveredDays.includes(day), `Missing day ${day}`);
  }
});

test("rank calculation and XP progress percentage stay bounded", () => {
  assert.equal(rankForXp(0).title.en, "Frame Scout");
  assert.equal(rankForXp(180).title.en, "Visual Storyteller");
  assert.equal(nextRankForXp(0)?.min, 80);
  assert.equal(nextRankForXp(900), null);
  assert.equal(rankProgressPercent(40), 50);
  assert.equal(rankProgressPercent(1200), 100);
});

test("computeLearningStreak counts current and longest consecutive UTC days accurately", () => {
  const streak = computeLearningStreak(
    [
      "2026-05-01T10:00:00Z",
      "2026-05-02T14:00:00Z",
      "2026-05-03T18:00:00Z",
      "2026-05-07T09:00:00Z",
      "2026-05-08T11:30:00Z",
    ],
    "2026-05-09T08:00:00Z",
  );
  assert.equal(streak.longestStreak, 3);
  assert.equal(streak.currentStreak, 2);
  assert.equal(streak.activeDaysCount, 5);

  const broken = computeLearningStreak(
    ["2026-05-01T10:00:00Z"],
    "2026-05-09T08:00:00Z",
  );
  assert.equal(broken.currentStreak, 0);
  assert.equal(broken.longestStreak, 1);
});

test("evaluateAchievements unlocks milestones based on progress, reflections, and attempts", () => {
  const progress = [1, 2, 3, 4, 5, 6, 7].map((day) => ({
    day,
    xp_earned: day === 7 ? 35 : 20,
    reflection: day <= 5 ? "Measured negative space and eyelines carefully." : "",
    completed_at: `2026-05-0${day}T12:00:00Z`,
  }));
  const attempts = [1, 2, 3, 4, 5].map((id) => ({
    id,
    day: id,
    is_correct: true,
    xp_awarded: 20,
    attempted_at: `2026-05-0${id}T12:00:00Z`,
  }));

  const badges = evaluateAchievements({ progress, attempts });
  const map = new Map(badges.map((badge) => [badge.id, badge]));
  assert.equal(map.get("first-frame")?.unlocked, true);
  assert.equal(map.get("visual-foundation")?.unlocked, true);
  assert.equal(map.get("field-notes")?.unlocked, true);
  assert.equal(map.get("sharp-eye")?.unlocked, true);
  assert.equal(map.get("memory-keeper")?.unlocked, false);
  assert.equal(map.get("auteur-graduate")?.unlocked, false);
});

test("getTopicProgress and getRecommendedActions respect access bounds and wrong attempts", () => {
  const completed = new Set([1, 2]);
  const firstTopicProgress = getTopicProgress(ACADEMY_TWELVE_TOPICS[0], completed);
  assert.equal(firstTopicProgress.status, "completed");
  assert.equal(firstTopicProgress.percent, 100);

  const recs = getRecommendedActions({
    completedDays: completed,
    attempts: [
      { id: 1, day: 1, is_correct: false, xp_awarded: 0, attempted_at: "2026-05-05T10:00:00Z" },
    ],
    hasProgram: false,
  });
  assert.equal(recs[0].kind, "continue");
  assert.equal(recs[0].targetDay, 3);
  assert.equal(recs[1].kind, "review");
  assert.equal(recs[1].targetDay, 1);
});
