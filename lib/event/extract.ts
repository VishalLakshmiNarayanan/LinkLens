import * as cheerio from "cheerio";
import { EventOverview, EventPlatform } from "./types";
import { extractEventbrite } from "./extractors/eventbrite";

export async function extractEventData(
  url: string,
  platform: EventPlatform
): Promise<EventOverview | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use platform-specific extractors
    if (platform === "eventbrite") {
      console.log("\n🎯 Routing to Eventbrite extractor");
      return await extractEventbrite(url, html);
    }

    const $ = cheerio.load(html);

    // Try to extract from JSON-LD structured data first
    const jsonLd = $('script[type="application/ld+json"]').first().html();
    console.log("\n=== EXTRACTION LOG ===");
    console.log("URL:", url);
    console.log("Platform:", platform);

    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd);
        console.log("\n📦 Raw JSON-LD Data:", JSON.stringify(data, null, 2));

        if (data["@type"] === "Event") {
          // Extract cost from offers
          let cost: string | undefined;
          if (data.offers) {
            const offers = Array.isArray(data.offers) ? data.offers[0] : data.offers;
            console.log("\n💰 Offers data:", offers);
            if (offers.price === "0" || offers.price === 0) {
              cost = "Free";
            } else if (offers.price) {
              const currency = offers.priceCurrency || "$";
              cost = `${currency}${offers.price}`;
            }
            console.log("Extracted cost:", cost);
          }

          const extractedEvent = {
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
            cost,
            imageUrl: data.image || data.image?.url,
            organizer:
              typeof data.organizer === "string"
                ? data.organizer
                : data.organizer?.name,
            platform,
            originalUrl: url,
          };

          console.log("\n✅ Extracted Event Data:", JSON.stringify(extractedEvent, null, 2));
          console.log("===================\n");
          return extractedEvent;
        }
      } catch (e) {
        console.log("❌ JSON-LD parsing failed:", e);
        // Continue to fallback extraction
      }
    }

    // Fallback: Generic Open Graph / meta tag extraction
    console.log("\n⚠️  Using fallback Open Graph extraction");

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Untitled Event";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");

    const imageUrl = $('meta[property="og:image"]').attr("content");

    const fallbackEvent = {
      title,
      description,
      imageUrl,
      platform,
      originalUrl: url,
    };

    console.log("\n✅ Fallback Extracted Event Data:", JSON.stringify(fallbackEvent, null, 2));
    console.log("===================\n");

    return fallbackEvent;
  } catch (error) {
    console.error("Error extracting event data:", error);
    return null;
  }
}
