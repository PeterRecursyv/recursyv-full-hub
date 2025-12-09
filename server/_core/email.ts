import { ENV } from "./env";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Manus Forge API email service
 * @param payload Email payload with to, subject, html, and optional text
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!ENV.forgeApiUrl) {
    console.error("[Email] BUILT_IN_FORGE_API_URL is not configured");
    return false;
  }

  if (!ENV.forgeApiKey) {
    console.error("[Email] BUILT_IN_FORGE_API_KEY is not configured");
    return false;
  }

  const baseUrl = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;
  
  const endpoint = new URL("email.v1.EmailService/SendEmail", baseUrl).toString();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text || payload.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    console.log(`[Email] Email sent successfully to ${payload.to}`);
    return true;
  } catch (error) {
    console.error("[Email] Error calling email service:", error);
    return false;
  }
}
