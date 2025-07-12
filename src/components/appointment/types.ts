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
