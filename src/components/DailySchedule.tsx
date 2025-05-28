import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import DayAppointments from './DayAppointments';

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  phone: string;
  notes?: string;
}

const DailySchedule = ({
  date,
  appointments,
  onAddAppointment
}: {
  date: Date;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}) => {
  const { language, t } = useLanguage();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-serif text-salon-gold" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {format(date, "EEEE, MMMM d, yyyy")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DayAppointments 
          date={date}
          appointments={appointments}
          onAddAppointment={onAddAppointment}
        />
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
