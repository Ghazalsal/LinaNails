import { BackendAppointment } from "@/api";

export interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: BackendAppointment | undefined;
  date: Date;
  onUpdate?: (
    id: string,
    data: Partial<Omit<BackendAppointment, "id">>
  ) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export interface TimeSlotProps {
  time: string;
  appointment: BackendAppointment | undefined;
  appointments?: BackendAppointment[];
  isPast: boolean;
  onClick: () => void;
  onAppointmentClick?: (appointment: BackendAppointment) => void;
  onAddClick?: () => void;
}