"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@repo/supabase/server";

export async function toggleMessageRead(formData: FormData) {
  const id = String(formData.get("id") || "");
  const value = formData.get("value") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("contact_messages").update({ is_read: value }).eq("id", id);
  revalidatePath("/messages");
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/messages");
}
