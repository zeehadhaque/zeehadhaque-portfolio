import { GoogleGenAI } from '@google/genai';
import { createClient } from '@libsql/client';

export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  GEMINI_API_KEY?: string;
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
  ZEEHAD_ADMIN_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      try {
        if (pathname === '/api/chat' && request.method === 'POST') {
          const body = await request.json() as { message?: string; language?: string; history?: Array<{ role: string; text: string }> };
          const userMessage = body.message || '';
          const lang = body.language || 'bn';

          let replyText = '';
          const apiKey = env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);

          if (apiKey) {
            try {
              const ai = new GoogleGenAI({ apiKey });
              const systemInstruction = `You are ZEE — Zeehad Haque's digital carbon copy and pocket director assistant on his filmmaker portfolio & academy website ("THE INFINITE CINEMATIC CASTLE UNIVERSE").
Personality: Witty, human, poetic, cinematic, friendly, passionate about mobile filmmaking (Redmi Note 14 Pro+ 5G), DaVinci Resolve color grading, silence, light, psychological thrillers, and Tagore-like poetic expressions.
Language: Respond in the requested language (${lang}: 'bn' for Bengali, 'en' for English, 'hi' for Hindi, 'ur' for Urdu).
Keep your answers engaging, cinematic, and helpful.`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userMessage,
                config: {
                  systemInstruction,
                  temperature: 0.8,
                },
              });
              replyText = response.text || '';
            } catch (err) {
              console.warn('Gemini API call failed, using intelligent fallback:', err);
            }
          }

          if (!replyText) {
            const qLower = userMessage.toLowerCase();
            if (lang === 'bn') {
              if (qLower.includes('course') || qLower.includes('codex') || qLower.includes('academy') || qLower.includes('buy') || qLower.includes('কোর্স') || qLower.includes('কিনব') || qLower.includes('একাডেমি')) {
                replyText = `আরে বস! 'Filmmaking Master Codex' কোর্সগুলো হলো ডিরেকশন ও সিনেমাটোগ্রাফির একদম মাস্টারক্লাস। 🎬\n\nজীবনানন্দ দাশের ভাষায় যেমন—\n"হাজার বছর ধরে আমি পথ হাঁটিতেছি... তেমনই নিখুঁত একটি ফ্রেমের খোঁজে জীবনের অনেকটা সময় কেটে যায়।"\n\nআপনি যদি আপনার স্টোরিটেলিং আর কালার গ্রেডিং নেক্সট লেভেলে নিয়ে যেতে চান, তবে একাডেমি সেকশন থেকে যেকোনো কোর্স বেছে নিন। পেমেন্ট বা এনরোলমেন্ট নিয়ে কোনো ঝামেলায় পড়লে সরাসরি জিহাদ ভাইয়ের সাথে যোগাযোগ করুন: zeehadhaque@gmail.com। কথা দিলাম, পস্তাবেন না! 🔥`;
              } else if (qLower.includes('tip') || qLower.includes('camera') || qLower.includes('redmi') || qLower.includes('davinci') || qLower.includes('shoot') || qLower.includes('শুট') || qLower.includes('ক্যামেরা')) {
                replyText = `চলুন কিছু খাঁটি ডিরেক্টরি টিপস শেয়ার করি! 🎥\n\n১. লাইটিং: নাটুকে ও ছায়াঘেরা মুড আনতে সবসময় সাইড লাইট বা উইন্ডো লাইট ব্যবহার করুন।\n২. ক্যামেরা গিয়ার: জিহাদ ভাই যেমন রেডমি নোট ১৪ প্রো+ ৫জি দিয়ে পকেট-ফ্রেন্ডলি অথচ সিনেমাটিক শ্যুট করেন, তেমনি আপনার হাতের ফোনটাকেই হাতিয়ার বানান।\n৩. কালার গ্রেডিং: ডাভিঞ্চি রিজলভ (DaVinci Resolve)-এ গিয়ে কন্ট্রাস্ট একটু বাড়িয়ে স্যাচুরেশন কমিয়ে একটা মুডি অ্যানালগ লুক দিন।\n\n"রাতের আকাশে যেমন তারার মেলা, তেমনি লেন্সের ফোকাসে জীবনের অবয়ব।" — মাস্তি করতে করতে সিনেমা বানান! 🚀`;
              } else if (qLower.includes('poetry') || qLower.includes('kobita') || qLower.includes('কবি') || qLower.includes('কবিতা') || qLower.includes('life') || qLower.includes('জীবন')) {
                replyText = `"পৃথিবীর গভীর গভীরতর অন্ধকার থেকে উঠে এসে\nআমরা একফালি আলো আর লেন্সের খোঁজে ঘুরি..." 🌌\n\nভাই, সিনেমা মানেই তো ভিজ্যুয়াল কবিতা! যখন ফ্রেম কথা বলে না, তখন সিলেন্স আর লাইট মিলে কবিতা হয়ে ওঠে। আপনার মনের গহীনে কোন গল্পটা জমা হয়ে আছে বলুন তো?`;
              } else {
                replyText = `আরে দোস্ত! কী অবস্থা? 🎬 আমি হচ্ছি জিহাদ হকের ডিজিটাল কার্বন কপি—আপনার পকেট ডিরেক্টর আর সিনেমাটিক দোস্ত!\n\n"হৃদয়ের অন্ধকার কুঠুরিতে যখন আলো মেশে, তখনই জন্ম নেয় আসল সিনেমা।" \n\nবলুন, আজ কোন প্রজেক্ট নিয়ে আড্ডা হবে? মোবাইল সিনেমাটোগ্রাফি টিপস লাগবে, নাকি আমাদের 'Filmmaking Master Codex' থেকে কোনো কোর্স কিনতে সাহায্য করব? জিহাদ ভাই যেমন রেডমি নোট ১৪ প্রো+ ৫জি দিয়ে এক্কেবারে আগুন ভিজ্যুয়াল নামিয়ে দেন আর ডাভিঞ্চি রিজলভে কালার গ্রেড করেন! কী বলবেন, কোন দিকে যাব আজ? 🎥✨`;
              }
            } else {
              if (qLower.includes('course') || qLower.includes('codex') || qLower.includes('academy') || qLower.includes('buy')) {
                replyText = `My friend! The 'Filmmaking Master Codex' courses are your ticket to directorial nirvana. 🎬\n\nAs the darkroom whisper goes:\n"In the silence of 24 frames, a thousand lifetimes unfold."\n\nHead over to the Filmmaking Codex section to grab your course. If you need any manual payment assistance or direct enrollment help, hit up Zeehad at zeehadhaque@gmail.com. Let's make your cinematic dreams a reality! 🔥`;
              } else if (qLower.includes('tip') || qLower.includes('camera') || qLower.includes('redmi') || qLower.includes('davinci') || qLower.includes('shoot')) {
                replyText = `Here are some raw director's notes for you! 🎥\n\n1. Lighting: Embrace shadow and side-lighting. Moody contrast is pure emotion.\n2. Mobile First: Just like Zeehad shoots on the Redmi Note 14 Pro+ 5G, remember that the best camera is the one in your hand.\n3. Grading: Take it into DaVinci Resolve, crush the blacks slightly, and let the cinematic halation breathe.\n\n"In the deep theater of night, every shadow tells a story." Keep creating with passion! 🚀`;
              } else if (qLower.includes('poetry') || qLower.includes('poem') || qLower.includes('life')) {
                replyText = `"Out of the deep, quiet darkrooms of the soul,\nWe emerge clutching light, shadow, and 24fps..." 🌌\n\nCinema is just poetry written with photons, my friend. What story are we framing today?`;
              } else {
                replyText = `Hey there, cinema wanderer! 🎬 I am ZEE — Zeehad Haque's digital carbon copy, your partner in crime, creative sparring partner, and pocket director.\n\n"In the stillness of 24fps, the soul finds its true framing."\n\nWhether you need raw mobile filmmaking tips (Redmi Note 14 Pro+ 5G wizardry!), DaVinci Resolve color grading secrets, or want to grab a course from the Filmmaking Master Codex, I'm right here. What's on your mind today? Let's make some cinematic magic happen! ✨`;
              }
            }
          }

          return new Response(JSON.stringify({ reply: replyText }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        if (pathname.startsWith('/api/academy/')) {
          const adminSecret = env.ZEEHAD_ADMIN_SECRET || (typeof process !== 'undefined' ? process.env.ZEEHAD_ADMIN_SECRET : undefined);

          // Fast rejection on unauthorized admin actions before DB connection
          if (pathname === '/api/academy/grant' && request.method === 'POST') {
            const body = await request.json() as { studentId: string; courseId: string; accessType: string; adminKey: string };
            if (!body.adminKey || body.adminKey !== adminSecret) {
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          }

          let dbUrl = env.TURSO_DATABASE_URL;
          // In Cloudflare Workers environment, file: URLs are not supported by web client. Default to libSQL remote URL.
          if (!dbUrl || dbUrl.startsWith('file:')) {
            dbUrl = 'libsql://dummy-db.turso.io';
          }
          const dbToken = env.TURSO_AUTH_TOKEN;
          const db = createClient({ url: dbUrl, authToken: dbToken });

          if (pathname === '/api/academy/entitlements' && request.method === 'POST') {
            const { studentId } = await request.json() as { studentId?: string };
            try {
              const result = await db.execute({
                sql: 'SELECT course_id, access_type FROM course_entitlements WHERE student_id = ?',
                args: [studentId || 'guest'],
              });
              return new Response(JSON.stringify({ entitlements: result.rows }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            } catch (dbErr: any) {
              // Return empty entitlements if remote DB is not yet provisioned in dev
              return new Response(JSON.stringify({ entitlements: [], note: 'Database offline or credentials not set' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          }

          if (pathname === '/api/academy/grant' && request.method === 'POST') {
            const body = await request.json() as { studentId: string; courseId: string; accessType: string; adminKey: string };
            try {
              await db.execute({
                sql: 'INSERT OR REPLACE INTO course_entitlements (student_id, course_id, access_type) VALUES (?, ?, ?)',
                args: [body.studentId, body.courseId, body.accessType],
              });
              return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            } catch (dbErr: any) {
              return new Response(JSON.stringify({ success: false, error: dbErr.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          }
        }

        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Internal Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Serve static assets or fallback to index.html for SPA routing
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404 && !pathname.includes('.')) {
        return await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }
      return assetResponse;
    } catch (e) {
      return await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }
  },
};
