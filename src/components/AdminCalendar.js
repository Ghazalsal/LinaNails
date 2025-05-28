import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/libs/utils';
const AppointmentCalendar = ({ selectedDate, onSelectDate, appointments, onAddAppointment }) => {
    const disableSunday = (date) => date.getDay() === 0;
    const handleDateClick = (date) => {
        onSelectDate(date);
    };
    return (_jsx(_Fragment, { children: _jsx(Card, { className: "w-full shadow-md", children: _jsx(CardContent, { className: "p-4", children: _jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: handleDateClick, className: cn("p-3 pointer-events-auto rounded-md border"), disabled: disableSunday }) }) }) }));
};
export default AppointmentCalendar;
