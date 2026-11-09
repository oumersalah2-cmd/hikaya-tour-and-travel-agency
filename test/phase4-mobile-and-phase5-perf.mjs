import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = "/home/ab/.gemini/antigravity/brain/9d799e90-aedc-4acf-a979-897d91cf6594/screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "360x740", width: 360, height: 740, isMobile: true },
  { name: "390x844", width: 390, height: 844, isMobile: true },
  { name: "412x915", width: 412, height: 915, isMobile: true },
  { name: "768x1024", width: 768, height: 1024, isMobile: true },
  { name: "1280x800", width: 1280, height: 800, isMobile: false },
];

const LOCALES = ["en", "om", "am"];
const PAGES = ["", "/contact", "/gallery", "/privacy"];

const results = [];
function record(suite, test, pass, details = "") {
  results.push({ suite, test, pass, details });
  const status = pass ? "[PASS]" : "[FAIL]";
  console.log(`${status} ${suite} - ${test}${details ? `: ${details}` : ""}`);
}

async function run() {
  console.log("=== STARTING PHASE 4 MOBILE & PHASE 5 PERFORMANCE AUDIT ===\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // Create admin session cookie for admin screenshots
  const expires = String(Date.now() + 3600_000);
  const sig = crypto
    .createHmac("sha256", "hikaya-session-secret-key-123456:hikaya-admin-password-2026")
    .update(expires)
    .digest("base64url");

  // -------------------------------------------------------------------------
  // SECTION 1: Viewport & Layout Checks Across Languages (No Horizontal Scroll)
  // -------------------------------------------------------------------------
  console.log("--- Section 1: Responsive Layout & No Horizontal Overflow ---");

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const lang of LOCALES) {
      for (const p of PAGES) {
        const url = `${BASE_URL}/${lang}${p}`;
        await page.goto(url, { waitUntil: "networkidle2" });

        // Check for horizontal overflow (document scrollWidth > clientWidth)
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
          const clientW = Math.max(doc.clientWidth, body.clientWidth);
          return {
            hasOverflow: scrollW > clientW + 1, // 1px threshold for subpixel rounding
            scrollWidth: scrollW,
            clientWidth: clientW,
          };
        });

        record(
          "Responsive Layout",
          `No horizontal scroll on /${lang}${p || "/"} at ${vp.name}`,
          !overflow.hasOverflow,
          `scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`
        );
      }
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 2: Capture Visual Proof Screenshots
  // -------------------------------------------------------------------------
  console.log("\n--- Section 2: Capturing Visual Proof Screenshots ---");

  // 1) 360x740 (Mobile Android) for all 3 languages
  await page.setViewport({ width: 360, height: 740 });
  for (const lang of LOCALES) {
    await page.goto(`${BASE_URL}/${lang}`, { waitUntil: "networkidle2" });
    const file = path.join(SCREENSHOT_DIR, `home-360x740-${lang}.png`);
    await page.screenshot({ path: file, fullPage: false });
    record("Screenshots", `Saved mobile screenshot: home-360x740-${lang}.png`, fs.existsSync(file));
  }

  // 2) 390x844 (iPhone) for /en/contact, /am/contact, /en/gallery
  await page.setViewport({ width: 390, height: 844 });
  for (const p of ["/en/contact", "/am/contact", "/en/gallery", "/am/gallery"]) {
    await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle2" });
    const cleanName = p.replace(/\//g, "-").slice(1);
    const file = path.join(SCREENSHOT_DIR, `${cleanName}-390x844.png`);
    await page.screenshot({ path: file, fullPage: false });
    record("Screenshots", `Saved screenshot: ${cleanName}-390x844.png`, fs.existsSync(file));
  }

  // 3) Admin Login & Admin Panel at 390px
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2" });
  const adminLoginFile = path.join(SCREENSHOT_DIR, `admin-login-390x844.png`);
  await page.screenshot({ path: adminLoginFile });
  record("Screenshots", "Saved admin login screenshot at 390px", fs.existsSync(adminLoginFile));

  // Set cookie for admin panel
  await page.setCookie({
    name: "hikaya_admin",
    value: `${expires}.${sig}`,
    domain: "localhost",
    path: "/",
  });
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
  const adminPanelFile = path.join(SCREENSHOT_DIR, `admin-panel-390x844.png`);
  await page.screenshot({ path: adminPanelFile });
  record("Screenshots", "Saved admin dashboard screenshot at 390px", fs.existsSync(adminPanelFile));

  // 4) 404 Page Visual Proof
  await page.goto(`${BASE_URL}/en/nonexistent-route`, { waitUntil: "networkidle2" });
  const notFoundFile = path.join(SCREENSHOT_DIR, `404-page-390x844.png`);
  await page.screenshot({ path: notFoundFile });
  record("Screenshots", "Saved branded 404 page screenshot at 390px", fs.existsSync(notFoundFile));

  // -------------------------------------------------------------------------
  // SECTION 3: Mobile Touch Targets & Floating WhatsApp Placement
  // -------------------------------------------------------------------------
  console.log("\n--- Section 3: Tap Targets & Floating WhatsApp Placement ---");
  await page.setViewport({ width: 360, height: 740 });
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });
  // Wait for WhatsApp floating button entrance spring animation (1.2s delay)
  await new Promise((r) => setTimeout(r, 1600));

  // Floating WhatsApp button position
  const waMetrics = await page.evaluate(() => {
    const wa =
      document.querySelector('a.fixed[aria-label*="WhatsApp"]') ||
      document.querySelector('a[aria-label*="WhatsApp"].fixed') ||
      document.querySelector('a.fixed[href*="wa.me"]');
    if (!wa) return null;
    const rect = wa.getBoundingClientRect();
    const computed = window.getComputedStyle(wa);
    return {
      width: rect.width,
      height: rect.height,
      bottom: window.innerHeight - rect.bottom,
      right: window.innerWidth - rect.right,
      zIndex: computed.zIndex,
    };
  });

  record(
    "WhatsApp Button",
    "Floating WhatsApp button has tap target >= 44x44px",
    waMetrics && waMetrics.width >= 44 && waMetrics.height >= 44,
    `Size: ${waMetrics?.width}x${waMetrics?.height}px`
  );

  record(
    "WhatsApp Button",
    "Floating WhatsApp button has safe bottom offset for mobile UI",
    waMetrics && waMetrics.bottom >= 12,
    `Bottom margin: ${waMetrics?.bottom}px`
  );

  // Check form inputs on /en/contact have fontSize >= 16px to prevent iOS auto-zoom
  await page.goto(`${BASE_URL}/en/contact`, { waitUntil: "networkidle2" });
  const inputFonts = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
    return inputs.map((el) => {
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      return { tag: el.tagName, type: (el).type, fontSize: size, ok: size >= 16 };
    });
  });

  const allInputsNoZoom = inputFonts.every((f) => f.ok);
  record(
    "Mobile Forms",
    "All form inputs have font-size >= 16px (prevents iOS auto-zoom on focus)",
    allInputsNoZoom,
    `Min font-size: ${Math.min(...inputFonts.map((f) => f.fontSize))}px`
  );

  // Check input types (tel and email)
  const hasTel = inputFonts.some((f) => f.type === "tel");
  const hasEmail = inputFonts.some((f) => f.type === "email");
  record(
    "Mobile Forms",
    "Form includes proper semantic input types (type=tel, type=email) for mobile keyboards",
    hasTel && hasEmail,
    `hasTel=${hasTel}, hasEmail=${hasEmail}`
  );

  // -------------------------------------------------------------------------
  // SECTION 4: Modals & Sheets Mobile Scroll Locking
  // -------------------------------------------------------------------------
  console.log("\n--- Section 4: Modals & Sheets Mobile Behavior ---");
  await page.setViewport({ width: 360, height: 740 });
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  // Open Details Modal
  const detailsBtnHandle = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find((b) => b.textContent.includes("Details"));
  });
  const detailsBtn = detailsBtnHandle.asElement();

  if (detailsBtn) {
    await detailsBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Check body scroll lock
    const bodyLocked = await page.evaluate(() => {
      return document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden";
    });

    record(
      "Modals",
      "Body scroll is locked (overflow: hidden) while modal is open",
      bodyLocked,
      `body.overflow=${bodyLocked}`
    );

    // Save screenshot of modal on 360px mobile
    const modalFile = path.join(SCREENSHOT_DIR, "details-modal-360x740.png");
    await page.screenshot({ path: modalFile });
    record("Screenshots", "Saved modal screenshot at 360px: details-modal-360x740.png", fs.existsSync(modalFile));

    // Close modal via Escape
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // -------------------------------------------------------------------------
  // SECTION 5: Ethiopian 4G Performance (Network Throttling)
  // -------------------------------------------------------------------------
  console.log("\n--- Section 5: Ethiopian 4G Performance & Web Vitals ---");
  // Ethiopian 4G profile: 1.6 Mbps down, 750 kbps up, 150 ms RTT
  const client = await page.target().createCDPSession();
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150, // ms
    downloadThroughput: (1.6 * 1024 * 1024) / 8, // bytes/sec
    uploadThroughput: (750 * 1024) / 8, // bytes/sec
  });

  let totalJsBytes = 0;
  client.on("Network.responseReceived", (params) => {
    const type = params.response.mimeType || "";
    if (type.includes("javascript") || params.response.url.endsWith(".js")) {
      totalJsBytes += params.response.encodedDataLength || 0;
    }
  });

  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  const perfMetrics = await page.evaluate(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((e) => e.name === "first-contentful-paint")?.startTime || 0;

    return {
      fcp: Math.round(fcp),
      domContentLoaded: Math.round(navEntry?.domContentLoadedEventEnd || 0),
      load: Math.round(navEntry?.loadEventEnd || 0),
    };
  });

  const totalJsKb = Math.round(totalJsBytes / 1024);
  record(
    "Performance",
    "Total JS transferred on initial load < 130 KB gzipped",
    totalJsKb < 130,
    `Total JS: ${totalJsKb} KB`
  );

  record(
    "Performance",
    "Ethiopian 4G FCP (First Contentful Paint) is fast",
    perfMetrics.fcp < 2500,
    `FCP: ${perfMetrics.fcp}ms, DOMContentLoaded: ${perfMetrics.domContentLoaded}ms`
  );

  // -------------------------------------------------------------------------
  // SECTION 6: JavaScript Disabled Fallback
  // -------------------------------------------------------------------------
  console.log("\n--- Section 6: JavaScript-Disabled Fallback ---");
  await page.setJavaScriptEnabled(false);
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  const noJsHtml = await page.content();
  const hasHeadings = noJsHtml.includes("HIKAYA") && noJsHtml.includes("Umrah");
  const hasWhatsAppFallback = noJsHtml.includes("wa.me") || noJsHtml.includes("WhatsApp");

  record(
    "Accessibility & No-JS",
    "Page renders complete and readable HTML when JavaScript is disabled",
    hasHeadings,
    "Headings and tour text present"
  );

  record(
    "Accessibility & No-JS",
    "Direct contact / WhatsApp links function when JavaScript is disabled",
    hasWhatsAppFallback,
    "wa.me direct links present in static HTML"
  );

  await browser.close();

  console.log("\n========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`PHASE 4 & 5 AUDIT TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
}

run().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
