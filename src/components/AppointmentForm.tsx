import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Appointment } from './DailySchedule';
import { AppointmentFormFields, SERVICES } from './forms/AppointmentFormFields';
import { useLanguage } from '@/contexts/LanguageContext';

const appointmentSchema = z.object({
  clientName: z.string().min(2, { message: "Client name is required" }),
  service: z.string().min(1, { message: "Service type is required" }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  duration: z.number().positive({ message: "Duration must be positive" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof appointmentSchema>;

const AppointmentForm = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  date,
  preselectedTime = null
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Appointment, 'id'>) => void;
  date: Date;
  preselectedTime?: string | null;
}) => {
  const { language, t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientName: '',
      service: '',
      time: preselectedTime || '',
      duration: 45,
      phone: '+972-',
      notes: '',
    }
  });

  useEffect(() => {
    if (preselectedTime) {
      form.setValue('time', preselectedTime);
    }
  }, [preselectedTime, form]);

  const handleServiceChange = (value: string) => {
    const service = SERVICES.find(s => s.id === value);
    if (service) {
      form.setValue('duration', service.duration);
    }
  };

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      clientName: data.clientName,
      service: SERVICES.find(s => s.id === data.service)?.name[language] || data.service,
      time: data.time,
      duration: data.duration,
      phone: data.phone,
      notes: data.notes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold">
            {t('newAppointment')} {format(date, "MMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>
            {t('fillDetails')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <AppointmentFormFields control={form?.control} onServiceChange={handleServiceChange} />

            <DialogFooter className={`flex gap-2 ${language === 'ar' ? 'justify-between' : 'justify-end'}`}>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit" className="bg-salon-gold hover:bg-salon-light-gold text-white">
                {t('addAppointment')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
