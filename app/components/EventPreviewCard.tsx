"use client";

import { EventOverview } from "@/lib/event";

interface EventPreviewCardProps {
  event: EventOverview;
}

export function EventPreviewCard({ event }: EventPreviewCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {event.imageUrl && (
        <div className="w-full h-48 bg-gray-200">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <span className="text-xs uppercase font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {event.platform}
          </span>
        </div>

        {event.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        )}

        <div className="space-y-3">
          {event.dateTime?.start && (
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(event.dateTime.start)}
                </p>
                {event.dateTime.end && (
                  <p className="text-xs text-gray-500">
                    to {formatDate(event.dateTime.end)}
                  </p>
                )}
              </div>
            </div>
          )}

          {event.location && (
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                {event.location.isOnline && (
                  <p className="text-sm font-medium text-gray-900">Online Event</p>
                )}
                {event.location.name && (
                  <p className="text-sm font-medium text-gray-900">
                    {event.location.name}
                  </p>
                )}
                {event.location.address && (
                  <p className="text-xs text-gray-500">{event.location.address}</p>
                )}
              </div>
            </div>
          )}

          {event.organizer && (
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-400 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-sm text-gray-900">{event.organizer}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href={event.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View full event
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
