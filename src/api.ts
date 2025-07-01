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
  date?: string; // Format: YYYY-MM-DD
}

export async function fetchAppointmentsByDate(date: Date) {
  // Format date using local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;
  
  console.log('Fetching appointments for formatted date:', formatted, 'from original date:', date);
  
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
    console.log({ res });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to create appointment: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data: BackendAppointment | unknown = await res.json();
    // Transform MongoDB _id to id in the response
    const createdAppointment = {
      ...(data as BackendAppointment),
      id: (data as any)?._id ?? (data as any)?.id,
    };

    console.log("Successfully created appointment:", createdAppointment);
    return createdAppointment as BackendAppointment;
  } catch (error) {
    console.error("Error in createAppointment:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while creating appointment");
  }
}

export interface UpdateAppointmentData extends Partial<Omit<BackendAppointment, "id">> {
  date?: string; // Format: YYYY-MM-DD
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

    // Transform MongoDB _id to id in the response
    const updatedAppointment = {
      ...(data as any),
      id: (data as any)?._id,
      _id: undefined,
    };

    console.log("Successfully updated appointment:", updatedAppointment);
    return updatedAppointment as BackendAppointment;
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

    console.log("Successfully deleted appointment:", id);
  } catch (error) {
    console.error("Error in deleteAppointment:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown error occurred while deleting appointment");
  }
}
