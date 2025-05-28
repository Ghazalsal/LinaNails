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

const SERVICES = [
  { id: "manicure", name: { en: "Manicure", ar: "مانيكير" }, duration: 45 },
  { id: "pedicure", name: { en: "Pedicure", ar: "باديكير" }, duration: 60 },
  { id: "gel-nails", name: { en: "Gel Nails", ar: "أظافر جل" }, duration: 75 },
  { id: "nail-art", name: { en: "Nail Art", ar: "فن الأظافر" }, duration: 90 },
  { id: "polish-change", name: { en: "Polish Change", ar: "تغيير الطلاء" }, duration: 30 },
  { id: "acrylic-full-set", name: { en: "Acrylic Full Set", ar: "مجموعة أكريليك كاملة" }, duration: 90 },
  { id: "acrylic-fill", name: { en: "Acrylic Fill", ar: "تعبئة أكريليك" }, duration: 60 },
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

interface FormValues {
  clientName: string;
  service: string;
  time: string;
  duration: number;
  phone: string;
  notes?: string;
}

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
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clientName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('enterClientName')} {...field} />
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
              <Input placeholder="+972-59-123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="service"
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
                <SelectTrigger>
                  <SelectValue placeholder={t('selectService')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
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
                <SelectTrigger>
                  <SelectValue placeholder={t('selectTime')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export { AppointmentFormFields, SERVICES };