import http from "node:http";
import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Helper to run tests in child process with custom env
import { spawn } from "node:child_process";

async function runSubprocess(env) {
  return new Promise((resolve, reject) => {
    const cp = spawn(
      process.execPath,
      [
        "--import",
        'data:text/javascript,import module from "node:module"; module.register("data:text/javascript,export function resolve(specifier, context, nextResolve) { if (specifier === \\"server-only\\") return { url: \\"data:text/javascript,export default {}\\", shortCircuit: true }; return nextResolve(specifier, context); }");',
        path.join(process.cwd(), "test/suite.mjs"),
      ],
      {
        env: { ...process.env, ...env },
        stdio: "inherit",
      }
    );
    cp.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Test process failed with code ${code}`));
    });
  });
}

// Mock Upstash Redis Server
function startMockRedis(port) {
  const store = new Map();
  const hashes = new Map();

  const server = http.createServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405).end();
      return;
    }
    const auth = req.headers.authorization;
    if (auth !== "Bearer mock_token") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const command = JSON.parse(body);
      const cmd = command[0].toUpperCase();
      let result = null;

      if (cmd === "GET") {
        const key = command[1];
        result = store.get(key) ?? null;
      } else if (cmd === "SET") {
        const key = command[1];
        const val = command[2];
        store.set(key, String(val));
        result = "OK";
      } else if (cmd === "DEL") {
        const key = command[1];
        const existed = store.delete(key) || hashes.delete(key);
        result = existed ? 1 : 0;
      } else if (cmd === "HSET") {
        const key = command[1];
        const field = command[2];
        const val = command[3];
        if (!hashes.has(key)) hashes.set(key, new Map());
        hashes.get(key).set(field, String(val));
        result = 1;
      } else if (cmd === "HGET") {
        const key = command[1];
        const field = command[2];
        result = hashes.get(key)?.get(field) ?? null;
      } else if (cmd === "HDEL") {
        const key = command[1];
        const field = command[2];
        result = hashes.get(key)?.delete(field) ? 1 : 0;
      } else if (cmd === "HGETALL") {
        const key = command[1];
        const map = hashes.get(key);
        if (!map) {
          result = [];
        } else {
          result = [];
          for (const [k, v] of map) {
            result.push(k, v);
          }
        }
      } else if (cmd === "INCR") {
        const key = command[1];
        const curr = parseInt(store.get(key) || "0", 10);
        const next = curr + 1;
        store.set(key, String(next));
        result = next;
      } else if (cmd === "EXPIRE") {
        result = 1;
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Unsupported command: ${cmd}` }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result }));
    });
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  console.log("=== Phase 1, Step 4: Testing Store Drivers (File vs. Redis) ===\n");

  // 1. Test File Mode
  console.log("--- 1. Testing FILE Storage Mode ---");
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "hikaya-file-store-"));
  try {
    await runSubprocess({
      DATA_DIR: tempDir,
      KV_REST_API_URL: "",
      KV_REST_API_TOKEN: "",
    });
    console.log("✓ File Storage Mode: ALL TESTS PASSED\n");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }

  // 2. Test Redis Mode with Mock Upstash Server
  console.log("--- 2. Testing REDIS Storage Mode (Upstash REST API Mock) ---");
  const port = 34567;
  const mockServer = await startMockRedis(port);
  try {
    await runSubprocess({
      KV_REST_API_URL: `http://127.0.0.1:${port}`,
      KV_REST_API_TOKEN: "mock_token",
    });
    console.log("✓ Redis Storage Mode: ALL TESTS PASSED\n");
  } finally {
    await new Promise((resolve) => mockServer.close(resolve));
  }

  console.log("=== All Store Tests Completed Successfully! ===");
}

main().catch((err) => {
  console.error("FATAL TEST FAILURE:", err);
  process.exit(1);
});

