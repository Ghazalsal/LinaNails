import { AppointmentType, BackendAppointment } from "@/api";
import { z } from "zod";

export interface AppointmentCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  appointments: BackendAppointment[];
  loading?: boolean;
}


export const appointmentSchema = z.object({
  userId: z.string().min(1, ('userRequired')),
  type: z.nativeEnum(AppointmentType),
  time: z.string().min(1, ('timeRequired')),
  notes: z.string().optional(),
  duration: z.number(),
});

export type FormValues = z.infer<typeof appointmentSchema>;

export interface InitialValues {
  name?: string;
  type?: AppointmentType;
  time?: string;
  phone?: string;
  notes?: string;
  duration?: number;
}