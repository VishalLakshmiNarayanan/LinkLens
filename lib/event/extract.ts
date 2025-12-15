import * as cheerio from "cheerio";
import { EventOverview, EventPlatform } from "./types";

export async function extractEventData(
  url: string,
  platform: EventPlatform
): Promise<EventOverview | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract from JSON-LD structured data first
    const jsonLd = $('script[type="application/ld+json"]').first().html();
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd);
        if (data["@type"] === "Event") {
          return {
            title: data.name || "Untitled Event",
            description: data.description,
            dateTime: {
              start: data.startDate,
              end: data.endDate,
            },
            location: data.location
              ? {
                  name: data.location.name,
                  address:
                    typeof data.location.address === "string"
                      ? data.location.address
                      : data.location.address?.streetAddress,
                  isOnline: data.eventAttendanceMode === "OnlineEventAttendanceMode",
                }
              : undefined,
            imageUrl: data.image || data.image?.url,
            organizer:
              typeof data.organizer === "string"
                ? data.organizer
                : data.organizer?.name,
            platform,
            originalUrl: url,
          };
        }
      } catch (e) {
        // Continue to fallback extraction
      }
    }

    // Fallback: Generic Open Graph / meta tag extraction
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Untitled Event";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const imageUrl = $('meta[property="og:image"]').attr("content");

    return {
      title,
      description,
      imageUrl,
      platform,
      originalUrl: url,
    };
  } catch (error) {
    console.error("Error extracting event data:", error);
    return null;
  }
}
