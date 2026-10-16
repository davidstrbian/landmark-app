// Checks the Row Level Security policies against a real Supabase project with
// two throwaway users, A and B.
//
//   npm run test:rls
//
// Needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and
// SUPABASE_SERVICE_ROLE_KEY in .env.local. The service role key is used only
// to create and delete the two test users and to double-check results behind
// RLS; every check itself runs as anon or as a signed-in user. The users (and,
// by cascade, their profiles and completions) are always deleted at the end.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
  process.exit(1);
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, serviceKey, options);
const anon = createClient(url, anonKey, options);

let failures = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ✓ ${name}`);
  else {
    failures++;
    console.log(`  ✗ ${name}`, detail ?? "");
  }
}

// Postgres error codes PostgREST passes through.
const RLS_VIOLATION = "42501"; // insufficient_privilege: a policy refused a write
const UNIQUE_VIOLATION = "23505";

async function signIn(email: string, password: string) {
  const client = createClient(url!, anonKey!, options);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(`Sign-in failed for ${email}: ${error?.message}`);
  return { client, id: data.user.id };
}

async function main() {
  const stamp = Date.now();
  const password = `Rls-test-${stamp}-${Math.random().toString(36).slice(2)}`;
  const emails = [`rls-test-a-${stamp}@example.com`, `rls-test-b-${stamp}@example.com`];
  const createdIds: string[] = [];

  try {
    for (const email of emails) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error || !data.user) throw new Error(`Creating ${email} failed: ${error?.message}`);
      createdIds.push(data.user.id);
    }
    const a = await signIn(emails[0], password);
    const b = await signIn(emails[1], password);

    console.log("Landmarks");
    const anonRead = await anon.from("landmarks").select("id").order("sort_order");
    check("anon can read landmarks", !anonRead.error && (anonRead.data?.length ?? 0) > 0, anonRead.error);
    const landmarkIds = (anonRead.data ?? []).map((l) => l.id as string);
    const [first, second] = landmarkIds;
    if (!first || !second) throw new Error("Need at least two landmarks: run supabase/seed.sql first.");
    const userRead = await a.client.from("landmarks").select("id");
    check("signed-in users can read landmarks", (userRead.data?.length ?? 0) === landmarkIds.length, userRead.error);

    for (const [who, client] of [["anon", anon], ["user A", a.client]] as [string, SupabaseClient][]) {
      const ins = await client.from("landmarks").insert({
        id: `rls-test-${stamp}`,
        name: "Test",
        category: "peak",
        region: "Test",
        description: "Test",
        sort_order: 9999,
      });
      check(`${who} cannot insert landmarks`, ins.error?.code === RLS_VIOLATION, ins.error ?? "insert succeeded");
      const upd = await client.from("landmarks").update({ name: "Hacked" }).eq("id", first).select();
      check(`${who} cannot update landmarks`, (upd.data?.length ?? 0) === 0, upd.data);
      const del = await client.from("landmarks").delete().eq("id", first).select();
      check(`${who} cannot delete landmarks`, (del.data?.length ?? 0) === 0, del.data);
    }
    const stillThere = await admin.from("landmarks").select("id, name").eq("id", first).single();
    check("landmark is unchanged afterwards", !!stillThere.data && stillThere.data.name !== "Hacked", stillThere.data);

    console.log("Profiles");
    const aProfiles = await a.client.from("profiles").select("id");
    check(
      "a profile was created on sign-up, and A sees only her own",
      aProfiles.data?.length === 1 && aProfiles.data[0].id === a.id,
      aProfiles.data ?? aProfiles.error,
    );
    const ownUpdate = await a.client.from("profiles").update({ display_name: "Aino" }).eq("id", a.id).select();
    check("A can update her own profile", ownUpdate.data?.length === 1, ownUpdate.error);
    const otherUpdate = await a.client.from("profiles").update({ display_name: "Hacked" }).eq("id", b.id).select();
    check("A cannot update B's profile", (otherUpdate.data?.length ?? 0) === 0, otherUpdate.data);
    const otherDelete = await a.client.from("profiles").delete().eq("id", b.id).select();
    check("A cannot delete B's profile", (otherDelete.data?.length ?? 0) === 0, otherDelete.data);
    const otherInsert = await a.client.from("profiles").insert({ id: b.id });
    check("A cannot create a profile for B", !!otherInsert.error, "insert succeeded");
    const bProfile = await admin.from("profiles").select("id, display_name").eq("id", b.id).single();
    check("B's profile is untouched", !!bProfile.data && bProfile.data.display_name !== "Hacked", bProfile.data);
    const anonProfiles = await anon.from("profiles").select("id");
    check("anon sees no profiles", (anonProfiles.data?.length ?? 0) === 0, anonProfiles.data);

    console.log("Completions");
    const aInsert = await a.client.from("completions").insert({ landmark_id: first }).select().single();
    check("A can mark a landmark completed (user_id defaults to her)", aInsert.data?.user_id === a.id, aInsert.error);
    const forB = await a.client.from("completions").insert({ user_id: b.id, landmark_id: second });
    check("A cannot add a completion for B", forB.error?.code === RLS_VIOLATION, forB.error ?? "insert succeeded");
    const dup = await a.client.from("completions").insert({ landmark_id: first });
    check("a duplicate (same user, same landmark) is rejected", dup.error?.code === UNIQUE_VIOLATION, dup.error ?? "insert succeeded");
    const bSees = await b.client.from("completions").select("id");
    check("B cannot see A's completions", (bSees.data?.length ?? 0) === 0, bSees.data);
    const bUpdate = await b.client.from("completions").update({ completed_at: new Date(0).toISOString() }).eq("user_id", a.id).select();
    check("B cannot change A's completions", (bUpdate.data?.length ?? 0) === 0, bUpdate.data);
    const bDelete = await b.client.from("completions").delete().eq("user_id", a.id).select();
    check("B cannot delete A's completions", (bDelete.data?.length ?? 0) === 0, bDelete.data);
    const steal = await a.client.from("completions").update({ user_id: b.id }).eq("user_id", a.id).select();
    check("A cannot hand her completion over to B", !!steal.error || (steal.data?.length ?? 0) === 0, steal.data);
    const anonInsert = await anon.from("completions").insert({ user_id: a.id, landmark_id: second });
    check("anon cannot add completions", !!anonInsert.error, "insert succeeded");
    const anonSees = await anon.from("completions").select("id");
    check("anon sees no completions", (anonSees.data?.length ?? 0) === 0, anonSees.data);
    const aStill = await admin.from("completions").select("id").eq("user_id", a.id);
    check("A's completion survived B's attempts", aStill.data?.length === 1, aStill.data);
    const aDelete = await a.client.from("completions").delete().eq("landmark_id", first).select();
    check("A can delete her own completion", aDelete.data?.length === 1, aDelete.error);
  } finally {
    for (const id of createdIds) {
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) console.error(`Could not delete test user ${id}: ${error.message}`);
    }
  }

  console.log(failures === 0 ? "\nAll RLS checks passed." : `\n${failures} RLS check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
