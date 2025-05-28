import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import AppointmentDetailsModal from './appointment/AppointmentDetailsModal';
import TimeSlot from './appointment/TimeSlot';
const WORK_HOURS = {
    start: 10,
    end: 20,
};
const DayAppointments = ({ date, appointments, onAddAppointment }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
            for (let minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const appointment = appointments.find(apt => apt.time === timeString);
                const isPast = isToday && (hour < now.getHours() ||
                    (hour === now.getHours() && minute < now.getMinutes()));
                slots.push({
                    time: timeString,
                    appointment,
                    isPast
                });
            }
        }
        return slots;
    };
    const timeSlots = generateTimeSlots();
    const formattedHours = `${WORK_HOURS.start}:00 صباحاً - ${WORK_HOURS.end - 12}:00 مساءً`;
    const hasAppointments = appointments.length > 0;
    const handleTimeSlotClick = (slot) => {
        if (slot.isPast)
            return;
        setSelectedSlot(slot.time);
        if (slot.appointment) {
            setShowAppointmentDetails(true);
        }
        else {
            setShowAppointmentForm(true);
        }
    };
    const handleAddAppointmentClick = () => {
        setSelectedSlot(null);
        setShowAppointmentForm(true);
    };
    const handleFormSubmit = (data) => {
        onAddAppointment(data);
        setShowAppointmentForm(false);
    };
    const selectedAppointment = selectedSlot
        ? appointments.find(apt => apt.time === selectedSlot)
        : undefined;
    return (_jsxs("div", { className: "space-y-4", dir: "rtl", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0639\u0645\u0644: ", formattedHours] }), !hasAppointments && (_jsx("div", { className: "py-4 text-center border border-dashed rounded-md", children: _jsx("p", { className: "mb-2 text-gray-500", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u0639\u064A\u062F \u0645\u062C\u062F\u0648\u0644\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645" }) })), timeSlots.map((slot) => (_jsx(TimeSlot, { time: slot.time, appointment: slot.appointment, isPast: slot.isPast, onClick: () => handleTimeSlotClick(slot) }, slot.time))), _jsx("div", { className: "flex justify-center mt-4", children: _jsxs(Button, { onClick: handleAddAppointmentClick, className: "bg-salon-gold hover:bg-salon-light-gold text-white", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "\u0645\u0648\u0639\u062F \u062C\u062F\u064A\u062F"] }) }), _jsx(AppointmentForm, { isOpen: showAppointmentForm, onClose: () => setShowAppointmentForm(false), onSubmit: handleFormSubmit, date: date, preselectedTime: selectedSlot }), _jsx(AppointmentDetailsModal, { isOpen: showAppointmentDetails, onClose: () => setShowAppointmentDetails(false), appointment: selectedAppointment, date: date })] }));
};
export default DayAppointments;
