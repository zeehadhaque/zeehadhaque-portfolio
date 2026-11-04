import { useState } from "react";
import type { AcademyLanguage } from "../../data/academy";

const labs = [
  {
    id: "light",
    number: "01",
    en: "Natural-light continuity",
    bn: "Natural-light continuity",
    briefEn: "Create a three-shot sequence beside one window. Lock exposure and white balance; change only blocking and camera position. Keep skin detail while maintaining a consistent direction of light.",
    briefBn: "একটি window-এর পাশে তিন-shot sequence তৈরি করো। Exposure ও white balance lock রাখবে; শুধু blocking ও camera position বদলাবে। Skin detail রেখে light direction consistent রাখো।",
    checksEn: ["Lock exposure and white balance", "Record key direction and shadow shape", "Match all three shots before grading"],
    checksBn: ["Exposure ও white balance lock", "Key direction ও shadow shape record", "Grading-এর আগে তিনটি shot match"],
  },
  {
    id: "depth",
    number: "02",
    en: "Layered blocking & reveal",
    bn: "Layered blocking ও reveal",
    briefEn: "Stage an action across foreground, middle ground and background. Hide one piece of information, then reveal it through a motivated move or a change in the character's eyeline.",
    briefBn: "Foreground, middle ground ও background-এ action stage করো। একটি তথ্য আড়াল করে motivated move বা character-এর eyeline change দিয়ে reveal করো।",
    checksEn: ["Map the three visual planes", "Define what the audience knows first", "Motivate the reveal with action"],
    checksBn: ["তিনটি visual plane map", "দর্শক আগে কী জানবে ঠিক করো", "Action দিয়ে reveal motivate"],
  },
  {
    id: "sound",
    number: "03",
    en: "Silence, sound bridge & rhythm",
    bn: "Silence, sound bridge ও rhythm",
    briefEn: "Build two edits of the same scene. One uses ambience and a sound bridge; the other uses a deliberate drop to silence. Compare how cut length changes anticipation.",
    briefBn: "একই scene-এর দুটি edit বানাও। একটিতে ambience ও sound bridge, অন্যটিতে deliberate silence ব্যবহার করো। Cut length anticipation কীভাবে বদলায় তুলনা করো।",
    checksEn: ["Record room tone and a close detail", "Build a sound bridge across one cut", "Compare the silence version"],
    checksBn: ["Room tone ও close detail record", "একটি cut জুড়ে sound bridge তৈরি", "Silence version তুলনা"],
  },
] as const;

export function AdvancedLab({ language }: { language: AcademyLanguage }) {
  const [checks, setChecks] = useState<string[]>([]);
  const bn = language === "bn";
  return (
    <section className="academy-advanced">
      <div className="academy-section-intro">
        <span className="academy-eyebrow">ACCESS GRANTED / ADVANCED PRACTICE</span>
        <h3>{bn ? "ফ্রেমের আরও গভীরে যাও।" : "Go deeper behind the frame."}</h3>
        <p>{bn ? "Foundation শেষে আরও demanding visual decision পরীক্ষা করার জন্য তিনটি practical lab। এগুলো brief, preset recipe নয়।" : "Three focused labs for learners who have completed the foundation and want to test more demanding visual decisions. These are practical briefs, not preset recipes."}</p>
      </div>
      <div className="academy-game-grid academy-advanced-grid">
        {labs.map((lab) => (
          <article className="academy-game-card" key={lab.id}>
            <span className="academy-eyebrow">LAB / {lab.number}</span>
            <h4>{bn ? lab.bn : lab.en}</h4>
            <p>{bn ? lab.briefBn : lab.briefEn}</p>
            <div className="academy-advanced-checks">
              {lab.checksEn.map((check, index) => {
                const id = `${lab.id}-${index}`;
                return (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={checks.includes(id)}
                      onChange={(event) => setChecks((current) =>
                        event.target.checked ? [...current, id] : current.filter((item) => item !== id)
                      )}
                    />
                    <span>{bn ? lab.checksBn[index] : check}</span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <p className="academy-admin__security">{bn ? "এই advanced checklist অনুশীলনের সহায়ক। এগুলো XP বা professional qualification দেয় না।" : "These advanced lab checklists are practice aids. They do not issue XP or a professional qualification."}</p>
    </section>
  );
}
