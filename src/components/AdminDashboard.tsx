import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import DailySchedule, { Appointment } from './DailySchedule';
import LanguageSwitcher from './LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppointmentCalendar from './AdminCalendar';
import { fetchAppointmentsByDate } from '@/api';

const AdminDashboard = () => {
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointmentsByDate(selectedDate);
        const converted: Appointment[] = data.map((apt) => ({
          id: String(apt.id),
          clientName: apt.name,
          service: apt.type,
          time: format(new Date(apt.time), 'HH:mm'),
          duration: 60,
          phone: apt.phone,
          notes: apt.notes,
        }));
        setAppointments(converted);
      } catch (err) {
        toast({ title: t('error'), description: 'Failed to load appointments' });
        console.log(err);
      }
    };
    loadAppointments();
  }, [selectedDate]);

  const handleSelectDate = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
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

  return (
    <div className="container mx-auto p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="mb-8 text-center">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1"></div>
          <div className="flex justify-center flex-1">
            <img 
              src="logo-lina.png" 
              alt="Lina Pure Nails Logo" 
              className="h-40 w-auto"
            />
          </div>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
        <p className="text-gray-600">{t('dashboardTitle')}</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="space-y-6">
            <AppointmentCalendar 
              selectedDate={selectedDate} 
              onSelectDate={handleSelectDate}
              appointments={filteredAppointments}
              onAddAppointment={handleAddAppointment}
            />
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif text-salon-gold">
                  {t('quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-salon-light-pink p-4 rounded-md">
                    <p className="text-gray-600">{t('todayAppointments')}</p>
                    <p className="text-2xl font-bold">{filteredAppointments.length}</p>
                  </div>
                  <div className="bg-salon-light-gold p-4 rounded-md">
                    <p className="text-gray-600">{t('totalHours')}</p>
                    <p className="text-2xl font-bold">
                      {Math.round(filteredAppointments.reduce((total, apt) => total + apt.duration, 0) / 60)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <DailySchedule 
            date={selectedDate}
            appointments={filteredAppointments}
            onAddAppointment={handleAddAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
