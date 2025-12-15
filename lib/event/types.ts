export type EventPlatform =
  | "eventbrite"
  | "meetup"
  | "luma"
  | "partful"
  | "facebook"
  | "unknown";

export interface EventOverview {
  title: string;
  description?: string;
  dateTime?: {
    start: string;
    end?: string;
  };
  location?: {
    name?: string;
    address?: string;
    isOnline?: boolean;
  };
  cost?: string;
  imageUrl?: string;
  organizer?: string;
  platform: EventPlatform;
  originalUrl: string;
}

export interface AnalysisResult {
  success: boolean;
  event?: EventOverview;
  error?: string;
}
