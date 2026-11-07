import { notFound } from "next/navigation";

/** Renders the branded 404 (inside the language layout) for unknown URLs. */
export default function CatchAll() {
  notFound();
}
