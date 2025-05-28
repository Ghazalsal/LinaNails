export enum AppointmentType {
  Manicure = 'MANICURE',
  Pedicure = 'PEDICURE',
  Both = 'BOTH'
}

export interface BackendAppointment {
  id: number;
  name: string;
  phone: string;
  type: AppointmentType;
  time: string;
  notes?: string;
}

export async function fetchAppointmentsByDate(date: Date) {
  const formatted = date.toISOString().split('T')[0]; 
  const res = await fetch(`http://localhost:4000/appointments?date=${formatted}`);

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return await res.json() as BackendAppointment[];
}
