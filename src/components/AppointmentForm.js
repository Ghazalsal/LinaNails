import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AppointmentFormFields, SERVICES } from './forms/AppointmentFormFields';
import { useLanguage } from '@/contexts/LanguageContext';
const appointmentSchema = z.object({
    clientName: z.string().min(2, { message: "Client name is required" }),
    service: z.string().min(1, { message: "Service type is required" }),
    time: z.string().min(1, { message: "Appointment time is required" }),
    duration: z.number().positive({ message: "Duration must be positive" }),
    phone: z.string().min(10, { message: "Valid phone number required" }),
    notes: z.string().optional(),
});
const AppointmentForm = ({ isOpen, onClose, onSubmit, date, preselectedTime = null }) => {
    const { language, t } = useLanguage();
    const form = useForm({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            clientName: '',
            service: '',
            time: preselectedTime || '',
            duration: 45,
            phone: '+972-',
            notes: '',
        }
    });
    useEffect(() => {
        if (preselectedTime) {
            form.setValue('time', preselectedTime);
        }
    }, [preselectedTime, form]);
    const handleServiceChange = (value) => {
        const service = SERVICES.find(s => s.id === value);
        if (service) {
            form.setValue('duration', service.duration);
        }
    };
    const handleSubmit = (data) => {
        onSubmit({
            clientName: data.clientName,
            service: SERVICES.find(s => s.id === data.service)?.name[language] || data.service,
            time: data.time,
            duration: data.duration,
            phone: data.phone,
            notes: data.notes,
        });
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", dir: language === 'ar' ? 'rtl' : 'ltr', children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "text-xl font-serif text-salon-gold", children: [t('newAppointment'), " ", format(date, "MMM d, yyyy")] }), _jsx(DialogDescription, { children: t('fillDetails') })] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4 pt-4", children: [_jsx(AppointmentFormFields, { control: form?.control, onServiceChange: handleServiceChange }), _jsxs(DialogFooter, { className: `flex gap-2 ${language === 'ar' ? 'justify-between' : 'justify-end'}`, children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: t('cancel') }), _jsx(Button, { type: "submit", className: "bg-salon-gold hover:bg-salon-light-gold text-white", children: t('addAppointment') })] })] }) })] }) }));
};
export default AppointmentForm;
