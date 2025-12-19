"use client";

import { useState, useEffect } from "react";
import { Message } from "@/lib/supabase";
import { EventPreviewCard } from "./EventPreviewCard";
import { EventOverview } from "@/lib/event";

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  onEventDetected?: (messageId: string, eventData: any) => void;
}

// URL detection regex
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Event platform patterns
const EVENT_PLATFORMS = [
  /eventbrite\.com/i,
  /meetup\.com/i,
  /facebook\.com\/events/i,
  /lu\.ma/i,
  /zoom\.us/i,
  /teams\.microsoft\.com/i,
];

function isEventUrl(url: string): boolean {
  return EVENT_PLATFORMS.some((pattern) => pattern.test(url));
}

function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

export function ChatMessage({
  message,
  isOwnMessage,
  onEventDetected,
}: ChatMessageProps) {
  const [eventData, setEventData] = useState<EventOverview | null>(
    message.event_data as EventOverview | null
  );
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);

  useEffect(() => {
    // Check if message contains an event URL and we don't have event data yet
    if (!eventData && !loadingEvent) {
      const urls = extractUrls(message.content);
      const eventUrl = urls.find(isEventUrl);

      if (eventUrl) {
        analyzeEventUrl(eventUrl);
      }
    }
  }, [message.content, eventData, loadingEvent]);

  const analyzeEventUrl = async (url: string) => {
    setLoadingEvent(true);
    setEventError(null);

    try {
      const response = await fetch("/api/event/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success && result.event) {
        setEventData(result.event);
        onEventDetected?.(message.id, result.event);
      } else {
        setEventError(result.error || "Failed to analyze event");
      }
    } catch (err) {
      setEventError("Network error analyzing event");
    } finally {
      setLoadingEvent(false);
    }
  };

  // Format message content with clickable links
  const formatContent = (text: string) => {
    const parts = text.split(URL_REGEX);
    return parts.map((part, index) => {
      if (URL_REGEX.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} mb-4`}
    >
      {/* User info */}
      <div
        className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}
      >
        {message.user_image ? (
          <img
            src={message.user_image}
            alt={message.user_name || "User"}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {(message.user_name || message.user_email)?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <span className="text-xs text-gray-500">
          {message.user_name || message.user_email?.split("@")[0]}
        </span>
        <span className="text-xs text-gray-400">
          {formatTime(message.created_at)}
        </span>
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {formatContent(message.content)}
        </p>
      </div>

      {/* Event Preview */}
      {loadingEvent && (
        <div className="mt-3 w-full max-w-md">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-gray-500 text-sm">Analyzing event link...</span>
            </div>
          </div>
        </div>
      )}

      {eventError && (
        <div className="mt-3 w-full max-w-md">
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <p className="text-red-600 text-sm">{eventError}</p>
          </div>
        </div>
      )}

      {eventData && (
        <div className="mt-3 w-full">
          <EventPreviewCard event={eventData} />
        </div>
      )}
    </div>
  );
}

