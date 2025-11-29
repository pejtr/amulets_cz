import crypto from "crypto";

const META_PIXEL_ID = "1150262920608217";
const META_CONVERSIONS_API_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;
const META_API_VERSION = "v22.0";

interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_source_url: string;
  user_data: {
    em?: string; // hashed email
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: Record<string, any>;
}

/**
 * Hash email with SHA256 for Meta Conversions API
 */
function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

/**
 * Send conversion event to Meta Conversions API
 */
export async function sendMetaConversion(params: {
  eventName: string;
  email?: string;
  eventSourceUrl: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  customData?: Record<string, any>;
}): Promise<boolean> {
  if (!META_CONVERSIONS_API_TOKEN) {
    console.error("META_CONVERSIONS_API_TOKEN is not set");
    return false;
  }

  try {
    const event: ConversionEvent = {
      event_name: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: params.eventSourceUrl,
      user_data: {
        ...(params.email && { em: hashEmail(params.email) }),
        ...(params.clientIp && { client_ip_address: params.clientIp }),
        ...(params.userAgent && { client_user_agent: params.userAgent }),
        ...(params.fbc && { fbc: params.fbc }),
        ...(params.fbp && { fbp: params.fbp }),
      },
      ...(params.customData && { custom_data: params.customData }),
    };

    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [event],
          access_token: META_CONVERSIONS_API_TOKEN,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta Conversions API error:", result);
      return false;
    }

    console.log("Meta Conversions API success:", result);
    return true;
  } catch (error) {
    console.error("Failed to send Meta conversion:", error);
    return false;
  }
}

/**
 * Send Lead event when user subscribes via exit-intent popup
 */
export async function sendLeadEvent(params: {
  email: string;
  eventSourceUrl: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<boolean> {
  return sendMetaConversion({
    eventName: "Lead",
    email: params.email,
    eventSourceUrl: params.eventSourceUrl,
    clientIp: params.clientIp,
    userAgent: params.userAgent,
    fbc: params.fbc,
    fbp: params.fbp,
    customData: {
      content_name: "Exit Intent Popup - 11% Discount",
      content_category: "Email Subscription",
      value: 0,
      currency: "CZK",
    },
  });
}
