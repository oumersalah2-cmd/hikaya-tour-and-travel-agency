"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ lang?: string }>();
  const om = params?.lang === "om";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-800 to-primary-950 px-6 text-center text-white"
    >
      <h1 className="font-display text-3xl font-bold">
        {om ? "Rakkoon uumame" : "Something went wrong"}
      </h1>
      <p className="mt-3 max-w-md text-gray-300">
        {om
          ? "Dhiifama, rakkoon yeroo muraasaaf uumameera. Irra deebi’ii yaalaa."
          : "We hit an unexpected problem. Please try again."}
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-8 px-8">
        {om ? "Irra deebi’ii yaali" : "Try again"}
      </button>
    </main>
  );
}
