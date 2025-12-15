"use client";

import { useState } from "react";
import { EventLinkInput } from "./components/EventLinkInput";
import { EventPreviewCard } from "./components/EventPreviewCard";
import { AnalysisResult } from "@/lib/event";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LinkLens
          </h1>
          <p className="text-xl text-gray-600">
            Paste an event link, get instant details
          </p>
        </div>

        <EventLinkInput onAnalyze={setResult} />

        {result?.success && result.event && (
          <div className="mt-8">
            <EventPreviewCard event={result.event} />
          </div>
        )}
      </div>
    </main>
  );
}
