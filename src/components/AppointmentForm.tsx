/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isValid } from "date-fns";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AppointmentType, BackendAppointment, fetchUsers, User } from "@/api";
import { AppointmentFormFields } from "./forms/AppointmentFormFields";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AppointmentFormInput } from "./appointment/types";

interface AppointmentFormProps {
  date: Date;
  onSubmit: (data: AppointmentFormInput) => void;
  onCancel: () => void;
  initialValues?: BackendAppointment | any;
  preselectedTime?: string;
  isLoading?: boolean;
  isOpen: boolean;
  isUpdate?: boolean;
}

const formSchema = z.object({
  userId: z.string().min(1, "Client is required"),
  type: z.nativeEnum(AppointmentType),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});
export type FormValues = z.infer<typeof formSchema>;

function normalizeTimeString(value?: string): string | undefined {
  if (!value) return undefined;

  try {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      const hours = parsed.getHours();
      const minutes = parsed.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  } catch (error) {
    console.error('Error parsing time:', error);
  }

  // If it's already in HH:MM format, return as is
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  return undefined;
}

function timeStringToISOString(timeStr: string, date: Date): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const appointmentDate = new Date(date);
  
  appointmentDate.setHours(hours, minutes, 0, 0);
  
  return appointmentDate.toISOString();
}

function formatDateSafely(date: Date | undefined | null, formatString: string, fallback: string = ""): string {
  if (!date || !isValid(date)) {
    return fallback;
  }
  try {
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error, { date, formatString });
    return fallback;
  }
}

export default function AppointmentForm({
  date,
  onCancel,
  initialValues,
  preselectedTime,
  isLoading,
  isOpen,
  isUpdate,
  onSubmit
}: AppointmentFormProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [service, setService] = useState<AppointmentType | undefined>(initialValues?.type);
  const [users, setUsers] = useState<User[]>([]);

  // Use a fallback date if date is undefined
  const safeDate = date || new Date();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: initialValues?.userId || initialValues?.user?.id,
      type: initialValues?.type || undefined,
      time: normalizeTimeString(initialValues?.time || preselectedTime) || "",
      notes: initialValues?.notes || "",
    },
  });

  // Load users when the form opens
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err: any) {
        console.error('Error loading users:', err);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        });
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, toast]);

  // Set initial values when editing or preselecting time
  useEffect(() => {
    console.log('Form initial values:', initialValues);
    console.log('Preselected time:', preselectedTime);
    
    if (initialValues) {
      // Editing existing appointment
      const timeValue = normalizeTimeString(initialValues.time);
      console.log('Normalized time:', timeValue);
      
      form.reset({
        userId: initialValues.userId || initialValues?.user?.id || "",
        type: initialValues.type || undefined,
        time: timeValue || "",
        notes: initialValues.notes || "",
      });
      setService(initialValues.type);
    } else if (preselectedTime) {
      // Creating new appointment with preselected time
      const timeValue = normalizeTimeString(preselectedTime);
      console.log('Normalized preselected time:', timeValue);
      
      form.reset({
        userId: "",
        type: undefined,
        time: timeValue || "",
        notes: "",
      });
    }
  }, [initialValues, preselectedTime, form]);

  const handleSubmit = form.handleSubmit(async (data: any) => {
    try {
      // Validate date before processing
      if (!safeDate || !isValid(safeDate)) {
        toast({
          title: "Error",
          description: "Invalid date provided",
          variant: "destructive"
        });
        return;
      }

      const appointmentTimeISO = timeStringToISOString(data.time, safeDate);

      const submissionData: AppointmentFormInput | any = {
        userId: data.userId || data?.user?.id,
        type: data.type,
        time: appointmentTimeISO,
        notes: data.notes || "",
      };

      console.log('Form data after processing:', submissionData);
      onSubmit(submissionData);
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to process form data",
        variant: "destructive"
      });
    }
  });

  // Generate safe title text
  const getTitleDateText = () => {
    if (!safeDate || !isValid(safeDate)) {
      return t("selectDate") || "Select Date";
    }

    const month = formatDateSafely(safeDate, "MMMM", "");
    const shortMonth = formatDateSafely(safeDate, "MMM", "");
    const dayNum = formatDateSafely(safeDate, "d", "");
    const year = formatDateSafely(safeDate, "yyyy", "");

    const translatedMonth = t(month) || month;

    return language === "ar"
      ? `${dayNum} ${translatedMonth}، ${year}`
      : `${shortMonth} ${dayNum}, ${year}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold text-center">
            {isUpdate ? t("updateAppointment") || "Update Appointment" : t("newAppointment") || "New Appointment"}{" "}
            {getTitleDateText()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("fillDetails") || "Fill in the appointment details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AppointmentFormFields
              control={form.control}
              onServiceChange={setService}
              userId={form.watch("userId")}
              users={users}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                {t("cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? (t("saving"))
                  : isUpdate
                    ? (t("edit") )
                    : (t("save"))
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}