// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lkspdreojzjugkhinjbs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrc3BkcmVvanpqdWdraGluamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MDkzMzIsImV4cCI6MjA1MDA4NTMzMn0.4x5HKjxPosLbNq3vUtE80hk7SXtUqrR9icEvTeVXCwE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);