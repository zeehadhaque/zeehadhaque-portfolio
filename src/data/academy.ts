export type AcademyLanguage = "en" | "bn";
export type Bilingual = { en: string; bn: string };
export type AcademyModuleKey = "visual" | "camera" | "story" | "post";

export interface AcademyQuestion {
  prompt: Bilingual;
  options: readonly Bilingual[];
  answerIndex: number;
  explanation: Bilingual;
}

export interface AcademyDay {
  day: number;
  week: number;
  module: AcademyModuleKey;
  title: Bilingual;
  objective: Bilingual;
  lesson: Bilingual;
  exercise: Bilingual;
  reflection: Bilingual;
  question: AcademyQuestion;
  xp: number;
  requiredEntitlement?: "program.30day";
}

const t = (en: string, bn: string): Bilingual => ({ en, bn });

export const academyModules: readonly {
  key: AcademyModuleKey;
  number: string;
  title: Bilingual;
  description: Bilingual;
  days: string;
}[] = [
  { key: "visual", number: "01", title: t("Visual language", "ভিজ্যুয়াল ভাষা"), description: t("Learn to direct the eye before you move the camera.", "ক্যামেরা নড়ানোর আগেই দর্শকের চোখকে পরিচালনা করতে শেখো।"), days: "01—07" },
  { key: "camera", number: "02", title: t("Camera & light", "ক্যামেরা ও আলো"), description: t("Make exposure, perspective and movement serve the scene.", "Exposure, perspective ও movement-কে দৃশ্যের প্রয়োজনে ব্যবহার করো।"), days: "08—14" },
  { key: "story", number: "03", title: t("Story & direction", "গল্প ও পরিচালনা"), description: t("Turn intention into blocking, visual beats and a shootable plan.", "ভাবনাকে blocking, visual beat ও shootable plan-এ রূপ দাও।"), days: "15—21" },
  { key: "post", number: "04", title: t("Editing & sound", "এডিটিং ও সাউন্ড"), description: t("Shape time, continuity, atmosphere and a finished cut.", "সময়, continuity, atmosphere ও final cut তৈরি করো।"), days: "22—30" },
];

export const academyDays: readonly AcademyDay[] = [
  {
    day: 1, week: 1, module: "visual", xp: 20,
    title: t("Think in frames", "ফ্রেমের ভেতর ভাবতে শেখো"),
    objective: t("Identify what the audience should notice first.", "দর্শক প্রথমে কী দেখবে তা নির্ধারণ করতে শেখা।"),
    lesson: t("A frame is a decision, not a container. Every edge includes something and excludes something. Before recording, identify the subject, the visual priority and the information the audience does not need yet. A strong frame gives the viewer a clear place to look.", "ফ্রেম শুধু ছবি রাখার বাক্স নয়—এটি একটি সিদ্ধান্ত। ফ্রেমের প্রতিটি edge কিছু দেখায়, কিছু আড়াল করে। রেকর্ড করার আগে subject, visual priority এবং দর্শক এখনই যা জানার প্রয়োজন নেই তা ঠিক করো। শক্তিশালী ফ্রেম দর্শকের চোখকে একটি পরিষ্কার জায়গা দেয়।"),
    exercise: t("Record the same subject in three compositions: centered, off-centre and with negative space. Keep the camera still. Compare which version communicates the subject's mood most clearly.", "একই subject-কে তিনভাবে রেকর্ড করো: মাঝখানে, এক পাশে এবং negative space রেখে। ক্যামেরা স্থির রাখবে। কোন ফ্রেমে subject-এর mood সবচেয়ে পরিষ্কার বোঝা যায় তুলনা করো।"),
    reflection: t("What did you deliberately leave outside the frame, and why?", "ইচ্ছা করে ফ্রেমের বাইরে কী রেখেছ, এবং কেন?"),
    question: { prompt: t("Before choosing a camera move, what should you identify?", "ক্যামেরা মুভ বেছে নেওয়ার আগে কী নির্ধারণ করবে?"), options: [t("The subject and visual priority", "Subject ও visual priority"), t("The longest possible lens", "সবচেয়ে লম্বা lens"), t("A transition effect", "একটি transition effect"), t("The export bitrate", "Export bitrate")], answerIndex: 0, explanation: t("A purposeful frame starts with subject, intention and hierarchy. Technical choices follow the story.", "Purposeful frame শুরু হয় subject, intention ও visual hierarchy দিয়ে। Technical choice পরে গল্পকে support করে।") },
  },
  {
    day: 2, week: 1, module: "visual", xp: 20,
    title: t("Shot sizes & visual distance", "Shot size ও দৃশ্যের দূরত্ব"),
    objective: t("Choose shot size according to the information and emotion a scene needs.", "দৃশ্যের তথ্য ও আবেগ অনুযায়ী shot size বেছে নেওয়া।"),
    lesson: t("Wide shots establish space and relationships. Medium shots reveal body language and interaction. Close-ups isolate detail and emotion. Extreme close-ups turn a small detail into a story event. These are not rigid rules: choose the size that gives the audience the right information at the right moment.", "Wide shot জায়গা ও সম্পর্ক বোঝায়। Medium shot body language ও interaction দেখায়। Close-up আবেগ বা detail আলাদা করে। Extreme close-up ছোট detail-কে গল্পের গুরুত্বপূর্ণ ঘটনায় পরিণত করতে পারে। এগুলো কঠোর নিয়ম নয়—সঠিক মুহূর্তে দর্শককে সঠিক তথ্য দেয় এমন shot বেছে নাও।"),
    exercise: t("Shoot a 20-second action using only four sizes: wide, medium, close-up and extreme close-up. Keep the action continuous and make every cut reveal new information.", "একটি ২০ সেকেন্ডের action শুধু চারটি size দিয়ে শুট করো: wide, medium, close-up ও extreme close-up। Action continuous রাখবে, প্রতিটি cut-এ নতুন তথ্য প্রকাশ করবে।"),
    reflection: t("Which shot size changed the emotional meaning of the action most?", "কোন shot size action-এর আবেগ সবচেয়ে বেশি বদলে দিয়েছে?"),
    question: { prompt: t("Which shot is usually best for revealing a tiny but important clue?", "ছোট কিন্তু গুরুত্বপূর্ণ clue দেখাতে সাধারণত কোন shot বেশি কার্যকর?"), options: [t("Extreme wide shot", "Extreme wide shot"), t("Extreme close-up", "Extreme close-up"), t("Establishing shot only", "শুধু establishing shot"), t("Overhead master shot", "Overhead master shot")], answerIndex: 1, explanation: t("An extreme close-up isolates a small detail so the audience reads it as significant.", "Extreme close-up ছোট detail আলাদা করে, ফলে দর্শক সেটিকে গুরুত্বপূর্ণ হিসেবে পড়ে।") },
  },
  {
    day: 3, week: 1, module: "visual", xp: 20,
    title: t("Camera angles & point of view", "Camera angle ও point of view"),
    objective: t("Understand how camera height changes the viewer's relationship with a subject.", "ক্যামেরার উচ্চতা subject-এর সঙ্গে দর্শকের সম্পর্ক কীভাবে বদলায় বোঝা।"),
    lesson: t("An angle is a point of view. Eye-level often feels observational; a low angle can add scale or pressure; a high angle can reveal vulnerability or spatial pattern. None of these meanings is automatic. Context, lens, performance and framing decide what the angle communicates.", "Angle হলো একটি point of view। Eye-level সাধারণত পর্যবেক্ষণধর্মী; low angle subject-কে বড় বা চাপ সৃষ্টিকারী করতে পারে; high angle vulnerability বা spatial pattern প্রকাশ করতে পারে। তবে কোনো angle-এর অর্থ automatic নয়—context, lens, performance ও framing মিলে অর্থ তৈরি করে।"),
    exercise: t("Film the same person at eye level, slightly below eye level and from above. Keep distance and lens setting as similar as possible. Write one mood word for each version.", "একই ব্যক্তিকে eye level, সামান্য নিচ থেকে এবং ওপর থেকে শুট করো। দূরত্ব ও lens setting যতটা সম্ভব একই রাখবে। প্রতিটি version-এর জন্য একটি mood word লেখো।"),
    reflection: t("Did the angle change the character, or only your judgement of the character?", "Angle কি character-কে বদলেছে, নাকি character সম্পর্কে তোমার বিচারকে?"),
    question: { prompt: t("What is the most reliable way to choose a camera angle?", "Camera angle বেছে নেওয়ার সবচেয়ে নির্ভরযোগ্য উপায় কী?"), options: [t("Follow a fixed rule for every genre", "প্রতিটি genre-এ একই নিয়ম"), t("Match the point of view to story intention", "Story intention অনুযায়ী point of view বেছে নেওয়া"), t("Always use a low angle", "সবসময় low angle ব্যবহার"), t("Copy a popular shot", "জনপ্রিয় shot কপি করা")], answerIndex: 1, explanation: t("Angles communicate through context. The story intention is the deciding factor.", "Angle context-এর মাধ্যমে অর্থ তৈরি করে। Story intention-ই সিদ্ধান্তের ভিত্তি।") },
  },
  {
    day: 4, week: 1, module: "visual", xp: 20,
    title: t("Composition & negative space", "Composition ও negative space"),
    objective: t("Create visual hierarchy using placement, balance and empty space.", "Placement, balance ও খালি জায়গা দিয়ে visual hierarchy তৈরি করা।"),
    lesson: t("Rule of thirds is a useful starting grid, not a law. Leading lines can guide attention; foreground can add depth; symmetry can suggest control; imbalance can create unease. Negative space can communicate isolation, anticipation or scale. Composition should support the emotional beat rather than decorate the frame.", "Rule of thirds একটি useful starting grid, আইন নয়। Leading line চোখকে পরিচালনা করে; foreground depth যোগ করে; symmetry নিয়ন্ত্রণের অনুভূতি দিতে পারে; imbalance অস্বস্তি তৈরি করতে পারে। Negative space isolation, anticipation বা scale বোঝাতে পারে। Composition-এর কাজ আবেগকে support করা, শুধু frame সাজানো নয়।"),
    exercise: t("Create two still frames of a person waiting: one crowded and one with generous negative space. Keep the same person and location. Compare the feeling.", "অপেক্ষারত একজন মানুষকে নিয়ে দুটি still frame বানাও: একটি crowded, অন্যটিতে অনেক negative space। একই মানুষ ও location ব্যবহার করবে। অনুভূতির পার্থক্য তুলনা করো।"),
    reflection: t("What does the empty space make the audience expect?", "খালি জায়গাটি দর্শককে কী আশা করতে বাধ্য করছে?"),
    question: { prompt: t("Negative space is especially useful when you want to communicate…", "Negative space বিশেষভাবে কার্যকর যখন তুমি বোঝাতে চাও…"), options: [t("Only technical sharpness", "শুধু technical sharpness"), t("Isolation, scale or anticipation", "Isolation, scale বা anticipation"), t("A faster frame rate", "দ্রুত frame rate"), t("A cleaner audio waveform", "পরিষ্কার audio waveform")], answerIndex: 1, explanation: t("Empty space can become story information by shaping the subject's relationship to the environment.", "খালি জায়গা subject ও environment-এর সম্পর্ক দেখিয়ে গল্পের তথ্য হয়ে উঠতে পারে।") },
  },
  {
    day: 5, week: 1, module: "visual", xp: 20,
    title: t("Screen direction & eyelines", "Screen direction ও eyeline"),
    objective: t("Keep spatial relationships legible across cuts.", "Cut-এর মধ্যেও spatial relationship পরিষ্কার রাখা।"),
    lesson: t("The 180-degree system helps preserve left-right relationships between subjects. The camera generally stays on one side of the axis of action. Eyelines should connect logically: if a character looks screen-right, the next shot should show what they are looking toward in a compatible direction. Crossing the line can be intentional, but the audience needs a visual reason to reorient.", "180-degree system subject-দের left-right relationship ধরে রাখতে সাহায্য করে। Camera সাধারণত action axis-এর এক পাশে থাকে। Eyeline logicalভাবে connect হওয়া দরকার: character screen-right তাকালে পরের shot-এ compatible direction-এ তার দৃষ্টির target দেখাও। Line cross করা যায়, তবে দর্শককে নতুন spatial orientation বুঝতে visual clue দিতে হবে।"),
    exercise: t("Shoot a simple two-person exchange with a clear action axis. Edit the shots together. Then deliberately cross the line and add a neutral moving shot to re-establish geography.", "দুই ব্যক্তির ছোট exchange একটি পরিষ্কার action axis ধরে শুট করো। Shotগুলো edit করো। এরপর ইচ্ছাকৃতভাবে line cross করে একটি neutral moving shot যোগ করো যাতে geography আবার পরিষ্কার হয়।"),
    reflection: t("At what moment did the screen direction become confusing, and how did you fix it?", "কোন মুহূর্তে screen direction বিভ্রান্তিকর হয়েছে, এবং কীভাবে ঠিক করেছ?"),
    question: { prompt: t("What does the 180-degree rule primarily protect?", "180-degree rule মূলত কী রক্ষা করে?"), options: [t("Colour consistency", "Colour consistency"), t("Spatial and screen-direction continuity", "Spatial ও screen-direction continuity"), t("Audio loudness", "Audio loudness"), t("Lens distortion", "Lens distortion")], answerIndex: 1, explanation: t("It preserves the audience's mental map of where subjects are in relation to one another.", "এটি subject-রা একে অপরের তুলনায় কোথায় আছে—দর্শকের সেই mental map ধরে রাখে।") },
  },
  {
    day: 6, week: 1, module: "visual", xp: 20,
    title: t("Build a visual sequence", "Visual sequence তৈরি"),
    objective: t("Use a sequence of shots to communicate one complete action.", "কয়েকটি shot দিয়ে একটি সম্পূর্ণ action বোঝানো।"),
    lesson: t("A sequence is not a random collection of attractive shots. Each shot should add information, change emphasis or move the action forward. A simple five-shot pattern can be: wide context, medium action, close detail, reaction and a final image that changes the meaning. The pattern is a practice tool, not a formula.", "Sequence মানে সুন্দর shot-এর এলোমেলো collection নয়। প্রতিটি shot নতুন তথ্য দেয়, emphasis বদলায় অথবা action এগিয়ে নেয়। সহজ পাঁচ-shot pattern হতে পারে: wide context, medium action, close detail, reaction এবং অর্থ বদলে দেওয়া final image। এটি practice tool, বাধ্যতামূলক formula নয়।"),
    exercise: t("Create a silent 15–30 second sequence of someone discovering an object. Use no dialogue and no more than five shots. Make the last shot reveal why the object matters.", "কেউ একটি বস্তু খুঁজে পাওয়ার ১৫–৩০ সেকেন্ডের silent sequence তৈরি করো। Dialogue নয়, সর্বোচ্চ পাঁচটি shot। শেষ shot-এ বস্তুটি কেন গুরুত্বপূর্ণ তা বোঝাবে।"),
    reflection: t("Which shot carries the turning point of your sequence?", "তোমার sequence-এর turning point কোন shot বহন করছে?"),
    question: { prompt: t("A useful sequence shot should…", "একটি কার্যকর sequence shot-এর কাজ কী?"), options: [t("Repeat the previous shot exactly", "আগের shot হুবহু পুনরাবৃত্তি"), t("Add information or shift emphasis", "নতুন তথ্য দেওয়া বা emphasis বদলানো"), t("Exist only because it looks cinematic", "শুধু cinematic দেখায় বলে থাকা"), t("Hide the action", "Action লুকানো")], answerIndex: 1, explanation: t("Every cut earns its place by adding information, emphasis, rhythm or emotional meaning.", "প্রতিটি cut-এর জায়গা অর্জন করতে হয়—তথ্য, emphasis, rhythm বা আবেগ যোগ করে।") },
  },
  {
    day: 7, week: 1, module: "visual", xp: 35,
    title: t("Memory lab 01 — visual language", "মেমোরি ল্যাব ০১ — ভিজ্যুয়াল ভাষা"),
    objective: t("Retrieve key ideas from days 1–6 without rereading first.", "আগে না পড়ে ১–৬ দিনের ধারণাগুলো মনে করে প্রয়োগ করা।"),
    lesson: t("Close your notes before the checkpoint. Sketch a frame from memory, label the subject hierarchy, describe its shot size and explain the screen direction. Retrieval practice makes gaps visible; after answering, revisit the explanation and correct your misunderstanding.", "Checkpoint-এর আগে নোট বন্ধ করো। স্মৃতি থেকে একটি frame আঁকো, subject hierarchy label করো, shot size বর্ণনা করো এবং screen direction ব্যাখ্যা করো। Retrieval practice শেখার gap দেখায়; উত্তর দেওয়ার পরে explanation দেখে ভুল ধারণা ঠিক করো।"),
    exercise: t("Make a six-frame contact sheet: one wide, one medium, one close-up, one negative-space composition, one eyeline match and one complete action sequence.", "ছয়টি frame-এর contact sheet বানাও: একটি wide, medium, close-up, negative-space composition, eyeline match এবং একটি complete action sequence।"),
    reflection: t("Which idea could you recall easily, and which one needed another attempt?", "কোন ধারণা সহজে মনে পড়েছে, আর কোনটি আবার অনুশীলন করতে হয়েছে?"),
    question: { prompt: t("What should you do after a retrieval-practice answer is wrong?", "Retrieval-practice-এর উত্তর ভুল হলে কী করা উচিত?"), options: [t("Ignore it and move on", "উপেক্ষা করে এগিয়ে যাওয়া"), t("Correct the misconception with feedback", "Feedback দিয়ে ভুল ধারণা সংশোধন"), t("Memorise the option letter only", "শুধু option letter মুখস্থ করা"), t("Repeat without checking", "না দেখে একই কাজ করা")], answerIndex: 1, explanation: t("Timely corrective feedback prevents a misconception from being reinforced.", "সময়মতো corrective feedback ভুল ধারণাকে আরও শক্তিশালী হতে দেয় না।") },
  },
  {
    day: 8, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("Exposure: frame rate & shutter", "Exposure: frame rate ও shutter"),
    objective: t("Understand the relationship between motion rendering and exposure.", "Motion rendering ও exposure-এর সম্পর্ক বোঝা।"),
    lesson: t("Frame rate controls how many frames are captured each second. Shutter time influences motion blur and exposure. A common starting point for natural-looking motion is a shutter speed near double the frame rate (the 180-degree-shutter convention), but available light and creative intent may require a different choice. Lock exposure when you need consistency across a take.", "Frame rate প্রতি সেকেন্ডে কতটি frame capture হবে তা নির্ধারণ করে। Shutter time motion blur ও exposure-কে প্রভাবিত করে। Natural motion-এর একটি প্রচলিত starting point হলো frame rate-এর প্রায় দ্বিগুণ shutter speed (180-degree-shutter convention); তবে available light ও creative intent অনুযায়ী বদলাতে পারে। একই take-এ consistency দরকার হলে exposure lock করো।"),
    exercise: t("Record the same walking action at your normal frame rate with a natural shutter setting, then with a much faster shutter. Compare motion texture, not just brightness.", "একই হাঁটার action normal frame rate ও natural shutter setting-এ রেকর্ড করো, এরপর অনেক fast shutter-এ করো। শুধু brightness নয়, motion texture তুলনা করো।"),
    reflection: t("When would you intentionally choose sharper, staccato motion?", "কখন তুমি ইচ্ছা করে sharper, staccato motion বেছে নেবে?"),
    question: { prompt: t("A shutter near double the frame rate is commonly used to…", "Frame rate-এর প্রায় দ্বিগুণ shutter সাধারণত কেন ব্যবহার করা হয়?"), options: [t("Create a familiar amount of motion blur", "পরিচিত মাত্রার motion blur তৈরি"), t("Increase resolution", "Resolution বাড়ানো"), t("Change focal length", "Focal length বদলানো"), t("Record spatial audio", "Spatial audio রেকর্ড")], answerIndex: 0, explanation: t("The 180-degree-shutter convention is a starting point for natural-looking motion blur, not an unbreakable rule.", "180-degree convention natural motion blur-এর starting point, অপরিবর্তনীয় নিয়ম নয়।") },
  },
  {
    day: 9, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("Focal length & perspective", "Focal length ও perspective"),
    objective: t("Separate lens field of view from perspective created by camera position.", "Lens field of view ও camera position-এর perspective আলাদা করে বোঝা।"),
    lesson: t("Focal length changes field of view and the amount of a scene included from a fixed camera position. Perspective relationships are primarily determined by camera-to-subject distance. Moving closer exaggerates near-far size differences; moving back reduces them. Do not blame every perspective change on the lens alone.", "একই camera position থেকে focal length field of view এবং frame-এ কতটা scene থাকবে তা বদলায়। Perspective relationship মূলত camera থেকে subject-এর দূরত্ব দ্বারা নির্ধারিত হয়। কাছে গেলে near-far size difference বেশি চোখে পড়ে; দূরে গেলে কমে। Perspective change-এর সব দায় lens-এর নয়।"),
    exercise: t("Frame a person with a wide and a tighter lens/view. First keep camera position fixed; then move back and reframe. Notice which change alters perspective.", "Wide ও tighter lens/view দিয়ে একজনকে frame করো। প্রথমে camera position স্থির রাখো; এরপর পেছনে গিয়ে reframe করো। কোন পরিবর্তনে perspective বদলায় লক্ষ্য করো।"),
    reflection: t("How did camera distance change the relationship between the face and the background?", "Camera distance মুখ ও background-এর সম্পর্ক কীভাবে বদলেছে?"),
    question: { prompt: t("What primarily determines perspective relationships?", "Perspective relationship মূলত কী নির্ধারণ করে?"), options: [t("Camera-to-subject distance", "Camera থেকে subject-এর দূরত্ব"), t("File extension", "File extension"), t("White balance preset", "White balance preset"), t("Audio sample rate", "Audio sample rate")], answerIndex: 0, explanation: t("The camera position and distance determine relative size and perspective; focal length controls framing from that position.", "Camera position ও distance relative size/perspective নির্ধারণ করে; focal length সেই position থেকে framing নিয়ন্ত্রণ করে।") },
  },
  {
    day: 10, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("Motivated camera movement", "Motivated camera movement"),
    objective: t("Make every camera move answer a story question.", "প্রতিটি camera move-কে গল্পের একটি প্রশ্নের উত্তর বানানো।"),
    lesson: t("A move can reveal information, follow an action, change power, create intimacy or withhold a detail. If a move does none of these, a locked frame may be stronger. Plan the start, destination, speed and stopping point. Smooth movement is useful only when the movement itself has a reason.", "একটি move নতুন তথ্য প্রকাশ, action follow, power বদল, intimacy তৈরি অথবা detail আড়াল করতে পারে। এগুলোর কিছুই না হলে locked frame আরও শক্তিশালী হতে পারে। Start, destination, speed ও stopping point পরিকল্পনা করো। Move-এর কারণ থাকলেই smooth movement অর্থবহ।"),
    exercise: t("Shoot one locked frame and one slow push-in of the same moment. Write the new information or emotion the move creates. If there is none, remove the move.", "একই মুহূর্তে একটি locked frame ও একটি slow push-in শুট করো। Moveটি কী নতুন তথ্য বা আবেগ তৈরি করেছে লেখো। কিছু না হলে move বাদ দাও।"),
    reflection: t("What is the audience learning because the camera moves?", "Camera move করার কারণে দর্শক কী নতুন বিষয় জানতে পারছে?"),
    question: { prompt: t("A motivated camera move should…", "Motivated camera move-এর কাজ কী হওয়া উচিত?"), options: [t("Show off stabilisation", "Stabilisation দেখানো"), t("Reveal, follow or change story emphasis", "Reveal, follow বা story emphasis বদলানো"), t("Replace blocking", "Blocking-এর জায়গা নেওয়া"), t("Happen in every shot", "প্রতিটি shot-এ হওয়া")], answerIndex: 1, explanation: t("The move must serve information, emotion or spatial understanding.", "Move-কে তথ্য, আবেগ অথবা spatial understanding-কে serve করতে হবে।") },
  },
  {
    day: 11, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("Available light & direction", "Available light ও direction"),
    objective: t("Read the direction, quality and motivation of existing light.", "বিদ্যমান আলোর direction, quality ও motivation বুঝতে শেখা।"),
    lesson: t("Start by observing the light source: where it comes from, how large it appears, how hard its shadows are and what surface it bounces from. A window can be a key source; a white wall can act as fill; a dark surface can absorb light. Before adding equipment, move the subject and camera to shape the available light.", "প্রথমে light source দেখো: কোথা থেকে আসছে, কত বড় মনে হচ্ছে, shadow কত hard এবং কোন surface থেকে bounce করছে। Window key source হতে পারে; সাদা দেয়াল fill হিসেবে কাজ করতে পারে; dark surface আলো শোষণ করতে পারে। Equipment যোগ করার আগে subject ও camera সরিয়ে available light shape করো।"),
    exercise: t("Photograph the same subject facing a window, side-on to the window and with the window behind. Keep exposure controlled and compare shadow shape.", "একই subject-কে window-এর দিকে, পাশ ফিরে এবং window পেছনে রেখে ছবি/ভিডিও করো। Exposure নিয়ন্ত্রণে রেখে shadow shape তুলনা করো।"),
    reflection: t("Which light direction best supports the emotion you want?", "তোমার চাওয়া আবেগকে কোন light direction সবচেয়ে ভালো support করেছে?"),
    question: { prompt: t("Before adding a light, what is a useful first step?", "নতুন light যোগ করার আগে কোন কাজটি উপকারী?"), options: [t("Observe the existing source and move the subject", "বিদ্যমান source দেখে subject সরানো"), t("Raise saturation", "Saturation বাড়ানো"), t("Add every available lamp", "সব lamp জ্বালানো"), t("Increase sharpening", "Sharpening বাড়ানো")], answerIndex: 0, explanation: t("Light can often be shaped through blocking, camera position, distance and bounce before adding equipment.", "Equipment ছাড়াও blocking, camera position, distance ও bounce দিয়ে আলো shape করা যায়।") },
  },
  {
    day: 12, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("Contrast, fill & negative fill", "Contrast, fill ও negative fill"),
    objective: t("Control the shadow side instead of only brightening the subject.", "শুধু subject উজ্জ্বল না করে shadow side নিয়ন্ত্রণ করা।"),
    lesson: t("Fill light reduces contrast by lifting shadows. Negative fill does the opposite: a dark flag, cloth or unlit surface removes bounce and deepens the shadow side. Contrast ratio changes mood and separation. Watch skin detail and avoid clipping highlights; the goal is controlled information, not maximum brightness.", "Fill light shadow তুলে contrast কমায়। Negative fill উল্টো কাজ করে: dark flag, কাপড় বা unlit surface bounce light সরিয়ে shadow side গভীর করে। Contrast ratio mood ও separation বদলায়। Skin detail দেখো এবং highlight clipping এড়াও; লক্ষ্য maximum brightness নয়, controlled information।"),
    exercise: t("Place a subject near a window. Compare a white reflector on the shadow side with a dark cloth. Record both setups without changing camera exposure.", "Window-এর পাশে subject রাখো। Shadow side-এ white reflector এবং dark cloth ব্যবহার করে দুটি setup তুলনা করো। Camera exposure না বদলে দুটো রেকর্ড করো।"),
    reflection: t("Which version reveals more psychological tension, and why?", "কোন version বেশি psychological tension তৈরি করেছে, এবং কেন?"),
    question: { prompt: t("Negative fill is used to…", "Negative fill ব্যবহার করা হয়…"), options: [t("Remove bounce and deepen shadows", "Bounce সরিয়ে shadow গভীর করতে"), t("Increase frame rate", "Frame rate বাড়াতে"), t("Add digital grain", "Digital grain যোগ করতে"), t("Change the lens mount", "Lens mount বদলাতে")], answerIndex: 0, explanation: t("A dark surface absorbs or blocks reflected light, increasing contrast on the shadow side.", "Dark surface reflected light শোষণ বা block করে, ফলে shadow side-এ contrast বাড়ে।") },
  },
  {
    day: 13, week: 2, module: "camera", xp: 25, requiredEntitlement: "program.30day",
    title: t("White balance & colour temperature", "White balance ও colour temperature"),
    objective: t("Keep colour neutral when needed and motivated when stylised.", "প্রয়োজনে neutral এবং stylised হলে motivated colour ধরে রাখা।"),
    lesson: t("White balance tells the camera what should appear neutral under the current light. Auto white balance can shift during a take. A locked setting gives continuity. Mixed light sources can create different colour casts across the frame; decide whether to correct them or use them deliberately as part of the visual design.", "বর্তমান আলোর মধ্যে কোন রং neutral হওয়া উচিত তা camera-কে white balance জানায়। Auto white balance take-এর মধ্যে বদলে যেতে পারে। Locked setting continuity দেয়। Mixed light frame-এর বিভিন্ন জায়গায় আলাদা colour cast তৈরি করতে পারে; সেগুলো correct করবে নাকি visual design হিসেবে রাখবে সিদ্ধান্ত নাও।"),
    exercise: t("Record a neutral object under daylight and warm indoor light with auto white balance, then with a locked setting. Compare consistency between cuts.", "Daylight ও warm indoor light-এ একটি neutral object auto white balance-এ রেকর্ড করো, পরে locked setting-এ করো। Cut-এর মধ্যে consistency তুলনা করো।"),
    reflection: t("When does a colour cast become a storytelling choice instead of a technical mistake?", "কখন colour cast technical mistake না থেকে storytelling choice হয়ে ওঠে?"),
    question: { prompt: t("Why lock white balance during a continuous scene?", "একটি continuous scene-এ white balance lock করার কারণ কী?"), options: [t("To prevent unwanted colour shifts", "অপ্রত্যাশিত colour shift ঠেকাতে"), t("To increase resolution", "Resolution বাড়াতে"), t("To make focus automatic", "Focus automatic করতে"), t("To compress the file", "File compress করতে")], answerIndex: 0, explanation: t("A fixed white balance improves colour continuity between shots.", "Fixed white balance shotগুলোর মধ্যে colour continuity উন্নত করে।") },
  },
  {
    day: 14, week: 2, module: "camera", xp: 35, requiredEntitlement: "program.30day",
    title: t("Memory lab 02 — camera & light", "মেমোরি ল্যাব ০২ — ক্যামেরা ও আলো"),
    objective: t("Retrieve camera and lighting principles through a mixed scenario.", "Mixed scenario দিয়ে camera ও lighting-এর ধারণা মনে করে প্রয়োগ করা।"),
    lesson: t("Without opening earlier lessons, plan a night interior near a window. Choose frame rate, shutter approach, exposure lock, camera distance, movement motivation, key direction and shadow control. Then check your plan against the lessons and revise it.", "আগের lesson না খুলে window-এর কাছে একটি night interior পরিকল্পনা করো। Frame rate, shutter approach, exposure lock, camera distance, movement motivation, key direction ও shadow control বেছে নাও। তারপর lesson-এর সঙ্গে মিলিয়ে পরিকল্পনা সংশোধন করো।"),
    exercise: t("Create two contrasting looks with the same location: one soft and open, one high-contrast and tense. Document your camera and light decisions.", "একই location-এ দুটি contrasting look তৈরি করো: একটি soft ও open, অন্যটি high-contrast ও tense। Camera ও light decision লিখে রাখো।"),
    reflection: t("Which technical choice had the biggest effect on the scene's meaning?", "কোন technical choice দৃশ্যের অর্থে সবচেয়ে বড় প্রভাব ফেলেছে?"),
    question: { prompt: t("A useful mixed-scenario review asks you to…", "একটি কার্যকর mixed-scenario review-তে কী করতে হয়?"), options: [t("Repeat definitions only", "শুধু definition পুনরাবৃত্তি"), t("Combine several decisions for one story goal", "একটি story goal-এর জন্য একাধিক সিদ্ধান্ত একত্র করা"), t("Ignore earlier feedback", "আগের feedback উপেক্ষা"), t("Choose settings randomly", "এলোমেলো setting বেছে নেওয়া")], answerIndex: 1, explanation: t("Transfer happens when you combine ideas to solve a new practical situation.", "নতুন practical situation সমাধানে ধারণাগুলো একত্র করলে transfer তৈরি হয়।") },
  },
  {
    day: 15, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Story intention & visual premise", "Story intention ও visual premise"),
    objective: t("Express what a scene is about through an observable visual idea.", "একটি scene-এর ভাবনা দৃশ্যমান visual idea দিয়ে প্রকাশ করা।"),
    lesson: t("A theme is broad; a visual premise makes it filmable. Instead of saying 'loneliness', define an image-system: a person framed at the edge of rooms, reflections that split the image, or repeated empty chairs. The motif should evolve with the character rather than appear as decoration.", "Theme বিস্তৃত; visual premise সেটিকে শুটযোগ্য করে। শুধু 'loneliness' না বলে একটি image-system নির্ধারণ করো: ঘরের কিনারায় থাকা মানুষ, image ভাগ করা reflection অথবা বারবার দেখা empty chair। Motif যেন character-এর সঙ্গে evolve করে, decoration হয়ে না থাকে।"),
    exercise: t("Choose one emotion and design three recurring images that can express it without dialogue. Give each image a different meaning as the scene develops.", "একটি emotion বেছে dialogue ছাড়া সেটি প্রকাশ করার তিনটি recurring image design করো। Scene এগোনোর সঙ্গে প্রতিটি image-এর অর্থ বদলাবে।"),
    reflection: t("How does the motif change between its first and final appearance?", "Motif-এর প্রথম ও শেষ উপস্থিতির মধ্যে অর্থ কীভাবে বদলায়?"),
    question: { prompt: t("A visual motif is strongest when it…", "Visual motif সবচেয়ে শক্তিশালী হয় যখন এটি…"), options: [t("Repeats without changing", "কোনো পরিবর্তন ছাড়াই বারবার আসে"), t("Evolves with the story or character", "গল্প বা character-এর সঙ্গে evolve করে"), t("Replaces every plot event", "সব plot event-এর জায়গা নেয়"), t("Exists only in the poster", "শুধু poster-এ থাকে")], answerIndex: 1, explanation: t("A recurring image gains meaning when context changes how we read it.", "Context বদলালে recurring image-এর অর্থও বদলায়—সেখানেই motif শক্তিশালী হয়।") },
  },
  {
    day: 16, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Beats, objective & conflict", "Beat, objective ও conflict"),
    objective: t("Break a scene into playable changes rather than vague emotion.", "অস্পষ্ট আবেগ নয়, অভিনয়যোগ্য পরিবর্তনে scene ভাগ করা।"),
    lesson: t("A beat is a shift in intention, information or tactic. A character objective is something they want in the scene; conflict is what resists it. Write actions that can be played: hide, persuade, delay, test, escape. This gives actors and camera a concrete event to build around.", "Beat হলো intention, information অথবা tactic-এর পরিবর্তন। Character objective হলো scene-এ সে যা চায়; conflict হলো যা বাধা দেয়। অভিনয়যোগ্য action লেখো: লুকানো, বোঝানো, দেরি করানো, পরীক্ষা করা, পালানো। এতে actor ও camera বাস্তব event পায়।"),
    exercise: t("Write a one-page silent scene with three beats: a clear objective, a complication and a changed tactic. Make every beat visible through action.", "তিনটি beat দিয়ে এক পৃষ্ঠার silent scene লেখো: clear objective, complication ও changed tactic। প্রতিটি beat যেন action-এ দৃশ্যমান হয়।"),
    reflection: t("What changes in the character's tactic after the complication?", "Complication-এর পরে character-এর tactic কীভাবে বদলায়?"),
    question: { prompt: t("A playable beat usually contains…", "একটি অভিনয়যোগ্য beat-এ সাধারণত কী থাকে?"), options: [t("A shift in intention, information or tactic", "Intention, information বা tactic-এর পরিবর্তন"), t("Only a camera specification", "শুধু camera specification"), t("A colour grade preset", "Colour grade preset"), t("A list of locations", "Location-এর তালিকা")], answerIndex: 0, explanation: t("Beats help the scene progress through observable changes.", "Beat দৃশ্যকে পর্যবেক্ষণযোগ্য পরিবর্তনের মাধ্যমে এগিয়ে নেয়।") },
  },
  {
    day: 17, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Blocking & actor movement", "Blocking ও actor movement"),
    objective: t("Use movement and distance to reveal relationships.", "Movement ও distance দিয়ে সম্পর্ক প্রকাশ করা।"),
    lesson: t("Blocking is the planned movement and positioning of performers in a scene. Distance, orientation, entrances, exits and pauses all carry meaning. Start with the dramatic change, then place the performers. Let the camera support the blocking instead of moving performers only to create a camera move.", "Blocking হলো scene-এ performer-দের অবস্থান ও movement পরিকল্পনা। Distance, orientation, entrance, exit ও pause—সবই অর্থ বহন করে। Dramatic change থেকে শুরু করে performer-দের position নির্ধারণ করো। শুধু camera move বানাতে actor সরাবে না; camera blocking-কে support করবে।"),
    exercise: t("Stage two people who want to speak but avoid each other. Create a version with distance and a version where one person crosses the space. Record from a fixed wide shot first.", "দুইজন মানুষ stage করো যারা কথা বলতে চায় কিন্তু একে অপরকে এড়িয়ে যায়। একটি version-এ দূরত্ব রাখো, আরেকটিতে একজন space cross করে। প্রথমে fixed wide shot-এ রেকর্ড করো।"),
    reflection: t("Which movement changed the power relationship?", "কোন movement power relationship বদলে দিয়েছে?"),
    question: { prompt: t("Blocking should primarily serve…", "Blocking-এর প্রধান কাজ কী হওয়া উচিত?"), options: [t("The dramatic relationship and action", "Dramatic relationship ও action"), t("The camera operator's exercise", "Camera operator-এর exercise"), t("A fixed number of cuts", "নির্দিষ্ট cut সংখ্যা"), t("The export frame size", "Export frame size")], answerIndex: 0, explanation: t("Performer placement should make the scene's intention and changing relationships legible.", "Performer-এর position scene-এর intention ও সম্পর্কের পরিবর্তন পরিষ্কার করবে।") },
  },
  {
    day: 18, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Depth & staging", "Depth ও staging"),
    objective: t("Use foreground, middle ground and background as story layers.", "Foreground, middle ground ও background-কে গল্পের layer হিসেবে ব্যবহার করা।"),
    lesson: t("Depth separates planes and can show who belongs together, who is isolated and what the character notices. A foreground obstruction can create surveillance or distance. Background action can reveal information before the subject notices it. Keep the viewer's attention intentional; depth is not clutter.", "Depth আলাদা plane তৈরি করে এবং কে কার সঙ্গে, কে বিচ্ছিন্ন, character কী দেখছে তা বোঝায়। Foreground obstruction surveillance বা দূরত্ব তৈরি করতে পারে। Background action character বোঝার আগেই দর্শককে তথ্য দিতে পারে। দর্শকের attention intentional রাখবে; depth মানেই clutter নয়।"),
    exercise: t("Stage a subject in the foreground, a second action in the background and one meaningful object between them. Make the audience discover the background event at a chosen moment.", "Foreground-এ subject, background-এ দ্বিতীয় action এবং মাঝখানে একটি গুরুত্বপূর্ণ object stage করো। নির্দিষ্ট মুহূর্তে দর্শক যেন background event আবিষ্কার করে।"),
    reflection: t("Which visual plane carries the most important information?", "কোন visual plane সবচেয়ে গুরুত্বপূর্ণ তথ্য বহন করছে?"),
    question: { prompt: t("A background action can be used to…", "Background action ব্যবহার করা যায়…"), options: [t("Reveal information before the main subject notices", "Main subject বোঝার আগে দর্শককে তথ্য দিতে"), t("Remove all depth", "সব depth সরাতে"), t("Guarantee perfect focus", "Perfect focus নিশ্চিত করতে"), t("Replace the story objective", "Story objective-এর বদলি হিসেবে")], answerIndex: 0, explanation: t("Layered staging lets the audience read more than one plane of action.", "Layered staging দর্শককে একাধিক plane-এর action পড়তে দেয়।") },
  },
  {
    day: 19, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Shot list & storyboard", "Shot list ও storyboard"),
    objective: t("Translate a scene into a realistic, purposeful shooting plan.", "Scene-কে বাস্তবসম্মত ও purposeful shooting plan-এ রূপান্তর করা।"),
    lesson: t("A shot list records what must be captured and why: scene/shot number, framing, movement, action, sound, props and continuity notes. A storyboard sketches screen direction and composition. Plan coverage around story information, not an arbitrary number of angles. A small crew benefits from clear priorities and a minimum viable shot plan.", "Shot list-এ কী capture করতে হবে এবং কেন—scene/shot number, framing, movement, action, sound, props ও continuity note লিখে রাখো। Storyboard screen direction ও composition sketch করে। এলোমেলো angle সংখ্যা নয়, story information অনুযায়ী coverage plan করো। ছোট crew-এর জন্য পরিষ্কার priority ও minimum viable shot plan জরুরি।"),
    exercise: t("Create a six-shot list for a person entering a room and discovering something missing. Mark the must-have shots and one optional insert.", "একজন মানুষ ঘরে ঢুকে কিছু হারানো আবিষ্কার করছে—এমন দৃশ্যের ছয়-shot list বানাও। Must-have shot এবং একটি optional insert চিহ্নিত করো।"),
    reflection: t("If time is cut in half, which shots are essential to preserve the story?", "সময় অর্ধেক হলে গল্প বাঁচাতে কোন shotগুলো অপরিহার্য?"),
    question: { prompt: t("A useful shot list prioritises…", "একটি কার্যকর shot list কোন বিষয়কে priority দেয়?"), options: [t("As many angles as possible", "যত বেশি angle সম্ভব"), t("Essential story information and continuity", "অপরিহার্য story information ও continuity"), t("Only expensive equipment", "শুধু দামী equipment"), t("A random shooting order", "এলোমেলো shooting order")], answerIndex: 1, explanation: t("A shot list is a practical coverage plan built around what the scene must communicate.", "Shot list হলো scene কী communicate করবে তার ওপর নির্মিত practical coverage plan।") },
  },
  {
    day: 20, week: 3, module: "story", xp: 25, requiredEntitlement: "program.30day",
    title: t("Suspense, reveal & reaction", "Suspense, reveal ও reaction"),
    objective: t("Control what the audience knows and when they know it.", "দর্শক কী জানবে এবং কখন জানবে তা নিয়ন্ত্রণ করা।"),
    lesson: t("Suspense often grows from a gap between what the audience suspects and what the character knows. A reveal changes the information state; a reaction lets the audience register its consequence. Delay can create tension, but delay without a changing question becomes empty waiting. Give each beat a new piece of evidence or a new expectation.", "Suspense অনেক সময় দর্শকের সন্দেহ ও character-এর জানা তথ্যের ব্যবধান থেকে জন্ম নেয়। Reveal তথ্যের অবস্থা বদলায়; reaction দর্শককে তার consequence অনুভব করতে দেয়। Delay tension তৈরি করতে পারে, কিন্তু প্রশ্ন না বদলে শুধু অপেক্ষা করানো ফাঁপা। প্রতিটি beat-এ নতুন evidence বা expectation দাও।"),
    exercise: t("Create a silent reveal using three shots: clue, character reaction and confirmation. Then make a second edit that withholds confirmation. Compare tension.", "তিনটি shot দিয়ে silent reveal বানাও: clue, character reaction ও confirmation। এরপর confirmation আড়াল করে দ্বিতীয় edit বানাও। Tension তুলনা করো।"),
    reflection: t("What did the audience know one shot before the character knew it?", "Character জানার এক shot আগে দর্শক কী জানত?"),
    question: { prompt: t("A reveal is effective when it…", "একটি কার্যকর reveal তখনই হয় যখন এটি…"), options: [t("Changes what the audience understands", "দর্শকের বোঝাপড়া বদলে দেয়"), t("Adds random information", "এলোমেলো তথ্য যোগ করে"), t("Removes every consequence", "সব consequence সরিয়ে দেয়"), t("Always happens in the first shot", "সবসময় প্রথম shot-এ হয়")], answerIndex: 0, explanation: t("A reveal reframes earlier information or creates a new question for the audience.", "Reveal আগের তথ্যের অর্থ নতুন করে সাজায় বা দর্শকের সামনে নতুন প্রশ্ন তোলে।") },
  },
  {
    day: 21, week: 3, module: "story", xp: 35, requiredEntitlement: "program.30day",
    title: t("Memory lab 03 — story & direction", "মেমোরি ল্যাব ০৩ — গল্প ও পরিচালনা"),
    objective: t("Plan a scene by combining objective, blocking and visual motif.", "Objective, blocking ও visual motif মিলিয়ে scene পরিকল্পনা করা।"),
    lesson: t("Close your notes. Write a one-sentence premise, the character's objective, the resistance, three visual beats and a six-shot coverage plan. Then explain where the reveal occurs and what the audience should understand at that moment. Review your answers and revise one weak link.", "নোট বন্ধ করে এক বাক্যের premise, character-এর objective, resistance, তিনটি visual beat ও ছয়-shot coverage plan লেখো। Reveal কোথায় হবে এবং তখন দর্শক কী বুঝবে ব্যাখ্যা করো। এরপর উত্তর যাচাই করে একটি দুর্বল link সংশোধন করো।"),
    exercise: t("Direct a 20–30 second silent scene with one character, one prop and one change in intention. Create a shot list before recording.", "একজন character, একটি prop ও intention-এর একটি পরিবর্তন দিয়ে ২০–৩০ সেকেন্ডের silent scene direct করো। Record করার আগে shot list তৈরি করো।"),
    reflection: t("Which directing decision changed the audience's interpretation most?", "কোন directing decision দর্শকের interpretation সবচেয়ে বেশি বদলেছে?"),
    question: { prompt: t("What makes a scene plan coherent?", "কোন বিষয় scene plan-কে coherent করে?"), options: [t("Objective, resistance, beats and coverage support one another", "Objective, resistance, beat ও coverage একে অপরকে support করে"), t("More props than necessary", "প্রয়োজনের চেয়ে বেশি prop"), t("Every shot uses a different angle", "প্রতিটি shot-এ আলাদা angle"), t("A long equipment list", "দীর্ঘ equipment list")], answerIndex: 0, explanation: t("A coherent plan aligns dramatic intention with what the camera needs to capture.", "Coherent plan dramatic intention ও camera-র capture প্রয়োজনকে একসঙ্গে আনে।") },
  },
  {
    day: 22, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Continuity editing", "Continuity editing"),
    objective: t("Make cuts feel connected in space, time and action.", "Space, time ও action-এর মধ্যে cut-কে connected করা।"),
    lesson: t("Continuity editing helps the viewer follow action without noticing unnecessary confusion. Match screen direction, eyelines, props, body positions and action phases. A continuity error can be intentional, but accidental mismatches pull attention away from the story. Watch the cut at normal speed and frame-by-frame when diagnosing it.", "Continuity editing দর্শককে অপ্রয়োজনীয় বিভ্রান্তি ছাড়াই action follow করতে সাহায্য করে। Screen direction, eyeline, prop, body position ও action phase match করো। Continuity error ইচ্ছাকৃত হতে পারে, কিন্তু accidental mismatch গল্প থেকে মন সরিয়ে দেয়। Cut normal speed-এ এবং সমস্যা ধরতে frame-by-frame দেখো।"),
    exercise: t("Edit a simple action across three shots. Check hand position, prop state, movement direction and eyeline at every cut.", "তিনটি shot দিয়ে একটি simple action edit করো। প্রতিটি cut-এ হাতের অবস্থান, prop-এর অবস্থা, movement direction ও eyeline মিলিয়ে দেখো।"),
    reflection: t("Which continuity detail was easiest to miss during editing?", "Editing-এর সময় কোন continuity detail সবচেয়ে সহজে চোখ এড়িয়ে যায়?"),
    question: { prompt: t("Continuity editing primarily protects…", "Continuity editing প্রধানত কী রক্ষা করে?"), options: [t("The viewer's understanding of action and space", "Action ও space সম্পর্কে দর্শকের বোঝাপড়া"), t("The camera battery", "Camera battery"), t("The colour of the editing interface", "Editing interface-এর রং"), t("The number of transitions", "Transition-এর সংখ্যা")], answerIndex: 0, explanation: t("Continuity gives viewers a stable mental model of the scene.", "Continuity দর্শকের কাছে scene-এর স্থিতিশীল mental model তৈরি করে।") },
  },
  {
    day: 23, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Match on action & motivated cuts", "Match on action ও motivated cut"),
    objective: t("Hide a cut inside a continuous movement or meaningful change.", "Continuous movement বা meaningful change-এর ভেতরে cut লুকানো।"),
    lesson: t("Cutting on action joins two views of the same movement at a compatible moment. The viewer follows the action rather than the edit. A motivated cut can also respond to a look, sound, prop or change in attention. Match movement direction, timing and screen position; a cut is not motivated merely because it is fast.", "Cutting on action একই movement-এর দুটি view-কে compatible মুহূর্তে যুক্ত করে। দর্শক edit নয়, action follow করে। Motivated cut কোনো look, sound, prop বা attention change-এর প্রতিও সাড়া দিতে পারে। Movement direction, timing ও screen position match করো; শুধু fast হলেই cut motivated হয় না।"),
    exercise: t("Film a hand opening a door from two angles. Cut during the movement and adjust the edit point until the action feels continuous.", "দুটি angle থেকে হাত দিয়ে দরজা খোলার shot নাও। Movement চলার সময় cut করো এবং edit point adjust করো যতক্ষণ action continuous লাগে।"),
    reflection: t("Where did the cut become invisible, and what made it work?", "কোথায় cut অদৃশ্য মনে হয়েছে, এবং কী কারণে কাজ করেছে?"),
    question: { prompt: t("A match-on-action cut works best when…", "Match-on-action cut সবচেয়ে ভালো কাজ করে যখন…"), options: [t("The action phase and direction are compatible", "Action phase ও direction compatible"), t("The shots have unrelated movement", "Shotগুলোর movement সম্পর্কহীন"), t("The audio is muted", "Audio mute"), t("The cut is always on a flash", "Cut সবসময় flash-এর ওপর")], answerIndex: 0, explanation: t("The audience tracks the continuous action across the edit point.", "Edit point-এর দুই পাশে continuous action থাকায় দর্শক movement follow করে।") },
  },
  {
    day: 24, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Rhythm, duration & silence", "Rhythm, duration ও silence"),
    objective: t("Shape pacing through shot length and meaningful pauses.", "Shot length ও অর্থবহ pause দিয়ে pacing তৈরি করা।"),
    lesson: t("Editing rhythm is the relationship between shot duration, action, sound and audience expectation. Fast cutting is not automatically energetic; long takes are not automatically thoughtful. A pause works when the audience has something to observe, anticipate or feel. Let the scene's emotional pressure determine duration.", "Editing rhythm হলো shot duration, action, sound ও দর্শকের expectation-এর সম্পর্ক। Fast cut মানেই energetic নয়; long take মানেই thoughtful নয়। Pause তখনই কাজ করে যখন দর্শকের পর্যবেক্ষণ, anticipation বা অনুভব করার কিছু থাকে। Scene-এর emotional pressure shot duration নির্ধারণ করুক।"),
    exercise: t("Cut the same 15-second footage into two versions: one urgent, one contemplative. Use duration and sound timing rather than extra effects.", "একই ১৫ সেকেন্ডের footage দুটি version-এ cut করো: একটি urgent, অন্যটি contemplative। Extra effect নয়, duration ও sound timing ব্যবহার করো।"),
    reflection: t("Which pause gave the audience time to understand something?", "কোন pause দর্শককে কিছু বোঝার সময় দিয়েছে?"),
    question: { prompt: t("What should primarily determine a shot's duration?", "একটি shot-এর duration প্রধানত কী নির্ধারণ করবে?"), options: [t("A fixed number of seconds", "নির্দিষ্ট কয়েক সেকেন্ড"), t("Emotional pressure, action and information", "Emotional pressure, action ও information"), t("The editor's favourite transition", "Editor-এর প্রিয় transition"), t("The file size alone", "শুধু file size")], answerIndex: 1, explanation: t("Duration should give the audience the time needed for the intended experience.", "কাঙ্ক্ষিত অভিজ্ঞতার জন্য দর্শকের যতটা সময় প্রয়োজন, duration ততটাই হওয়া উচিত।") },
  },
  {
    day: 25, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Sound perspective & layers", "Sound perspective ও layers"),
    objective: t("Build space and emotion with layered sound.", "Layered sound দিয়ে space ও emotion তৈরি করা।"),
    lesson: t("Think in layers: dialogue or foreground action, environment, specific effects and music when it serves the scene. Distance changes level, high-frequency detail and reverberation. A sound bridge can connect two images, while silence can focus attention. Avoid filling every gap; sound should clarify or deepen the scene.", "Sound layer হিসেবে ভাবো: dialogue বা foreground action, environment, specific effect এবং প্রয়োজন হলে music। Distance অনুযায়ী level, high-frequency detail ও reverberation বদলায়। Sound bridge দুটি image যুক্ত করতে পারে; silence attention কেন্দ্রীভূত করতে পারে। প্রতিটি gap ভরাট কোরো না; sound scene পরিষ্কার বা গভীর করবে।"),
    exercise: t("Build a 20-second soundscape using room tone, one close sound, one distant sound and a deliberate moment of silence. Test it under a static image.", "Room tone, একটি close sound, একটি distant sound এবং ইচ্ছাকৃত silence দিয়ে ২০ সেকেন্ডের soundscape বানাও। Static image-এর নিচে পরীক্ষা করো।"),
    reflection: t("Which sound made the location feel larger or closer?", "কোন sound location-কে বড় বা কাছের মনে করিয়েছে?"),
    question: { prompt: t("A sound bridge is useful because it can…", "Sound bridge উপকারী কারণ এটি…"), options: [t("Connect scenes across an image cut", "Image cut-এর দুই পাশে scene যুক্ত করতে পারে"), t("Increase camera resolution", "Camera resolution বাড়াতে পারে"), t("Fix a blurred frame", "Blurred frame ঠিক করতে পারে"), t("Replace all ambience", "সব ambience-এর বদলি হতে পারে")], answerIndex: 0, explanation: t("Sound can begin before or continue after a cut, creating continuity or contrast.", "Sound cut-এর আগে শুরু বা পরে চলতে পারে, continuity অথবা contrast তৈরি করে।") },
  },
  {
    day: 26, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Colour correction before grading", "Grading-এর আগে colour correction"),
    objective: t("Separate technical consistency from creative colour styling.", "Technical consistency ও creative colour styling আলাদা করা।"),
    lesson: t("Correction aims to make shots technically consistent: exposure, white balance, contrast and skin tone. Grading shapes the look and emotional palette. Work in a sensible order: balance exposure and white balance, match shots, protect highlights and skin, then create the look. A LUT is a starting transform, not a substitute for judgement.", "Correction-এর লক্ষ্য shotগুলো technicalভাবে consistent করা: exposure, white balance, contrast ও skin tone। Grading look ও emotional palette তৈরি করে। যুক্তিসংগত order-এ কাজ করো: exposure ও white balance balance, shot match, highlight ও skin protect, তারপর look তৈরি। LUT starting transform, judgement-এর বিকল্প নয়।"),
    exercise: t("Match two shots from the same scene before adding any creative look. Compare waveform or scopes if available, then inspect skin and neutral objects by eye.", "Creative look দেওয়ার আগে একই scene-এর দুটি shot match করো। Scopes থাকলে waveform দেখো, এরপর চোখে skin ও neutral object যাচাই করো।"),
    reflection: t("Which mismatch was technical, and which difference did you choose to keep creatively?", "কোন mismatch technical ছিল, আর কোন পার্থক্য creativeভাবে রাখতে চেয়েছ?"),
    question: { prompt: t("What is the primary goal of colour correction?", "Colour correction-এর প্রধান লক্ষ্য কী?"), options: [t("Create an extreme stylised look first", "প্রথমেই extreme stylised look তৈরি"), t("Balance and match shots consistently", "Shot balance ও consistent match করা"), t("Replace sound design", "Sound design বদলে দেওয়া"), t("Increase frame rate", "Frame rate বাড়ানো")], answerIndex: 1, explanation: t("Correction establishes a controlled, consistent base before creative grading.", "Creative grading-এর আগে correction একটি controlled ও consistent base তৈরি করে।") },
  },
  {
    day: 27, week: 4, module: "post", xp: 25, requiredEntitlement: "program.30day",
    title: t("Export, codecs & quality control", "Export, codec ও quality control"),
    objective: t("Deliver a file that preserves the intended image and sound.", "উদ্দেশ্য অনুযায়ী image ও sound ধরে রেখে file deliver করা।"),
    lesson: t("A delivery check includes resolution, frame rate, aspect ratio, codec, bitrate or quality setting, audio sample rate, channel layout and playback. Inspect the exported file, not only the timeline. Watch the opening, transitions, dark scenes, highlights and final seconds. Keep a high-quality master and make platform-specific copies when needed.", "Delivery check-এ resolution, frame rate, aspect ratio, codec, bitrate বা quality setting, audio sample rate, channel layout ও playback যাচাই করো। শুধু timeline নয়, export file দেখো। Opening, transition, dark scene, highlight ও শেষ কয়েক সেকেন্ড পরীক্ষা করো। High-quality master রাখো এবং প্রয়োজন হলে platform-specific copy বানাও।"),
    exercise: t("Export a short sequence, re-import it into the editor and watch it from start to finish. Note any colour shift, audio peak, missing frame or aspect-ratio issue.", "একটি ছোট sequence export করে editor-এ আবার import করো এবং শুরু থেকে শেষ পর্যন্ত দেখো। Colour shift, audio peak, missing frame বা aspect-ratio issue নোট করো।"),
    reflection: t("What did you discover only after checking the exported file?", "Export file যাচাই করার পরই কী সমস্যা আবিষ্কার করেছ?"),
    question: { prompt: t("Why should you inspect the exported file?", "Export file কেন আলাদাভাবে inspect করা দরকার?"), options: [t("The export may differ from the timeline or reveal delivery issues", "Export timeline থেকে আলাদা হতে পারে বা delivery issue দেখাতে পারে"), t("The editor automatically proves quality", "Editor নিজেই quality প্রমাণ করে"), t("It changes the story idea", "এটি story idea বদলায়"), t("It removes the need for backups", "Backup-এর প্রয়োজন দূর করে")], answerIndex: 0, explanation: t("Only the final encoded file reveals the actual delivery result.", "Final encoded file-ই প্রকৃত delivery result দেখায়।") },
  },
  {
    day: 28, week: 4, module: "post", xp: 35, requiredEntitlement: "program.30day",
    title: t("Memory lab 04 — post-production", "মেমোরি ল্যাব ০৪ — post-production"),
    objective: t("Retrieve editing, sound and finishing decisions without notes.", "নোট ছাড়া editing, sound ও finishing decision মনে করে প্রয়োগ করা।"),
    lesson: t("Rebuild a post-production checklist from memory: continuity, motivated cuts, rhythm, sound layers, correction, grade, export settings and quality control. Explain why each step exists. Then review your previous work and identify the first problem you would fix.", "স্মৃতি থেকে post-production checklist তৈরি করো: continuity, motivated cut, rhythm, sound layer, correction, grade, export setting ও quality control। প্রতিটি ধাপ কেন দরকার ব্যাখ্যা করো। এরপর আগের কাজ দেখে প্রথম কোন সমস্যা ঠিক করবে নির্ধারণ করো।"),
    exercise: t("Take a previous short edit and make a finishing pass focused only on continuity and sound. Export a review copy and write three observations.", "আগের একটি short edit নিয়ে শুধু continuity ও sound-এর finishing pass দাও। Review copy export করে তিনটি observation লেখো।"),
    reflection: t("Which step do you tend to skip when time is short?", "সময় কম থাকলে কোন ধাপটি সাধারণত বাদ পড়ে?"),
    question: { prompt: t("Which is the best finishing order?", "কোন finishing order সবচেয়ে যুক্তিসংগত?"), options: [t("Grade, export, then check continuity", "Grade, export, তারপর continuity check"), t("Edit/continuity, sound, correction, grade, export QC", "Edit/continuity, sound, correction, grade, export QC"), t("Export before editing", "Editing-এর আগে export"), t("Add LUTs and stop", "LUT যোগ করে থেমে যাওয়া")], answerIndex: 1, explanation: t("A reliable finishing pass moves from editorial integrity to sound and image consistency, then checks the encoded delivery.", "নির্ভরযোগ্য finishing pass editorial integrity থেকে sound ও image consistency-তে যায়, এরপর encoded delivery যাচাই করে।") },
  },
  {
    day: 29, week: 4, module: "post", xp: 30, requiredEntitlement: "program.30day",
    title: t("Capstone 01 — plan a silent scene", "Capstone ০১ — silent scene পরিকল্পনা"),
    objective: t("Combine visual language, camera, direction and sound in a shootable plan.", "Visual language, camera, direction ও sound একত্র করে শুটযোগ্য পরিকল্পনা করা।"),
    lesson: t("Design a 45–90 second silent scene with one character, one location and one prop. Define the objective, obstacle, visual motif and final change. Build a shot list of 6–10 shots, identify available light, map screen direction and list the sound layers. Keep the scope achievable with the equipment and time you have.", "একজন character, একটি location ও একটি prop দিয়ে ৪৫–৯০ সেকেন্ডের silent scene design করো। Objective, obstacle, visual motif ও final change ঠিক করো। ৬–১০ shot-এর list বানাও, available light চিহ্নিত করো, screen direction map করো এবং sound layer লেখো। নিজের equipment ও সময় অনুযায়ী scope বাস্তবসম্মত রাখো।"),
    exercise: t("Write a one-page treatment, shot list and sound plan. If possible, shoot a rough version. Do not spend time on decorative transitions before the scene works.", "এক পৃষ্ঠার treatment, shot list ও sound plan লেখো। সম্ভব হলে rough version শুট করো। Scene কাজ করার আগে decorative transition-এ সময় নষ্ট কোরো না।"),
    reflection: t("What is the single visual decision that makes the scene yours?", "কোন একটি visual decision scene-টিকে তোমার নিজস্ব করে তুলেছে?"),
    question: { prompt: t("A strong capstone plan should first protect…", "একটি শক্তিশালী capstone plan প্রথমে কী রক্ষা করবে?"), options: [t("A clear objective and achievable scope", "Clear objective ও achievable scope"), t("The most expensive gear list", "সবচেয়ে দামী gear list"), t("A large number of locations", "অনেক location"), t("A complicated title animation", "জটিল title animation")], answerIndex: 0, explanation: t("A clear, achievable scene lets craft decisions serve the story rather than overwhelm production.", "পরিষ্কার ও achievable scene craft decision-কে production জটিলতার বদলে গল্পের সেবায় রাখে।") },
  },
  {
    day: 30, week: 4, module: "post", xp: 60, requiredEntitlement: "program.30day",
    title: t("Capstone 02 — finish, review & reflect", "Capstone ০২ — finish, review ও reflection"),
    objective: t("Complete a short scene and evaluate the choices behind it.", "একটি short scene সম্পূর্ণ করে সিদ্ধান্তগুলো মূল্যায়ন করা।"),
    lesson: t("Finish the scene, then review it in three passes: story clarity, visual continuity and sound/image finish. Ask a viewer what they understood before explaining your intention. Compare that response with your goal. Write down one strength, one mismatch and one next experiment. Completion means a deliberate learning loop, not a perfect film.", "Scene finish করে তিন ধাপে review করো: story clarity, visual continuity এবং sound/image finish। নিজের intention ব্যাখ্যা করার আগে দর্শককে জিজ্ঞেস করো সে কী বুঝেছে। উত্তরকে তোমার goal-এর সঙ্গে তুলনা করো। একটি strength, একটি mismatch এবং পরের experiment লেখো। Completion মানে deliberate learning loop, perfect film নয়।"),
    exercise: t("Export the finished scene, show it to one viewer and record their interpretation. Submit a short reflection: intention, what worked, what did not, and the next test.", "Finished scene export করে একজন দর্শককে দেখাও এবং তার interpretation লিখে রাখো। ছোট reflection জমা দাও: intention, কী কাজ করেছে, কী করেনি এবং পরের test কী।"),
    reflection: t("What will you do differently on your next film, based on evidence from this one?", "এই কাজের প্রমাণ থেকে পরের film-এ কী ভিন্নভাবে করবে?"),
    question: { prompt: t("A useful final review compares…", "একটি কার্যকর final review কী তুলনা করে?"), options: [t("Your intention with what viewers actually understood", "তোমার intention-এর সঙ্গে দর্শক বাস্তবে কী বুঝেছে"), t("Only the number of effects used", "শুধু ব্যবহৃত effect-এর সংখ্যা"), t("The camera brand with another brand", "Camera brand-এর সঙ্গে অন্য brand"), t("The runtime with a feature film", "Runtime-এর সঙ্গে feature film")], answerIndex: 0, explanation: t("Comparing intention with audience interpretation reveals whether the film communicates as intended.", "Intention ও দর্শকের interpretation তুলনা করলে film কাঙ্ক্ষিতভাবে communicate করছে কি না বোঝা যায়।") },
  },
];

export const academyFinalExam: readonly AcademyQuestion[] = [
  academyDays[3].question,
  academyDays[4].question,
  academyDays[8].question,
  academyDays[10].question,
  academyDays[11].question,
  academyDays[15].question,
  academyDays[18].question,
  academyDays[22].question,
  academyDays[25].question,
  academyDays[29].question,
];

export const academyEntitlements = [
  { key: "program.30day", title: t("30-day complete programme", "সম্পূর্ণ ৩০ দিনের প্রোগ্রাম"), description: t("Unlock days 8–30 and the final capstone.", "৮–৩০ দিন এবং final capstone আনলক করে।") },
  { key: "track.advanced", title: t("Advanced cinematography lab", "Advanced cinematography lab"), description: t("Unlock advanced practice notes and technique drills.", "Advanced practice note ও technique drill আনলক করে।") },
  { key: "arcade.pro", title: t("Cine-Arcade challenge pack", "Cine-Arcade challenge pack"), description: t("Unlock the advanced arcade challenge.", "Advanced arcade challenge আনলক করে।") },
  { key: "certificate.issue", title: t("Certificate issue permission", "Certificate issue permission"), description: t("Allows an eligible learner to create a completion certificate.", "যোগ্য শিক্ষার্থীকে completion certificate তৈরি করতে দেয়।") },
] as const;

export const academyRanks = [
  { min: 0, title: t("Frame Scout", "ফ্রেম স্কাউট") },
  { min: 80, title: t("Shot Shaper", "শট শেপার") },
  { min: 180, title: t("Visual Storyteller", "ভিজ্যুয়াল স্টোরিটেলার") },
  { min: 330, title: t("Scene Architect", "সিন আর্কিটেক্ট") },
  { min: 520, title: t("Auteur in Progress", "অতর ইন প্রগ্রেস") },
  { min: 800, title: t("Cinematic Auteur", "সিনেমাটিক অতর") },
] as const;

export const academyArcadeGames: readonly {
  key: string;
  title: Bilingual;
  description: Bilingual;
  requiredEntitlement?: "arcade.pro";
  questions: readonly AcademyQuestion[];
}[] = [
  {
    key: "shot-match",
    title: t("Shot Match", "শট ম্যাচ"),
    description: t("Match the shot choice to the story intention.", "গল্পের উদ্দেশ্যের সঙ্গে সঠিক shot মিলাও।"),
    questions: [
      { prompt: t("You need to reveal a character's tiny hidden clue. Choose…", "Character-এর ছোট লুকানো clue দেখাতে কোনটি বেছে নেবে?"), options: [t("Extreme close-up", "Extreme close-up"), t("Extreme wide", "Extreme wide"), t("Long two-shot", "Long two-shot")], answerIndex: 0, explanation: t("The detail becomes readable and gains importance.", "Detail পরিষ্কার হয় এবং গুরুত্ব পায়।") },
      { prompt: t("You need to establish a lonely figure in a large location. Choose…", "বড় location-এ একাকী মানুষকে establish করতে কোনটি বেছে নেবে?"), options: [t("Tight insert", "Tight insert"), t("Wide shot with negative space", "Negative space-সহ wide shot"), t("Extreme close-up", "Extreme close-up")], answerIndex: 1, explanation: t("The environment and empty space define the subject's isolation.", "Environment ও খালি জায়গা subject-এর isolation বোঝায়।") },
      { prompt: t("You want to make a slow reveal feel intentional. Start with…", "ধীর reveal-কে purposeful করতে কী দিয়ে শুরু করবে?"), options: [t("A motivated movement or obstructed frame", "Motivated movement বা obstructed frame"), t("Random zooms", "Random zoom"), t("A transition preset", "Transition preset")], answerIndex: 0, explanation: t("Movement or framing should control when information becomes visible.", "Movement বা framing নিয়ন্ত্রণ করবে কখন তথ্য প্রকাশ পাবে।") },
    ],
  },
  {
    key: "continuity-detective",
    title: t("Continuity Detective", "কন্টিনিউটি ডিটেকটিভ"),
    description: t("Spot what breaks between two shots.", "দুটি shot-এর মাঝে কোন detail continuity ভাঙছে খুঁজে বের করো।"),
    questions: [
      { prompt: t("A character holds a cup in the right hand; after the cut it is suddenly in the left. What changed?", "Character ডান হাতে cup ধরে; cut-এর পরে হঠাৎ বাম হাতে। কী বদলেছে?"), options: [t("Prop/hand continuity", "Prop/hand continuity"), t("White balance", "White balance"), t("Frame rate", "Frame rate")], answerIndex: 0, explanation: t("The prop state and hand position do not match across the edit.", "Edit-এর দুই পাশে prop state ও hand position মেলেনি।") },
      { prompt: t("A character exits frame right, but the next shot shows them entering from the same direction without a geography change. Main risk?", "Character frame right দিয়ে বের হয়, পরের shot-এ geography না বদলেই একই direction থেকে ঢোকে। প্রধান ঝুঁকি কী?"), options: [t("Screen-direction confusion", "Screen-direction confusion"), t("Colour banding", "Colour banding"), t("Low audio sample rate", "Low audio sample rate")], answerIndex: 0, explanation: t("The audience may lose the spatial direction of travel.", "দর্শক movement-এর spatial direction হারাতে পারে।") },
      { prompt: t("An eyeline points screen-left, but the supposed subject appears screen-left in the reverse shot too. Check…", "Eyeline screen-left, কিন্তু reverse shot-এ subject-ও screen-left। কী যাচাই করবে?"), options: [t("Axis and camera placement", "Axis ও camera placement"), t("Export filename", "Export filename"), t("Music loudness", "Music loudness")], answerIndex: 0, explanation: t("The axis and camera position determine whether eyelines connect.", "Axis ও camera position eyeline connect হচ্ছে কি না নির্ধারণ করে।") },
    ],
  },
  {
    key: "cut-rhythm",
    title: t("Cut Rhythm Lab", "কাট রিদম ল্যাব"),
    description: t("Choose the edit that best serves the scene.", "দৃশ্যের উদ্দেশ্যকে সবচেয়ে ভালো support করা edit বেছে নাও।"),
    requiredEntitlement: "arcade.pro",
    questions: [
      { prompt: t("A character hears a sound in a quiet room. Best first choice?", "শান্ত ঘরে character একটি sound শোনে। প্রথমে কোন edit সবচেয়ে কার্যকর?"), options: [t("Hold long enough for the audience to listen and react", "দর্শককে শোনা ও reaction বোঝার সময় দিয়ে hold"), t("Cut rapidly through unrelated angles", "অসম্পর্কিত angle-এ দ্রুত cut"), t("Add a random flash", "Random flash যোগ")], answerIndex: 0, explanation: t("Duration lets the sound and reaction carry the beat.", "Duration sound ও reaction-কে beat বহন করতে দেয়।") },
      { prompt: t("An action feels slow because the edit hides its cause. What may help?", "Edit cause আড়াল করায় action ধীর মনে হচ্ছে। কী সাহায্য করতে পারে?"), options: [t("A motivated insert or reaction", "Motivated insert বা reaction"), t("More saturation", "আরও saturation"), t("A different export container", "অন্য export container")], answerIndex: 0, explanation: t("A purposeful insert or reaction can clarify cause and consequence.", "Purposeful insert বা reaction cause ও consequence পরিষ্কার করতে পারে।") },
      { prompt: t("A montage should feel increasingly urgent. Which choice is most relevant?", "Montage ক্রমশ urgent লাগাতে কোন choice বেশি প্রাসঙ্গিক?"), options: [t("Vary shot duration and action rhythm intentionally", "Shot duration ও action rhythm পরিকল্পিতভাবে বদলানো"), t("Use one duration for every shot", "সব shot-এ একই duration"), t("Disable the audio", "Audio বন্ধ করা")], answerIndex: 0, explanation: t("Changing durations and rhythmic accents can build urgency when matched to action.", "Action অনুযায়ী duration ও rhythmic accent বদলালে urgency তৈরি হতে পারে।") },
    ],
  },
];
