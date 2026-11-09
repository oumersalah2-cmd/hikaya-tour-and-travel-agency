import assert from "node:assert";
import {
  adminConfigured,
  passwordMatches,
  isLocked,
  recordFailure,
  clearFailures,
} from "../test-dist/src/lib/auth.js";
import {
  writeContent,
  readContent,
  resetContent,
} from "../test-dist/src/lib/store.js";
import {
  getSettings,
  getItems,
  sanitizeSettings,
} from "../test-dist/src/lib/content.js";

const results = [];
function record(suite, test, pass, details = "") {
  results.push({ suite, test, pass, details });
  const status = pass ? "[PASS]" : "[FAIL]";
  console.log(`${status} ${suite} - ${test}${details ? `: ${details}` : ""}`);
}

async function run() {
  console.log("=== STARTING PHASE 2 LOCKOUT & CONTENT LIFECYCLE TESTS ===\n");

  // ----------------------------------------------------
  // TEST 1: Password Configuration & Match
  // ----------------------------------------------------
  console.log("--- Test 1: Admin Password Validation ---");
  record(
    "Admin Auth",
    "adminConfigured() is true with 12+ char password and 16+ char secret",
    adminConfigured() === true,
    `Configured: ${adminConfigured()}`
  );

  record(
    "Admin Auth",
    "passwordMatches() returns true for correct password",
    passwordMatches("hikaya-admin-password-2026") === true
  );

  record(
    "Admin Auth",
    "passwordMatches() returns false for wrong password",
    passwordMatches("wrongpassword123") === false
  );

  // ----------------------------------------------------
  // TEST 2: Brute-Force Lockout (5 failures, 6th attempt locked)
  // ----------------------------------------------------
  console.log("\n--- Test 2: Brute-Force Lockout (6 attempts) ---");
  const testIp = "test-lockout-ip-10.9.8.7";
  await clearFailures(testIp);

  // Initial check: not locked
  let locked = await isLocked(testIp);
  record("Lockout", "Initial state is not locked", !locked);

  // Record 5 failed attempts
  for (let i = 1; i <= 5; i++) {
    await recordFailure(testIp);
  }

  // 6th attempt check: should be locked out!
  locked = await isLocked(testIp);
  record(
    "Lockout",
    "After 5 failed password attempts, 6th attempt is locked out (expect isLocked === true)",
    locked === true,
    `isLocked: ${locked}`
  );

  // Reset lockout
  await clearFailures(testIp);
  locked = await isLocked(testIp);
  record(
    "Lockout",
    "clearFailures() restores access after successful login",
    locked === false,
    `isLocked after clear: ${locked}`
  );

  // ----------------------------------------------------
  // TEST 3: Settings Lifecycle (Business Info Update)
  // ----------------------------------------------------
  console.log("\n--- Test 3: Business Settings Lifecycle ---");
  const origSettings = await getSettings();

  const updatedSettings = sanitizeSettings({
    ...origSettings,
    phones: ["+251912124876"],
    emails: ["hikayatravelagency12@gmail.com"],
    whatsapp: "251912124876",
  });

  await writeContent("settings", updatedSettings);
  const reloadedSettings = await getSettings();

  record(
    "Settings",
    "Update business info (phone, email, whatsapp) persists in store",
    reloadedSettings.phones.includes("+251912124876") &&
      reloadedSettings.emails.includes("hikayatravelagency12@gmail.com") &&
      reloadedSettings.whatsapp === "251912124876",
    `Phone: ${reloadedSettings.phones[0]}, Email: ${reloadedSettings.emails[0]}`
  );

  // Reset settings
  await resetContent("settings");
  const restoredSettings = await getSettings();
  record(
    "Settings",
    "resetContent('settings') restores original defaults cleanly",
    restoredSettings.name === origSettings.name
  );

  // ----------------------------------------------------
  // TEST 4: Package Lifecycle (Add, Edit, Hide, Delete)
  // ----------------------------------------------------
  console.log("\n--- Test 4: Package Lifecycle ---");
  const origPackages = await getItems("packages");
  const initialCount = origPackages.length;

  // Add package
  const newPkg = {
    id: "pkg-qa-test",
    title: {
      en: "QA VIP Umrah Package",
      om: "Qophii Umraa VIP QA",
      am: "የቪአይፒ ኡምራ የጥራት ሙከራ",
    },
    days: 14,
    nights: 13,
    price: 175000,
    currency: "ETB",
    rating: 5,
    reviewsCount: 120,
    image: "/images/packages/december-umrah-scholar.jpg",
    visible: true,
    route: {
      en: "Addis Ababa → Madinah → Makkah → Addis Ababa",
      om: "Finfinnee → Madiinaa → Makkaa → Finfinnee",
      am: "አዲስ አበባ → መዲና → መካ → አዲስ አበባ",
    },
    description: {
      en: "Premium 14-day spiritual journey.",
      om: "Imala hafuuraa guyyoota 14 qophii addaa.",
      am: "ልዩ የ14 ቀናት መንፈሳዊ ጉዞ።",
    },
    includes: {
      en: ["5-star hotel in Makkah", "VIP luxury transport"],
      om: ["Hoteela koorfeettaa 5 Makkaatti", "Geejjiba VIP"],
      am: ["ባለ 5 ኮከብ ሆቴል በመካ", "የቪአይፒ የቅንጦት ትራንስፖርት"],
    },
  };

  await writeContent("packages", [...origPackages, newPkg]);
  let currentPackages = await getItems("packages");

  record(
    "Packages",
    "Add new tour package with en, om, am content",
    currentPackages.length === initialCount + 1 && currentPackages.some((p) => p.id === "pkg-qa-test"),
    `Count: ${currentPackages.length}`
  );

  // Edit package price
  const editedPackages = currentPackages.map((p) =>
    p.id === "pkg-qa-test" ? { ...p, price: 185000 } : p
  );
  await writeContent("packages", editedPackages);
  currentPackages = await getItems("packages");
  const editedItem = currentPackages.find((p) => p.id === "pkg-qa-test");
  record(
    "Packages",
    "Edit package price (175,000 -> 185,000 ETB)",
    editedItem?.price === 185000,
    `Price: ${editedItem?.price}`
  );

  // Hide package
  const hiddenPackages = currentPackages.map((p) =>
    p.id === "pkg-qa-test" ? { ...p, visible: false } : p
  );
  await writeContent("packages", hiddenPackages);
  currentPackages = await getItems("packages");
  const hiddenItem = currentPackages.find((p) => p.id === "pkg-qa-test");
  record(
    "Packages",
    "Hide package (visible: false)",
    hiddenItem?.visible === false,
    `Visible: ${hiddenItem?.visible}`
  );

  // Delete package
  await writeContent(
    "packages",
    currentPackages.filter((p) => p.id !== "pkg-qa-test")
  );
  currentPackages = await getItems("packages");
  record(
    "Packages",
    "Delete package removes item completely",
    currentPackages.length === initialCount && !currentPackages.some((p) => p.id === "pkg-qa-test"),
    `Count: ${currentPackages.length}`
  );

  // Reset packages
  await resetContent("packages");

  // ----------------------------------------------------
  // TEST 5: FAQ Lifecycle (Add, Edit, Delete)
  // ----------------------------------------------------
  console.log("\n--- Test 5: FAQ Lifecycle ---");
  const origFaqs = await getItems("faq");
  const initialFaqCount = origFaqs.length;

  const newFaq = {
    id: "faq-qa-test",
    question: {
      en: "Can I pay in Ethiopian Birr?",
      om: "Birrii Itoophiyaatiin kaffaluu nan danda'aa?",
      am: "በኢትዮጵያ ብር መክፈል እችላለሁ?",
    },
    answer: {
      en: "Yes, CBE and Telebirr are fully supported.",
      om: "Eeyyee, CBE fi Telebirr guutummaatti ni danda'ama.",
      am: "አዎ፣ ንግድ ባንክ እና ቴሌብር ሙሉ በሙሉ ተቀባይነት አላቸው።",
    },
    visible: true,
  };

  await writeContent("faq", [...origFaqs, newFaq]);
  let currentFaqs = await getItems("faq");
  record(
    "FAQ",
    "Add new trilingual FAQ item",
    currentFaqs.length === initialFaqCount + 1 && currentFaqs.some((f) => f.id === "faq-qa-test"),
    `Count: ${currentFaqs.length}`
  );

  // Delete FAQ
  await writeContent(
    "faq",
    currentFaqs.filter((f) => f.id !== "faq-qa-test")
  );
  currentFaqs = await getItems("faq");
  record(
    "FAQ",
    "Delete FAQ restores count",
    currentFaqs.length === initialFaqCount && !currentFaqs.some((f) => f.id === "faq-qa-test")
  );
  await resetContent("faq");

  // ----------------------------------------------------
  // TEST 6: Testimonials Lifecycle (Add, Edit, Delete)
  // ----------------------------------------------------
  console.log("\n--- Test 6: Testimonial Lifecycle ---");
  const origTestimonials = await getItems("testimonials");
  const initialTestimonialCount = origTestimonials.length;

  const newTestimonial = {
    id: "testim-qa-test",
    name: "Dr. Aster Tadesse",
    role: { en: "Pilgrim 2026", om: "Imaltuu 2026", am: "የ2026 ተጓዥ" },
    location: "Addis Ababa",
    rating: 5,
    quote: {
      en: "Outstanding service and guidance throughout the Umrah pilgrimage.",
      om: "Tajaajila addaa fi qajeelfama gaarii imala Umraa guutuu.",
      am: "በኡምራ ጉዞው ሙሉ ምርጥ አገልግሎት እና መመሪያ ተሰጥቶናል።",
    },
    visible: true,
  };

  await writeContent("testimonials", [...origTestimonials, newTestimonial]);
  let currentTestimonials = await getItems("testimonials");
  record(
    "Testimonials",
    "Add new trilingual testimonial",
    currentTestimonials.length === initialTestimonialCount + 1 &&
      currentTestimonials.some((t) => t.id === "testim-qa-test"),
    `Count: ${currentTestimonials.length}`
  );

  // Delete Testimonial
  await writeContent(
    "testimonials",
    currentTestimonials.filter((t) => t.id !== "testim-qa-test")
  );
  currentTestimonials = await getItems("testimonials");
  record(
    "Testimonials",
    "Delete testimonial restores count",
    currentTestimonials.length === initialTestimonialCount &&
      !currentTestimonials.some((t) => t.id === "testim-qa-test")
  );
  await resetContent("testimonials");

  console.log("\n========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`LOCKOUT & CONTENT TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
