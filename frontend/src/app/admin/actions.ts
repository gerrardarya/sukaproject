"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client — service role bypasses RLS entirely
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteProduct(id: number) {
  // Fetch the product first to get its image_url
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete the product from the database
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Delete the image from storage if it belongs to our bucket
  if (product?.image_url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/images/`;

    if (product.image_url.startsWith(bucketPrefix)) {
      const fileName = product.image_url.replace(bucketPrefix, "");
      await supabaseAdmin.storage.from("images").remove([fileName]);
    }
  }
}

export async function toggleProductActive(id: number, is_active: boolean) {
  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_active: boolean;
}) {
  const { error } = await supabaseAdmin.from("products").insert([data]);
  if (error) throw new Error(error.message);
}

export async function updateProduct(
  id: string | string[] | undefined,
  data: {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    is_active: boolean;
  }
) {
  const { error } = await supabaseAdmin
    .from("products")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── Category Actions ─────────────────────────────────────────────

export async function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required");

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name: trimmed })
    .select("id, name")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("This category already exists");
    throw new Error(error.message);
  }

  return data as { id: number; name: string };
}

export async function deleteCategory(id: number) {
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── Banner Actions ───────────────────────────────────────────────

export async function deleteBanner(id: number) {
  const { data: banner } = await supabaseAdmin
    .from("banners")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (banner?.image_url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/images/`;
    if (banner.image_url.startsWith(bucketPrefix)) {
      const fileName = banner.image_url.replace(bucketPrefix, "");
      await supabaseAdmin.storage.from("images").remove([fileName]);
    }
  }
}

export async function toggleBannerActive(id: number, is_active: boolean) {
  const { error } = await supabaseAdmin
    .from("banners")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createBanner(data: {
  title: string;
  description: string;
  button_text: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}) {
  // Check for duplicate sort_order
  const { data: existing } = await supabaseAdmin
    .from("banners")
    .select("id")
    .eq("sort_order", data.sort_order)
    .maybeSingle();

  if (existing) {
    throw new Error(`Order #${data.sort_order} is already used by another banner. Please choose a different order.`);
  }

  const { error } = await supabaseAdmin.from("banners").insert([data]);
  if (error) throw new Error(error.message);
}

export async function updateBanner(
  id: string | string[] | undefined,
  data: {
    title: string;
    description: string;
    button_text: string;
    image_url: string;
    is_active: boolean;
    sort_order: number;
  }
) {
  // Check for duplicate sort_order, excluding the current banner
  const { data: existing } = await supabaseAdmin
    .from("banners")
    .select("id")
    .eq("sort_order", data.sort_order)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    throw new Error(`Order #${data.sort_order} is already used by another banner. Please choose a different order.`);
  }

  const { error } = await supabaseAdmin
    .from("banners")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderBanners(orderedIds: number[]) {
  // Two-phase update: park every banner on a temporary negative sort_order
  // first so the final values never collide if sort_order is unique.
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabaseAdmin
      .from("banners")
      .update({ sort_order: -(i + 1) })
      .eq("id", orderedIds[i]);
    if (error) throw new Error(error.message);
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabaseAdmin
      .from("banners")
      .update({ sort_order: i + 1 })
      .eq("id", orderedIds[i]);
    if (error) throw new Error(error.message);
  }
}

// ─── Client Actions ───────────────────────────────────────────────────

export async function createClient(data: {
  name: string;
  logo_url: string;
  is_active: boolean;
  sort_order: number;
}) {
  const { error } = await supabaseAdmin.from("clients").insert([data]);
  if (error) throw new Error(error.message);
}

export async function updateClient(
  id: string | string[] | undefined,
  data: {
    name: string;
    logo_url: string;
    is_active: boolean;
    sort_order: number;
  }
) {
  const { error } = await supabaseAdmin
    .from("clients")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteClient(id: number) {
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("logo_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (client?.logo_url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/images/`;
    if (client.logo_url.startsWith(bucketPrefix)) {
      const fileName = client.logo_url.replace(bucketPrefix, "");
      await supabaseAdmin.storage.from("images").remove([fileName]);
    }
  }
}

export async function toggleClientActive(id: number, is_active: boolean) {
  const { error } = await supabaseAdmin
    .from("clients")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── Testimonial Actions ────────────────────────────────────────────

export async function createTestimonial(data: {
  client_name: string;
  company: string;
  result_image_url: string;
  quote: string;
  result_text: string;
  is_active: boolean;
  sort_order: number;
}) {
  const { error } = await supabaseAdmin.from("testimonials").insert([data]);
  if (error) throw new Error(error.message);
}

export async function updateTestimonial(
  id: string | string[] | undefined,
  data: {
    client_name: string;
    company: string;
    result_image_url: string;
    quote: string;
    result_text: string;
    is_active: boolean;
    sort_order: number;
  }
) {
  const { data: existing } = await supabaseAdmin
    .from("testimonials")
    .select("result_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin
    .from("testimonials")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);

  const oldUrl = existing?.result_image_url as string | undefined;
  if (oldUrl && oldUrl !== data.result_image_url) {
    const fileName = bucketFileName(oldUrl);
    if (fileName) await supabaseAdmin.storage.from("images").remove([fileName]);
  }
}

export async function deleteTestimonial(id: number) {
  const { data: testimonial } = await supabaseAdmin
    .from("testimonials")
    .select("result_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (testimonial?.result_image_url) {
    const fileName = bucketFileName(testimonial.result_image_url);
    if (fileName) await supabaseAdmin.storage.from("images").remove([fileName]);
  }
}

export async function toggleTestimonialActive(id: number, is_active: boolean) {
  const { error } = await supabaseAdmin
    .from("testimonials")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ─── About page (`about_settings` single row + `team_members`, max 3) ──

const MAX_TEAM_MEMBERS = 3;

function bucketFileName(url: string): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/images/`;
  return url.startsWith(bucketPrefix) ? url.replace(bucketPrefix, "") : null;
}

export async function upsertAboutSettings(data: {
  mission_image_url: string;
  vision_image_url: string;
}) {
  const { data: existing } = await supabaseAdmin
    .from("about_settings")
    .select("id, mission_image_url, vision_image_url")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const payload = {
    mission_image_url: data.mission_image_url.trim(),
    vision_image_url: data.vision_image_url.trim(),
  };

  if (existing?.id != null) {
    const { error } = await supabaseAdmin
      .from("about_settings")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("about_settings")
      .insert(payload);
    if (error) throw new Error(error.message);
  }

  // Remove replaced images from storage
  for (const key of ["mission_image_url", "vision_image_url"] as const) {
    const oldUrl = existing?.[key] as string | undefined;
    if (oldUrl && oldUrl !== payload[key]) {
      const fileName = bucketFileName(oldUrl);
      if (fileName) await supabaseAdmin.storage.from("images").remove([fileName]);
    }
  }
}

export async function createTeamMember(data: {
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
}) {
  const { count, error: countError } = await supabaseAdmin
    .from("team_members")
    .select("id", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) >= MAX_TEAM_MEMBERS) {
    throw new Error(`You can only have up to ${MAX_TEAM_MEMBERS} team members.`);
  }

  const { error } = await supabaseAdmin.from("team_members").insert([data]);
  if (error) throw new Error(error.message);
}

export async function updateTeamMember(
  id: number,
  data: {
    name: string;
    description: string;
    image_url: string;
    sort_order: number;
  }
) {
  const { data: existing } = await supabaseAdmin
    .from("team_members")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin
    .from("team_members")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);

  const oldUrl = existing?.image_url as string | undefined;
  if (oldUrl && oldUrl !== data.image_url) {
    const fileName = bucketFileName(oldUrl);
    if (fileName) await supabaseAdmin.storage.from("images").remove([fileName]);
  }
}

export async function deleteTeamMember(id: number) {
  const { data: member } = await supabaseAdmin
    .from("team_members")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin
    .from("team_members")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (member?.image_url) {
    const fileName = bucketFileName(member.image_url);
    if (fileName) await supabaseAdmin.storage.from("images").remove([fileName]);
  }
}

// ─── WhatsApp popup settings (table `whatsapp_settings`, single row) ───

export async function upsertWhatsAppSettings(data: {
  greeting_message: string;
  prefilled_message: string;
}) {
  const { data: existing } = await supabaseAdmin
    .from("whatsapp_settings")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const payload = {
    greeting_message: data.greeting_message.trim(),
    prefilled_message: data.prefilled_message.trim(),
  };

  if (existing?.id != null) {
    const { error } = await supabaseAdmin
      .from("whatsapp_settings")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("whatsapp_settings")
      .insert(payload);
    if (error) throw new Error(error.message);
  }
}

// ─── Site popup (table `popups`, single row; expects primary key `id`) ─

export async function upsertPopup(data: {
  name: string;
  description: string;
  image_url: string;
}) {
  const { data: existing } = await supabaseAdmin
    .from("popups")
    .select("id, image_url")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const payload = {
    name: data.name.trim(),
    description: data.description.trim(),
    image_url: data.image_url.trim(),
  };

  if (existing?.id != null) {
    const { error } = await supabaseAdmin
      .from("popups")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin.from("popups").insert(payload);
    if (error) throw new Error(error.message);
  }

  const oldUrl = existing?.image_url as string | undefined;
  const newUrl = payload.image_url;
  if (oldUrl && newUrl && oldUrl !== newUrl) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const bucketPrefix = `${supabaseUrl}/storage/v1/object/public/images/`;
    if (oldUrl.startsWith(bucketPrefix)) {
      const fileName = oldUrl.replace(bucketPrefix, "");
      await supabaseAdmin.storage.from("images").remove([fileName]);
    }
  }
}
