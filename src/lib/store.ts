import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Tiny JSON-file store (leads + gallery). Files live in DATA_DIR (default ./data)
 * and are written atomically. Works on any host with a persistent disk (VPS,
 * Docker volume, Railway/Render disk…). On serverless hosts (e.g. Vercel) the
 * disk is read-only/ephemeral — swap this module for a database there; the rest
 * of the app only uses the exported functions.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export type LeadType = "contact" | "booking" | "newsletter";
export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  package: string;
  travelers: string;
  preferredDates: string;
  notes: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  caption: { en: string; om: string };
  visible: boolean;
  /** true when the file ships in /public (cannot be deleted from disk) */
  builtin?: boolean;
  createdAt: string;
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialises writes so concurrent requests can't clobber each other. */
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

/* ------------------------------- Leads ------------------------------- */

export async function listLeads(): Promise<Lead[]> {
  const leads = await readJson<Lead[]>("leads.json", []);
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(
  input: Partial<Omit<Lead, "id" | "status" | "notes" | "createdAt">> & {
    type: LeadType;
    email: string;
  }
): Promise<Lead> {
  const lead: Lead = {
    id: crypto.randomUUID(),
    status: "new",
    notes: "",
    createdAt: new Date().toISOString(),
    name: "",
    phone: "",
    subject: "",
    message: "",
    package: "",
    travelers: "",
    preferredDates: "",
    ...input,
  };
  await locked(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    leads.push(lead);
    await writeJson("leads.json", leads);
  });
  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "status" | "notes">>
) {
  await locked(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    Object.assign(lead, patch);
    await writeJson("leads.json", leads);
  });
}

export async function deleteLead(id: string) {
  await locked(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    await writeJson("leads.json", leads.filter((l) => l.id !== id));
  });
}

/* ------------------------------ Gallery ------------------------------ */

export async function listGallery(defaults: GalleryItem[]): Promise<GalleryItem[]> {
  return readJson<GalleryItem[]>("gallery.json", defaults);
}

export async function mutateGallery(
  defaults: GalleryItem[],
  fn: (items: GalleryItem[]) => GalleryItem[] | Promise<GalleryItem[]>
) {
  await locked(async () => {
    const items = await readJson<GalleryItem[]>("gallery.json", defaults);
    await writeJson("gallery.json", await fn(items));
  });
}

/* ------------------------- Generic content files ------------------------- */
/* Used for site settings and the editable lists (packages, FAQ, …). */

export async function readContent<T>(name: string, fallback: T): Promise<T> {
  return readJson<T>(`${name}.json`, fallback);
}

export async function writeContent(name: string, data: unknown) {
  await locked(() => writeJson(`${name}.json`, data));
}

/** Deleting the saved file makes the website fall back to the built-in defaults. */
export async function resetContent(name: string) {
  await locked(() => fs.rm(path.join(DATA_DIR, `${name}.json`), { force: true }));
}

export async function backupSnapshot() {
  const names = ["settings", "packages", "destinations", "testimonials", "faq", "gallery", "leads"];
  const out: Record<string, unknown> = {};
  for (const n of names) {
    try {
      out[n] = await readJson<unknown>(`${n}.json`, null);
    } catch {
      out[n] = { error: "file could not be read (corrupted JSON)" };
    }
  }
  return out;
}
