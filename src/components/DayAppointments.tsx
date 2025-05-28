import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Appointment } from './DailySchedule';
import AppointmentForm from './AppointmentForm';
import AppointmentDetailsModal from './appointment/AppointmentDetailsModal';
import TimeSlot from './appointment/TimeSlot';

const WORK_HOURS = {
  start: 10,
  end: 20,
};

const DayAppointments = ({ 
  date,
  appointments,
  onAddAppointment
}: {
  date: Date;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
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
        const isPast = isToday && (
          hour < now.getHours() || 
          (hour === now.getHours() && minute < now.getMinutes())
        );
        
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

  const handleTimeSlotClick = (slot: { time: string; appointment: Appointment | undefined; isPast: boolean }) => {
    if (slot.isPast) return;
    
    setSelectedSlot(slot.time);
    if (slot.appointment) {
      setShowAppointmentDetails(true);
    } else {
      setShowAppointmentForm(true);
    }
  };

  const handleAddAppointmentClick = () => {
    setSelectedSlot(null);
    setShowAppointmentForm(true);
  };

  const handleFormSubmit = (data: Omit<Appointment, 'id'>) => {
    onAddAppointment(data);
    setShowAppointmentForm(false);
  };

  const selectedAppointment = selectedSlot 
    ? appointments.find(apt => apt.time === selectedSlot)
    : undefined;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="text-sm text-gray-500">ساعات العمل: {formattedHours}</div>
      
      {!hasAppointments && (
        <div className="py-4 text-center border border-dashed rounded-md">
          <p className="mb-2 text-gray-500">لا توجد مواعيد مجدولة لهذا اليوم</p>
        </div>
      )}

      {timeSlots.map((slot) => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          appointment={slot.appointment}
          isPast={slot.isPast}
          onClick={() => handleTimeSlotClick(slot)}
        />
      ))}

      <div className="flex justify-center mt-4">
        <Button onClick={handleAddAppointmentClick} className="bg-salon-gold hover:bg-salon-light-gold text-white">
          <Plus className="mr-2 h-4 w-4" />
          موعد جديد
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
        onClose={() => setShowAppointmentDetails(false)}
        appointment={selectedAppointment}
        date={date}
      />
    </div>
  );
};

export default DayAppointments;
