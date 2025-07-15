import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    dashboardTitle: 'Appointment Dashboard',

    workingHours: 'Working Hours: 10:00 AM - 8:00 PM',
    noAppointments: 'No appointments scheduled for this day',
    todayAppointments: 'Today\'s Appointments',
    clickTimeSlot: 'Click on a specific time to view details or add appointment',

    available: 'Available',
    past: 'Past',

    newAppointment: 'New Appointment on',
    fillDetails: 'Fill in the details below to book a new appointment',
    clientName: 'Client Name',
    enterClientName: 'Enter client name',
    phoneNumber: 'Phone Number',
    service: 'Service',
    selectService: 'Select a service',
    time: 'Time',
    selectTime: 'Select a time',
    notes: 'Notes (Optional)',
    addNotes: 'Add any additional notes here',
    cancel: 'Cancel',
    addAppointment: 'Add Appointment',

    manicure: 'Manicure',
    pedicure: 'Pedicure',
    both: 'Both',

    appointmentDetails: 'Appointment Details',
    client: 'Client',
    duration: 'Duration',
    phone: 'Phone',
    minute: 'minute',
    sendWhatsAppReminder: 'Send WhatsApp Reminder',
    close: 'Close',

    quickStats: 'Quick Stats',
    totalHours: 'Total Hours',
    newAppointmentBtn: 'New Appointment',

    appointmentAdded: 'Appointment Added',
    reminderSent: 'Reminder Sent',
    reminderSentDirectly: 'Message sent directly via WhatsApp API',
    whatsappOpened: 'WhatsApp opened to send reminder to',
    whatsappOpenedFor: 'WhatsApp opened to send reminder to {name}',
    enterName: 'Enter name',
    "Name": "Name",
    error: 'Error',
    reminderError: 'Reminder Error',
    whatsappSendError: 'Failed to send WhatsApp message. Please try again.',
    missingPhoneNumber: 'Client phone number is missing',
    errorBookingAppointment: 'Error booking appointment',
    updated: 'Updated',
    appointmentUpdatedSuccessfully: 'Appointment updated successfully',
    errorUpdatingAppointment: 'Error updating appointment',
    deleted: 'Deleted',
    appointmentDeletedSuccessfully: 'Appointment deleted successfully',
    errorDeletingAppointment: 'Error deleting appointment',
    
    whatsappMessageTemplate: 'Hello {clientName}, this is a reminder for your appointment at Lina Pure Nails:\n\nDate: {date}\nTime: {time}\nService: {service}\n\nWe look forward to seeing you!',
    
    edit: 'Edit',
    delete: 'Delete',
    updateAppointment: 'Update Appointment',
    Type: 'Service',
    "AM": "AM",
    "PM": "PM",
    
    sendTomorrowReminders: 'Send Tomorrow\'s Reminders',
    sendingReminders: 'Sending Reminders...',
    remindersSent: 'Reminders Sent',
    remindersError: 'Error Sending Reminders',
    unknownError: 'An unknown error occurred',
    scheduledReminderInfo: 'Reminders are automatically sent at 8:00 PM daily',
    "Loading...": "Loading...",
    "appointment": "appointment",
    "appointments": "appointments",
    
    "Monday": "Monday",
    "Tuesday": "Tuesday",
    "Wednesday": "Wednesday",
    "Thursday": "Thursday",
    "Friday": "Friday",
    "Saturday": "Saturday",
    "Sunday": "Sunday",
    
    "January": "January",
    "February": "February",
    "March": "March",
    "April": "April",
    "May": "May",
    "June": "June",
    "July": "July",
    "August": "August",
    "September": "September",
    "October": "October",
    "November": "November",
    "December": "December"
  },
  ar: {
    dashboardTitle: 'لوحة تحكم المواعيد',

    workingHours: 'ساعات العمل: 10:00 صباحاً - 8:00 مساءً',
    noAppointments: 'لا توجد مواعيد مجدولة لهذا اليوم',
    todayAppointments: 'مواعيد اليوم',
    appointments: 'مواعيد',
    clickTimeSlot: 'انقر على وقت محدد لعرض التفاصيل أو إضافة موعد',

    available: 'متاح',
    past: 'مضى',

    newAppointment: 'موعد جديد في',
    fillDetails: 'املأ التفاصيل أدناه لحجز موعد جديد',
    clientName: 'اسم العميل',
    enterClientName: 'أدخل اسم العميل',
    phoneNumber: 'رقم الهاتف',
    service: 'الخدمة',
    selectService: 'اختر خدمة',
    time: 'الوقت',
    selectTime: 'اختر وقتاً',
    notes: 'ملاحظات (اختياري)',
    addNotes: 'أضف أي ملاحظات إضافية هنا',
    cancel: 'إلغاء',
    addAppointment: 'إضافة موعد',

    manicure: 'مانيكير',
    pedicure: 'باديكير',
    both: 'كلاهما',

    appointmentDetails: 'تفاصيل الموعد',
    client: 'العميل',
    duration: 'المدة',
    phone: 'الهاتف',
    minute: 'دقيقة',
    sendWhatsAppReminder: 'إرسال تذكير واتساب',
    close: 'إغلاق',

    quickStats: 'إحصائيات سريعة',
    totalHours: 'إجمالي الساعات',

    newAppointmentBtn: 'موعد جديد',

    appointmentAdded: 'تمت إضافة الموعد',
    reminderSent: 'تم إرسال التذكير',
    reminderSentDirectly: 'تم إرسال الرسالة مباشرة عبر واتساب API',
    whatsappOpened: 'تم فتح واتساب لإرسال تذكير إلى',
    whatsappOpenedFor: 'تم فتح واتساب لإرسال تذكير إلى {name}',
    enterName: 'ادخل اسم الزبون',
    "Name": "الاسم",
    error: 'خطأ',
    reminderError: 'خطأ في التذكير',
    whatsappSendError: 'فشل في إرسال رسالة واتساب. يرجى المحاولة مرة أخرى.',
    missingPhoneNumber: 'رقم هاتف العميل مفقود',
    errorBookingAppointment: 'حدث خطأ أثناء حجز الموعد',
    updated: 'تم التحديث',
    appointmentUpdatedSuccessfully: 'تم تحديث الموعد بنجاح',
    errorUpdatingAppointment: 'حدث خطأ أثناء تحديث الموعد',
    deleted: 'تم الحذف',
    appointmentDeletedSuccessfully: 'تم حذف الموعد بنجاح',
    errorDeletingAppointment: 'حدث خطأ أثناء حذف الموعد',
    
    whatsappMessageTemplate: 'مرحباً {clientName}، هذا تذكير بموعدك في لينا بيور نيلز:\n\nالتاريخ: {date}\nالوقت: {time}\nالخدمة: {service}\n\nنتطلع لرؤيتك!',
    
    edit: 'تعديل',
    delete: 'حذف',
    updateAppointment: 'تحديث الموعد',
    Type: 'الخدمة',
    "AM": "صباحاً",
    "PM": "مساءً",
    
    sendTomorrowReminders: 'إرسال تذكيرات الغد',
    sendingReminders: 'جاري إرسال التذكيرات...',
    remindersSent: 'تم إرسال التذكيرات',
    remindersError: 'خطأ في إرسال التذكيرات',
    unknownError: 'حدث خطأ غير معروف',
    scheduledReminderInfo: 'يتم إرسال التذكيرات تلقائياً في الساعة 8:00 مساءً يومياً',
    "Loading...": "جاري التحميل...",
    "appointment": "موعد",
    
    "Monday": "الإثنين",
    "Tuesday": "الثلاثاء",
    "Wednesday": "الأربعاء",
    "Thursday": "الخميس",
    "Friday": "الجمعة",
    "Saturday": "السبت",
    "Sunday": "الأحد",
    
    "January": "يناير",
    "February": "فبراير",
    "March": "مارس",
    "April": "أبريل",
    "May": "مايو",
    "June": "يونيو",
    "July": "يوليو",
    "August": "أغسطس",
    "September": "سبتمبر",
    "October": "أكتوبر",
    "November": "نوفمبر",
    "December": "ديسمبر"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage === 'en' || savedLanguage === 'ar') ? savedLanguage : 'en';
  });

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
