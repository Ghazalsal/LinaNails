

import { AppointmentType } from "@/api";

export const formatTimeForDisplay = (time: string) => {
  // This is a workaround since we can't use hooks directly in utility functions
  // We'll use English AM/PM by default and let components handle translation if needed
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const isPm = hour >= 12;
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minuteStr} ${isPm ? 'PM' : 'AM'}`;
};

/**
 * Translates service type to Arabic
 * @param serviceType The service type enum value (MANICURE, PEDICURE, BOTH)
 * @returns The Arabic translation of the service type
 */
export const translateServiceTypeToArabic = (serviceType: string): string => {
  switch (serviceType) {
    case AppointmentType.Manicure:
      return "مانيكير";
    case AppointmentType.Pedicure:
      return "باديكير";
    case AppointmentType.Both:
      return "كلاهما";
    default:
      return serviceType;
  }
};

/**
 * Translates service type to the current language
 * @param serviceType The service type enum value (MANICURE, PEDICURE, BOTH)
 * @param language The current language ("en" or "ar")
 * @param t The translation function
 * @returns The translated service type in the current language
 */
export const translateServiceType = (serviceType: string, language: string, t: (key: string) => string): string => {
  if (language === "ar") {
    return translateServiceTypeToArabic(serviceType);
  } else {
    switch (serviceType) {
      case AppointmentType.Manicure:
        return t("manicure");
      case AppointmentType.Pedicure:
        return t("pedicure");
      case AppointmentType.Both:
        return t("both");
      default:
        return serviceType;
    }
  }
};





