"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { resetCollectionAction, saveCollectionAction } from "@/app/admin/actions";
import { blankItem, type CollectionSchema, type Field, type Item, type L10n, type L10nLines } from "@/lib/collections";

export interface LibraryImage {
  src: string;
  label: string;
}

const emptyL10n: L10n = { en: "", om: "" };
const emptyLines: L10nLines = { en: [], om: [] };

/* ------------------------------ Image picker ------------------------------ */

function ImagePicker({
  value,
  onChange,
  library,
}: {
  value: string;
  onChange: (src: string) => void;
  library: LibraryImage[];
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { src?: string; error?: string };
      if (!res.ok || !data.src) throw new Error(data.error || "Upload failed");
      onChange(data.src);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          {value ? (
            <Image src={value} alt="" fill unoptimized sizes="176px" className="object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-gray-400">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-accent-400 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {busy ? "Uploading…" : "Upload photo"}
          </button>
          <button
            type="button"
            onClick={() => setShowLibrary((v) => !v)}
            aria-expanded={showLibrary}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-accent-400"
          >
            <Images className="h-4 w-4" /> Choose from library
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" /> Remove
            </button>
          )}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Best size: landscape, at least 1200 × 800 px. JPG, PNG or WebP up to 15 MB — resized automatically.
        {!value && " With no photo, a neutral placeholder is shown on the website."}
      </p>
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      {showLibrary && (
        <ul className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-4 lg:grid-cols-6">
          {library.map((img) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => {
                  onChange(img.src);
                  setShowLibrary(false);
                }}
                className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-lg ring-2 transition ${
                  value === img.src ? "ring-accent-400" : "ring-transparent hover:ring-accent-300"
                }`}
                title={img.label}
              >
                <Image src={img.src} alt={img.label} fill unoptimized sizes="160px" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-0.5 text-left text-[10px] text-white">
                  {img.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ Field editor ------------------------------ */

const inputCls = "form-input py-2.5 text-sm";

function FieldEditor({
  field,
  item,
  onChange,
  library,
  idPrefix,
}: {
  field: Field;
  item: Item;
  onChange: (key: string, value: unknown) => void;
  library: LibraryImage[];
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.key}`;
  const value = item[field.key];

  const label = (text: string, htmlFor?: string) => (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-gray-600">
      {text}
      {field.required && <span className="text-red-500"> *</span>}
    </label>
  );

  if (field.type === "image") {
    return (
      <div>
        {label(field.label)}
        <ImagePicker value={String(value ?? "")} onChange={(v) => onChange(field.key, v)} library={library} />
      </div>
    );
  }

  if (field.type === "bool") {
    return (
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-[#d4a84b]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {label(field.label, id)}
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(field.key, e.target.value)} className={inputCls}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        {label(field.label, id)}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={typeof value === "number" ? value : 0}
          onChange={(e) => onChange(field.key, e.target.value === "" ? 0 : Number(e.target.value))}
          className={inputCls}
        />
        {field.help && <p className="mt-1 text-xs text-gray-400">{field.help}</p>}
      </div>
    );
  }

  if (field.type === "lines") {
    const lines = (v: unknown) => (Array.isArray(v) ? (v as string[]).join("\n") : "");
    const toArr = (s: string) => s.split("\n");
    if (field.localized) {
      const v = (value as L10nLines | undefined) ?? emptyLines;
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {(["en", "om"] as const).map((l) => (
            <div key={l}>
              {label(`${field.label} (${l === "en" ? "English" : "Afaan Oromoo"})`, `${id}-${l}`)}
              <textarea
                id={`${id}-${l}`}
                rows={5}
                value={lines(v[l])}
                onChange={(e) => onChange(field.key, { ...v, [l]: toArr(e.target.value) })}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        {label(field.label, id)}
        <textarea id={id} rows={5} value={lines(value)} onChange={(e) => onChange(field.key, toArr(e.target.value))} className={inputCls} />
      </div>
    );
  }

  // text / textarea
  // Plain function (not a component) so inputs keep focus while typing
  const control = (val: string, set: (s: string) => void, suffix: string) =>
    field.type === "textarea" ? (
      <textarea
        id={`${id}${suffix}`}
        rows={4}
        maxLength={field.max}
        value={val}
        onChange={(e) => set(e.target.value)}
        className={inputCls}
      />
    ) : (
      <input
        id={`${id}${suffix}`}
        type="text"
        maxLength={field.max}
        placeholder={field.placeholder}
        value={val}
        onChange={(e) => set(e.target.value)}
        className={inputCls}
      />
    );

  if (field.localized) {
    const v = (value as L10n | undefined) ?? emptyL10n;
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          {label(`${field.label} (English)`, `${id}-en`)}
          {control(v.en, (s) => onChange(field.key, { ...v, en: s }), "-en")}
        </div>
        <div>
          {label(`${field.label} (Afaan Oromoo)`, `${id}-om`)}
          {control(v.om, (s) => onChange(field.key, { ...v, om: s }), "-om")}
          <p className="mt-1 text-xs text-gray-400">If empty, the English text is shown.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {label(field.label, id)}
      {control(String(value ?? ""), (s) => onChange(field.key, s), "")}
    </div>
  );
}

/* ---------------------------------- Manager ---------------------------------- */

const titleOf = (schema: CollectionSchema, item: Item) => {
  const v = item[schema.titleField];
  const text = typeof v === "object" && v !== null ? (v as L10n).en : String(v ?? "");
  return text || `Untitled ${schema.singular}`;
};

const subtitleOf = (schema: CollectionSchema, item: Item) => {
  if (!schema.subtitleField) return "";
  const v = item[schema.subtitleField];
  return typeof v === "object" && v !== null ? (v as L10n).en : String(v ?? "");
};

function missingRequired(schema: CollectionSchema, item: Item): string[] {
  return schema.fields
    .filter((f) => f.required)
    .filter((f) => {
      const v = item[f.key];
      if (f.localized) return !((v as L10n | undefined)?.en ?? "").trim();
      return !String(v ?? "").trim();
    })
    .map((f) => f.label);
}

export default function CollectionManager({
  schema,
  initialItems,
  library,
  isCustom,
}: {
  schema: CollectionSchema;
  initialItems: Item[];
  library: LibraryImage[];
  isCustom: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [saved, setSaved] = useState(() => JSON.stringify(initialItems));
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = useMemo(() => JSON.stringify(items) !== saved, [items, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const patch = (id: string, key: string, value: unknown) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  const move = (index: number, dir: -1 | 1) =>
    setItems((list) => {
      const j = index + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const add = () => {
    const item = blankItem(schema.name);
    setItems((list) => [...list, item]);
    setOpenId(item.id);
    setMessage(null);
  };

  const duplicate = (item: Item) => {
    const copy: Item = JSON.parse(JSON.stringify(item));
    copy.id = `${schema.name}-${Math.random().toString(36).slice(2, 9)}`;
    setItems((list) => {
      const i = list.findIndex((x) => x.id === item.id);
      const next = [...list];
      next.splice(i + 1, 0, copy);
      return next;
    });
    setOpenId(copy.id);
  };

  const remove = (item: Item) => {
    if (confirm(`Delete “${titleOf(schema, item)}”? It disappears from the website after you press Save.`)) {
      setItems((list) => list.filter((x) => x.id !== item.id));
    }
  };

  const save = () => {
    const incomplete = items.map((it) => ({ it, missing: missingRequired(schema, it) })).find((x) => x.missing.length);
    if (incomplete) {
      setOpenId(incomplete.it.id);
      setMessage({ ok: false, text: `Please fill in: ${incomplete.missing.join(", ")} (for “${titleOf(schema, incomplete.it)}”).` });
      return;
    }
    start(async () => {
      const res = await saveCollectionAction(schema.name, items);
      if (res.ok) {
        setSaved(JSON.stringify(items));
        setMessage({ ok: true, text: "Saved — the website is updated." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: res.error ?? "Could not save." });
      }
    });
  };

  const reset = () => {
    if (!confirm("Restore the original built-in content? Your changes to this list will be lost.")) return;
    start(async () => {
      const res = await resetCollectionAction(schema.name);
      if (res.ok) {
        // reload so the editor shows the built-in defaults again
        window.location.reload();
      } else setMessage({ ok: false, text: res.error ?? "Could not reset." });
    });
  };

  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:opacity-30";

  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-primary-700">{items.length}</span> {schema.singular}
          {items.length === 1 ? "" : "s"} · {items.filter((i) => i.visible).length} visible
          {dirty && <span className="ml-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Unsaved changes</span>}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {isCustom && (
            <button type="button" onClick={reset} disabled={pending} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
              <RotateCcw className="h-4 w-4" /> Restore originals
            </button>
          )}
          <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:border-accent-400">
            <Plus className="h-4 w-4" /> Add {schema.singular}
          </button>
          <button type="button" onClick={save} disabled={!dirty || pending} className="btn-primary px-5 py-2 text-sm">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`mb-5 flex items-start gap-2 rounded-xl p-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
        >
          {!message.ok && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          {message.text}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          Nothing here yet — press “Add {schema.singular}”.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const open = openId === item.id;
            const image = schema.imageField ? String(item[schema.imageField] ?? "") : "";
            const needs = missingRequired(schema, item).length > 0;
            return (
              <li key={item.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${item.visible ? "border-gray-100" : "border-amber-200"}`}>
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  {schema.imageField && (
                    <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                      {image && <Image src={image} alt="" fill unoptimized sizes="80px" className={`object-cover ${item.visible ? "" : "opacity-40 grayscale"}`} />}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate font-semibold">{titleOf(schema, item)}</p>
                    <p className="truncate text-sm text-gray-500">
                      {subtitleOf(schema, item) || " "}
                      {!item.visible && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">Hidden</span>}
                      {needs && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">Needs attention</span>}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center">
                    <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} className={iconBtn}>
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)} className={iconBtn}>
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={item.visible ? "Hide from website" : "Show on website"}
                      aria-pressed={item.visible}
                      onClick={() => patch(item.id, "visible", !item.visible)}
                      className={iconBtn}
                    >
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button type="button" aria-label="Edit" onClick={() => setOpenId(open ? null : item.id)} className={iconBtn}>
                      <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="space-y-5 border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {schema.fields.map((f) => {
                        const span = f.half && !f.localized ? "" : "sm:col-span-2";
                        return (
                          <div key={f.key} className={span}>
                            <FieldEditor
                              field={f}
                              item={item}
                              onChange={(k, v) => patch(item.id, k, v)}
                              library={library}
                              idPrefix={`${item.id}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 border-t border-gray-100 pt-4">
                      <button type="button" onClick={() => duplicate(item)} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <Copy className="h-4 w-4" /> Duplicate
                      </button>
                      <button type="button" onClick={() => remove(item)} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
