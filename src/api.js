export var AppointmentType;
(function (AppointmentType) {
    AppointmentType["Manicure"] = "MANICURE";
    AppointmentType["Pedicure"] = "PEDICURE";
    AppointmentType["Both"] = "BOTH";
})(AppointmentType || (AppointmentType = {}));
export async function fetchAppointmentsByDate(date) {
    const formatted = date.toISOString().split('T')[0];
    const res = await fetch(`http://localhost:4000/appointments?date=${formatted}`);
    if (!res.ok) {
        throw new Error("Failed to fetch appointments");
    }
    return await res.json();
}
