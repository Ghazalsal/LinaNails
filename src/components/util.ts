import { BackendAppointment } from "@/api";
import { z } from "zod";

export interface AppointmentCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  appointments: BackendAppointment[];
  loading?: boolean;
}


export const appointmentSchema = z.object({
  name: z.string().min(2, { message: "Client name is required" }),
  type: z.string().min(1, { message:"Type is required" }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  duration: z.number().positive({ message: "Duration must be positive" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  notes: z.string().optional(),
}); 

export type FormValues = z.infer<typeof appointmentSchema>;

export interface InitialValues {
  name?: string;
  type?: string;
  phone?: string;
  notes?: string;
}