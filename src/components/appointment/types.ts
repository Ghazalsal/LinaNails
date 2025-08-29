/* eslint-disable @typescript-eslint/no-explicit-any */
import { BackendAppointment } from "@/api";

// Form input type that matches what the form submits
export interface AppointmentFormInput {
  userId: string;
  time: string;  // ISO string
  type: BackendAppointment["type"];
  notes?: string;
  endTime: string;   // ISO string
  duration: number;  // Duration in minutes
}

// Props for AppointmentDetailsModal
export interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: BackendAppointment | any;
  date: Date;
  onUpdate?: (id: string, data: Partial<Omit<BackendAppointment, "id">>) => void;
  onDelete?: (id: string) => void;
  onEdit?: (appointment: BackendAppointment) => void; // New prop for opening edit form
  isLoading?: boolean;
}

// Props for TimeSlot
export interface TimeSlotProps {
  timeLabel?: string;
  time: string;
  appointments?: BackendAppointment[];
  isPast: boolean;
  onClick: () => void;
  onAppointmentClick?: (appointment: BackendAppointment) => void;
  onAddClick?: () => void;
}

// Props for DayAppointments - updated to match backend expectations
export interface DayAppointmentsProps {
  date: Date;
  appointments: BackendAppointment[];
  timeSlots?: string[]; // e.g., ["08:00", "08:30", "09:00"]
  onCreate: (appointment: BackendAppointment) => void; // Updated to receive full appointment
  onUpdate: (id: string, appointment: BackendAppointment) => void; // Updated to receive full appointment
  onDelete: (id: string) => void;
}