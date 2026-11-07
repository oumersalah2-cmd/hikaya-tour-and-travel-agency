import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "hikaya_admin";
const SESSION_HOURS = 8;

const secret = () => {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
};

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && secret());

const sign = (value: string) =>
  crypto.createHmac("sha256", secret()!).update(value).digest("base64url");

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

/** Use at the top of every admin page / action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* Brute-force protection: 5 failed attempts / 15 min per IP (in-memory). */
const attempts = new Map<string, { count: number; reset: number }>();

export async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

export function isLocked(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.reset < Date.now()) return false;
  return entry.count >= 5;
}

export function recordFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.reset < Date.now()) {
    attempts.set(key, { count: 1, reset: Date.now() + 15 * 60_000 });
  } else {
    entry.count += 1;
  }
}

export const clearFailures = (key: string) => attempts.delete(key);
