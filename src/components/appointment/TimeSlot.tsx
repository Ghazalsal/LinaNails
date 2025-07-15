import React from 'react';
import { cn } from '@/libs/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTimeForDisplay, translateServiceType } from '@/utils/AppointmentUtils';
import { Plus } from 'lucide-react';
import { TimeSlotProps } from './types';

const TimeSlot = ({ time, appointment, appointments = [], isPast, onClick, onAppointmentClick, onAddClick }: TimeSlotProps) => {
  const { t, language } = useLanguage();
  
  const allAppointments = appointments.length > 0 ? appointments : (appointment ? [appointment] : []);
  const hasAppointments = allAppointments.length > 0;
  
  return (
    <div
      className={cn(
        "p-3 rounded-md border transition-colors",
        hasAppointments ? "bg-salon-light-pink border-salon-gold" :
          isPast ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 cursor-pointer"
      )}
      onClick={!hasAppointments && !isPast ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          {(() => {
            const timeString = formatTimeForDisplay(time);
            return timeString
              .replace('AM', t('AM'))
              .replace('PM', t('PM'));
          })()}
        </span>
        {!hasAppointments && !isPast && (
          <span className="text-sm text-gray-400">{t('available')}</span>
        )}
        {!hasAppointments && isPast && (
          <span className="text-sm text-gray-400">{t('past')}</span>
        )}
      </div>
      
      {hasAppointments && (
        <div className="space-y-2">
          {allAppointments.map((apt) => (
            <div 
              key={apt.id} 
              className="flex items-center justify-between p-2 bg-white rounded border border-salon-gold cursor-pointer hover:bg-gray-50"
              onClick={() => onAppointmentClick ? onAppointmentClick(apt) : undefined}
            >
              <span className="text-sm">{apt.name} - {translateServiceType(apt.type, language, t)}</span>
            </div>
          ))}
          
          {!isPast && onAddClick && (
            <div 
              className="flex items-center justify-center p-2 bg-white rounded border border-dashed border-salon-gold cursor-pointer hover:bg-gray-50 mt-2"
              onClick={onAddClick}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-sm">{t('addAppointment')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;