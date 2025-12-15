import * as cheerio from "cheerio";
import { EventOverview } from "../types";

export async function extractEventbrite(
  url: string,
  html: string
): Promise<EventOverview | null> {
  const $ = cheerio.load(html);

  console.log("\n🎫 Using Eventbrite-specific extractor");

  try {
    // Try to find the structured data script
    let eventData: any = null;

    // Method 1: Look for JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "");
        if (data["@type"] === "Event") {
          eventData = data;
          console.log("✅ Found JSON-LD event data");
        }
      } catch (e) {
        // Continue to next script
      }
    });

    // Method 2: Look for Eventbrite's __SERVER_DATA__
    $("script").each((_, el) => {
      const scriptContent = $(el).html() || "";
      if (scriptContent.includes("window.__SERVER_DATA__")) {
        try {
          // Extract the JSON data
          const match = scriptContent.match(/window\.__SERVER_DATA__\s*=\s*({[\s\S]*?});/);
          if (match) {
            const serverData = JSON.parse(match[1]);
            console.log("✅ Found __SERVER_DATA__");
            eventData = serverData;
          }
        } catch (e) {
          console.log("Failed to parse __SERVER_DATA__:", e);
        }
      }
    });

    let extracted: Partial<EventOverview> = {
      platform: "eventbrite",
      originalUrl: url,
    };

    // Extract from JSON-LD if available
    if (eventData && eventData["@type"] === "Event") {
      console.log("\n📦 Extracting from JSON-LD:");

      extracted.title = eventData.name;
      extracted.description = eventData.description;
      extracted.imageUrl = typeof eventData.image === "string" ? eventData.image : eventData.image?.url;

      // Date/Time
      if (eventData.startDate) {
        extracted.dateTime = {
          start: eventData.startDate,
          end: eventData.endDate,
        };
      }

      // Location
      if (eventData.location) {
        const loc = eventData.location;
        extracted.location = {
          name: loc.name,
          address:
            typeof loc.address === "string"
              ? loc.address
              : [
                  loc.address?.streetAddress,
                  loc.address?.addressLocality,
                  loc.address?.addressRegion,
                  loc.address?.postalCode,
                ]
                  .filter(Boolean)
                  .join(", "),
          isOnline: eventData.eventAttendanceMode === "OnlineEventAttendanceMode",
        };
      }

      // Cost
      if (eventData.offers) {
        const offers = Array.isArray(eventData.offers) ? eventData.offers[0] : eventData.offers;
        if (offers.price === "0" || offers.price === 0) {
          extracted.cost = "Free";
        } else if (offers.price) {
          const currency = offers.priceCurrency || "$";
          extracted.cost = `${currency}${offers.price}`;
        }
      }

      // Organizer
      if (eventData.organizer) {
        extracted.organizer =
          typeof eventData.organizer === "string" ? eventData.organizer : eventData.organizer?.name;
      }
    }

    // Fallback: Scrape from HTML selectors
    if (!extracted.title) {
      extracted.title =
        $('h1[class*="event-title"]').first().text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text().trim() ||
        "Untitled Event";
    }

    if (!extracted.description) {
      extracted.description =
        $('div[class*="event-description"]').first().text().trim() ||
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");
    }

    if (!extracted.imageUrl) {
      extracted.imageUrl =
        $('img[class*="event-image"]').first().attr("src") ||
        $('meta[property="og:image"]').attr("content");
    }

    // Extract location from page if not found
    if (!extracted.location?.name) {
      const locationText =
        $('div[class*="location-info"]').text().trim() ||
        $('p[class*="location"]').text().trim();

      if (locationText) {
        extracted.location = {
          name: locationText,
          isOnline: locationText.toLowerCase().includes("online"),
        };
      }
    }

    // Extract date if not found
    if (!extracted.dateTime?.start) {
      const dateText =
        $('time').first().attr("datetime") ||
        $('div[class*="date-info"]').text().trim();

      if (dateText) {
        extracted.dateTime = {
          start: dateText,
        };
      }
    }

    // Extract organizer if not found
    if (!extracted.organizer) {
      extracted.organizer =
        $('div[class*="organizer-name"]').first().text().trim() ||
        $('a[class*="organizer"]').first().text().trim();
    }

    // Extract price if not found
    if (!extracted.cost) {
      const priceText =
        $('div[class*="conversion-bar__panel-info"]').text().trim() ||
        $('div[class*="price"]').first().text().trim() ||
        $('span[class*="price"]').first().text().trim();

      if (priceText) {
        if (priceText.toLowerCase().includes("free")) {
          extracted.cost = "Free";
        } else {
          // Extract price from text like "$65.87" or "From $20"
          const priceMatch = priceText.match(/\$[\d,]+\.?\d*/);
          if (priceMatch) {
            extracted.cost = priceMatch[0];
          } else {
            extracted.cost = priceText;
          }
        }
      }
    }

    console.log("\n✅ Final Eventbrite extraction:");
    console.log(JSON.stringify(extracted, null, 2));

    return extracted as EventOverview;
  } catch (error) {
    console.error("❌ Eventbrite extraction error:", error);
    return null;
  }
}
