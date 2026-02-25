import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cpgyeoiyvoowotcdloqj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZ3llb2l5dm9vd290Y2Rsb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTkzNjksImV4cCI6MjA4NTg3NTM2OX0.N50xOr718LG4Hs-7SBvtUhcqRKQhDZ7k8Uo6XV0eLzo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
