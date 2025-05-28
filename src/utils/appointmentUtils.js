import { format } from 'date-fns';
export const formatTimeForDisplay = (time) => {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const isPm = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minuteStr} ${isPm ? 'مساءً' : 'صباحاً'}`;
};
export const createWhatsAppMessage = (clientName, date, time, service, duration) => {
    const appointmentDate = format(date, 'yyyy/MM/dd');
    const timeFormatted = formatTimeForDisplay(time);
    return `مرحباً ${clientName}، هذا تذكير بموعدك في لينا بيور نيلز:\n\nالتاريخ: ${appointmentDate}\nالوقت: ${timeFormatted}\nالخدمة: ${service}\nالمدة: ${duration} دقيقة\n\nنتطلع لرؤيتك!`;
};
export const sendWhatsAppReminder = (phone, message) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};
