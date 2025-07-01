# WhatsApp Integration Guide

## Overview

This document explains the method available for sending WhatsApp messages in the Lina Nails application:

**Facebook WhatsApp Business API** - The official method that uses the WhatsApp Business API

## Facebook WhatsApp Business API

This is the official and recommended method for business use. It requires proper registration with Facebook and configuration of API keys.

### Configuration

The following environment variables need to be set in the `.env` file:

```
VITE_WHATSAPP_API_VERSION="v17.0"
VITE_WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
VITE_WHATSAPP_ACCESS_TOKEN="your_access_token"
```

### How It Works

The application uses the `sendWhatsAppReminder` function in `AppointmentUtils.ts` which calls the Facebook Graph API to send messages. This method is reliable and officially supported by WhatsApp.





## Troubleshooting

### Facebook WhatsApp Business API Issues

- Verify that your API keys and phone number ID are correctly configured
- Check that your WhatsApp Business account is properly set up
- Review the console logs for detailed error messages