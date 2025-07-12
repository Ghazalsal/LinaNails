import dotenv from "dotenv";
dotenv.config();

export interface WhatsAppConfig {
  apiVersion: string;
  phoneNumberId: string;
  accessToken: string;
}

const config: WhatsAppConfig = {
  apiVersion: process.env.WHATSAPP_VERSION! || "v22.0",
  phoneNumberId: process.env.WHATSAPP_ID! || "741850909002950",
  accessToken: process.env.WHATSAPP_TOKEN! || "EAAKhhtZApsEcBPGaX7IQ2spK0Rcyh6dVaR7ACwrr7ZCDUwpHFd72U1xbQT4OjxTafuNvjkgyKDiaeVnd5y7ZAXk8h2mWm3F1ffkAD9TCV79SZANvpQRnkDBPYPjp3l1PlTqgm9HMLyF4Xur5ZBBeZCK5hW7moojjsAIT0vZBMEDkaKTypMNIZA6hwbBocZAvWgSaOyxsLioBhKB1YZBsYofKL2J968Kt63d5XKkNEERzNbcD6TKYAZCS211DjpIHOBkxAZDZD", // <-- Don't forget to update this!
};

export const sendWhatsAppMessage = async (
  phoneNumber: string,
  clientName: string,
  date: string,
  time: string,
  service: string
): Promise<Response> => {
  const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
  const { phoneNumberId, accessToken, apiVersion } = config;

  if (!phoneNumberId || !accessToken || !apiVersion) {
    throw new Error("WhatsApp Business API configuration is missing or invalid.");
  }

  const apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const requestBody = {
    messaging_product: "whatsapp",
    to: cleanedPhoneNumber,
    recipient_type: "individual",
    type: "template",
    template: {
      name: "lina_appointment2",
      language: {
        code: "ar", // Arabic language
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://raw.githubusercontent.com/Ghazalsal/image/main/315547457_114440274812316_1595265513982162514_n.png"
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: clientName }, // {{1}}
            { type: "text", text: date },       // {{2}}
            { type: "text", text: time },       // {{3}}
            { type: "text", text: service },    // {{4}}
          ]
        }
      ]
    }
  };

  console.log("📤 Sending WhatsApp message to:", cleanedPhoneNumber);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ WhatsApp API Error:", errorData);
      throw new Error(errorData.error?.message || "Unknown error from WhatsApp API.");
    }

    console.log("✅ Message sent successfully");
    return response;
  } catch (err) {
    console.error("🚨 Failed to send WhatsApp message:", err);
    throw err;
  }
};
