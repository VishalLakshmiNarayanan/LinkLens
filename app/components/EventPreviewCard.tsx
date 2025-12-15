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
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Event Image and Title */}
      {event.imageUrl && (
        <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              What
            </h3>
          </div>
          <p className="text-xl font-bold text-gray-900 leading-tight">
            {event.title}
          </p>
          <div className="mt-2">
            <span className="text-xs uppercase font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {event.platform}
            </span>
          </div>
        </div>

        {/* When Card */}
        {event.dateTime?.start && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                When
              </h3>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(event.dateTime.start)}
            </p>
            {event.dateTime.end && (
              <p className="text-sm text-gray-500 mt-1">
                Until: {formatDate(event.dateTime.end)}
              </p>
            )}
          </div>
        )}

        {/* Where Card */}
        {event.location && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Where
              </h3>
            </div>
            {event.location.isOnline ? (
              <p className="text-lg font-semibold text-gray-900">Online Event</p>
            ) : (
              <>
                {event.location.name && (
                  <p className="text-lg font-semibold text-gray-900">
                    {event.location.name}
                  </p>
                )}
                {event.location.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    {event.location.address}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Cost Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Cost
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {event.cost || "Not specified"}
          </p>
        </div>
      </div>

      {/* About Section */}
      {event.description && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              About
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Organizer Info */}
      {event.organizer && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-600 mr-2"
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
            <span className="text-sm text-gray-600">Organized by</span>
            <span className="ml-2 font-semibold text-gray-900">
              {event.organizer}
            </span>
          </div>
        </div>
      )}

      {/* View Event Button */}
      <div className="flex justify-center">
        <a
          href={event.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          View Full Event
          <svg
            className="w-5 h-5 ml-2"
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
  );
}
