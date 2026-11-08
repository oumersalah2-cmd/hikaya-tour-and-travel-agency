"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, Eye, EyeOff, ArrowUp, ArrowDown, Trash2, Save, Loader2, AlertCircle } from "lucide-react";
import { deleteGalleryAction, moveGalleryAction, saveCaptionAction } from "@/app/admin/actions";
import type { GalleryItem } from "@/lib/store";

function Uploader() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(f.name));
    if (!list.length) {
      setMessage({ ok: false, text: "Please choose JPG, PNG or WebP images." });
      return;
    }
    setBusy(true);
    setMessage(null);
    const body = new FormData();
    list.forEach((f) => body.append("files", f));
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body });
      const data = (await res.json()) as { added?: number; failed?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const failed = data.failed ?? [];
      setMessage({
        ok: failed.length === 0,
        text: `${data.added} photo${data.added === 1 ? "" : "s"} uploaded.${failed.length ? ` Couldn’t process: ${failed.join(", ")} (use JPG, PNG or WebP under 15 MB).` : ""}`,
      });
      router.refresh();
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <section className="mb-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void upload(e.dataTransfer.files); }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-10 text-center transition-colors ${drag ? "border-accent-400 bg-accent-50" : "border-gray-200"}`}
      >
        {busy ? <Loader2 className="mb-3 h-10 w-10 animate-spin text-accent-500" /> : <UploadCloud className="mb-3 h-10 w-10 text-accent-500" aria-hidden="true" />}
        <p className="font-semibold">{busy ? "Uploading & optimizing…" : "Drag photos here, or"}</p>
        {!busy && (
          <button type="button" onClick={() => input.current?.click()} className="btn-primary mt-3 px-6 py-2.5 text-sm">
            Choose photos
          </button>
        )}
        <p className="mt-3 text-xs text-gray-400">JPG, PNG or WebP · up to 15 MB each · up to 20 at a time. Photos are resized and compressed automatically.</p>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => e.target.files && void upload(e.target.files)} />
      </div>
      {message && (
        <p role="status" className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {!message.ok && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          {message.text}
        </p>
      )}
    </section>
  );
}

function Card({ item, index, total }: { item: GalleryItem; index: number; total: number }) {
  const [en, setEn] = useState(item.caption.en);
  const [om, setOm] = useState(item.caption.om);
  const [am, setAm] = useState(item.caption.am || "");
  const [visible, setVisible] = useState(item.visible);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty =
    en !== item.caption.en ||
    om !== item.caption.om ||
    am !== (item.caption.am || "") ||
    visible !== item.visible;

  const save = () =>
    start(async () => {
      await saveCaptionAction(item.id, en, om, visible, am);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });

  const remove = () => {
    if (confirm("Delete this photo from the gallery? This cannot be undone.")) {
      start(() => deleteGalleryAction(item.id));
    }
  };

  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-primary-700 shadow transition hover:bg-white disabled:opacity-40";

  return (
    <li className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${visible ? "border-gray-100" : "border-amber-200"} ${pending ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={item.thumb}
          alt={en || "Gallery photo"}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className={`object-cover ${visible ? "" : "opacity-40 grayscale"}`}
        />
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">#{index + 1}</span>
        {!visible && <span className="absolute right-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-primary-900">Hidden</span>}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <button type="button" aria-label="Move earlier" disabled={index === 0 || pending} onClick={() => start(() => moveGalleryAction(item.id, "up"))} className={iconBtn}><ArrowUp className="h-4 w-4" /></button>
          <button type="button" aria-label="Move later" disabled={index === total - 1 || pending} onClick={() => start(() => moveGalleryAction(item.id, "down"))} className={iconBtn}><ArrowDown className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <label htmlFor={`en-${item.id}`} className="mb-1 block text-xs font-semibold text-gray-600">Caption (English)</label>
          <input id={`en-${item.id}`} value={en} maxLength={140} onChange={(e) => setEn(e.target.value)} className="form-input py-2 text-sm" />
        </div>
        <div>
          <label htmlFor={`om-${item.id}`} className="mb-1 block text-xs font-semibold text-gray-600">Caption (Afaan Oromoo)</label>
          <input id={`om-${item.id}`} value={om} maxLength={140} onChange={(e) => setOm(e.target.value)} className="form-input py-2 text-sm" />
        </div>
        <div>
          <label htmlFor={`am-${item.id}`} className="mb-1 block text-xs font-semibold text-gray-600">Caption (አማርኛ)</label>
          <input id={`am-${item.id}`} value={am} maxLength={140} onChange={(e) => setAm(e.target.value)} className="form-input py-2 text-sm" />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex gap-1">
            <button type="button" onClick={() => setVisible((v) => !v)} aria-pressed={visible} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
              {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {visible ? "Visible" : "Hidden"}
            </button>
            <button type="button" onClick={remove} aria-label="Delete photo" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span role="status" className="text-xs font-medium text-emerald-600">Saved ✓</span>}
            <button type="button" onClick={save} disabled={!dirty || pending} className="btn-primary px-4 py-1.5 text-sm"><Save className="h-4 w-4" /> Save</button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  return (
    <>
      <Uploader />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">
          {items.length} photo{items.length === 1 ? "" : "s"}
          <span className="ml-2 text-sm font-normal text-gray-400">{items.filter((i) => i.visible).length} visible on the website</span>
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">No photos yet — upload some above.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item, i) => <Card key={item.id} item={item} index={i} total={items.length} />)}
        </ul>
      )}
    </>
  );
}
