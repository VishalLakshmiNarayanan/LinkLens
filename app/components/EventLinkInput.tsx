"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/event";

interface EventLinkInputProps {
  onAnalyze: (result: AnalysisResult) => void;
}

export function EventLinkInput({ onAnalyze }: EventLinkInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/event/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result: AnalysisResult = await response.json();

      if (result.success) {
        onAnalyze(result);
      } else {
        setError(result.error || "Failed to analyze event");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event-url" className="block text-sm font-medium text-gray-700 mb-2">
            Paste your event link here
          </label>
          <input
            id="event-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://eventbrite.com/e/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!url || loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {loading ? "Analyzing..." : "Analyze Event"}
        </button>
      </form>
    </div>
  );
}
