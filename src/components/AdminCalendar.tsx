import { BackendAppointment } from "@/api";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from '@/libs/utils';
import { format } from 'date-fns';

interface AppointmentCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  appointments: BackendAppointment[];
  loading?: boolean;
}

const AppointmentCalendar = ({
  selectedDate,
  onSelectDate,
  appointments,
  loading = false
}: AppointmentCalendarProps) => {
  const { t, language } = useLanguage();

  const disableSunday = (date: Date) => date.getDay() === 0;

  const handleDateClick = (date: Date | undefined) => {
    if (date && !loading) {
      // Log the date for debugging
      console.log('Calendar date selected:', date);
      
      // Ensure we're working with a normalized date to avoid timezone issues
      onSelectDate(date);
    }
  };

  // Function to check if a date has appointments
  const hasAppointments = (date: Date) => {
    // Normalize the date strings to avoid timezone issues
    const dateStr = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
    const selectedDateStr = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).toISOString().split('T')[0];
    
    // Only show indicators for the currently selected date's appointments
    if (dateStr === selectedDateStr) {
      return appointments.length > 0;
    }
    return false;
  };

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4">
        <div className={cn("relative", loading && "opacity-50 pointer-events-none")}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            className={cn("p-3 rounded-md border")}
            disabled={disableSunday}
            modifiers={{
              hasAppointments: (date) => hasAppointments(date)
            }}
            modifiersStyles={{
              hasAppointments: {
                backgroundColor: '#fef3c7', // Light yellow background for dates with appointments
                color: '#92400e',
                fontWeight: 'bold'
              }
            }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
        
        {/* Show selected date info */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <p className="font-medium">
            {(() => {
              // Get the formatted date parts
              const day = format(selectedDate, "EEEE");
              const month = format(selectedDate, "MMMM");
              const dayNum = format(selectedDate, "d");
              const year = format(selectedDate, "yyyy");
              
              // Translate day and month
              const translatedDay = t(day);
              const translatedMonth = t(month);
              
              // Return formatted date string based on language
              return language === 'ar'
                ? `${translatedDay}، ${dayNum} ${translatedMonth}، ${year}`
                : `${translatedDay}, ${translatedMonth} ${dayNum}, ${year}`;
            })()}
          </p>
          <p className="text-gray-600">
            {loading ? t('Loading...') : `${appointments.length} ${appointments.length !== 1 ? t('appointments') : t('appointment')}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;