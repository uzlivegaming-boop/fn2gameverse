import { useState, type FormEvent } from "react";
import { CATEGORIES, COUNTRIES, PLATFORMS } from "@/data/games";
import { Button, Field, SafeImage } from "@/components/ui-kit";
import type { GameInput } from "@/services/store";
import type { Category, Platform } from "@/types";

type Errors = Partial<Record<keyof GameInput, string>>;

export function validateGame(v: GameInput): Errors {
  const e: Errors = {};
  if (v.title.trim().length < 2) e.title = "Title must be at least 2 characters.";
  if (v.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
  if (!/^(https?:\/\/|data:image\/)/.test(v.cover)) e.cover = "Provide an image URL or upload a file.";
  if (!(v.rating >= 1 && v.rating <= 5)) e.rating = "Rating must be between 1 and 5.";
  if (v.website && !/^https?:\/\/\S+\.\S+/.test(v.website)) e.website = "Enter a valid URL starting with http(s)://";
  return e;
}

const EMPTY: GameInput = {
  title: "", description: "", cover: "", category: "Action", country: COUNTRIES[0], platform: "PC", rating: 4, website: "",
};

export function GameForm({ initial, submitLabel, onSubmit }: {
  initial?: GameInput; submitLabel: string; onSubmit: (v: GameInput) => void;
}) {
  const [v, setV] = useState<GameInput>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const up = <K extends keyof GameInput>(k: K, val: GameInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) return setErrors((e) => ({ ...e, cover: "Image must be under 1.5 MB." }));
    const r = new FileReader();
    r.onload = () => up("cover", String(r.result));
    r.readAsDataURL(file);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateGame(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    try { onSubmit({ ...v, title: v.title.trim(), description: v.description.trim(), website: v.website?.trim() || undefined }); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_280px]" noValidate>
      <div className="card-surface space-y-5 p-5 md:p-7">
        <Field label="Title" error={errors.title}>
          <input className="field" value={v.title} onChange={(e) => up("title", e.target.value)} placeholder="e.g. Neon Protocol" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea className="field min-h-32" value={v.description} onChange={(e) => up("description", e.target.value)} placeholder="What makes this game special?" />
        </Field>
        <Field label="Cover image URL" error={errors.cover}>
          <input className="field" value={v.cover.startsWith("data:") ? "(uploaded file)" : v.cover} onChange={(e) => up("cover", e.target.value)} placeholder="https://..." />
        </Field>
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="block text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Category">
            <select className="field" value={v.category} onChange={(e) => up("category", e.target.value as Category)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Country">
            <select className="field" value={v.country} onChange={(e) => up("country", e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Platform">
            <select className="field" value={v.platform} onChange={(e) => up("platform", e.target.value as Platform)}>
              {PLATFORMS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={`Rating: ${v.rating.toFixed(1)}`} error={errors.rating}>
            <input type="range" min={1} max={5} step={0.1} value={v.rating} onChange={(e) => up("rating", Number(e.target.value))} className="mt-3 w-full accent-primary" />
          </Field>
          <Field label="Website URL (optional)" error={errors.website}>
            <input className="field" value={v.website ?? ""} onChange={(e) => up("website", e.target.value)} placeholder="https://..." />
          </Field>
        </div>
        <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Saving…" : submitLabel}
        </Button>
      </div>
      <aside>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Cover preview</p>
        <div className="card-surface aspect-[3/4] overflow-hidden">
          {v.cover ? <SafeImage src={v.cover} alt="Cover preview" /> : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">Add an image to see a preview</div>
          )}
        </div>
      </aside>
    </form>
  );
}
