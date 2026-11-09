import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { bumpCounter, clearCounter, readCounter } from "@/lib/store";

export const SESSION_COOKIE = "hikaya_admin";
const SESSION_HOURS = 8;

const secret = () => {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
};

export const adminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12 && secret());

/** The key also depends on ADMIN_PASSWORD, so rotating the password invalidates old sessions. */
const sign = (value: string) =>
  crypto
    .createHmac("sha256", `${secret()!}:${process.env.ADMIN_PASSWORD ?? ""}`)
    .update(value)
    .digest("base64url");

const sha = (value: string) => crypto.createHash("sha256").update(value).digest();

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return crypto.timingSafeEqual(sha(input), sha(expected));
}

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const value = String(expires);
  (await cookies()).set(SESSION_COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const expected = sign(expires);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(expires) > Date.now();
}

/** true when the request's Origin header (if any) matches the Host. Never throws. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Use at the top of every admin page / action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* Brute-force protection: 5 failed attempts / 15 min per IP (shared via Redis on Vercel). */
const LOGIN_WINDOW_S = 15 * 60;
const LOGIN_MAX = 5;
const loginKey = (key: string) => `login:${key}`;

export async function clientKey() {
  const h = await headers();
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function isLocked(key: string) {
  return (await readCounter(loginKey(key))) >= LOGIN_MAX;
}

export async function recordFailure(key: string) {
  await bumpCounter(loginKey(key), LOGIN_WINDOW_S);
}

export const clearFailures = (key: string) => clearCounter(loginKey(key));
