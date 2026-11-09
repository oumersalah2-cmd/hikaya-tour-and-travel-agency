import path from "node:path";
import { pathToFileURL } from "node:url";

export function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,export default {}", shortCircuit: true };
  }
  if (specifier === "next/headers") {
    return {
      url: "data:text/javascript,export const cookies = () => ({ get: () => undefined, set: () => {}, delete: () => {} }); export const headers = () => ({ get: () => null });",
      shortCircuit: true,
    };
  }
  if (specifier === "next/navigation") {
    return {
      url: "data:text/javascript,export const redirect = () => {}; export const notFound = () => {};",
      shortCircuit: true,
    };
  }
  if (specifier === "next/cache") {
    return {
      url: "data:text/javascript,export const revalidatePath = () => {};",
      shortCircuit: true,
    };
  }
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const resolvedPath = path.resolve(process.cwd(), "test-dist/src", rel.endsWith(".js") ? rel : `${rel}.js`);
    return { url: pathToFileURL(resolvedPath).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

