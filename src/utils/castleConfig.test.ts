import test from "node:test";
import assert from "node:assert/strict";
import { filmProjects } from "../data/site";
import {
  CHAMBER_CAMERA_WAYPOINTS,
  UNIVERSE_DESTINATIONS,
  computeOpeningShotState,
  getCameraTargetForChamber,
  getFilmDisplayMetadata,
  interpolateCameraPose,
  normalizeActiveChamber,
  resolveInitialLiteMode,
} from "./castleConfig";

test("UNIVERSE_DESTINATIONS defines 7 Grand Cinema Palace destinations from Grand Foyer to Grand Exit", () => {
  assert.equal(UNIVERSE_DESTINATIONS.length, 7);
  assert.equal(UNIVERSE_DESTINATIONS[0].id, "foyer");
  assert.equal(UNIVERSE_DESTINATIONS[1].id, "screening-hall");
  assert.equal(UNIVERSE_DESTINATIONS[2].id, "projection-room");
  assert.equal(UNIVERSE_DESTINATIONS[3].id, "directors-suite");
  assert.equal(UNIVERSE_DESTINATIONS[4].id, "institute");
  assert.equal(UNIVERSE_DESTINATIONS[5].id, "intelligence");
  assert.equal(UNIVERSE_DESTINATIONS[6].id, "grand-exit");
  assert.equal(CHAMBER_CAMERA_WAYPOINTS.length, 7);
});

test("computeOpeningShotState sequences all 4 Grand Cinema Opening shots smoothly", () => {
  const shot1 = computeOpeningShotState(0.05);
  const shot2 = computeOpeningShotState(0.36);
  const shot3 = computeOpeningShotState(0.6);
  const shot4 = computeOpeningShotState(0.95);

  assert.equal(shot1.shot, 1);
  assert.equal(shot2.shot, 2);
  assert.equal(shot3.shot, 3);
  assert.equal(shot4.shot, 4);

  assert.ok(shot1.posZ > shot2.posZ);
  assert.ok(shot2.posZ > shot3.posZ);
  assert.ok(shot3.posZ > shot4.posZ);

  assert.ok(shot2.doorOpenRatio > shot1.doorOpenRatio);
  assert.equal(shot3.doorOpenRatio, 1);
  assert.ok(shot4.curtainOpenRatio > shot3.curtainOpenRatio);
  assert.ok(shot4.screenGlow >= 0.9);
});

test("interpolateCameraPose returns endpoints at 0 and 1 and smooth midpoints", () => {
  const start = interpolateCameraPose(0);
  const mid = interpolateCameraPose(0.5);
  const end = interpolateCameraPose(1);

  assert.equal(start.posZ, CHAMBER_CAMERA_WAYPOINTS[0].posZ);
  assert.equal(end.posZ, CHAMBER_CAMERA_WAYPOINTS[6].posZ);
  assert.ok(mid.posZ < start.posZ && mid.posZ > end.posZ);
  assert.equal(interpolateCameraPose(-5).posZ, start.posZ);
  assert.equal(interpolateCameraPose(9).posZ, end.posZ);
});

test("normalizeActiveChamber maps Grand Cinema Palace IDs and compatibility anchors accurately", () => {
  assert.equal(normalizeActiveChamber("foyer"), "foyer");
  assert.equal(normalizeActiveChamber("origin"), "foyer");
  assert.equal(normalizeActiveChamber("home"), "foyer");
  assert.equal(normalizeActiveChamber("screening-hall"), "screening-hall");
  assert.equal(normalizeActiveChamber("filmography"), "screening-hall");
  assert.equal(normalizeActiveChamber("films"), "screening-hall");
  assert.equal(normalizeActiveChamber("projection-room"), "projection-room");
  assert.equal(normalizeActiveChamber("frame"), "projection-room");
  assert.equal(normalizeActiveChamber("visual-chamber"), "projection-room");
  assert.equal(normalizeActiveChamber("directors-suite"), "directors-suite");
  assert.equal(normalizeActiveChamber("auteur"), "directors-suite");
  assert.equal(normalizeActiveChamber("about"), "directors-suite");
  assert.equal(normalizeActiveChamber("institute"), "institute");
  assert.equal(normalizeActiveChamber("academy"), "institute");
  assert.equal(normalizeActiveChamber("intelligence"), "intelligence");
  assert.equal(normalizeActiveChamber("grand-exit"), "grand-exit");
  assert.equal(normalizeActiveChamber("contact"), "grand-exit");
  assert.equal(normalizeActiveChamber("unknown"), "foyer");
});

test("getCameraTargetForChamber resolves valid waypoints and compatibility aliases", () => {
  assert.equal(
    getCameraTargetForChamber("screening-hall").chamber,
    "screening-hall",
  );
  assert.equal(
    getCameraTargetForChamber("filmography").chamber,
    "screening-hall",
  );
  assert.equal(getCameraTargetForChamber("nonexistent").chamber, "foyer");
});

test("getFilmDisplayMetadata preserves all 8 YouTube IDs without inventing unverified titles", () => {
  assert.equal(filmProjects.length, 8);
  const expectedIds = [
    "zBJNLNok3Pc",
    "O88euzMxskQ",
    "ZSttExMBavg",
    "jcZx3QuT16g",
    "qeRZNvjSX8U",
    "I11_0aB_IOM",
    "Yj6-Iyc3u3Q",
    "Zoqn6CyBIzU",
  ];
  assert.deepEqual(
    filmProjects.map((f) => f.videoId),
    expectedIds,
  );

  const shadowMeta = getFilmDisplayMetadata(filmProjects[2], 2);
  assert.equal(shadowMeta.title, "SHADOW / III");
  assert.equal(shadowMeta.isTitleVerified, true);

  const teaserMeta = getFilmDisplayMetadata(filmProjects[7], 7);
  assert.equal(teaserMeta.title, "Don't Go There — Teaser");
  assert.equal(teaserMeta.isTitleVerified, true);

  const untitledMeta = getFilmDisplayMetadata(filmProjects[0], 0);
  assert.equal(untitledMeta.title, "Selected Film · Vault 01");
  assert.equal(untitledMeta.isTitleVerified, false);
});

test("resolveInitialLiteMode respects explicit preference, reduced motion, and weak hardware", () => {
  assert.equal(
    resolveInitialLiteMode({
      prefersReducedMotion: true,
      storedPreference: "false",
    }),
    false,
  );
  assert.equal(
    resolveInitialLiteMode({
      prefersReducedMotion: true,
      storedPreference: null,
    }),
    true,
  );
  assert.equal(
    resolveInitialLiteMode({
      prefersReducedMotion: false,
      storedPreference: null,
      deviceMemory: 2,
    }),
    true,
  );
  assert.equal(
    resolveInitialLiteMode({
      prefersReducedMotion: false,
      storedPreference: null,
      hardwareConcurrency: 8,
      deviceMemory: 8,
    }),
    false,
  );
});
