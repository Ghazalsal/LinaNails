import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import DayAppointments from './DayAppointments';
const DailySchedule = ({ date, appointments, onAddAppointment }) => {
    const { language, t } = useLanguage();
    return (_jsxs(Card, { className: "w-full shadow-md", children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: _jsx("div", { children: _jsx(CardTitle, { className: "text-xl font-serif text-salon-gold", dir: language === 'ar' ? 'rtl' : 'ltr', children: format(date, "EEEE, MMMM d, yyyy") }) }) }), _jsx(CardContent, { children: _jsx(DayAppointments, { date: date, appointments: appointments, onAddAppointment: onAddAppointment }) })] }));
};
export default DailySchedule;
