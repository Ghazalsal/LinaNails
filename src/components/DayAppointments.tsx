/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { format, isBefore, parseISO } from "date-fns";
import { BackendAppointment } from "@/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "@/api";
import TimeSlot from "./appointment/TimeSlot";
import AppointmentForm from "./AppointmentForm";
import { AppointmentDetailsModal } from "./appointment/AppointmentDetailsModal";
import { AppointmentFormInput } from "./appointment/types";

interface DayAppointmentsPropsFixed {
  date: Date;
  appointments: BackendAppointment[];
  onCreate: (appointment: BackendAppointment) => void;
  onUpdate: (id: string, data: Partial<BackendAppointment>) => void;
  onDelete: (id: string) => void;
}

const DayAppointments: React.FC<DayAppointmentsPropsFixed> = ({
  date,
  appointments,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<BackendAppointment | undefined>();
  const [editingAppointment, setEditingAppointment] = useState<BackendAppointment | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots from 8:00 AM to 8:00 PM in 30-minute intervals
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dateTime = new Date(date);
        dateTime.setHours(hour, minute, 0, 0);
        slots.push({
          time: timeString,
          dateTime: dateTime.toISOString(),
        });
      }
    }
    return slots;
  }, [date]);

  // Map appointments to their time slots
  const appointmentMap = useMemo(() => {
    const map = new Map<string, BackendAppointment[]>();
    appointments.forEach(appointment => {
      try {
        const appointmentTime = new Date(appointment.time);
        const timeString = format(appointmentTime, 'HH:mm');
        if (!map.has(timeString)) {
          map.set(timeString, []);
        }
        map.get(timeString)!.push(appointment);
      } catch (error) {
        console.error('Error parsing appointment time:', error, appointment);
      }
    });
    return map;
  }, [appointments]);

  const handleAddAppointment = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setEditingAppointment(undefined);
    setIsFormOpen(true);
  };

  const handleAppointmentClick = (appointment: BackendAppointment) => {
    console.log("click", appointment)
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleFormSubmit = async (formData: AppointmentFormInput | any) => {
    setIsLoading(true);
    console.log('Form data received:', formData);
    
    try {
      // Prepare data in the format server expects
      const submissionData = {
        userId: formData.userId,
        type: formData.type,
        time: formData.time,
        notes: formData.notes || "",
      };
      
      console.log({submissionData}, "from day ");
      
      if (editingAppointment) {
        const updatedAppointment = await updateAppointment(editingAppointment.id, submissionData);
        toast({
          title: t('appointmentUpdated'),
          description: t('appointmentUpdatedSuccessfully'),
        });
        onUpdate(editingAppointment.id, updatedAppointment);
      } else {
        // Create new appointment
        const newAppointment = await createAppointment(submissionData);
        toast({
          title: t('appointmentCreated'),
        });
        onCreate(newAppointment);
      }
      setIsFormOpen(false);
      setEditingAppointment(undefined);
      setSelectedTimeSlot("");
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: t('error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to handle updates from the details modal
  const handleUpdateAppointment = async (id: string, data: any) => {
    setIsLoading(true);
    console.log('Update appointment:', id, data);
    
    try {
      const updatedAppointment = await updateAppointment(id, data);
      toast({
        title: t('appointmentUpdated'),
      });
      onUpdate(id, updatedAppointment);
      setIsDetailsModalOpen(false);
      setSelectedAppointment(undefined);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: t('error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      await deleteAppointment(appointmentId);
      toast({
        title: t('appointmentDeleted'),
      });
      onDelete(appointmentId);
      setIsDetailsModalOpen(false);
      setSelectedAppointment(undefined);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: t('error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ selectedAppointment })
const handleClose =()=>{
  
}
  return (
    <div className="space-y-2">
      {timeSlots.map(({ time, dateTime }) => {
        const appointment = appointmentMap.get(time);
        const isPast = isBefore(parseISO(dateTime), new Date());

        return (
          <TimeSlot
            key={time}
            timeLabel={format(parseISO(dateTime), 'h:mm a')}
            time={dateTime}
            appointments={appointmentMap.get(time) || []}
            isPast={isPast}
            onClick={() => handleAddAppointment(time)}
            onAppointmentClick={handleAppointmentClick}
            onAddClick={() => handleAddAppointment(time)}
          />
        );
      })}

      <AppointmentForm
        isOpen={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingAppointment(undefined);
          setSelectedTimeSlot("");
        }}
        onSubmit={handleFormSubmit}
        selectedDate={date}
        selectedTimeSlot={selectedTimeSlot}
        editingAppointment={editingAppointment}
        isLoading={isLoading}
      />

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(undefined);
        }}
        appointment={selectedAppointment}
        date={date}
        onUpdate={handleUpdateAppointment} // Use the new function
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DayAppointments;