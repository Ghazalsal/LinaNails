import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import DayAppointments from './DayAppointments';
import { BackendAppointment } from '@/api';

interface DailyScheduleProps {
  date: Date;
  appointments: BackendAppointment[];
  onAppointmentsChange?: () => Promise<boolean>;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({
  date,
  appointments,
  onAppointmentsChange,
}) => {
  const { language, t } = useLanguage();

  const handleCreate = async (newAppointment: BackendAppointment) => {
    // The appointment is already created by DayAppointments, just refresh the list
    if (onAppointmentsChange) {
      await onAppointmentsChange();
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<BackendAppointment>) => {
    // The appointment is already updated by DayAppointments, just refresh the list
    if (onAppointmentsChange) {
      await onAppointmentsChange();
    }
  };

  const handleDelete = async (id: string) => {
    // The appointment is already deleted by DayAppointments, just refresh the list
    if (onAppointmentsChange) {
      await onAppointmentsChange();
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-serif text-salon-gold" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {(() => {
            const day = format(date, "EEEE");
            const month = format(date, "MMMM");
            const dayNum = format(date, "d");
            const year = format(date, "yyyy");

            const translatedDay = t(day);
            const translatedMonth = t(month);

            return language === 'ar'
              ? `${translatedDay}، ${dayNum} ${translatedMonth}، ${year}`
              : `${translatedDay}, ${translatedMonth} ${dayNum}, ${year}`;
          })()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DayAppointments
          date={date}
          appointments={appointments}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default DailySchedule;