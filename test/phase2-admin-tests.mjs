import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const ADMIN_PASSWORD = "hikaya-admin-password-2026";
const SESSION_SECRET = "hikaya-session-secret-key-123456";

const results = [];

function record(suite, test, pass, details = "") {
  results.push({ suite, test, pass, details });
  const status = pass ? "[PASS]" : "[FAIL]";
  console.log(`${status} ${suite} - ${test}${details ? `: ${details}` : ""}`);
}

function makeSessionCookie(password = ADMIN_PASSWORD, secret = SESSION_SECRET, offsetMs = 8 * 3600_000) {
  const expires = String(Date.now() + offsetMs);
  const signature = crypto
    .createHmac("sha256", `${secret}:${password}`)
    .update(expires)
    .digest("base64url");
  return `hikaya_admin=${expires}.${signature}`;
}

async function request(urlPath, options = {}) {
  const headers = { ...options.headers };
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, text, json };
}

async function run() {
  console.log("=== STARTING PHASE 2 ADMIN & CONTENT TESTS ===\n");

  // ----------------------------------------------------
  // TEST 1: Admin Password & Session Token Verification
  // ----------------------------------------------------
  console.log("--- Test 1: Admin Auth Cookie & Direct API Access ---");

  // Valid session cookie
  const validCookie = makeSessionCookie();
  const resBackupValid = await request("/api/admin/backup", {
    headers: { cookie: validCookie },
  });
  record(
    "Admin Auth",
    "Access /api/admin/backup with valid session cookie (expect 200)",
    resBackupValid.status === 200,
    `Status ${resBackupValid.status}`
  );

  // Invalid signature cookie
  const invalidCookie = "hikaya_admin=" + Date.now() + ".invalidsignature";
  const resBackupInvalid = await request("/api/admin/backup", {
    headers: { cookie: invalidCookie },
  });
  record(
    "Admin Auth",
    "Access /api/admin/backup with forged cookie (expect 401)",
    resBackupInvalid.status === 401,
    `Status ${resBackupInvalid.status}`
  );

  // Expired cookie
  const expiredCookie = makeSessionCookie(ADMIN_PASSWORD, SESSION_SECRET, -10_000);
  const resBackupExpired = await request("/api/admin/backup", {
    headers: { cookie: expiredCookie },
  });
  record(
    "Admin Auth",
    "Access /api/admin/backup with expired cookie (expect 401)",
    resBackupExpired.status === 401,
    `Status ${resBackupExpired.status}`
  );

  // ----------------------------------------------------
  // TEST 2: Leads CSV Export & Spreadsheet Formula Protection
  // ----------------------------------------------------
  console.log("\n--- Test 2: CSV Export & Formula Protection ---");

  // First submit a lead containing Amharic characters AND a formula injection payload
  const formulaPayload = "=cmd|' /C calc'!A0";
  const amharicName = "አበበ በቀለ እና ፋጢማ ሁሴን";
  await request("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.99.1",
    },
    body: JSON.stringify({
      type: "booking",
      name: amharicName,
      email: "abebe@example.com",
      phone: "+251911223344",
      package: "የቪአይፒ ኡምራ ጥቅል (VIP Umrah)",
      message: formulaPayload,
    }),
  });

  const resExport = await request("/api/admin/leads/export", {
    headers: { cookie: validCookie },
  });

  record(
    "CSV Export",
    "GET /api/admin/leads/export returns 200 and text/csv",
    resExport.status === 200 && resExport.headers.get("content-type")?.includes("text/csv"),
    `Status ${resExport.status}, Content-Type: ${resExport.headers.get("content-type")}`
  );

  // Check UTF-8 BOM from raw bytes
  const rawExportRes = await fetch(`${BASE_URL}/api/admin/leads/export`, {
    headers: { cookie: validCookie },
  });
  const exportBytes = Buffer.from(await rawExportRes.arrayBuffer());
  const hasBOM = exportBytes[0] === 0xEF && exportBytes[1] === 0xBB && exportBytes[2] === 0xBF;
  record(
    "CSV Export",
    "CSV includes UTF-8 BOM (0xEF 0xBB 0xBF) for Excel Amharic compatibility",
    hasBOM,
    `First 3 bytes: 0x${exportBytes[0].toString(16)} 0x${exportBytes[1].toString(16)} 0x${exportBytes[2].toString(16)}`
  );

  // Check Amharic text is preserved
  const hasAmharic = resExport.text.includes(amharicName);
  record(
    "CSV Export",
    "Amharic text is preserved accurately in CSV",
    hasAmharic,
    `Found name: ${hasAmharic}`
  );

  // Check formula injection is safely neutralized with leading single quote: '=cmd|...
  const hasNeutralizedFormula = resExport.text.includes("'" + formulaPayload);
  record(
    "CSV Export",
    "Formula injection payload is neutralized with leading quote ('=cmd...)",
    hasNeutralizedFormula,
    `Formula properly escaped: ${hasNeutralizedFormula}`
  );

  // ----------------------------------------------------
  // TEST 3: Backup Download
  // ----------------------------------------------------
  console.log("\n--- Test 3: Backup Download ---");
  const backupJson = resBackupValid.json;
  const hasSections =
    backupJson &&
    typeof backupJson === "object" &&
    Object.prototype.hasOwnProperty.call(backupJson, "settings") &&
    Object.prototype.hasOwnProperty.call(backupJson, "packages") &&
    Object.prototype.hasOwnProperty.call(backupJson, "faq") &&
    Object.prototype.hasOwnProperty.call(backupJson, "testimonials") &&
    Object.prototype.hasOwnProperty.call(backupJson, "gallery") &&
    Object.prototype.hasOwnProperty.call(backupJson, "leads") &&
    Array.isArray(backupJson.leads);

  record(
    "Backup API",
    "Backup snapshot contains settings, packages, faq, testimonials, gallery, leads",
    Boolean(hasSections),
    `Keys: ${Object.keys(backupJson || {}).join(", ")}, Leads: ${backupJson?.leads?.length}`
  );

  // ----------------------------------------------------
  // TEST 4: File Upload Security & Processing (/api/admin/upload)
  // ----------------------------------------------------
  console.log("\n--- Test 4: File Upload Security & Compression ---");

  // A) Valid JPG upload
  const sampleJpg = fs.readFileSync("public/images/destinations/sof-omar.jpg");
  const formValidJpg = new FormData();
  formValidJpg.append("file", new Blob([sampleJpg], { type: "image/jpeg" }), "test-photo.jpg");

  const resUploadJpg = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: BASE_URL,
    },
    body: formValidJpg,
  });
  const jsonUploadJpg = await resUploadJpg.json();

  record(
    "Upload API",
    "Valid JPG upload returns 200, webp src and thumb",
    resUploadJpg.status === 200 && jsonUploadJpg.src?.endsWith(".webp") && jsonUploadJpg.thumb?.endsWith(".webp"),
    `Status ${resUploadJpg.status}, src=${jsonUploadJpg.src}, thumb=${jsonUploadJpg.thumb}`
  );

  // Verify the newly uploaded webp can be fetched via /uploads/...
  if (jsonUploadJpg.src) {
    const resServeUpload = await request(jsonUploadJpg.src);
    record(
      "Uploads Serving",
      `GET ${jsonUploadJpg.src} serves uploaded WebP file (expect 200, image/webp)`,
      resServeUpload.status === 200 && resServeUpload.headers.get("content-type")?.includes("image/webp"),
      `Status ${resServeUpload.status}, Content-Type: ${resServeUpload.headers.get("content-type")}`
    );
  }

  // B) Valid PNG upload
  const samplePng = fs.readFileSync("public/images/logo-emblem.png");
  const formValidPng = new FormData();
  formValidPng.append("file", new Blob([samplePng], { type: "image/png" }), "emblem.png");

  const resUploadPng = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: BASE_URL,
    },
    body: formValidPng,
  });
  const jsonUploadPng = await resUploadPng.json();

  record(
    "Upload API",
    "Valid PNG upload returns 200 and converts to WebP",
    resUploadPng.status === 200 && jsonUploadPng.src?.endsWith(".webp"),
    `Status ${resUploadPng.status}, src=${jsonUploadPng.src}`
  );

  // C) Fake .jpg that is really plain text
  const formFakeJpg = new FormData();
  formFakeJpg.append("file", new Blob(["NOT AN IMAGE AT ALL - PLAIN TEXT MALICIOUS CONTENT"], { type: "image/jpeg" }), "fake.jpg");

  const resUploadFake = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: BASE_URL,
    },
    body: formFakeJpg,
  });
  const jsonUploadFake = await resUploadFake.json().catch(() => ({}));

  record(
    "Upload API",
    "Fake .jpg text file is rejected (expect 422)",
    resUploadFake.status === 422,
    `Status ${resUploadFake.status}, error=${jsonUploadFake.error}`
  );

  // D) Oversized image: 20 MB image (expect 413)
  const hugeBuffer = Buffer.alloc(20 * 1024 * 1024, 0);
  const formHuge = new FormData();
  formHuge.append("file", new Blob([hugeBuffer], { type: "image/jpeg" }), "huge-20mb.jpg");

  const resUploadHuge = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: BASE_URL,
    },
    body: formHuge,
  });
  const jsonUploadHuge = await resUploadHuge.json().catch(() => ({}));

  record(
    "Upload API",
    "20 MB image upload is rejected with HTTP 413 (Payload Too Large)",
    resUploadHuge.status === 413,
    `Status ${resUploadHuge.status}, error=${jsonUploadHuge.error}`
  );

  // E) CSRF protection: request with foreign origin header (expect 403 Forbidden)
  const formCsrf = new FormData();
  formCsrf.append("file", new Blob([sampleJpg], { type: "image/jpeg" }), "csrf-test.jpg");
  const resCsrf = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: "http://malicious-attacker-site.com",
    },
    body: formCsrf,
  });
  record(
    "Upload API",
    "Cross-origin upload request is rejected with HTTP 403 (sameOrigin check)",
    resCsrf.status === 403,
    `Status ${resCsrf.status}`
  );

  // ----------------------------------------------------
  // TEST 5: Gallery API (/api/admin/gallery)
  // ----------------------------------------------------
  console.log("\n--- Test 5: Gallery Upload & Management ---");
  const formGallery = new FormData();
  formGallery.append("files", new Blob([sampleJpg], { type: "image/jpeg" }), "gallery-sof-omar.jpg");

  const resGallery = await fetch(`${BASE_URL}/api/admin/gallery`, {
    method: "POST",
    headers: {
      cookie: validCookie,
      origin: BASE_URL,
    },
    body: formGallery,
  });
  const jsonGallery = await resGallery.json();

  record(
    "Gallery API",
    "Gallery upload adds photo and returns added: 1",
    resGallery.status === 200 && jsonGallery.added === 1,
    `Status ${resGallery.status}, added=${jsonGallery.added}`
  );

  console.log("\n========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`PHASE 2 (PART 2) TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
