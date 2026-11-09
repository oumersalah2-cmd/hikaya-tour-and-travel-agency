import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Storage layer (leads, gallery, settings, editable lists, uploaded photos).
 *
 * Two drivers, chosen automatically:
 *  - Redis (Upstash, via the Vercel Marketplace) when KV_REST_API_URL + KV_REST_API_TOKEN
 *    (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) are set. Required on Vercel,
 *    whose filesystem is read-only. Talks to Upstash's REST API with fetch (no extra package).
 *  - JSON files in DATA_DIR (default ./data) for local development or a VPS / Docker volume.
 *
 * The rest of the app only uses the exported functions.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);

const PREFIX = "hikaya:";
/** Upstash limits a single request body to ~1 MB; keep photos safely below that. */
const MAX_REDIS_UPLOAD_B64 = 900_000;

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`Redis error: ${data.error ?? res.status}`);
  return data.result as T;
}

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
  caption: { en: string; om: string; am?: string };
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
  if (usingRedis) {
    const raw = await redis<string | null>(["GET", `${PREFIX}file:${file}`]);
    return raw === null || raw === undefined ? fallback : (JSON.parse(raw) as T);
  }
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file: string, data: unknown) {
  if (usingRedis) {
    await redis(["SET", `${PREFIX}file:${file}`, JSON.stringify(data)]);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

/* ------------------------------- Leads ------------------------------- */

const LEADS_HASH = `${PREFIX}leads`;

export async function listLeads(): Promise<Lead[]> {
  if (usingRedis) {
    const flat = (await redis<string[]>(["HGETALL", LEADS_HASH])) ?? [];
    const leads: Lead[] = [];
    for (let i = 1; i < flat.length; i += 2) {
      try {
        leads.push(JSON.parse(flat[i]) as Lead);
      } catch {
        /* skip a corrupted entry instead of breaking the inbox */
      }
    }
    return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
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
  if (usingRedis) {
    await redis(["HSET", LEADS_HASH, lead.id, JSON.stringify(lead)]);
    return lead;
  }
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
  if (usingRedis) {
    const raw = await redis<string | null>(["HGET", LEADS_HASH, id]);
    if (!raw) return;
    await redis(["HSET", LEADS_HASH, id, JSON.stringify({ ...(JSON.parse(raw) as Lead), ...patch })]);
    return;
  }
  await locked(async () => {
    const leads = await readJson<Lead[]>("leads.json", []);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    Object.assign(lead, patch);
    await writeJson("leads.json", leads);
  });
}

export async function deleteLead(id: string) {
  if (usingRedis) {
    await redis(["HDEL", LEADS_HASH, id]);
    return;
  }
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
  if (usingRedis) {
    await redis(["DEL", `${PREFIX}file:${name}.json`]);
    return;
  }
  await locked(() => fs.rm(path.join(DATA_DIR, `${name}.json`), { force: true }));
}

export async function backupSnapshot() {
  const names = ["settings", "packages", "destinations", "testimonials", "faq", "gallery", "leads"];
  const out: Record<string, unknown> = {};
  for (const n of names) {
    try {
      out[n] = n === "leads" ? await listLeads() : await readJson<unknown>(`${n}.json`, null);
    } catch {
      out[n] = { error: "file could not be read (corrupted JSON)" };
    }
  }
  return out;
}

/* ------------------------------- Uploads ------------------------------- */
/* Admin-uploaded photos (already resized to WebP by the upload routes). */

const UPLOAD_NAME_RE = /^[a-f0-9-]{6,40}(-thumb)?\.webp$/;

export const isValidUploadName = (name: string) => UPLOAD_NAME_RE.test(name);

export async function saveUpload(name: string, data: Buffer) {
  if (!isValidUploadName(name)) throw new Error("invalid upload name");
  if (usingRedis) {
    const b64 = data.toString("base64");
    if (b64.length > MAX_REDIS_UPLOAD_B64) throw new Error("image too large after compression");
    await redis(["SET", `${PREFIX}upload:${name}`, b64]);
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), data);
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!isValidUploadName(name)) return null;
  if (usingRedis) {
    const b64 = await redis<string | null>(["GET", `${PREFIX}upload:${name}`]);
    return b64 ? Buffer.from(b64, "base64") : null;
  }
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

export async function deleteUpload(name: string) {
  if (!isValidUploadName(name)) return;
  if (usingRedis) {
    await redis(["DEL", `${PREFIX}upload:${name}`]);
    return;
  }
  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
}

/* ----------------------------- Rate limiting ----------------------------- */

const memoryCounters = new Map<string, { count: number; reset: number }>();

/**
 * Increments a counter that expires after `windowSeconds` and returns the new value.
 * Shared across serverless instances when Redis is configured, in-memory otherwise.
 * Fails open (returns 0) if the store is unreachable so visitors are never blocked by an outage.
 */
export async function bumpCounter(key: string, windowSeconds: number): Promise<number> {
  try {
    if (usingRedis) {
      const k = `${PREFIX}rl:${key}`;
      const n = await redis<number>(["INCR", k]);
      if (n === 1) await redis(["EXPIRE", k, windowSeconds]);
      return n;
    }
  } catch (error) {
    console.error("[ratelimit] store unavailable", error);
    return 0;
  }
  const now = Date.now();
  const entry = memoryCounters.get(key);
  if (!entry || entry.reset < now) {
    memoryCounters.set(key, { count: 1, reset: now + windowSeconds * 1000 });
    if (memoryCounters.size > 5000) {
      for (const [k, v] of memoryCounters) if (v.reset < now) memoryCounters.delete(k);
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

export async function readCounter(key: string): Promise<number> {
  try {
    if (usingRedis) return Number((await redis<string | null>(["GET", `${PREFIX}rl:${key}`])) ?? 0);
  } catch {
    return 0;
  }
  const entry = memoryCounters.get(key);
  return entry && entry.reset > Date.now() ? entry.count : 0;
}

export async function clearCounter(key: string) {
  try {
    if (usingRedis) await redis(["DEL", `${PREFIX}rl:${key}`]);
  } catch {
    /* ignore */
  }
  memoryCounters.delete(key);
}
