"use server";

import { createClient } from "@supabase/supabase-js";

// Server-only client — service role bypasses RLS entirely
const supabaseAdmin = createClient(
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
