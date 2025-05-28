import React from 'react';
import { cn } from '@/libs/utils';
import { Appointment } from '../DailySchedule';
import { formatTimeForDisplay } from '@/utils/appointmentUtils';

interface TimeSlotProps {
  time: string;
  appointment: Appointment | undefined;
  isPast: boolean;
  onClick: () => void;
}

const TimeSlot = ({ time, appointment, isPast, onClick }: TimeSlotProps) => {
  return (
    <div 
      className={cn(
        "p-3 rounded-md border cursor-pointer transition-colors",
        appointment ? "bg-salon-light-pink border-salon-gold" : 
        isPast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {formatTimeForDisplay(time)}
        </span>
        {appointment ? (
          <span className="truncate max-w-[150px]">{appointment.clientName} - {appointment.service}</span>
        ) : !isPast ? (
          <span className="text-sm text-gray-400">متاح</span>
        ) : (
          <span className="text-sm text-gray-400">مضى</span>
        )}
      </div>
    </div>
  );
};

export default TimeSlot;