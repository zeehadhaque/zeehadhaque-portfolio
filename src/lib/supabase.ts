import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://khagjlnczaihgkohmpmg.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_lqi_R3QWs0pInCEemHAhoA_mrmM7i3v";

export const ACADEMY_STORAGE_KEY = "zee-academy-session-v1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storageKey: ACADEMY_STORAGE_KEY,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
