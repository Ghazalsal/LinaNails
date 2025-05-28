import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '../DailySchedule';
import { formatTimeForDisplay, createWhatsAppMessage, sendWhatsAppReminder } from '@/utils/appointmentUtils';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | undefined;
  date: Date;
}

const AppointmentDetailsModal = ({ isOpen, onClose, appointment, date }: AppointmentDetailsModalProps) => {
  const { toast } = useToast();

  const handleSendWhatsAppReminder = () => {
    if (!appointment) return;

    const message = createWhatsAppMessage(
      appointment.clientName,
      date,
      appointment.time,
      appointment.service,
      appointment.duration
    );

    sendWhatsAppReminder(appointment.phone, message);
    
    toast({
      title: "تم إرسال التذكير",
      description: `تم فتح واتساب لإرسال تذكير إلى ${appointment.clientName}`,
    });
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold">
            تفاصيل الموعد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">العميل</p>
              <p className="text-lg">{appointment.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">الوقت</p>
              <p className="text-lg">{formatTimeForDisplay(appointment.time)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">الخدمة</p>
              <p className="text-lg">{appointment.service}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">المدة</p>
              <p className="text-lg">{appointment.duration} دقيقة</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">الهاتف</p>
              <p className="text-lg">{appointment.phone}</p>
            </div>
            {appointment.notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">ملاحظات</p>
                <p className="text-lg">{appointment.notes}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4 gap-2">
            <Button 
              onClick={handleSendWhatsAppReminder}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="ml-2 h-4 w-4" />
              إرسال تذكير واتساب
            </Button>
            <Button onClick={onClose} className="bg-salon-gold hover:bg-salon-light-gold text-white">
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;