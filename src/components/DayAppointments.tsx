import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AppointmentDetailsModal from './appointment/AppointmentDetailsModal';
import TimeSlot from './appointment/TimeSlot';
import { createAppointment, updateAppointment, deleteAppointment, BackendAppointment, CreateAppointmentData, UpdateAppointmentData } from '@/api';
import { useToast } from '@/hooks/use-toast';
import AppointmentForm from './AppointmentForm';
import { useLanguage } from '@/contexts/LanguageContext';

const WORK_HOURS = {
  start: 10,
  end: 20,
};

const DayAppointments = ({
  date,
  appointments,
  onAppointmentsChange
}: {
  date: Date;
  appointments: BackendAppointment[];
  onAppointmentsChange?: () => void;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<BackendAppointment | undefined>(undefined);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const timeAppointments = appointments.filter(apt => apt.time === timeString);
        const isPast = isToday && (
          hour < now.getHours() || 
          (hour === now.getHours() && minute < now.getMinutes())
        );
        
        slots.push({
          time: timeString,
          appointment: timeAppointments.length > 0 ? timeAppointments[0] : undefined,
          appointments: timeAppointments,
          isPast
        });
      }
    }
    
    return slots;
  };

  const { t, language } = useLanguage();
  const timeSlots = generateTimeSlots();
  const formattedHours = t('workingHours');
  const hasAppointments = appointments.length > 0;

  const handleTimeSlotClick = (slot: { time: string; appointment: BackendAppointment | undefined; appointments?: BackendAppointment[]; isPast: boolean }) => {
    if (slot.isPast) return;
    setSelectedSlot(slot.time);
    setShowAppointmentForm(true);
  };
  
  const handleAppointmentClick = (appointment: BackendAppointment) => {
    setSelectedSlot(appointment.time);
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };
  
  const handleAddToTimeSlot = (time: string) => {
    setSelectedSlot(time);
    setShowAppointmentForm(true);
  };

  const handleAddAppointmentClick = () => {
    setSelectedSlot(null);
    setShowAppointmentForm(true);
  };

  const handleFormSubmit = async (data: Omit<BackendAppointment, 'id'>) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const appointmentData: CreateAppointmentData = {
        ...data,
        date: formattedDate
      };
      
      const newAppointment = await createAppointment(appointmentData);
      setShowAppointmentForm(false);
      if(newAppointment?.id){
        toast({
        title: t('appointmentAdded'),
        description: t('appointmentAdded'),
      });
        if (onAppointmentsChange) {
          onAppointmentsChange();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorBookingAppointment'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (id: string, data: Partial<Omit<BackendAppointment, 'id'>>) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const appointmentData: UpdateAppointmentData = {
        ...data,
        date: formattedDate
      };
      
      const updated = await updateAppointment(id, appointmentData);
      if(updated?.id){
        setShowAppointmentDetails(false);
        setSelectedAppointment(undefined);
        toast({
          title: t('updated'),
          description: t('appointmentUpdatedSuccessfully'),
        });
        if (onAppointmentsChange) {
          onAppointmentsChange();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorUpdatingAppointment'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteAppointment(id);
      setShowAppointmentDetails(false);
      setSelectedAppointment(undefined);
      toast({
        title: t('deleted'),
        description: t('appointmentDeletedSuccessfully'),
      });
      if (onAppointmentsChange) {
        onAppointmentsChange();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorDeletingAppointment'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-sm text-gray-500">{formattedHours}</div>
      
      {!hasAppointments && (
        <div className="py-4 text-center border border-dashed rounded-md">
          <p className="mb-2 text-gray-500">{t('noAppointments')}</p>
        </div>
      )}

      {timeSlots.map((slot) => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          appointment={slot.appointment}
          appointments={slot.appointments}
          isPast={slot.isPast}
          onClick={() => handleTimeSlotClick(slot)}
          onAppointmentClick={handleAppointmentClick}
          onAddClick={!slot.isPast ? () => handleAddToTimeSlot(slot.time) : undefined}
        />
      ))}

      <div className="flex justify-center mt-4">
        <Button onClick={handleAddAppointmentClick} className="bg-salon-gold hover:bg-salon-light-gold text-white">
          <Plus className={language === 'ar' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
          {t('newAppointmentBtn')}
        </Button>
      </div>

      <AppointmentForm 
        isOpen={showAppointmentForm} 
        onClose={() => setShowAppointmentForm(false)}
        onSubmit={handleFormSubmit}
        date={date}
        preselectedTime={selectedSlot}
      />

      <AppointmentDetailsModal
        isOpen={showAppointmentDetails}
        onClose={() => {
          setShowAppointmentDetails(false);
          setSelectedAppointment(undefined);
        }}
        appointment={selectedAppointment}
        date={date}
        onUpdate={handleUpdateAppointment}
        onDelete={handleDeleteAppointment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DayAppointments;
