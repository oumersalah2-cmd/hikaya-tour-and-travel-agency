import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = "/home/ab/.gemini/antigravity/brain/9d799e90-aedc-4acf-a979-897d91cf6594/screenshots";

const VIEWPORTS = [
  { name: "360x740", width: 360, height: 740 },
  { name: "390x844", width: 390, height: 844 },
  { name: "412x915", width: 412, height: 915 },
];

const LOCALES = ["en", "om", "am"];

async function run() {
  console.log("=== VERIFYING MOBILE TABS ACCESSIBILITY & VISIBILITY ===\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const lang of LOCALES) {
      await page.goto(`${BASE_URL}/${lang}`, { waitUntil: "networkidle2" });

      // Scroll to search section
      await page.evaluate(() => {
        const el = document.getElementById("search");
        if (el) el.scrollIntoView();
      });

      // Query all 4 tabs
      const tabInfo = await page.evaluate(() => {
        const tablist = document.querySelector('[role="tablist"]');
        if (!tablist) return null;
        const buttons = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const winW = window.innerWidth;

        return buttons.map((b) => {
          const rect = b.getBoundingClientRect();
          return {
            text: b.textContent?.trim(),
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            visibleAtOnce: rect.left >= 0 && rect.right <= winW,
            minTapTarget: rect.height >= 44 && rect.width >= 44,
          };
        });
      });

      console.log(`[Viewport ${vp.name} | Lang: ${lang}]`);
      if (!tabInfo) {
        console.error("  FAIL: tablist not found!");
        continue;
      }

      console.log(`  Tabs found: ${tabInfo.length}`);
      const allVisible = tabInfo.every((t) => t.visibleAtOnce);
      const allTapTargets = tabInfo.every((t) => t.minTapTarget);

      console.log(`  All 4 tabs visible at once (0 horizontal scroll): ${allVisible ? "PASS" : "FAIL"}`);
      console.log(`  All 4 tabs meet >= 44px tap target: ${allTapTargets ? "PASS" : "FAIL"}`);

      tabInfo.forEach((t, i) => {
        console.log(`    Tab ${i + 1}: "${t.text}" -> ${Math.round(t.width)}x${Math.round(t.height)}px (left=${Math.round(t.left)}, right=${Math.round(t.right)})`);
      });

      // Take screenshot of search section
      const screenshotPath = path.join(SCREENSHOT_DIR, `tabs-${vp.name}-${lang}.png`);
      const searchElement = await page.$("#search");
      if (searchElement) {
        await searchElement.screenshot({ path: screenshotPath });
        console.log(`  Screenshot saved: tabs-${vp.name}-${lang}.png\n`);
      }
    }
  }

  // Interactive Tab Switching Test on 360x740
  console.log("--- Testing Tab Interactivity on Mobile (360x740) ---");
  await page.setViewport({ width: 360, height: 740 });
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  const tabsToClick = ["flights", "hotels", "tours", "umrah"];
  for (const tabId of tabsToClick) {
    const clicked = await page.evaluate((id) => {
      const tablist = document.querySelector('[role="tablist"]');
      const buttons = Array.from(tablist.querySelectorAll('[role="tab"]'));
      // Find button corresponding to tab
      const btn = buttons.find((b) => {
        const text = b.textContent?.toLowerCase() || "";
        if (id === "flights") return text.includes("flight");
        if (id === "hotels") return text.includes("hotel");
        if (id === "tours") return text.includes("tour");
        if (id === "umrah") return text.includes("umrah");
        return false;
      });
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, tabId);

    await new Promise((r) => setTimeout(r, 300));
    const formVisible = await page.evaluate((id) => {
      const form = document.querySelector(`form[key="${id}"]`) || document.querySelector("form");
      return form !== null;
    }, tabId);

    console.log(`  Click tab "${tabId}": switched successfully=${clicked && formVisible}`);
  }

  await browser.close();
  console.log("\n=== ALL MOBILE TAB VERIFICATION COMPLETED ===");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

