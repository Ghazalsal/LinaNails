import { toast } from '@/hooks/use-toast';

// WhatsApp Business API configuration
export interface WhatsAppConfig {
  apiVersion: string;
  phoneNumberId: string;
  // The access token is used for authentication with the WhatsApp Business API
  // It can be omitted if you're using a different authentication method or
  // if you're only using the browser-based fallback method
  accessToken?: string; // Made optional with '?'
}

// Default configuration - using environment variables
const defaultConfig: WhatsAppConfig = {
  apiVersion: import.meta.env.VITE_WHATSAPP_API_VERSION || 'v17.0', // Use env variable or default to v17.0
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || ''
};

/**
 * Send a message using the WhatsApp Business API
 * @param phoneNumber - The recipient's phone number (should include country code without + or spaces)
 * @param message - The message text to send
 * @param config - Optional WhatsApp API configuration
 * @returns Promise that resolves to the API response or rejects with an error
 */
export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
  config: WhatsAppConfig = defaultConfig
): Promise<Response> => {
  // Clean the phone number (remove non-digits)
  const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
  
  // Ensure we have the required configuration
  if (!config.phoneNumberId) {
    throw new Error('WhatsApp Business API configuration is missing');
  }

  // Prepare the API URL
  // The phone number ID should be prefixed with the version
  const apiUrl = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;
  
  // Prepare the request body according to WhatsApp Cloud API documentation
  const requestBody = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanedPhoneNumber,
    type: 'text',
    text: {
      preview_url: true, // Enable link previews if the message contains URLs
      body: message
    }
  };

  try {
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.accessToken ? { 'Authorization': `Bearer ${config.accessToken}` } : {})
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API Error Details:', JSON.stringify(errorData, null, 2));
      throw new Error(`WhatsApp API Error: ${errorData.error?.message || response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

/**
 * Fallback method to open WhatsApp in browser if the API is not configured
 * @param phoneNumber - The recipient's phone number
 * @param message - The message text to send
 */
export const openWhatsAppInBrowser = (phoneNumber: string, message: string): void => {
  const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

/**
 * Send a WhatsApp message using the Business API if configured, otherwise fall back to browser method
 * @param phoneNumber - The recipient's phone number
 * @param message - The message text to send
 * @param config - Optional WhatsApp API configuration
 * @param forceDirect - If true, will only try direct API sending without browser fallback
 * @returns Promise that resolves when the message is sent or the fallback is used
 */
export const sendWhatsAppMessageWithFallback = async (
  phoneNumber: string,
  message: string,
  config: WhatsAppConfig = defaultConfig,
  forceDirect: boolean = true
): Promise<boolean> => {
  // Check if the API is properly configured with a phone number ID and access token
  if (!config.phoneNumberId || !config.accessToken) {
    console.warn('WhatsApp API configuration incomplete: Missing phoneNumberId or accessToken');
    toast({
      title: "Configuration Missing",
      description: "WhatsApp Business API is not fully configured. Please check your .env file.",
      variant: "destructive",
    });
    return false;
  }

  try {
    // Try to send via the API
    console.log('Attempting to send WhatsApp message via API to:', phoneNumber);
    const response = await sendWhatsAppMessage(phoneNumber, message, config);
    
    // Log the successful response for debugging
    const responseData = await response.json();
    console.log('WhatsApp API response:', responseData);
    
    toast({
      title: "Message Sent",
      description: "WhatsApp message was sent successfully via the WhatsApp Business API.",
    });
    return true;
  } catch (error) {
    console.error('Failed to send via WhatsApp API:', error);
    
    // If forceDirect is true, don't fall back to browser method
    if (forceDirect) {
      toast({
        title: "Message Failed",
        description: `Could not send WhatsApp message directly: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and logs for details.`,
        variant: "destructive",
      });
      return false;
    }
      
      // Fall back to browser method if API fails and forceDirect is false
       toast({
         title: "Direct Sending Failed",
         description: "Falling back to WhatsApp web interface.",
       });
       
       // Open in browser as fallback
       openWhatsAppInBrowser(phoneNumber, message);
       return true;
     }
   
   // This code should never be reached with the new implementation
   return false;
};