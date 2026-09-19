// delete-account: lets a signed-in user permanently delete their own account and data.
// Deploy as a Supabase Edge Function named "delete-account" with JWT verification ON.
// Optional secret: PROTECTED_ACCOUNT_EMAILS = comma-separated emails that can never be deleted
// (use it for the demo login you give to App Store reviewers).
//
// All user tables reference auth.users with ON DELETE CASCADE, so deleting the auth user
// also deletes their goals, meals, chat history and profile.

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  // Identify the caller from their own access token (never from the request body)
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data, error } = await admin.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return json({ error: "login_required" }, 401);

  let body: { confirm?: string } = {};
  try {
    body = await req.json();
  } catch { /* handled below */ }
  if (body.confirm !== "DELETE") return json({ error: "not_confirmed" }, 400);

  const protectedEmails = (Deno.env.get("PROTECTED_ACCOUNT_EMAILS") ?? "")
    .toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  if (user.email && protectedEmails.includes(user.email.toLowerCase())) {
    return json({ error: "protected_account" }, 403);
  }

  // Explicit deletes first (also covered by ON DELETE CASCADE)
  for (const table of ["chat_messages", "food_entries", "user_goals"]) {
    const col = "user_id";
    const { error: e } = await admin.from(table).delete().eq(col, user.id);
    if (e) console.error(`delete ${table} failed`, e.message);
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    console.error("deleteUser failed", delErr.message);
    return json({ error: "delete_failed" }, 500);
  }
  return json({ ok: true });
});
