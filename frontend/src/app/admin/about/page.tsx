"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  upsertAboutSettings,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../actions";
import AdminSidebar from "../components/AdminSidebar";
import { Save, Upload, X, Plus, Trash2, Users, ImageIcon } from "lucide-react";

const MAX_TEAM_MEMBERS = 3;

type TeamMember = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

// ── Reusable image picker box ──────────────────────────────────────────
function ImagePicker({
  label,
  preview,
  onFile,
  onRemove,
  aspect = "aspect-[4/5]",
}: {
  label: string;
  preview: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-3">{label}</p>
      <div
        className={`relative ${aspect} rounded-xl overflow-hidden border border-border/40 bg-[#f8f7f4]`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              unoptimized={preview.startsWith("blob:")}
              sizes="300px"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted hover:text-red-500 shadow-sm transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-muted hover:text-accent shadow-sm transition-all duration-200"
            >
              <Upload className="w-3 h-3" />
              Replace
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full gap-2 cursor-pointer hover:bg-accent/5 transition-colors duration-200 group"
          >
            <Upload className="w-6 h-6 text-border group-hover:text-accent transition-colors duration-200" />
            <p className="text-xs text-muted/60 group-hover:text-accent transition-colors duration-200 font-medium">
              Click to upload
            </p>
            <p className="text-[10px] text-muted/40">PNG, JPG, WEBP</p>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}

// ── Team member card (existing or draft) ───────────────────────────────
function TeamMemberCard({
  member,
  sortOrder,
  onSaved,
  onRemoved,
}: {
  member: TeamMember | null;
  sortOrder: number;
  onSaved: () => void;
  onRemoved: () => void;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [description, setDescription] = useState(member?.description ?? "");
  const [preview, setPreview] = useState(member?.image_url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let image_url = file ? "" : preview;
      if (file) image_url = await uploadImage(file);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        image_url,
        sort_order: sortOrder,
      };

      if (member) {
        await updateTeamMember(member.id, payload);
      } else {
        await createTeamMember(payload);
      }
      setFile(null);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save member");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (member) {
      if (!confirm(`Delete team member "${member.name}"?`)) return;
      setDeleting(true);
      try {
        await deleteTeamMember(member.id);
        onRemoved();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete");
        setDeleting(false);
      }
    } else {
      onRemoved();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border/40 p-5 shadow-sm space-y-4">
      <ImagePicker
        label={member ? "Photo" : "Photo (new member)"}
        preview={preview}
        aspect="aspect-square"
        onFile={(f) => {
          setFile(f);
          setPreview(URL.createObjectURL(f));
        }}
        onRemove={() => {
          setFile(null);
          setPreview("");
        }}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Suka Pratiwi"
          className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Founder & Creative Director"
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-[#f8f7f4] text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 transition-all duration-200 disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              {member ? "Save" : "Add"}
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2.5 rounded-xl border border-border/50 text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 disabled:opacity-40"
        >
          {deleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────
export default function AboutSettingsPage() {
  const [loading, setLoading] = useState(true);

  // Mission / vision / showroom images
  const [missionPreview, setMissionPreview] = useState("");
  const [visionPreview, setVisionPreview] = useState("");
  const [showroomPreview, setShowroomPreview] = useState("");
  const [missionFile, setMissionFile] = useState<File | null>(null);
  const [visionFile, setVisionFile] = useState<File | null>(null);
  const [showroomFile, setShowroomFile] = useState<File | null>(null);
  const [savingImages, setSavingImages] = useState(false);
  const [imagesError, setImagesError] = useState("");
  const [imagesSaved, setImagesSaved] = useState(false);

  // Team
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [draftCount, setDraftCount] = useState(0);

  const fetchAll = async () => {
    const [{ data: settings }, { data: team }] = await Promise.all([
      supabase
        .from("about_settings")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
    ]);

    setMissionPreview(settings?.mission_image_url ?? "");
    setVisionPreview(settings?.vision_image_url ?? "");
    setShowroomPreview(settings?.showroom_image_url ?? "");
    setMissionFile(null);
    setVisionFile(null);
    setShowroomFile(null);
    setMembers(team ?? []);
    setDraftCount(0);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSaveImages = async () => {
    setSavingImages(true);
    setImagesError("");
    setImagesSaved(false);
    try {
      let mission_image_url = missionFile ? "" : missionPreview;
      let vision_image_url = visionFile ? "" : visionPreview;
      let showroom_image_url = showroomFile ? "" : showroomPreview;
      if (missionFile) mission_image_url = await uploadImage(missionFile);
      if (visionFile) vision_image_url = await uploadImage(visionFile);
      if (showroomFile) showroom_image_url = await uploadImage(showroomFile);

      await upsertAboutSettings({ mission_image_url, vision_image_url, showroom_image_url });
      setMissionFile(null);
      setVisionFile(null);
      setShowroomFile(null);
      setMissionPreview(mission_image_url);
      setVisionPreview(vision_image_url);
      setShowroomPreview(showroom_image_url);
      setImagesSaved(true);
    } catch (err) {
      setImagesError(
        err instanceof Error ? err.message : "Failed to save images"
      );
    }
    setSavingImages(false);
  };

  const totalCards = members.length + draftCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <AdminSidebar />
        <main className="ml-64 p-8 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">About Page</h1>
          <p className="text-sm text-muted mt-1">
            Manage the images and team shown on the About Us page
          </p>
        </div>

        {/* ── Mission & Vision images ── */}
        <section className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Site Images
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
            <ImagePicker
              label="Our Mission image"
              preview={missionPreview}
              onFile={(f) => {
                setMissionFile(f);
                setMissionPreview(URL.createObjectURL(f));
                setImagesSaved(false);
              }}
              onRemove={() => {
                setMissionFile(null);
                setMissionPreview("");
                setImagesSaved(false);
              }}
            />
            <ImagePicker
              label="Our Vision image"
              preview={visionPreview}
              onFile={(f) => {
                setVisionFile(f);
                setVisionPreview(URL.createObjectURL(f));
                setImagesSaved(false);
              }}
              onRemove={() => {
                setVisionFile(null);
                setVisionPreview("");
                setImagesSaved(false);
              }}
            />
            <ImagePicker
              label="Showroom image (homepage &ldquo;Find Us Online&rdquo; section)"
              preview={showroomPreview}
              onFile={(f) => {
                setShowroomFile(f);
                setShowroomPreview(URL.createObjectURL(f));
                setImagesSaved(false);
              }}
              onRemove={() => {
                setShowroomFile(null);
                setShowroomPreview("");
                setImagesSaved(false);
              }}
            />
          </div>

          {imagesError && (
            <p className="text-sm text-red-500 mt-4">{imagesError}</p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSaveImages}
              disabled={savingImages}
              className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 hover:shadow-md transition-all duration-300 disabled:opacity-60"
            >
              {savingImages ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Images
                </>
              )}
            </button>
            {imagesSaved && (
              <span className="text-sm text-green-600">Saved ✓</span>
            )}
          </div>
        </section>

        {/* ── Team members ── */}
        <section className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Team Members
              </h2>
              <span className="text-xs text-muted">
                ({members.length}/{MAX_TEAM_MEMBERS})
              </span>
            </div>
            {totalCards < MAX_TEAM_MEMBERS && (
              <button
                onClick={() => setDraftCount((c) => c + 1)}
                className="inline-flex items-center gap-2 border border-border/60 text-muted px-4 py-2 rounded-xl text-sm font-medium hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>

          {totalCards === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-muted/30 mb-3" />
              <p className="text-muted font-medium text-sm">No team members yet</p>
              <p className="text-xs text-muted/70 mt-1">
                Add up to {MAX_TEAM_MEMBERS} members to show on the About page
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, i) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  sortOrder={i + 1}
                  onSaved={fetchAll}
                  onRemoved={fetchAll}
                />
              ))}
              {Array.from({ length: draftCount }).map((_, i) => (
                <TeamMemberCard
                  key={`draft-${i}`}
                  member={null}
                  sortOrder={members.length + i + 1}
                  onSaved={fetchAll}
                  onRemoved={() => setDraftCount((c) => Math.max(0, c - 1))}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
