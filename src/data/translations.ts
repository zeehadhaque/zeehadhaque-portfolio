import { Language } from '../types';

export interface TranslationDictionary {
  nav: {
    work: string;
    stories: string;
    approach: string;
    about: string;
    contact: string;
    assistant: string;
    arcade?: string;
    academy?: string;
  };
  hero: {
    name: string;
    roles: string;
    tagline: string;
    scrollHint: string;
    soundOn: string;
    soundOff: string;
  };
  approach: {
    chapter: string;
    title: string;
    quote: string;
    pillars: {
      frame: { title: string; desc: string };
      light: { title: string; desc: string };
      silence: { title: string; desc: string };
      movement: { title: string; desc: string };
      story: { title: string; desc: string };
    };
  };
  work: {
    chapter: string;
    title: string;
    subtitle: string;
    viewFilm: string;
    readMore: string;
    runtime: string;
    genre: string;
    technical: string;
    closeModal: string;
    creditsTitle: string;
    synopsisTitle: string;
    shotOn: string;
    colorGraded: string;
    aspectRatio: string;
  };
  upcoming: {
    chapter: string;
    title: string;
    subtitle: string;
    charactersLabel: string;
    elementsLabel: string;
    statusBadge: string;
  };
  strip: {
    chapter: string;
    title: string;
    hint: string;
  };
  interests: {
    chapter: string;
    title: string;
    subtitle: string;
  };
  about: {
    chapter: string;
    title: string;
    location: string;
    bioParagraph1: string;
    bioParagraph2: string;
    bioParagraph3: string;
    focusAreasTitle: string;
    deviceNote: string;
    copyright: string;
  };
  contact: {
    chapter: string;
    headline: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    typePlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
    directEmailLabel: string;
    locationLabel: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    suggestedTitle: string;
    disclaimer: string;
    suggestions: string[];
    fallbackGreeting: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  bn: {
    nav: {
      work: 'চলচ্চিত্র',
      stories: 'চিত্রনাট্য',
      approach: 'দৃষ্টিভঙ্গি',
      about: 'পরিচিতি',
      contact: 'যোগাযোগ',
      assistant: 'জী এআই',
      arcade: 'গেমস',
      academy: 'একাডেমি',
    },
    hero: {
      name: 'জিহাদ হক',
      roles: 'চলচ্চিত্র নির্মাতা • লেখক • চিত্রগ্রাহক • পরিচালক',
      tagline: 'আলো, নিস্তব্ধতা এবং গতির সংমিশ্রণে নির্মিত দৃশ্যকাব্য।',
      scrollHint: 'সিনেমার জগতে প্রবেশ করুন',
      soundOn: 'শব্দ অন',
      soundOff: 'নিঃশব্দ',
    },
    approach: {
      chapter: 'অধ্যায় ০১ // ভিজ্যুয়াল ভাষা',
      title: 'চলচ্চিত্র নির্মাণ দৃষ্টিভঙ্গি',
      quote: 'আমি ফ্রেমের ভেতরে গল্প খুঁজি—আলো, নিস্তব্ধতা, গতি, পরিবেশ এবং যা দেখা যায় ও যা অনুভূত হয় তার মধ্যকার ফাঁকা স্থানের মধ্য দিয়ে।',
      pillars: {
        frame: { title: 'ফ্রেম', desc: '২.৩৫:১ সিনেম্যাটিক রেশিওতে বন্দী মনোস্তাত্ত্বিক গভীরতা।' },
        light: { title: 'আলো', desc: 'কঠিন বাস্তবতার ভেতর বৈদ্যুতিক নীল আলোর সূক্ষ্ম বিচ্ছুরণ।' },
        silence: { title: 'নিস্তব্ধতা', desc: 'শব্দের চেয়ে নীরবতা অনেক সময় বেশি জোরালো আর্তনাদ তৈরি করে।' },
        movement: { title: 'গতি', desc: 'ক্যামেরার নিয়ন্ত্রিত চলন ও দৃষ্টিবিভ্রমের নিখুঁত রসায়ন।' },
        story: { title: 'গল্প', desc: 'স্বপ্ন, স্মৃতি ও মানসিক টানাপোড়েনের এক অবিচ্ছেদ্য আখ্যান।' },
      },
    },
    work: {
      chapter: 'অধ্যায় ০২ // নির্বাচিত কাজ',
      title: 'চলচ্চিত্র তালিকা',
      subtitle: 'মনোস্তাত্ত্বিক সাসপেন্স ও আবহনির্ভর স্বতন্ত্র শর্ট ফিল্মসমূহ।',
      viewFilm: 'চলচ্চিত্রটি দেখুন',
      readMore: 'বিস্তারিত ফ্রেম',
      runtime: 'সময়কাল',
      genre: 'ঘরানা',
      technical: 'প্রযুক্তিগত তথ্য',
      closeModal: 'ফ্রেম বন্ধ করুন',
      creditsTitle: 'কুশীলব ও নির্মাণ দল',
      synopsisTitle: 'কাহিনী সংক্ষেপ',
      shotOn: 'ক্যামেরা',
      colorGraded: 'রঙ বিন্যাস',
      aspectRatio: 'ফ্রেম অনুপাত',
    },
    upcoming: {
      chapter: 'অধ্যায় ০৩ // নির্মাণাধীন গল্প',
      title: 'চিত্রনাট্য ও পরিকল্পনা',
      subtitle: 'চলচ্চিত্রে রূপ নেওয়ার অপেক্ষায় থাকা অপ্রকাশিত চিত্রনাট্যের খসড়া।',
      charactersLabel: 'চরিত্রসমূহ',
      elementsLabel: 'মুখ্য উপাদান',
      statusBadge: 'স্ক্রিপ্ট ড্রাফট ইন প্রগ্রেস',
    },
    strip: {
      chapter: 'অধ্যায় ০৪ // সিনেমাটিক ফ্রেম স্ট্রিপ',
      title: 'ফ্রেমের স্পন্দন',
      hint: 'ফ্রেমগুলো স্ক্রল অথবা ড্র্যাগ করে অন্বেষণ করুন',
    },
    interests: {
      chapter: 'অধ্যায় ০৫ // সৃজনশীল ক্ষেত্র',
      title: 'আগ্রহ ও অন্বেষণ',
      subtitle: 'চলচ্চিত্র শিল্পের বিভিন্ন শাখায় পরীক্ষা-নিরীক্ষা।',
    },
    about: {
      chapter: 'অধ্যায় ০৬ // চলচ্চিত্র নির্মাতা',
      title: 'জিহাদ হক সম্পর্কে',
      location: 'গাজীপুর, ঢাকা, বাংলাদেশ',
      bioParagraph1: 'জিহাদ হক বাংলাদেশের একজন সম্ভাবনাময় চলচ্চিত্র নির্মাতা, লেখক, চিত্রগ্রাহক এবং পরিচালক। তিনি ফ্রেমের কম্পোজিশন, আলো, নিস্তব্ধতা, চলন এবং সিনেমাটিক আবহ দিয়ে গল্প বুনতে গভীরভাবে আগ্রহী।',
      bioParagraph2: 'তাঁর কাজগুলো মূলত মানসিক টানাপোড়েন, রহস্য, বিভ্রম, স্বপ্ন, স্মৃতি, বন্ধুত্ব এবং মানুষের পারসেপশন বা উপলব্ধির রূপান্তর অন্বেষণ করে। দৃশ্যভিত্তিক গল্প বলা এবং সিনেমাটোগ্রাফিই তাঁর নির্মাণের মূল চালিকাশক্তি।',
      bioParagraph3: 'সীমাবদ্ধ বাজেটে ও মোবাইল সিনেমাটোগ্রাফির মাধ্যমে স্বতন্ত্র ভিজ্যুয়াল ভাষা গড়ে তোলা তাঁর কাজের অন্যতম অঙ্গীকার। এটি কোনো দুর্বলতা নয়, বরং সৃজনশীল স্বাধীনতা ও নান্দনিক আবিষ্কার।',
      focusAreasTitle: 'অনুসন্ধিৎসু দিকসমূহ',
      deviceNote: 'শর্টফিল্মসমূহ রেডমি নোট ১৪ প্রো+ ৫জি-তে শুটকৃত এবং ডাভিঞ্চি রিজলভে কালার গ্রেডেড।',
      copyright: '© ২০২৬ জিহাদ হক। সর্বস্বত্ব সংরক্ষিত।',
    },
    contact: {
      chapter: 'অধ্যায় ০৭ // যোগাযোগ',
      headline: 'আসুন একসাথে একটি ফ্রেম গড়ি।',
      subtitle: 'নতুন চলচ্চিত্র ভাবনা, সিনেমাটোগ্রাফি আলোচনা অথবা স্বাধীন নির্মাণ সহযোগিতার জন্য আমন্ত্রণ রইল।',
      namePlaceholder: 'আপনার পূর্ণ নাম',
      emailPlaceholder: 'আপনার ইমেইল ঠিকানা',
      typePlaceholder: 'প্রকল্পের ধরণ (যেমন: শর্ট ফিল্ম, সিনেমাটোগ্রাফি, পরিচালনা)',
      messagePlaceholder: 'আপনার ভাবনা বা গল্প সংক্ষেপে লিখুন...',
      submitButton: 'বার্তা পাঠান',
      sending: 'সংযোগ স্থাপন হচ্ছে...',
      successMessage: 'আপনার বার্তাটি সফলভাবে পৌঁছানো হয়েছে। ধন্যবাদ!',
      errorMessage: 'বার্তা পাঠাতে ত্রুটি হয়েছে। অনুগ্রহ করে সরাসরি ইমেইল করুন।',
      directEmailLabel: 'সরাসরি পোর্টফোলিও ইমেইল',
      locationLabel: 'কার্যস্থল ও ঠিকানা',
    },
    assistant: {
      title: 'জী (ZEE) // এআই সহকারী',
      subtitle: 'জিহাদ হকের সিনেমাটিক মহাবিশ্ব ও চলচ্চিত্রের তথ্যসঙ্গী',
      placeholder: 'জিহাদ হকের সিনেমা, প্রযুক্তি বা গল্প সম্পর্কে জানতে চান? লিখুন...',
      send: 'জিজ্ঞাসা করুন',
      suggestedTitle: 'আলোচনার প্রস্তাবনা:',
      disclaimer: 'জী জিহাদ হকের পোর্টফোলিও অ্যাসিস্ট্যান্ট। এটি স্বয়ং জিহাদ হক নন।',
      suggestions: [
        'জিহাদ হকের সিনেমাটোগ্রাফি দর্শন কী?',
        'Shadow / III শর্ট ফিল্মটি সম্পর্কে বিস্তারিত বলো',
        'তিনি কীভাবে মোবাইল ফোন (Redmi Note 14 Pro+ 5G) দিয়ে সিনেমাটোগ্রাফি করেন?',
        'Reflect ও Chakra চলচ্চিত্র দুটির মূল গল্প ও ভাব কী?',
        'তাঁর আসন্ন চিত্রনাট্যগুলো (Ghurpak, Autopsy) কী কী?',
        'DaVinci Resolve ও 2.35:1 Anamorphic রেশিও কেন ব্যবহার করেন?',
        'জিহাদ হকের সাথে নতুন প্রজেক্টে কোলাবরেশন বা যোগাযোগ কীভাবে করব?',
        'সাইকোলজিক্যাল থ্রিলার ও সাইলেন্ট সিনেমার প্রতি তাঁর বিশেষ আগ্রহের কারণ কী?',
        'তাঁর সিনেমা বানানোর সবচেয়ে বড় অনুপ্রেরণা কারা?',
        'শুটিংয়ে ন্যাচারাল লাইট আর থ্রি-পয়েন্ট লাইটিং কীভাবে ব্যালেন্স করেন?',
        'Illusion: Face of Reality শর্ট ফিল্মের রহস্য ও গল্প কী?',
        'The Director\'s Arcade ও ফিল্মমেকিং গেমগুলো কীভাবে খেলতে হয়?',
        'গাজীপুর ও ঢাকার কোন কোন লোকেশনে তিনি শুট করতে পছন্দ করেন?',
        'তাঁর চলচ্চিত্রে সাউন্ড ডিজাইন ও নীরবতার ভূমিকা কী?',
      ],
      fallbackGreeting: 'হ্যালো! আমি জী (ZEE), জিহাদ হকের পোর্টফোলিও অ্যাসিস্ট্যান্ট। জিহাদ ভাইয়ের শর্ট ফিল্ম, স্ক্রিপ্ট বা সিনেমাটোগ্রাফি সম্পর্কে কোনো প্রশ্ন আছে? নিশ্চিন্তে বলুন!',
    },
  },

  en: {
    nav: {
      work: 'WORK',
      stories: 'STORIES',
      approach: 'APPROACH',
      about: 'ABOUT',
      contact: 'CONTACT',
      assistant: 'ZEE AI',
      arcade: 'CINE-GAMES',
      academy: 'ACADEMY',
    },
    hero: {
      name: 'ZEEHAD HAQUE',
      roles: 'FILMMAKER • WRITER • CINEMATOGRAPHER • DIRECTOR',
      tagline: 'Stories told through light, silence and movement.',
      scrollHint: 'ENTER CINEMATIC EXPERIENCE',
      soundOn: 'SOUND ON',
      soundOff: 'MUTED',
    },
    approach: {
      chapter: 'CHAPTER 01 // VISUAL LANGUAGE',
      title: 'FILMMAKING APPROACH',
      quote: 'I look for stories inside frames—through light, silence, movement, atmosphere and the spaces between what is seen and what is felt.',
      pillars: {
        frame: { title: 'FRAME', desc: 'Psychological tension captured within 2.35:1 anamorphic composition.' },
        light: { title: 'LIGHT', desc: 'Electric blue currents and soft highlights cutting through deep graphite darkness.' },
        silence: { title: 'SILENCE', desc: 'Wordless sequences where atmospheric audio resonates louder than dialogue.' },
        movement: { title: 'MOVEMENT', desc: 'Controlled pacing and camera perspective revealing layered emotional truths.' },
        story: { title: 'STORY', desc: 'Explorations of dreams, loops, memories, and fragile human perceptions.' },
      },
    },
    work: {
      chapter: 'CHAPTER 02 // SELECTED WORK',
      title: 'FILMOGRAPHY',
      subtitle: 'Atmospheric, psychological short films exploring human perception and cinematic silence.',
      viewFilm: 'EXPLORE FILM',
      readMore: 'FILM DOSSIER',
      runtime: 'RUNTIME',
      genre: 'GENRE',
      technical: 'TECHNICAL SPECS',
      closeModal: 'CLOSE FRAME',
      creditsTitle: 'CREDITS & CREW',
      synopsisTitle: 'SYNOPSIS',
      shotOn: 'CAMERA',
      colorGraded: 'COLOR GRADING',
      aspectRatio: 'ASPECT RATIO',
    },
    upcoming: {
      chapter: 'CHAPTER 03 // IN DEVELOPMENT',
      title: 'UPCOMING STORIES',
      subtitle: 'Original screenplays, concept drafts, and cinematic projects in development.',
      charactersLabel: 'CHARACTERS',
      elementsLabel: 'CORE MOTIFS',
      statusBadge: 'SCREENPLAY IN PROGRESS',
    },
    strip: {
      chapter: 'CHAPTER 04 // INTERACTIVE STRIP',
      title: 'THE FILM STRIP',
      hint: 'DRAG OR SCROLL TO SCRUB CINEMATIC FRAMES',
    },
    interests: {
      chapter: 'CHAPTER 05 // CREATIVE SPECTRUM',
      title: 'AREAS OF EXPLORATION',
      subtitle: 'Disciplines shaping the visual narrative.',
    },
    about: {
      chapter: 'CHAPTER 06 // THE FILMMAKER',
      title: 'ABOUT ZEEHAD HAQUE',
      location: 'Gazipur, Dhaka, Bangladesh',
      bioParagraph1: 'Zeehad Haque is an emerging filmmaker, writer, cinematographer, and director from Bangladesh who is dedicated to telling stories through composition, atmosphere, silence, movement, and evocative cinematic imagery.',
      bioParagraph2: 'His work delves into psychological tension, mystery, illusions, dreams, memory, friendship, and the subtle transformations of human perception. Cinematography and visual composition remain at the very core of his process.',
      bioParagraph3: 'Crafting cinema with disciplined resourcefulness and mobile-first filmmaking, Zeehad treats constraints as an engine for experimental auteur visual language rather than a limitation.',
      focusAreasTitle: 'CORE INFLUENCES',
      deviceNote: 'Selected projects shot on Redmi Note 14 Pro+ 5G & color graded in DaVinci Resolve.',
      copyright: '© 2026 Zeehad Haque. All rights reserved.',
    },
    contact: {
      chapter: 'CHAPTER 07 // INQUIRIES',
      headline: "LET'S CREATE A FRAME.",
      subtitle: "Open for film collaborations, cinematography assignments, directing opportunities, and creative dialogues.",
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Your Email Address',
      typePlaceholder: 'Project Type (e.g., Short Film, Cinematography, Direction)',
      messagePlaceholder: 'Tell me about the story or concept...',
      submitButton: 'START A CONVERSATION',
      sending: 'TRANSMITTING...',
      successMessage: 'Frame transmitted successfully. Zeehad will review your message soon.',
      errorMessage: 'Transmission failed. Please reach out directly via email.',
      directEmailLabel: 'Direct Portfolio Email',
      locationLabel: 'Base Location',
    },
    assistant: {
      title: 'ZEE // CINEMATIC COMPANION',
      subtitle: "Interactive guide to Zeehad Haque's filmmaking world",
      placeholder: 'Ask about films, visual style, upcoming scripts, or gear...',
      send: 'ASK',
      suggestedTitle: 'DISCOVER QUESTIONS:',
      disclaimer: "ZEE is an AI assistant for this portfolio and is not Zeehad Haque directly.",
      suggestions: [
        'What is Zeehad Haque\'s cinematography and visual philosophy?',
        'Tell me in detail about the psychological short film Shadow / III.',
        'How does Zeehad achieve cinema-grade visuals on a mobile phone?',
        'What are the core themes behind Reflect and Chakra?',
        'What upcoming screenplays (Ghurpak, Autopsy, etc.) are in development?',
        'Why does he grade in DaVinci Resolve with a 2.35:1 Anamorphic ratio?',
        'How can I collaborate with Zeehad on a film or commercial project?',
        'What draws him toward psychological thrillers and silent cinema?',
        'Who are his greatest cinematic inspirations and auteur influences?',
        'How does he balance natural ambient lighting with three-point setups?',
        'What is the mystery and core twist in Illusion: Face of Reality?',
        'How does The Director\'s Quest progression work in the Cine-Arcade?',
        'Which filming locations in Gazipur and Dhaka does he frequent?',
        'What is the role of acoustic silence and foley in his storytelling?',
      ],
      fallbackGreeting: "Hi there! I'm ZEE, Zeehad Haque's portfolio assistant. Ask me anything about his films, visual philosophy, camera setups, or upcoming screenplays!",
    },
  },

  hi: {
    nav: {
      work: 'फिल्में',
      stories: 'कहानियाँ',
      approach: 'दृष्टिकोण',
      about: 'परिचय',
      contact: 'संपर्क',
      assistant: 'ज़ी एआई',
      arcade: 'गेम्स',
      academy: 'अकादमी',
    },
    hero: {
      name: 'ज़ीहाद हक',
      roles: 'फिल्म निर्माता • लेखक • छायाकार • निर्देशक',
      tagline: 'प्रकाश, मौन और गति के माध्यम से कही गई कहानियाँ।',
      scrollHint: 'सिनेमाई अनुभव में प्रवेश करें',
      soundOn: 'ध्वनि चालू',
      soundOff: 'मूक',
    },
    approach: {
      chapter: 'अध्याय ०१ // दृश्य भाषा',
      title: 'फिल्म निर्माण दृष्टिकोण',
      quote: 'मैं फ्रेम के भीतर कहानियाँ खोजता हूँ—प्रकाश, मौन, गति, वातावरण और जो देखा जाता है व जो महसूस होता है उसके बीच के रिक्त स्थान के माध्यम से।',
      pillars: {
        frame: { title: 'फ्रेम', desc: '२.३५:१ एनामॉर्फिक संरचना में कैद मनोवैज्ञानिक तनाव।' },
        light: { title: 'प्रकाश', desc: 'गहरे अंधेरे को चीरती नीली विद्युत आभा और कोमल चमक।' },
        silence: { title: 'मौन', desc: 'संवादहीन दृश्य जहाँ वातावरण की खामोशी शब्दों से अधिक गूँजती है।' },
        movement: { title: 'गति', desc: 'कैमरे की नियंत्रित चाल और दृष्टिभ्रम की गहराई।' },
        story: { title: 'कहानी', desc: 'सपनों, स्मृतियों और मानवीय अनुभूतियों की परतें।' },
      },
    },
    work: {
      chapter: 'अध्याय ०२ // चुनिंदा कार्य',
      title: 'फिल्मोग्राफी',
      subtitle: 'मानसिक रहस्य और वातावरणीय सन्नाटे पर आधारित लघु फिल्में।',
      viewFilm: 'फिल्म देखें',
      readMore: 'विस्तृत विवरण',
      runtime: 'समय अवधि',
      genre: 'शैली',
      technical: 'तकनीकी विवरण',
      closeModal: 'बंद करें',
      creditsTitle: 'कलाकार एवं दल',
      synopsisTitle: 'कहानी सारांश',
      shotOn: 'कैमरा',
      colorGraded: 'कलर ग्रेडिंग',
      aspectRatio: 'पहलू अनुपात',
    },
    upcoming: {
      chapter: 'अध्याय ०३ // निर्माणाधीन',
      title: 'आगामी कहानियाँ',
      subtitle: 'पटकथाओं के मूल ड्राफ्ट और आगामी स्वतंत्र फिल्में।',
      charactersLabel: 'पात्र',
      elementsLabel: 'मुख्य पहलू',
      statusBadge: 'पटकथा प्रक्रियाधीन',
    },
    strip: {
      chapter: 'अध्याय ०४ // फिल्म स्ट्रिप',
      title: 'फ्रेम की धड़कन',
      hint: 'फ्रेम को स्क्रॉल या ड्रैग करके देखें',
    },
    interests: {
      chapter: 'अध्याय ०५ // रचनात्मक क्षेत्र',
      title: 'सृजनात्मक अन्वेषण',
      subtitle: 'सिनेमाई कला की विभिन्न विधाओं का प्रयोग।',
    },
    about: {
      chapter: 'अध्याय ०६ // फिल्म निर्माता',
      title: 'ज़ीहाद हक का परिचय',
      location: 'गाज़ीपुर, ढाका, बांग्लादेश',
      bioParagraph1: 'ज़ीहाद हक बांग्लादेश के एक उभरते हुए फिल्म निर्माता, लेखक, छायाकार और निर्देशक हैं जो संरचना, प्रकाश, मौन और गति के माध्यम से कहानियाँ रचने में विश्वास रखते हैं।',
      bioParagraph2: 'उनका काम मुख्य रूप से मनोवैज्ञानिक तनाव, रहस्य, भ्रम, स्मृति और मानवीय अनुभूतियों के बदलावों को उजागर करता है। दृश्य कहानी और छायांकन उनकी कला के केंद्र में हैं।',
      bioParagraph3: 'सीमित बजट और मोबाइल-फर्स्ट सिनेमैटोग्राफी के साथ वे अपनी विशिष्ट सिनेमाई भाषा गढ़ रहे हैं। यह कोई सीमा नहीं, बल्कि कलात्मक प्रयोग की स्वतंत्रता है।',
      focusAreasTitle: 'मुख्य प्रेरणाएं',
      deviceNote: 'रेडमी नोट १४ प्रो+ ५जी पर फिल्मांकित एवं डाविंची रिज़ॉल्व में कलर ग्रेडेड।',
      copyright: '© २०२६ ज़ीहाद हक। सर्वाधिकार सुरक्षित।',
    },
    contact: {
      chapter: 'अध्याय ०७ // संपर्क',
      headline: 'आइए एक यादगार फ्रेम बनाएं।',
      subtitle: 'नई फिल्मों, छायांकन और स्वतंत्र निर्माण पर संवाद के लिए सादर आमंत्रित हैं।',
      namePlaceholder: 'आपका नाम',
      emailPlaceholder: 'ईमेल पता',
      typePlaceholder: 'परियोजना का प्रकार (उदा. लघु फिल्म, छायांकन, निर्देशन)',
      messagePlaceholder: 'अपनी कहानी या विचार साझा करें...',
      submitButton: 'बातचीत शुरू करें',
      sending: 'भेजा जा रहा है...',
      successMessage: 'संदेश सफलतापूर्वक भेज दिया गया। धन्यवाद!',
      errorMessage: 'संदेश भेजने में त्रुटि हुई। कृपया ईमेल से संपर्क करें।',
      directEmailLabel: 'पोर्टफोलियो ईमेल',
      locationLabel: 'स्थान',
    },
    assistant: {
      title: 'ज़ी // एआई सहायक',
      subtitle: 'ज़ीहाद हक के सिनेमाई संसार का मार्गदर्शक',
      placeholder: 'फिल्मों, तकनीकों या कहानियों के बारे में कुछ भी पूछें...',
      send: 'पूछें',
      suggestedTitle: 'सुझाए गए प्रश्न:',
      disclaimer: 'ज़ी इस पोर्टफोलियो का सहायक है, स्वयं ज़ीहाद हक नहीं।',
      suggestions: [
        'Shadow / III फिल्म की मूल अवधारणा क्या है?',
        'ज़ीहाद मोबाइल से सिनेमैटोग्राफी कैसे करते हैं?',
        'Reflect और Chakra फिल्मों की मूल कहानी क्या है?',
        'कौन सी नई कहानियाँ और पटकथाएँ (Ghurpak, Autopsy) निर्माणाधीन हैं?',
        'वे DaVinci Resolve और 2.35:1 Anamorphic अनुपात क्यों चुनते हैं?',
        'ज़ीहाद हक से सहयोग या संपर्क कैसे किया जाए?',
        'मनोवैज्ञानिक थ्रिलर और मूक सिनेमा में उनकी रुचि का क्या कारण है?',
        'फिल्म निर्माण में उनके मुख्य प्रेरणा स्रोत कौन हैं?',
        'शूटिंग में प्राकृतिक प्रकाश का संतुलन कैसे बनाया जाता है?',
        'Illusion: Face of Reality शॉर्ट फिल्म का रहस्य क्या है?',
        'डायरेक्टर्स आर्केड और गेम्स कैसे खेलें?',
        'गाज़ीपुर और ढाका के कौन से स्थानों पर शूटिंग की गई है?',
      ],
      fallbackGreeting: 'नमस्ते! मैं ज़ी (ZEE) हूँ, ज़ीहाद हक का डिजिटल सहायक। आप उनकी फिल्मों, आगामी कहानियों या छायांकन के बारे में कुछ भी पूछ सकते हैं!',
    },
  },

  ur: {
    nav: {
      work: 'فلمیں',
      stories: 'کہانیاں',
      approach: 'نظریہ',
      about: 'تعارف',
      contact: 'رابطہ',
      assistant: 'زی اے آئی',
      arcade: 'گیمز',
      academy: 'اکیڈمی',
    },
    hero: {
      name: 'جہاد حق',
      roles: 'فلم ساز • مصنف • سینماٹوگرافر • ہدایت کار',
      tagline: 'روشنی، خاموشی اور حرکت کے ذریعے بیان کی گئی کہانیاں۔',
      scrollHint: 'سنیما کی دنیا میں داخل ہوں',
      soundOn: 'آواز آن',
      soundOff: 'خاموش',
    },
    approach: {
      chapter: 'باب ۰۱ // بصری زبان',
      title: 'فلم سازی کا نظریہ',
      quote: 'میں فریم کے اندر کہانیاں تلاش کرتا ہوں—روشنی، خاموشی، حرکت، ماحول اور جو دیکھا جاتا ہے اور جو محسوس کیا جاتا ہے اس کے درمیانی فاصلے کے ذریعے۔',
      pillars: {
        frame: { title: 'فریم', desc: '۲.۳۵:۱ کے اینامورفک تناسب میں قید نفسیاتی تناؤ۔' },
        light: { title: 'روشنی', desc: 'گہرے اندھیرے میں الیکٹرک نیلی روشنی کا خوبصورت تاثر۔' },
        silence: { title: 'خاموشی', desc: 'بے آواز مناظر جہاں ماحول کی گونج الفاظ سے زیادہ بولتی ہے۔' },
        movement: { title: 'حرکت', desc: 'کیمرے کی متوازن رفتار اور بصری وسعت۔' },
        story: { title: 'کہانی', desc: 'خوابوں، یادوں اور احساسات کی گہرائیاں۔' },
      },
    },
    work: {
      chapter: 'باب ۰۲ // منتخب کام',
      title: 'فلموگرافی',
      subtitle: 'نفسیاتی سسپنس اور ماحولیاتی خاموشی پر مبنی مختصر فلمیں۔',
      viewFilm: 'فلم دیکھیں',
      readMore: 'تفصیلات',
      runtime: 'دورانیہ',
      genre: 'صنف',
      technical: 'تکنیکی تفصیلات',
      closeModal: 'بند کریں',
      creditsTitle: 'اداکار و عملہ',
      synopsisTitle: 'خلاصہ',
      shotOn: 'کیمرہ',
      colorGraded: 'کلر گریڈنگ',
      aspectRatio: 'تناسب',
    },
    upcoming: {
      chapter: 'باب ۰۳ // زیر تکمیل',
      title: 'آئندہ کہانیاں',
      subtitle: 'فلم میں ڈھلنے کے منتظر اسکرپٹ کے مسودے۔',
      charactersLabel: 'کردار',
      elementsLabel: 'اہم عناصر',
      statusBadge: 'اسکرپٹ پر کام جاری ہے',
    },
    strip: {
      chapter: 'باب ۰۴ // فلم پٹی',
      title: 'فریم کا منظر',
      hint: 'فریم کو اسکرول یا ڈریگ کرکے دیکھیں',
    },
    interests: {
      chapter: 'باب ۰۵ // تخلیقی دائرہ کار',
      title: 'تخلیقی دلچسپیاں',
      subtitle: 'سنیما کے مختلف فنون پر تحقیق و تجربات۔',
    },
    about: {
      chapter: 'باب ۰۶ // فلم ساز',
      title: 'جہاد حق کا تعارف',
      location: 'غازی پور، ڈھاکہ، بنگلہ دیش',
      bioParagraph1: 'جہاد حق بنگلہ دیش سے تعلق رکھنے والے ایک ابھرتے ہوئے فلم ساز، مصنف، سینماٹوگرافر اور ہدایت کار ہیں جو فریم، روشنی، خاموشی اور حرکت کے ساتھ کہانیاں بننے میں دلچسپی رکھتے ہیں۔',
      bioParagraph2: 'ان کا کام نفسیاتی تناؤ، اسرار، وہم، خواب، یادداشت اور انسانی ادراک کے پہلوؤں کو تلاش کرتا ہے۔ بصری کہانی اور سینماٹوگرافی ان کے کام کی روح ہیں۔',
      bioParagraph3: 'محدود وسائل اور موبائل سینماٹوگرافی کے ساتھ منفرد بصری اسلوب تخلیق کرنا ان کی پہچان ہے۔ یہ کوئی کمزوری نہیں بلکہ تخلیقی جرات ہے۔',
      focusAreasTitle: 'بنیادی اثرات',
      deviceNote: 'ریڈمی نوٹ ۱۴ پرو+ ۵جی پر شوٹ شدہ اور ڈاونچی ریزولو میں کلر گریڈڈ۔',
      copyright: '© ۲۰۲۶ جہاد حق۔ جملہ حقوق محفوظ ہیں۔',
    },
    contact: {
      chapter: 'باب ۰۷ // رابطہ',
      headline: 'آئیں مل کر ایک یادگار فریم بنائیں۔',
      subtitle: 'فلم سازی، سینماٹوگرافی اور تخلیقی تعاون کے لیے رابطہ فرمائیں۔',
      namePlaceholder: 'آپ کا نام',
      emailPlaceholder: 'آپ کا ای میل ایڈریس',
      typePlaceholder: 'منصوبے کی نوعیت (مثلاً مختصر فلم، سینماٹوگرافی)',
      messagePlaceholder: 'اپنی کہانی یا سوچ کا مختصر تعارف لکھیں...',
      submitButton: 'پیغام بھیجیں',
      sending: 'ارسال ہو رہا ہے...',
      successMessage: 'آپ کا پیغام موصول ہو گیا ہے۔ شکریہ!',
      errorMessage: 'پیغام بھیجنے میں دشواری پیش آئی۔ براہ کرم ای میل کریں۔',
      directEmailLabel: 'براہ راست پورٹ فولیو ای میل',
      locationLabel: 'مقام',
    },
    assistant: {
      title: 'زی // اے آئی اسسٹنٹ',
      subtitle: 'جہاد حق کی فلمی کائنات کا معلوماتی ساتھی',
      placeholder: 'فلموں، سینماٹوگرافی یا کہانیوں کے بارے میں پوچھیں...',
      send: 'پوچھیں',
      suggestedTitle: 'تجویز کردہ سوالات:',
      disclaimer: 'زی اس پورٹ فولیو کا مددگار ہے، بذات خود جہاد حق نہیں۔',
      suggestions: [
        'Shadow / III کا مرکزی خیال کیا ہے؟',
        'جہاد حق موبائل پر سینماٹوگرافی کیسے کرتے ہیں؟',
        'فلم Reflect اور Chakra کا بنیادی موضوع کیا ہے؟',
        'زیر تکمیل نئی کہانیاں (Ghurpak, Autopsy) کون سی ہیں؟',
        'وہ DaVinci Resolve اور 2.35:1 Anamorphic ریشو کیوں استعمال کرتے ہیں؟',
        'جہاد حق کے ساتھ نیا پروجیکٹ کیسے شروع کیا جائے؟',
        'نفسیاتی تھرلر اور خاموش سنیما کی طرف ان کا رجحان کیوں ہے؟',
        'فلم سازی میں ان کے اہم ترین اثرات اور اساتذہ کون ہیں؟',
        'قدرتی روشنی اور تھری پوائنٹ لائٹنگ کا توازن کیسے بناتے ہیں؟',
        'فلم Illusion: Face of Reality کی پراسرار کہانی کیا ہے؟',
        'ڈائریکٹرز آرکیڈ اور گیمز کیسے کھیلیں؟',
        'غازی پور اور ڈھاکہ کی کن لوکیشنز پر شوٹنگ کرتے ہیں؟',
      ],
      fallbackGreeting: 'خوش آمدید! میں زی (ZEE) ہوں، جہاد حق کا پورٹ فولیو معاون۔ آپ مجھ سے ان کی فلموں، اسکرپٹس اور سینماٹوگرافی کے متعلق کچھ بھی دریافت کر سکتے ہیں!',
    },
  },
};
