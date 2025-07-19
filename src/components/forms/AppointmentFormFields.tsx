import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppointmentType } from '@/api';
import { FormValues } from '../util';

const TypesOptions = [
  { id: AppointmentType.Manicure, name: { en: "Manicure", ar: "مانيكير" }, duration: 45 },
  { id: AppointmentType.Pedicure, name: { en: "Pedicure", ar: "باديكير" }, duration: 60 },
  { id: AppointmentType.Both, name: { en: "Pedicure and Manicure", ar: "باديكير و مانيكير" }, duration: 90 },
];

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 10; hour < 20; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const isPm = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      options.push({
        value: `${formattedHour}:${formattedMinute}`,
        label: {
          en: `${displayHour}:${formattedMinute} ${isPm ? 'PM' : 'AM'}`,
          ar: `${displayHour}:${formattedMinute} ${isPm ? 'مساءً' : 'صباحاً'}`
        }
      });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();


interface AppointmentFormFieldsProps {
  control: Control<FormValues>;
  onServiceChange: (value: string) => void;
}

const AppointmentFormFields = ({ control, onServiceChange }: AppointmentFormFieldsProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clientName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterClientName')} {...field} dir={language === 'ar' ? 'rtl' : 'ltr'} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('phoneNumber')}</FormLabel>
            <FormControl>
              <Input placeholder="+972-59-123-4567" {...field} dir='ltr' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('service')}</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onServiceChange(value);
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectValue placeholder={t('selectService')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TypesOptions.map((service) => (
                  <SelectItem key={service.id} value={service.id} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {service.name[language]} ({service.duration} {t('minute')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('time')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectValue placeholder={t('selectTime')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {option.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('notes')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('addNotes')} 
                className="resize-none" 
                {...field} 
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export { AppointmentFormFields, TypesOptions };