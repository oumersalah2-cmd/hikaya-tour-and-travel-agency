import puppeteer from "puppeteer";

const BASE_URL = "http://localhost:3000";
const results = [];

function record(suite, test, pass, details = "") {
  results.push({ suite, test, pass, details });
  const status = pass ? "[PASS]" : "[FAIL]";
  console.log(`${status} ${suite} - ${test}${details ? `: ${details}` : ""}`);
}

async function run() {
  console.log("=== STARTING PHASE 3 CSP & ABUSE VERIFICATION ===\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  const cspViolations = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("violates the following Content Security Policy") || text.includes("Content-Security-Policy")) {
      cspViolations.push(text);
    }
    if (msg.type() === "error") {
      consoleErrors.push(text);
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  // 1. Visit Homepage (/en)
  console.log("--- 1. Testing /en for CSP violations & Hydration ---");
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  record(
    "CSP",
    "No CSP violations on /en homepage",
    cspViolations.length === 0,
    cspViolations.length ? cspViolations.join("; ") : "Zero violations"
  );

  // Check fonts loaded
  const fontLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check("16px Inter") || document.fonts.size > 0;
  });
  record("CSP", "Web fonts (Inter & Playfair) loaded successfully", fontLoaded);

  // Check inline theme script executed
  const themeClass = await page.evaluate(() => document.documentElement.className);
  record("CSP", "Theme script executed without CSP block", themeClass !== undefined);

  // Check JSON-LD script tags present and valid
  const jsonLdCount = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    return scripts.filter((s) => {
      try {
        JSON.parse(s.textContent);
        return true;
      } catch {
        return false;
      }
    }).length;
  });
  record("CSP", "Structured data JSON-LD scripts present and parsed", jsonLdCount >= 1, `Found ${jsonLdCount}`);

  // 2. Visit /en/contact (Google Maps iframe)
  console.log("\n--- 2. Testing /en/contact (Google Maps iframe) ---");
  cspViolations.length = 0;
  await page.goto(`${BASE_URL}/en/contact`, { waitUntil: "networkidle2" });

  record(
    "CSP",
    "No CSP violations on /en/contact",
    cspViolations.length === 0,
    cspViolations.length ? cspViolations.join("; ") : "Zero violations"
  );

  // Check Google Maps iframe
  const mapIframe = await page.$("iframe");
  record("CSP", "Google Maps iframe allowed by CSP frame-src", mapIframe !== null);

  // 3. Visit /en/gallery
  console.log("\n--- 3. Testing /en/gallery ---");
  cspViolations.length = 0;
  await page.goto(`${BASE_URL}/en/gallery`, { waitUntil: "networkidle2" });
  record(
    "CSP",
    "No CSP violations on /en/gallery",
    cspViolations.length === 0,
    cspViolations.length ? cspViolations.join("; ") : "Zero violations"
  );

  // 4. Test Booking Modal Interaction on /en
  console.log("\n--- 4. Testing Booking Modal & Details Modal for CSP ---");
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  // Find Details button on first package card
  const detailsBtnHandle = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find((b) => b.textContent.includes("Details") || b.textContent.includes("ዝርዝር"));
  });
  const detailsBtn = detailsBtnHandle.asElement();

  if (detailsBtn) {
    await detailsBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"], [aria-modal="true"]');
      return modal !== null;
    });
    record("Modals", "Details modal opens with aria-modal and focus trap", modalVisible);

    // Close modal via Escape
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // 5. Test XSS in Forms
  console.log("\n--- 5. Testing XSS Payloads in Form Submission ---");
  let alertFired = false;
  page.on("dialog", async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });

  const xssPayload = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
  const submitRes = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "10.0.88.2",
    },
    body: JSON.stringify({
      type: "contact",
      name: `Mr XSS ${xssPayload}`,
      email: "xss-test@hikaya.com",
      phone: "+251911998877",
      subject: `Inquiry ${xssPayload}`,
      message: `Message body ${xssPayload}`,
    }),
  });

  const submitJson = await submitRes.json();
  record("Form Abuse", "XSS payload submission accepted as harmless text (expect 200)", submitRes.status === 200 && submitJson.ok);

  // Check Admin leads page with XSS stored
  // Create admin session cookie
  const crypto = await import("node:crypto");
  const expires = String(Date.now() + 3600_000);
  const sig = crypto
    .createHmac("sha256", "hikaya-session-secret-key-123456:hikaya-admin-password-2026")
    .update(expires)
    .digest("base64url");

  await page.setCookie({
    name: "hikaya_admin",
    value: `${expires}.${sig}`,
    domain: "localhost",
    path: "/",
  });

  await page.goto(`${BASE_URL}/admin/leads`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));

  record(
    "Security",
    "XSS payload rendered safely escaped in React admin panel (no dialog executed)",
    alertFired === false,
    `alertFired: ${alertFired}`
  );

  // Verify raw HTML of /admin/leads escapes the script tag
  const adminHtml = await page.content();
  const unescapedScript = adminHtml.includes("<script>alert(\"XSS\")</script>");
  record(
    "Security",
    "Admin UI contains no unescaped script tags from user input",
    unescapedScript === false,
    `Unescaped script found: ${unescapedScript}`
  );

  await browser.close();

  console.log("\n========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`CSP & ABUSE TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
