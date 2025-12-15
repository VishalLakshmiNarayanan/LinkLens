import { EventPlatform } from "./types";

export function detectPlatform(url: string): EventPlatform {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes("eventbrite.com")) {
      return "eventbrite";
    }
    if (hostname.includes("meetup.com")) {
      return "meetup";
    }
    if (hostname.includes("lu.ma") || hostname.includes("luma.com")) {
      return "luma";
    }
    if (hostname.includes("partful.com")) {
      return "partful";
    }
    if (hostname.includes("facebook.com") && urlObj.pathname.includes("/events/")) {
      return "facebook";
    }

    return "unknown";
  } catch (error) {
    return "unknown";
  }
}
