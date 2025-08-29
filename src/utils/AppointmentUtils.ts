

import { AppointmentType } from "@/api";

// utils/AppointmentUtils.ts
export const formatTimeForDisplay = (timeString: string) => {
  // Handle both ISO strings and HH:mm format
  let hours, minutes;
  
  if (timeString.includes('T')) {
    // ISO string
    const date = new Date(timeString);
    hours = date.getHours();
    minutes = date.getMinutes();
  } else {
    // HH:mm format
    [hours, minutes] = timeString.split(':').map(Number);
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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
    case AppointmentType.BothBasic:
      return "مانيكير و باديكير أساسي";
    case AppointmentType.BothFull:
      return "مانيكير و باديكير كامل";
    case AppointmentType.Eyebrows:
      return "حواجب";
    case AppointmentType.Lashes:
      return "رموش";
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
      case AppointmentType.BothBasic:
        return t("pedicure") + " and " + t("manicure") + " (" + t("basic") + ")";
      case AppointmentType.BothFull:
        return t("pedicure") + " and " + t("manicure") + " (" + t("full") + ")";
      case AppointmentType.Eyebrows:
        return t("eyebrows");
      case AppointmentType.Lashes:
        return t("lashes");
      default:
        return serviceType;
    }
  }
};





