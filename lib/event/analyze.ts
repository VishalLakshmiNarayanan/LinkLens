import { normalizeEventUrl } from "./normalize";
import { detectPlatform } from "./detect";
import { extractEventData } from "./extract";
import { AnalysisResult } from "./types";

export async function analyzeEvent(url: string): Promise<AnalysisResult> {
  try {
    // Step 1: Normalize the URL
    const normalizedUrl = normalizeEventUrl(url);

    // Step 2: Detect the platform
    const platform = detectPlatform(normalizedUrl);

    // Step 3: Extract event data
    const event = await extractEventData(normalizedUrl, platform);

    if (!event) {
      return {
        success: false,
        error: "Could not extract event data from the provided URL",
      };
    }

    return {
      success: true,
      event,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
