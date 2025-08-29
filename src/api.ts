/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4002";

// ---------------- Enums & Constants ----------------
export enum AppointmentType {
  Manicure = "MANICURE",
  Pedicure = "PEDICURE",
  BothBasic = "BOTH_BASIC",
  BothFull = "BOTH_FULL",
  Eyebrows = "EYEBROWS",
  Lashes = "LASHES",
}

export const ServiceDurations: Record<AppointmentType, number> = {
  [AppointmentType.Manicure]: 45,
  [AppointmentType.Pedicure]: 45,
  [AppointmentType.BothBasic]: 75,
  [AppointmentType.BothFull]: 90,
  [AppointmentType.Eyebrows]: 20,
  [AppointmentType.Lashes]: 120,
};

// ---------------- Types ----------------
export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface BackendAppointment {
  id: string;
  userId: string;
  type: AppointmentType;
  time: string; // ISO string
  endTime: string; // ISO string
  duration: number;
  notes?: string;
}

// ---------------- Utility ----------------
async function handleApiRequest<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}`
      );
    }
    return data;
  } catch (error) {
    console.error(`Network Error (${url}):`, error);
    throw error instanceof Error ? error : new Error("Network request failed");
  }
}

export async function createAppointment(data: {
  userId: string;
  type: AppointmentType;
  time: string;
  notes?: string;
}): Promise<BackendAppointment> {
  console.log('Creating appointment with data:', data);
  
  const res = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Error creating appointment: ${res.statusText}`);
  return res.json();
}

export async function updateAppointment(
  id: string,
  data: Partial<{ userId: string; type: AppointmentType; time: string; notes?: string }>
): Promise<BackendAppointment> {
  console.log('Updating appointment with data:', { id, data });
  
  const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Error updating appointment: ${res.statusText}`);
  return res.json();
}

export async function fetchAppointmentsByDate(
  date: Date
): Promise<BackendAppointment[]> {
  const formattedDate = format(date, "yyyy-MM-dd");
  return handleApiRequest<BackendAppointment[]>(
    `${API_BASE_URL}/api/appointments?date=${formattedDate}`,
    { method: "GET" }
  );
}



export async function deleteAppointment(
  id: string
): Promise<{ message: string }> {
  return handleApiRequest<{ message: string }>(
    `${API_BASE_URL}/api/appointments/${id}`,
    { method: "DELETE" }
  );
}

// ---------------- WhatsApp APIs ----------------

export const sendWhatsAppReminder = async (
  appointmentId: string,
  lang: string = "en"
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/appointments/${appointmentId}/send-whatsapp`,
      { 
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang })
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

export const sendDailyReminders = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/send-daily-reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Error sending daily reminders: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error sending daily reminders:', error);
    throw error;
  }
};

// ---------------- User APIs ----------------
export async function createUser(data: {
  name: string;
  phone: string;
}): Promise<User> {
  return handleApiRequest<User>(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name.trim(), phone: data.phone.trim() }),
  });
}

export async function fetchUsers(): Promise<User[]> {
  return handleApiRequest<User[]>(`${API_BASE_URL}/api/users`, {
    method: "GET",
  });
}

export async function updateUser(
  id: string,
  data: { name: string; phone: string }
): Promise<User> {
  return handleApiRequest<User>(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name.trim(),
      phone: data.phone.trim(),
    }),
  });
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  return handleApiRequest<{ message: string }>(
    `${API_BASE_URL}/api/users/${id}`,
    { method: "DELETE" }
  );
}

export async function searchUser(query: {
  phone?: string;
  id?: string;
}): Promise<User> {
  const params = new URLSearchParams();
  if (query.phone) params.append("phone", query.phone);
  if (query.id) params.append("id", query.id);

  return handleApiRequest<User>(
    `${API_BASE_URL}/api/users/search?${params.toString()}`,
    { method: "GET" }
  );
}
