import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const translations = {
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
        todayAppointments: 'Today\'s Appointments',
        totalHours: 'Total Hours',
        // Buttons
        newAppointmentBtn: 'New Appointment',
        // Toast messages
        appointmentAdded: 'Appointment Added',
        reminderSent: 'Reminder Sent',
        whatsappOpened: 'WhatsApp opened to send reminder to',
    },
    ar: {
        // Header
        dashboardTitle: 'لوحة تحكم المواعيد',
        // Calendar & Schedule
        workingHours: 'ساعات العمل: 10:00 صباحاً - 8:00 مساءً',
        noAppointments: 'لا توجد مواعيد مجدولة لهذا اليوم',
        todayAppointments: 'مواعيد اليوم',
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
        todayAppointments: 'مواعيد اليوم',
        totalHours: 'إجمالي الساعات',
        // Buttons
        newAppointmentBtn: 'موعد جديد',
        // Toast messages
        appointmentAdded: 'تمت إضافة الموعد',
        reminderSent: 'تم إرسال التذكير',
        whatsappOpened: 'تم فتح واتساب لإرسال تذكير إلى',
    }
};
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ar');
    const t = (key) => {
        return translations[language][key] || key;
    };
    return (_jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children: children }));
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
