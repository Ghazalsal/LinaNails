import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatTimeForDisplay, createWhatsAppMessage, sendWhatsAppReminder } from '@/utils/appointmentUtils';
const AppointmentDetailsModal = ({ isOpen, onClose, appointment, date }) => {
    const { toast } = useToast();
    const handleSendWhatsAppReminder = () => {
        if (!appointment)
            return;
        const message = createWhatsAppMessage(appointment.clientName, date, appointment.time, appointment.service, appointment.duration);
        sendWhatsAppReminder(appointment.phone, message);
        toast({
            title: "تم إرسال التذكير",
            description: `تم فتح واتساب لإرسال تذكير إلى ${appointment.clientName}`,
        });
    };
    if (!appointment)
        return null;
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", dir: "rtl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-xl font-serif text-salon-gold", children: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0648\u0639\u062F" }) }), _jsxs("div", { className: "space-y-4 pt-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0627\u0644\u0639\u0645\u064A\u0644" }), _jsx("p", { className: "text-lg", children: appointment.clientName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0627\u0644\u0648\u0642\u062A" }), _jsx("p", { className: "text-lg", children: formatTimeForDisplay(appointment.time) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0627\u0644\u062E\u062F\u0645\u0629" }), _jsx("p", { className: "text-lg", children: appointment.service })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0627\u0644\u0645\u062F\u0629" }), _jsxs("p", { className: "text-lg", children: [appointment.duration, " \u062F\u0642\u064A\u0642\u0629"] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0627\u0644\u0647\u0627\u062A\u0641" }), _jsx("p", { className: "text-lg", children: appointment.phone })] }), appointment.notes && (_jsxs("div", { className: "col-span-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A" }), _jsx("p", { className: "text-lg", children: appointment.notes })] }))] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4 gap-2", children: [_jsxs(Button, { onClick: handleSendWhatsAppReminder, className: "bg-green-600 hover:bg-green-700 text-white", children: [_jsx(MessageCircle, { className: "ml-2 h-4 w-4" }), "\u0625\u0631\u0633\u0627\u0644 \u062A\u0630\u0643\u064A\u0631 \u0648\u0627\u062A\u0633\u0627\u0628"] }), _jsx(Button, { onClick: onClose, className: "bg-salon-gold hover:bg-salon-light-gold text-white", children: "\u0625\u063A\u0644\u0627\u0642" })] })] })] }) }));
};
export default AppointmentDetailsModal;
