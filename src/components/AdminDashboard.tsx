import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import DailySchedule from './DailySchedule';
import LanguageSwitcher from './LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentCalendar from './AdminCalendar';
import { BackendAppointment, fetchAppointmentsByDate, sendTomorrowReminders } from '@/api';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const loadAppointments = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const data = await fetchAppointmentsByDate(date);
      const converted: BackendAppointment[] = data.map((apt) => ({
        id: String(apt.id),
        name: apt.name,
        type: apt.type,
        time: format(new Date(apt.time), 'HH:mm'),
        duration: 60,
        phone: apt.phone,
        notes: apt.notes,
      }));
      setAppointments(converted);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "\u062e\u0637\u0623",
        description: "\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAppointments(selectedDate);
  }, [selectedDate, loadAppointments]);

  const handleSelectDate = (date: Date | undefined) => {
    if (date && !loading) {
      setSelectedDate(date);
    }
  };

  const refreshAppointments = useCallback(async () => {
    await loadAppointments(selectedDate);
    return true;
  }, [selectedDate, loadAppointments]);

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
              appointments={appointments}
              loading={loading}
            />

            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif text-salon-gold">
                  {t('quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-2 gap-4 text-center">
                  <div className="bg-salon-light-pink p-4 rounded-md">
                    <p className="text-gray-600">{t('todayAppointments')}</p>
                    <p className="text-2xl font-bold">
                      {loading ? '...' : appointments.length}
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
            appointments={appointments}
            onAppointmentsChange={refreshAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
