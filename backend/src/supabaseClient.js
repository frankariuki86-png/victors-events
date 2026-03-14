import { createClient } from "@supabase/supabase-js";
import { config } from "./config.js";

if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
  console.warn("Supabase URL or service role key is missing. API will fail until env is configured.");
}

const fallbackSupabaseUrl = "http://localhost:54321";
const fallbackServiceKey = "missing-service-role-key";
const fallbackAnonKey = "missing-anon-key";

export const supabase = createClient(
  config.supabaseUrl || fallbackSupabaseUrl,
  config.supabaseServiceRoleKey || fallbackServiceKey,
  {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
  }
);

export const supabaseAuthClient = createClient(
  config.supabaseUrl || fallbackSupabaseUrl,
  config.supabaseAnonKey || fallbackAnonKey,
  {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
  }
);
