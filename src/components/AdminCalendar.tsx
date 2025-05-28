import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DayAppointments from "@/components/DayAppointments";
import { Appointment } from './DailySchedule';
import { cn } from '@/libs/utils';

const AppointmentCalendar = ({
  selectedDate,
  onSelectDate,
  appointments,
  onAddAppointment
}: {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}) => {

  const disableSunday = (date: Date) => date.getDay() === 0;

  const handleDateClick = (date: Date | undefined) => {
    onSelectDate(date);
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            className={cn("p-3 pointer-events-auto rounded-md border")}
            disabled={disableSunday}
          />
        </CardContent>
      </Card>

    </>
  );
};


export default AppointmentCalendar;
