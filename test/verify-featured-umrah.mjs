import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/home/ab/.gemini/antigravity/brain/9d799e90-aedc-4acf-a979-897d91cf6594/screenshots";
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    // 1. Test Afaan Oromoo
    console.log("Loading http://localhost:3001/om ...");
    await page.goto("http://localhost:3001/om", { waitUntil: "networkidle2" });

    // Scroll to #packages
    await page.evaluate(() => {
      document.getElementById("packages")?.scrollIntoView();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture packages section
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "packages-om-mobile.png") });
    console.log("Saved packages-om-mobile.png");

    // Click on the Details button of the first card
    const detailsButtons = await page.$$("button");
    let clicked = false;
    for (const btn of detailsButtons) {
      const text = await (await btn.getProperty("textContent")).jsonValue();
      if (text.includes("Bal'ina") || text.includes("Details")) {
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (clicked) {
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, "modal-umrah-om-mobile.png") });
      console.log("Saved modal-umrah-om-mobile.png");
    }

    // 2. Test English Desktop
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("http://localhost:3001/en", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      document.getElementById("packages")?.scrollIntoView();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "packages-en-desktop.png") });
    console.log("Saved packages-en-desktop.png");

    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

