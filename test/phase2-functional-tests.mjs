import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "http://localhost:3000";

async function postJson(endpoint, data, headers = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, text, json };
}

async function get(endpoint, headers = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "GET",
    headers,
    redirect: "manual",
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, text, json };
}

async function run() {
  console.log("=== STARTING PHASE 2 FUNCTIONAL TESTS ===\n");
  const results = [];

  function record(area, test, pass, evidence) {
    results.push({ area, test, pass, evidence });
    console.log(`[${pass ? "PASS" : "FAIL"}] ${area} - ${test}: ${evidence}`);
  }

  // ----------------------------------------------------
  // SECTION 1: Contact API & Form Validation
  // ----------------------------------------------------
  console.log("\n--- Section 1: /api/contact Form Validations ---");

  // Non-JSON body
  const resNonJson = await postJson("/api/contact", "not a json string at all", {
    "x-forwarded-for": "10.0.1.1",
  });
  record(
    "Contact API",
    "Non-JSON body (expect 400)",
    resNonJson.status === 400 && resNonJson.json?.error === "invalid_json",
    `Status ${resNonJson.status}, error=${resNonJson.json?.error}`
  );

  // Body over 20 KB
  const hugeBody = {
    type: "contact",
    name: "Abebe",
    email: "test@example.com",
    subject: "Test",
    message: "A".repeat(25000),
  };
  const resHuge = await postJson("/api/contact", hugeBody, {
    "x-forwarded-for": "10.0.1.2",
  });
  record(
    "Contact API",
    "Body over 20 KB (expect 413)",
    resHuge.status === 413 && resHuge.json?.error === "payload_too_large",
    `Status ${resHuge.status}, error=${resHuge.json?.error}`
  );

  // Invalid email
  const resBadEmail = await postJson(
    "/api/contact",
    {
      type: "contact",
      name: "Chala",
      email: "not-an-email",
      subject: "Inquiry",
      message: "Hello world",
    },
    { "x-forwarded-for": "10.0.1.3" }
  );
  record(
    "Contact API",
    "Invalid email format (expect 422 invalid_email)",
    resBadEmail.status === 422 && resBadEmail.json?.error === "invalid_email",
    `Status ${resBadEmail.status}, error=${resBadEmail.json?.error}`
  );

  // Missing fields for contact
  const resMissing = await postJson(
    "/api/contact",
    {
      type: "contact",
      name: "",
      email: "valid@example.com",
    },
    { "x-forwarded-for": "10.0.1.4" }
  );
  record(
    "Contact API",
    "Missing required name (expect 422 name_required)",
    resMissing.status === 422 && resMissing.json?.error === "name_required",
    `Status ${resMissing.status}, error=${resMissing.json?.error}`
  );

  // Honeypot field filled
  const resHoney = await postJson(
    "/api/contact",
    {
      type: "contact",
      name: "Spam Bot",
      email: "bot@spam.com",
      subject: "Buy links",
      message: "spam message",
      website: "http://spam-link.ru",
    },
    { "x-forwarded-for": "10.0.1.5" }
  );
  record(
    "Contact API",
    "Honeypot filled (expect 200 ok, silent drop)",
    resHoney.status === 200 && resHoney.json?.ok === true,
    `Status ${resHoney.status}, ok=${resHoney.json?.ok}`
  );

  // Valid submissions for all 3 types
  const resValidContact = await postJson(
    "/api/contact",
    {
      type: "contact",
      name: "Kalkidan Bekele",
      email: "kalkidan@hikaya.com",
      phone: "+251911445566",
      subject: "Umrah Inquiry for Parents",
      message: "Please send quote for December 2026 Umrah.",
    },
    { "x-forwarded-for": "10.0.1.6" }
  );
  record(
    "Contact API",
    "Valid contact form submission (expect 200 ok)",
    resValidContact.status === 200 && resValidContact.json?.ok === true,
    `Status ${resValidContact.status}, ok=${resValidContact.json?.ok}`
  );

  const resValidBooking = await postJson(
    "/api/contact",
    {
      type: "booking",
      name: "Mohammed Jemal",
      phone: "+251922889900",
      email: "mohammed@example.com",
      package: "VIP Luxury Umrah",
      travelers: "4",
      preferredDates: "2026-12",
      message: "Quad room requested.",
    },
    { "x-forwarded-for": "10.0.1.7" }
  );
  record(
    "Contact API",
    "Valid booking modal submission (expect 200 ok)",
    resValidBooking.status === 200 && resValidBooking.json?.ok === true,
    `Status ${resValidBooking.status}, ok=${resValidBooking.json?.ok}`
  );

  const resValidNews = await postJson(
    "/api/contact",
    {
      type: "newsletter",
      email: "newsletter.subscriber@example.com",
    },
    { "x-forwarded-for": "10.0.1.8" }
  );
  record(
    "Contact API",
    "Valid newsletter submission (expect 200 ok)",
    resValidNews.status === 200 && resValidNews.json?.ok === true,
    `Status ${resValidNews.status}, ok=${resValidNews.json?.ok}`
  );

  // Rate Limiting: 9 rapid submits from same IP (expect 429 on 9th)
  const rateLimitIP = "192.168.100.99";
  let got429 = false;
  let statusOn9th = null;
  for (let i = 1; i <= 9; i++) {
    const res = await postJson(
      "/api/contact",
      {
        type: "contact",
        name: `User ${i}`,
        email: `user${i}@example.com`,
        subject: `Sub ${i}`,
        message: "Quick message",
      },
      { "x-forwarded-for": rateLimitIP }
    );
    if (i === 9) {
      statusOn9th = res.status;
      got429 = res.status === 429;
    }
  }
  record(
    "Contact API",
    "9 rapid submits (expect HTTP 429 on 9th)",
    got429,
    `9th submit returned status ${statusOn9th}`
  );

  // ----------------------------------------------------
  // SECTION 2: Direct Access & Route Protection
  // ----------------------------------------------------
  console.log("\n--- Section 2: Security & Unauthenticated Route Access ---");

  const resAdminDirect = await get("/admin");
  record(
    "Admin Auth",
    "Direct GET /admin without session (expect 307 redirect to /admin/login)",
    resAdminDirect.status === 307 &&
      resAdminDirect.headers.get("location")?.includes("/admin/login"),
    `Status ${resAdminDirect.status}, Location: ${resAdminDirect.headers.get(
      "location"
    )}`
  );

  const resAdminApiBackup = await get("/api/admin/backup");
  record(
    "Admin Auth",
    "Direct GET /api/admin/backup without session (expect 401 Unauthorized)",
    resAdminApiBackup.status === 401,
    `Status ${resAdminApiBackup.status}`
  );

  const resAdminApiExport = await get("/api/admin/leads/export");
  record(
    "Admin Auth",
    "Direct GET /api/admin/leads/export without session (expect 401 Unauthorized)",
    resAdminApiExport.status === 401,
    `Status ${resAdminApiExport.status}`
  );

  const resAdminApiUpload = await postJson("/api/admin/upload", {});
  record(
    "Admin Auth",
    "Direct POST /api/admin/upload without session (expect 401 Unauthorized)",
    resAdminApiUpload.status === 401,
    `Status ${resAdminApiUpload.status}`
  );

  const resAdminApiGallery = await postJson("/api/admin/gallery", {});
  record(
    "Admin Auth",
    "Direct POST /api/admin/gallery without session (expect 401 Unauthorized)",
    resAdminApiGallery.status === 401,
    `Status ${resAdminApiGallery.status}`
  );

  // ----------------------------------------------------
  // SECTION 3: /uploads/ Directory Traversal & Serving
  // ----------------------------------------------------
  console.log("\n--- Section 3: /uploads/<file> Route & Path Traversal ---");

  const resUploadInvalid = await get("/uploads/invalid-file-name.exe");
  record(
    "Uploads Route",
    "Invalid upload file name (expect 404)",
    resUploadInvalid.status === 404,
    `Status ${resUploadInvalid.status}`
  );

  const resUploadTraversal1 = await get("/uploads/..%2F..%2Fetc%2Fpasswd");
  record(
    "Uploads Route",
    "Path traversal attempt ../.. (expect 404)",
    resUploadTraversal1.status === 404,
    `Status ${resUploadTraversal1.status}`
  );

  const resUploadTraversal2 = await get("/uploads/package.json");
  record(
    "Uploads Route",
    "Access arbitrary file package.json (expect 404)",
    resUploadTraversal2.status === 404,
    `Status ${resUploadTraversal2.status}`
  );

  // ----------------------------------------------------
  // SECTION 4: Routing, SEO, Manifest, Sitemap, Robots
  // ----------------------------------------------------
  console.log("\n--- Section 4: Routing, Languages & SEO Tags ---");

  const resEn = await get("/en");
  record(
    "Routing",
    "GET /en returns 200",
    resEn.status === 200 && resEn.text.includes("lang=\"en\""),
    `Status ${resEn.status}, html lang=en detected`
  );

  const resOm = await get("/om");
  record(
    "Routing",
    "GET /om returns 200",
    resOm.status === 200 && resOm.text.includes("lang=\"om\""),
    `Status ${resOm.status}, html lang=om detected`
  );

  const resAm = await get("/am");
  record(
    "Routing",
    "GET /am returns 200",
    resAm.status === 200 && resAm.text.includes("lang=\"am\""),
    `Status ${resAm.status}, html lang=am detected`
  );

  const resRoot = await get("/");
  record(
    "Routing",
    "GET / routes to localized homepage (expect 200 or 307)",
    resRoot.status === 200 || resRoot.status === 307 || resRoot.status === 308,
    `Status ${resRoot.status}`
  );

  const resInvalidLang = await get("/xx");
  record(
    "Routing",
    "GET /xx invalid language (expect 404)",
    resInvalidLang.status === 404,
    `Status ${resInvalidLang.status}`
  );

  const resRobots = await get("/robots.txt");
  record(
    "SEO",
    "GET /robots.txt exists and disallows /admin",
    resRobots.status === 200 && resRobots.text.includes("Disallow: /admin"),
    `Status ${resRobots.status}, contains Disallow: /admin`
  );

  const resSitemap = await get("/sitemap.xml");
  record(
    "SEO",
    "GET /sitemap.xml returns valid XML sitemap",
    resSitemap.status === 200 && resSitemap.text.includes("<urlset"),
    `Status ${resSitemap.status}, urlset found`
  );

  const resManifest = await get("/manifest.webmanifest");
  record(
    "PWA",
    "GET /manifest.webmanifest returns valid JSON",
    resManifest.status === 200 && resManifest.text.includes("HIKAYA"),
    `Status ${resManifest.status}`
  );

  // Check SEO canonical + hreflang tags on /en (case-insensitive for HTML / React 19 hrefLang)
  const lowerEn = resEn.text.toLowerCase();
  const hasHreflangEn = lowerEn.includes('hreflang="en"') || resEn.text.includes('hrefLang="en"');
  const hasHreflangOm = lowerEn.includes('hreflang="om"') || resEn.text.includes('hrefLang="om"');
  const hasHreflangAm = lowerEn.includes('hreflang="am"') || resEn.text.includes('hrefLang="am"');
  const hasCanonical = lowerEn.includes('rel="canonical"');
  const hasOG = lowerEn.includes('property="og:title"');
  record(
    "SEO Tags",
    "Canonical, hreflang (en, om, am), Open Graph tags present on /en",
    hasHreflangEn && hasHreflangOm && hasHreflangAm && hasCanonical && hasOG,
    `hreflang(en=${hasHreflangEn}, om=${hasHreflangOm}, am=${hasHreflangAm}), canonical=${hasCanonical}, og=${hasOG}`
  );

  console.log("\n========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("========================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
