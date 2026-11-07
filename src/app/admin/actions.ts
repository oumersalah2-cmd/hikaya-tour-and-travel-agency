"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminConfigured,
  clearFailures,
  clientKey,
  endSession,
  isLocked,
  passwordMatches,
  recordFailure,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import { changeGallery } from "@/lib/gallery";
import { deleteLead, resetContent, updateLead, writeContent, UPLOAD_DIR, type LeadStatus } from "@/lib/store";
import { sanitizeSettings } from "@/lib/content";
import { COLLECTION_NAMES, sanitizeItems, type CollectionName } from "@/lib/collections";
import { locales } from "@/lib/i18n";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET." };
  }
  const key = await clientKey();
  if (isLocked(key)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    recordFailure(key);
    return { error: "Incorrect password." };
  }
  clearFailures(key);
  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/* -------------------------------- Leads ------------------------------- */

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export async function saveLeadAction(id: string, status: LeadStatus, notes: string) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  await updateLead(id, { status, notes: notes.slice(0, 2000) });
  revalidatePath("/admin", "layout");
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await deleteLead(id);
  revalidatePath("/admin", "layout");
}

/* ------------------------------- Gallery ------------------------------ */

function refreshPublicGallery() {
  for (const lang of locales) {
    revalidatePath(`/${lang}`);
    revalidatePath(`/${lang}/gallery`);
  }
  revalidatePath("/admin/gallery");
}

export async function saveCaptionAction(id: string, en: string, om: string, visible: boolean) {
  await requireAdmin();
  await changeGallery((items) =>
    items.map((item) =>
      item.id === id
        ? { ...item, caption: { en: en.trim().slice(0, 140), om: om.trim().slice(0, 140) }, visible }
        : item
    )
  );
  refreshPublicGallery();
}

export async function moveGalleryAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  await changeGallery((items) => {
    const i = items.findIndex((item) => item.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= items.length) return items;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  refreshPublicGallery();
}

export async function deleteGalleryAction(id: string) {
  await requireAdmin();
  let removed: { src: string; thumb: string; builtin?: boolean } | undefined;
  await changeGallery((items) => {
    removed = items.find((item) => item.id === id);
    return items.filter((item) => item.id !== id);
  });
  if (removed && !removed.builtin) {
    for (const url of [removed.src, removed.thumb]) {
      const file = path.basename(url);
      await fs.rm(path.join(UPLOAD_DIR, file), { force: true });
    }
  }
  refreshPublicGallery();
}

/* --------------------------- Site content / settings --------------------------- */

function refreshWholeSite() {
  for (const lang of locales) revalidatePath(`/${lang}`, "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}

export async function saveSettingsAction(input: unknown): Promise<SaveResult> {
  await requireAdmin();
  try {
    await writeContent("settings", sanitizeSettings(input));
    refreshWholeSite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] saving settings failed", error);
    return { ok: false, error: "Could not save. Check that the server can write to its data folder." };
  }
}

export async function resetSettingsAction(): Promise<SaveResult> {
  await requireAdmin();
  await resetContent("settings");
  refreshWholeSite();
  return { ok: true };
}

export async function saveCollectionAction(name: string, items: unknown): Promise<SaveResult> {
  await requireAdmin();
  if (!COLLECTION_NAMES.includes(name as CollectionName)) return { ok: false, error: "Unknown list." };
  try {
    await writeContent(name, sanitizeItems(name as CollectionName, items));
    refreshWholeSite();
    return { ok: true };
  } catch (error) {
    console.error(`[admin] saving ${name} failed`, error);
    return { ok: false, error: "Could not save. Check that the server can write to its data folder." };
  }
}

export async function resetCollectionAction(name: string): Promise<SaveResult> {
  await requireAdmin();
  if (!COLLECTION_NAMES.includes(name as CollectionName)) return { ok: false, error: "Unknown list." };
  await resetContent(name);
  refreshWholeSite();
  return { ok: true };
}
