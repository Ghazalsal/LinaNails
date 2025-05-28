import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';
const SERVICES = [
    { id: "manicure", name: { en: "Manicure", ar: "مانيكير" }, duration: 45 },
    { id: "pedicure", name: { en: "Pedicure", ar: "باديكير" }, duration: 60 },
    { id: "gel-nails", name: { en: "Gel Nails", ar: "أظافر جل" }, duration: 75 },
    { id: "nail-art", name: { en: "Nail Art", ar: "فن الأظافر" }, duration: 90 },
    { id: "polish-change", name: { en: "Polish Change", ar: "تغيير الطلاء" }, duration: 30 },
    { id: "acrylic-full-set", name: { en: "Acrylic Full Set", ar: "مجموعة أكريليك كاملة" }, duration: 90 },
    { id: "acrylic-fill", name: { en: "Acrylic Fill", ar: "تعبئة أكريليك" }, duration: 60 },
];
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 10; hour < 20; hour++) {
        for (const minute of [0, 30]) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            const isPm = hour >= 12;
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            options.push({
                value: `${formattedHour}:${formattedMinute}`,
                label: {
                    en: `${displayHour}:${formattedMinute} ${isPm ? 'PM' : 'AM'}`,
                    ar: `${displayHour}:${formattedMinute} ${isPm ? 'مساءً' : 'صباحاً'}`
                }
            });
        }
    }
    return options;
};
const TIME_OPTIONS = generateTimeOptions();
const AppointmentFormFields = ({ control, onServiceChange }) => {
    const { language, t } = useLanguage();
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { control: control, name: "clientName", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: t('clientName') }), _jsx(FormControl, { children: _jsx(Input, { placeholder: t('enterClientName'), ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: control, name: "phone", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: t('phoneNumber') }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "+972-59-123-4567", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: control, name: "service", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: t('service') }), _jsxs(Select, { onValueChange: (value) => {
                                field.onChange(value);
                                onServiceChange(value);
                            }, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: t('selectService') }) }) }), _jsx(SelectContent, { children: SERVICES.map((service) => (_jsxs(SelectItem, { value: service.id, children: [service.name[language], " (", service.duration, " ", t('minute'), ")"] }, service.id))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: control, name: "time", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: t('time') }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: t('selectTime') }) }) }), _jsx(SelectContent, { children: TIME_OPTIONS.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label[language] }, option.value))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: control, name: "notes", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: t('notes') }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: t('addNotes'), className: "resize-none", ...field }) }), _jsx(FormMessage, {})] })) })] }));
};
export { AppointmentFormFields, SERVICES };
