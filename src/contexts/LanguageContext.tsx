import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    // Header
    dashboardTitle: 'Appointment Dashboard',

    // Calendar & Schedule
    workingHours: 'Working Hours: 10:00 AM - 8:00 PM',
    noAppointments: 'No appointments scheduled for this day',
    todayAppointments: 'Today\'s Appointments',
    clickTimeSlot: 'Click on a specific time to view details or add appointment',

    // Time slots
    available: 'Available',
    past: 'Past',

    // Appointment Form
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

    // Services
    manicure: 'Manicure',
    pedicure: 'Pedicure',
    gelNails: 'Gel Nails',
    nailArt: 'Nail Art',
    polishChange: 'Polish Change',
    acrylicFullSet: 'Acrylic Full Set',
    acrylicFill: 'Acrylic Fill',

    // Appointment Details
    appointmentDetails: 'Appointment Details',
    client: 'Client',
    duration: 'Duration',
    phone: 'Phone',
    minute: 'minute',
    sendWhatsAppReminder: 'Send WhatsApp Reminder',
    close: 'Close',

    // Quick Stats
    quickStats: 'Quick Stats',
    totalHours: 'Total Hours',

    // Buttons
    newAppointmentBtn: 'New Appointment',

    // Toast messages
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
    
    // WhatsApp Message Template
    whatsappMessageTemplate: 'Hello {clientName}, this is a reminder for your appointment at Lina Pure Nails:\n\nDate: {date}\nTime: {time}\nService: {service}\n\nWe look forward to seeing you!',
    editMessageTemplate: 'Edit Message Template',
    saveTemplate: 'Save Template',
    messageTemplateUpdated: 'Message template updated successfully',
    availableVariables: 'Available Variables',
    preview: 'Preview',
sendWhatsAppReminder: 'Send WhatsApp Reminder',
    
    // Action buttons
    edit: 'Edit',
    delete: 'Delete',
    updateAppointment: 'Update Appointment',
    Type: 'Service',
    "AM": "AM",
    "PM": "PM",
    "Loading...": "Loading...",
    "appointment": "appointment",
    "appointments": "appointments",
    
    // Days of the week
    "Monday": "Monday",
    "Tuesday": "Tuesday",
    "Wednesday": "Wednesday",
    "Thursday": "Thursday",
    "Friday": "Friday",
    "Saturday": "Saturday",
    "Sunday": "Sunday",
    
    // Months
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
    // Header
    dashboardTitle: 'لوحة تحكم المواعيد',

    // Calendar & Schedule
    workingHours: 'ساعات العمل: 10:00 صباحاً - 8:00 مساءً',
    noAppointments: 'لا توجد مواعيد مجدولة لهذا اليوم',
    todayAppointments: 'مواعيد اليوم',
    appointments: 'مواعيد',
    clickTimeSlot: 'انقر على وقت محدد لعرض التفاصيل أو إضافة موعد',

    // Time slots
    available: 'متاح',
    past: 'مضى',

    // Appointment Form
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

    // Services
    manicure: 'مانيكير',
    pedicure: 'باديكير',
    gelNails: 'أظافر جل',
    nailArt: 'فن الأظافر',
    polishChange: 'تغيير الطلاء',
    acrylicFullSet: 'مجموعة أكريليك كاملة',
    acrylicFill: 'تعبئة أكريليك',

    // Appointment Details
    appointmentDetails: 'تفاصيل الموعد',
    client: 'العميل',
    duration: 'المدة',
    phone: 'الهاتف',
    minute: 'دقيقة',
    sendWhatsAppReminder: 'إرسال تذكير واتساب',
    close: 'إغلاق',

    // Quick Stats
    quickStats: 'إحصائيات سريعة',
    totalHours: 'إجمالي الساعات',

    // Buttons
    newAppointmentBtn: 'موعد جديد',

    // Toast messages
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
sendWhatsAppReminder: 'إرسال تذكير واتساب',
    errorDeletingAppointment: 'حدث خطأ أثناء حذف الموعد',
    
    // WhatsApp Message Template
    whatsappMessageTemplate: 'مرحباً {clientName}، هذا تذكير بموعدك في لينا بيور نيلز:\n\nالتاريخ: {date}\nالوقت: {time}\nالخدمة: {service}\n\nنتطلع لرؤيتك!',
    editMessageTemplate: 'تعديل قالب الرسالة',
    saveTemplate: 'حفظ القالب',
    messageTemplateUpdated: 'تم تحديث قالب الرسالة بنجاح',
    availableVariables: 'المتغيرات المتاحة',
    preview: 'معاينة',
    
    // Action buttons
    edit: 'تعديل',
    delete: 'حذف',
    updateAppointment: 'تحديث الموعد',
    Type: 'الخدمة',
    "AM": "صباحاً",
    "PM": "مساءً",
    "Loading...": "جاري التحميل...",
    "appointment": "موعد",
    
    // Days of the week
    "Monday": "الإثنين",
    "Tuesday": "الثلاثاء",
    "Wednesday": "الأربعاء",
    "Thursday": "الخميس",
    "Friday": "الجمعة",
    "Saturday": "السبت",
    "Sunday": "الأحد",
    
    // Months
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
  const [language, setLanguage] = useState<Language>('en');

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
