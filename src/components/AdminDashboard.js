import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import DailySchedule from './DailySchedule';
import LanguageSwitcher from './LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentCalendar from './AdminCalendar';
import { fetchAppointmentsByDate } from '@/api';
const AdminDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const { toast } = useToast();
    const { language, t } = useLanguage();
    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const data = await fetchAppointmentsByDate(selectedDate);
                const converted = data.map((apt) => ({
                    id: String(apt.id),
                    clientName: apt.name,
                    service: apt.type,
                    time: format(new Date(apt.time), 'HH:mm'),
                    duration: 60,
                    phone: apt.phone,
                    notes: apt.notes,
                }));
                setAppointments(converted);
            }
            catch (err) {
                toast({ title: t('error'), description: 'Failed to load appointments' });
                console.log(err);
            }
        };
        loadAppointments();
    }, [selectedDate]);
    const handleSelectDate = (date) => {
        if (date)
            setSelectedDate(date);
    };
    const handleAddAppointment = (appointmentData) => {
        const newAppointment = {
            ...appointmentData,
            id: `appointment-${Date.now()}`,
        };
        setAppointments([...appointments, newAppointment]); // Optimistic UI
        toast({
            title: t('appointmentAdded'),
            description: `${appointmentData.clientName} ${language === 'ar' ? 'في' : 'on'} ${format(selectedDate, 'MMM dd')} - ${appointmentData.time}`,
        });
        // TODO: Also POST to backend
    };
    const filteredAppointments = appointments.filter(() => true); // Optional filter
    return (_jsxs("div", { className: "container mx-auto p-4", dir: language === 'ar' ? 'rtl' : 'ltr', children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("div", { className: "flex-1" }), _jsx("div", { className: "flex justify-center flex-1", children: _jsx("img", { src: "logo-lina.png", alt: "Lina Pure Nails Logo", className: "h-40 w-auto" }) }), _jsx("div", { className: "flex-1 flex justify-end", children: _jsx(LanguageSwitcher, {}) })] }), _jsx("p", { className: "text-gray-600", children: t('dashboardTitle') })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsx("div", { className: "lg:col-span-4", children: _jsxs("div", { className: "space-y-6", children: [_jsx(AppointmentCalendar, { selectedDate: selectedDate, onSelectDate: handleSelectDate, appointments: filteredAppointments, onAddAppointment: handleAddAppointment }), _jsxs(Card, { className: "shadow-md", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-xl font-serif text-salon-gold", children: t('quickStats') }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [_jsxs("div", { className: "bg-salon-light-pink p-4 rounded-md", children: [_jsx("p", { className: "text-gray-600", children: t('todayAppointments') }), _jsx("p", { className: "text-2xl font-bold", children: filteredAppointments.length })] }), _jsxs("div", { className: "bg-salon-light-gold p-4 rounded-md", children: [_jsx("p", { className: "text-gray-600", children: t('totalHours') }), _jsx("p", { className: "text-2xl font-bold", children: Math.round(filteredAppointments.reduce((total, apt) => total + apt.duration, 0) / 60) })] })] }) })] })] }) }), _jsx("div", { className: "lg:col-span-8", children: _jsx(DailySchedule, { date: selectedDate, appointments: filteredAppointments, onAddAppointment: handleAddAppointment }) })] })] }));
};
export default AdminDashboard;
