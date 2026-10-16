import type { SupabaseClient } from "@supabase/supabase-js";

// The signed-in visitor's rows in public.completions. RLS limits every query
// to their own rows; the user_id filters below only make that explicit.

export async function fetchCompletions(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("completions")
    .select("landmark_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.landmark_id as string);
}

// Upserts that ignore duplicates (ON CONFLICT DO NOTHING), so marking a
// landmark that's already marked, here or on another device, is harmless.
export async function addCompletion(supabase: SupabaseClient, userId: string, landmarkId: string) {
  const { error } = await supabase
    .from("completions")
    .upsert(
      { user_id: userId, landmark_id: landmarkId },
      { onConflict: "user_id,landmark_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export async function removeCompletion(supabase: SupabaseClient, userId: string, landmarkId: string) {
  const { error } = await supabase
    .from("completions")
    .delete()
    .eq("user_id", userId)
    .eq("landmark_id", landmarkId);
  if (error) throw error;
}

// The one-time copy of the browser's list into the account. Safe to run any
// number of times, in several tabs at once, or again after a failure: rows
// that already exist are left alone. Ids of landmarks that no longer exist
// are skipped, so one stale id can't fail the whole batch on the foreign key.
// Returns how many landmarks were new to the account.
export async function importLocalVisits(
  supabase: SupabaseClient,
  userId: string,
  localIds: readonly string[],
  accountIds: ReadonlySet<string>,
): Promise<number> {
  const unique = [...new Set(localIds)];
  if (unique.length === 0) return 0;
  const { data, error } = await supabase.from("landmarks").select("id").in("id", unique);
  if (error) throw error;
  const known = (data ?? []).map((row) => row.id as string);
  if (known.length > 0) {
    const { error: upsertError } = await supabase.from("completions").upsert(
      known.map((landmarkId) => ({ user_id: userId, landmark_id: landmarkId })),
      { onConflict: "user_id,landmark_id", ignoreDuplicates: true },
    );
    if (upsertError) throw upsertError;
  }
  return known.filter((id) => !accountIds.has(id)).length;
}
