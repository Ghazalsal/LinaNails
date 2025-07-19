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

const DailySchedule = ({
  date,
  appointments,
  onAppointmentsChange
}: {
  date: Date;
  appointments: BackendAppointment[];
  onAppointmentsChange?: () => Promise<boolean>;
}) => {
  const { language, t } = useLanguage();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
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
        </div>
      </CardHeader>
      <CardContent>
        <DayAppointments 
          date={date}
          appointments={appointments}
          onAppointmentsChange={onAppointmentsChange}
        />
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
