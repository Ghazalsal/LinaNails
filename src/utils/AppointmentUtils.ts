import { format } from 'date-fns';

import { useLanguage } from '@/contexts/LanguageContext';

export const formatTimeForDisplay = (time: string) => {
  // This is a workaround since we can't use hooks directly in utility functions
  // We'll use English AM/PM by default and let components handle translation if needed
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const isPm = hour >= 12;
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minuteStr} ${isPm ? 'PM' : 'AM'}`;
};

// Import the translations directly to avoid circular dependency with useLanguage hook
import { translations } from '@/contexts/LanguageContext';

export const createWhatsAppMessage = (clientName: string, date: Date, time: string, service: string, isArabic: boolean = false) => {
  // Format the date with translated month
  const day = format(date, 'd');
  const month = format(date, 'MMMM');
  const year = format(date, 'yyyy');
  
  // We'll use a different date format based on language
  const appointmentDate = isArabic
    ? `${day}/${format(date, 'MM')}/${year}`  // Keep numeric format for Arabic
    : `${format(date, 'MM/dd/yyyy')}`; // Keep standard format for English
    
  const timeFormatted = formatTimeForDisplay(time);
  
  // Get the template from translations
  const lang = isArabic ? 'ar' : 'en';
  const template = localStorage.getItem(`whatsappTemplate_${lang}`) || 
                   translations[lang].whatsappMessageTemplate;
  
  // Replace variables in the template
  return template
    .replace('{clientName}', clientName)
    .replace('{date}', appointmentDate)
    .replace('{time}', timeFormatted)
    .replace('{service}', service);
};

import { sendWhatsAppMessageWithFallback } from './WhatsAppAPI';

export const sendWhatsAppReminder = async (phone: string, message: string) => {
  try {
    // Always use forceDirect=true to send messages directly via the API without browser fallback
    return await sendWhatsAppMessageWithFallback(phone, message, undefined, true);
  } catch (error) {
    console.error('Failed to send WhatsApp reminder:', error);
    return false;
  }
};
