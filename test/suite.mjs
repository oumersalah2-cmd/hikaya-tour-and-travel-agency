import assert from "node:assert";
import * as store from "../test-dist/store.js";

async function run() {
  console.log(`Driver mode active: usingRedis=${store.usingRedis}`);

  // Test 1: Upload name validation
  console.log("  Testing upload name validation...");
  assert.strictEqual(store.isValidUploadName("abcdef.webp"), true);
  assert.strictEqual(store.isValidUploadName("12345678-thumb.webp"), true);
  assert.strictEqual(store.isValidUploadName("../evil.webp"), false);
  assert.strictEqual(store.isValidUploadName("foo/bar.webp"), false);
  assert.strictEqual(store.isValidUploadName("test.jpg"), false);
  assert.strictEqual(store.isValidUploadName("short.webp"), false); // < 6 chars

  // Test 2: Leads CRUD
  console.log("  Testing Leads CRUD...");
  const initialLeads = await store.listLeads();
  assert.strictEqual(Array.isArray(initialLeads), true);

  const lead1 = await store.addLead({
    type: "contact",
    name: "Abebe Bikila",
    email: "abebe@example.com",
    phone: "+251911223344",
    message: "Test message from Addis",
  });
  assert.ok(lead1.id);
  assert.strictEqual(lead1.name, "Abebe Bikila");
  assert.strictEqual(lead1.status, "new");

  const lead2 = await store.addLead({
    type: "booking",
    name: "Fatima Zahra",
    email: "fatima@example.com",
    phone: "+251922334455",
    package: "December Umrah VIP",
  });
  assert.ok(lead2.id);

  const leadsAfterAdd = await store.listLeads();
  assert.strictEqual(leadsAfterAdd.length >= 2, true);
  assert.ok(leadsAfterAdd.some((l) => l.id === lead1.id));
  assert.ok(leadsAfterAdd.some((l) => l.id === lead2.id));

  // Update lead
  await store.updateLead(lead1.id, { status: "contacted", notes: "Called via phone" });
  const leadsAfterUpdate = await store.listLeads();
  const updatedLead1 = leadsAfterUpdate.find((l) => l.id === lead1.id);
  assert.strictEqual(updatedLead1.status, "contacted");
  assert.strictEqual(updatedLead1.notes, "Called via phone");

  // Delete lead
  await store.deleteLead(lead2.id);
  const leadsAfterDelete = await store.listLeads();
  assert.strictEqual(leadsAfterDelete.some((l) => l.id === lead2.id), false);
  assert.strictEqual(leadsAfterDelete.some((l) => l.id === lead1.id), true);

  // Clean up lead1
  await store.deleteLead(lead1.id);

  // Test 3: Generic Content
  console.log("  Testing Content read/write/reset...");
  const defaultVal = { testKey: "defaultValue" };
  const read1 = await store.readContent("test-item", defaultVal);
  assert.deepStrictEqual(read1, defaultVal);

  const savedVal = { testKey: "persistedValue", count: 42 };
  await store.writeContent("test-item", savedVal);
  const read2 = await store.readContent("test-item", defaultVal);
  assert.deepStrictEqual(read2, savedVal);

  await store.resetContent("test-item");
  const read3 = await store.readContent("test-item", defaultVal);
  assert.deepStrictEqual(read3, defaultVal);

  // Test 4: Gallery list and mutate
  console.log("  Testing Gallery mutations...");
  const dummyDefaults = [
    {
      id: "item-1",
      src: "/images/test.webp",
      thumb: "/images/test-thumb.webp",
      width: 800,
      height: 600,
      caption: { en: "Test 1", om: "Test 1" },
      visible: true,
      createdAt: new Date().toISOString(),
    },
  ];
  const galleryInit = await store.listGallery(dummyDefaults);
  assert.ok(Array.isArray(galleryInit));

  await store.mutateGallery(dummyDefaults, (items) => {
    return [
      ...items,
      {
        id: "item-2",
        src: "/images/test2.webp",
        thumb: "/images/test2-thumb.webp",
        width: 1000,
        height: 800,
        caption: { en: "Test 2", om: "Test 2" },
        visible: true,
        createdAt: new Date().toISOString(),
      },
    ];
  });
  const galleryMutated = await store.listGallery(dummyDefaults);
  assert.ok(galleryMutated.some((i) => i.id === "item-2"));

  // Reset gallery content
  await store.resetContent("gallery");

  // Test 5: Uploads storage
  console.log("  Testing Uploads save/read/delete...");
  const uploadName = "12345678abcdef.webp";
  const uploadBuffer = Buffer.from("RIFF....WEBPVP8 ...fake image data...");
  await store.saveUpload(uploadName, uploadBuffer);

  const readBackBuffer = await store.readUpload(uploadName);
  assert.ok(readBackBuffer);
  assert.deepStrictEqual(readBackBuffer, uploadBuffer);

  // Invalid upload name safety check
  const invalidRead = await store.readUpload("../hacked.webp");
  assert.strictEqual(invalidRead, null);

  await store.deleteUpload(uploadName);
  const readAfterDelete = await store.readUpload(uploadName);
  assert.strictEqual(readAfterDelete, null);

  // Test 6: Rate Limiting Counter
  console.log("  Testing Rate Limit counter...");
  const rlKey = "test-ip-123.45.67.89";
  await store.clearCounter(rlKey);

  const count1 = await store.bumpCounter(rlKey, 60);
  assert.strictEqual(count1, 1);
  const count2 = await store.bumpCounter(rlKey, 60);
  assert.strictEqual(count2, 2);

  const currentCount = await store.readCounter(rlKey);
  assert.strictEqual(currentCount, 2);

  await store.clearCounter(rlKey);
  const countAfterClear = await store.readCounter(rlKey);
  assert.strictEqual(countAfterClear, 0);

  // Test 7: Backup snapshot
  console.log("  Testing Backup snapshot...");
  const snapshot = await store.backupSnapshot();
  assert.ok(snapshot);
  assert.ok("settings" in snapshot);
  assert.ok("packages" in snapshot);
  assert.ok("leads" in snapshot);

  console.log("  ✓ All assertions in this mode passed successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

