import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/libs/utils';
import { formatTimeForDisplay } from '@/utils/appointmentUtils';
const TimeSlot = ({ time, appointment, isPast, onClick }) => {
    return (_jsx("div", { className: cn("p-3 rounded-md border cursor-pointer transition-colors", appointment ? "bg-salon-light-pink border-salon-gold" :
            isPast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"), onClick: onClick, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium", children: formatTimeForDisplay(time) }), appointment ? (_jsxs("span", { className: "truncate max-w-[150px]", children: [appointment.clientName, " - ", appointment.service] })) : !isPast ? (_jsx("span", { className: "text-sm text-gray-400", children: "\u0645\u062A\u0627\u062D" })) : (_jsx("span", { className: "text-sm text-gray-400", children: "\u0645\u0636\u0649" }))] }) }));
};
export default TimeSlot;
