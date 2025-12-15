export function normalizeEventUrl(url: string): string {
  try {
    let cleanUrl = url.trim();

    // Add https:// if no protocol
    if (!cleanUrl.match(/^https?:\/\//i)) {
      cleanUrl = "https://" + cleanUrl;
    }

    const urlObj = new URL(cleanUrl);

    // Remove tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
      "_ga",
    ];

    trackingParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return the original
    return url;
  }
}
