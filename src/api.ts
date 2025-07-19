/* eslint-disable @typescript-eslint/no-explicit-any */
export enum AppointmentType {
  Manicure = "MANICURE",
  Pedicure = "PEDICURE",
  Both = "BOTH",
}

export interface BackendAppointment {
  id: number;
  name: string;
  phone: string;
  type: AppointmentType;
  time: string;
  notes?: string;
}

export interface CreateAppointmentData extends Omit<BackendAppointment, "id"> {
  date?: string;
}

export async function fetchAppointmentsByDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;
  
  const res = await fetch(
    `http://localhost:4002/api/appointments?date=${formatted}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return (await res.json()) as BackendAppointment[];
}
export async function createAppointment(
  appointment: CreateAppointmentData
): Promise<BackendAppointment> {
  try {
    const res = await fetch(`http://localhost:4002/api/appointments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to create appointment: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data: BackendAppointment | unknown = await res.json();
    const createdAppointment = {
      ...(data as BackendAppointment),
      id: (data as any)?._id ?? (data as any)?.id,
    };

    return createdAppointment as BackendAppointment;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while creating appointment");
  }
}

export interface UpdateAppointmentData extends Partial<Omit<BackendAppointment, "id">> {
  date?: string;
}

export async function updateAppointment(
  id: string,
  appointment: UpdateAppointmentData
): Promise<BackendAppointment> {
  try {
    const res = await fetch(`http://localhost:4002/api/appointments/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(appointment),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to update appointment: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data: BackendAppointment | unknown = await res.json();

    const updatedAppointment = {
      ...(data as BackendAppointment),
      id: (data as any)?._id ?? (data as any)?.id,
      _id: undefined,
    };

    console.log("Successfully updated appointment:", updatedAppointment);
    return updatedAppointment;
  } catch (error) {
    console.error("Error in updateAppointment:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while updating appointment");
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    const res = await fetch(`http://localhost:4002/api/appointments/${id}`, {
      method: "DELETE",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to delete appointment: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while deleting appointment");
  }
}

/**
 * Manually trigger sending reminders for tomorrow's appointments
 * @returns A promise that resolves to a success message or rejects with an error
 */
export async function sendTomorrowReminders(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`http://localhost:4002/api/send-tomorrow-reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to send reminders: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in sendTomorrowReminders:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while sending reminders");
  }
}
