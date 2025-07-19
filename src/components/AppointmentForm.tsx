/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
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
import { AppointmentFormFields, TypesOptions } from './forms/AppointmentFormFields';
import { useLanguage } from '@/contexts/LanguageContext';
import { BackendAppointment } from '@/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { appointmentSchema, FormValues, InitialValues } from './util';

const AppointmentForm = ({
  isOpen,
  onClose,
  onSubmit,
  date,
  preselectedTime = null,
  initialValues,
  isUpdate = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BackendAppointment | any, 'id'>) => void;
  date: Date;
  preselectedTime?: string | null;
  initialValues?: InitialValues;
  isUpdate?: boolean;
}) => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  const form = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: initialValues?.name || '',
      type: initialValues?.type || '',
      time: preselectedTime || '',
      duration: 45,
      phone: initialValues?.phone || '+972-',
      notes: initialValues?.notes || '',
    }
  });

  useEffect(() => {
    if (preselectedTime) {
      form.setValue('time', preselectedTime);
    }

    if (initialValues) {
      if (initialValues.name) form.setValue('name', initialValues.name);
      if (initialValues.type) {
        form.setValue('type', initialValues.type);
        const service = TypesOptions.find(s => s.id === initialValues.type);
        if (service) {
          form.setValue('duration', service.duration);
        }
      }
      if (initialValues.phone) form.setValue('phone', initialValues.phone);
      if (initialValues.notes) form.setValue('notes', initialValues.notes);
    }
  }, [preselectedTime, initialValues, form]);

  const handleServiceChange = (value: string) => {
    const service = TypesOptions.find(s => s.id === value);
    if (service) {
      form.setValue('duration', service.duration);
    }
  };

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      name: data.name,
      type: TypesOptions.find(s => s.id === data.type)?.id as any,
      time: data.time,
      phone: data.phone,
      notes: data.notes,
    });
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px]`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold text-center">
            {isUpdate ? t('updateAppointment') : t('newAppointment')} {(() => {
              const month = format(date, "MMMM");
              const shortMonth = format(date, "MMM");
              const dayNum = format(date, "d");
              const year = format(date, "yyyy");

              const translatedMonth = t(month);

              return language === 'ar'
                ? `${dayNum} ${translatedMonth}، ${year}`
                : `${shortMonth} ${dayNum}, ${year}`;
            })()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('fillDetails')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-4 pt-4 ${isMobile ? 'px-1' : ''}`}>
            <AppointmentFormFields control={form?.control} onServiceChange={handleServiceChange} />

            <DialogFooter className={`flex gap-1 ${language === 'ar' ? 'justify-between' : 'justify-end'}`}>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit" className="bg-salon-gold hover:bg-salon-light-gold text-white">
                {isUpdate ? t('updateAppointment') : t('addAppointment')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
