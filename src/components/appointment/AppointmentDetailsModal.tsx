/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Edit, Trash2, MessageCircle } from "lucide-react";
import { AppointmentDetailsModalProps, AppointmentFormInput } from "./types";
import { useToast } from "@/hooks/use-toast";
import { BackendAppointment, sendWhatsAppReminder, User } from "@/api";
import { findUserById } from "../forms/utils";
import AppointmentForm from "../AppointmentForm";
import { translateServiceType, translateServiceTypeToArabic } from "@/utils/AppointmentUtils";

function formatTimeForDisplay(time?: string) {
  if (!time) return "";
  try {
    return format(new Date(time), "hh:mm a");
  } catch (error) {
    console.error('Error formatting time:', error);
    return time || 'Invalid time';
  }
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  date,
  onUpdate,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const { language, t,  } = useLanguage();
  const [showEditForm, setShowEditForm] = useState(false);
  const [appointmentUser, setAppointmentUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userLoadError, setUserLoadError] = useState(false);

  // Fetch user data when appointment changes
  useEffect(() => {
    if (appointment) {
      setAppointmentUser(appointment.user || null);
      setIsLoadingUser(false);
      setUserLoadError(false);
    } else if (appointment?.userId) {
      // Fallback: fetch user by ID if only userId is provided
      let isMounted = true;
      setIsLoadingUser(true);

      const loadUser = async () => {
        try {
          const user = await findUserById(appointment.userId);
          if (isMounted && user) {
            setAppointmentUser(user);
          } else if (isMounted) {
            setUserLoadError(true);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          if (isMounted) {
            setUserLoadError(true);
          }
        } finally {
          if (isMounted) {
            setIsLoadingUser(false);
          }
        }
      };

      loadUser();
      return () => { isMounted = false; };
    } else {
      setAppointmentUser(null);
      setIsLoadingUser(false);
      setUserLoadError(true);
    }
  }, [appointment, appointment?.userId, isOpen]);

  // Add this function to get user display name
  const getUserDisplayName = () => {
    if (isLoadingUser) return t("loading") || "Loading...";
    if (userLoadError || !appointmentUser) return t("userNotFound") || "User not found";
    return appointmentUser.name;
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    if (!appointment || !onDelete) return;
    onDelete(appointment.id.toString());
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };
  const handleSendWhatsAppReminder = async () => {
    if (!appointment) return;

    setIsSending(true);
    try {
      const phone = appointment.phone || appointmentUser?.phone;
      if (!phone || phone.trim() === "") {
        toast({
          title: t("reminderError"),
          variant: "destructive",
        });
        return;
      }

      const result = await sendWhatsAppReminder(appointment.id, language);

      if (result.success) {
        toast({
          title: t("reminderSent"),
        });
      } else {
        toast({
          title: t("reminderError"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error sending WhatsApp reminder:', error);
      toast({
        title: t("reminderError") || "Error",
        description: error.message || "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEditFormSubmit = (data: AppointmentFormInput | any) => {
    if (onUpdate && appointment) {
      // Pass the complete form data, not just the ID
      onUpdate(appointment.id, data);
    }
    setShowEditForm(false);
  };

  if (!appointment) return null;

  if (showEditForm) {
    console.log({ appointment })
    return (
      <AppointmentForm
        isOpen={true}
        onCancel={handleEditFormClose}
        onSubmit={handleEditFormSubmit}
        date={date}
        preselectedTime={appointment.time}
        initialValues={{
          id: appointment.id,
          time: appointment.time,
          endTime: appointment.endTime,
          duration: appointment.duration,
          userId: appointment.userId || appointment?.user?.id,
          type: appointment.type,
          notes: appointment.notes || "",
        }}
        isUpdate={true}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold text-center">
            {t("appointmentDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4`}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="text-start">
              <p className="text-sm font-medium text-gray-500">
                {t("client")}
              </p>
              <p className={`text-lg font-semibold ${userLoadError ? 'text-red-600' : 'text-gray-800'}`}>
                {getUserDisplayName()}
              </p>
            </div>

            <div className="text-start">
              <p className="text-sm font-medium text-gray-500">
                {t("time")}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {(() => {
                  const timeString = formatTimeForDisplay(appointment.time);
                  return timeString
                    .replace("AM", t("AM"))
                    .replace("PM", t("PM"));
                })()}
              </p>
            </div>

            <div className="text-start">
              <p className="text-sm font-medium text-gray-500">
                {t("service")}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {translateServiceType(appointment.type, language, t)}
              </p>
            </div>

            {appointment.notes && (
              <div className="sm:col-span-2 text-start">
                <p className="text-sm font-medium text-gray-500">
                  {t("notes")}
                </p>
                <p className="text-lg font-normal text-gray-800 whitespace-pre-wrap">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div
              className={`flex gap-2 ${language === "ar" ? "flex-row-reverse" : ""
                }`}
            >
              <Button
                onClick={handleEdit}
                variant="outline"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
              >
                <Edit className="h-4 w-4" />
                {t("edit")}
              </Button>
              {appointmentUser?.phone && (
                <div className="space-y-2">
                  <Button
                    onClick={handleSendWhatsAppReminder}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center justify-center gap-2 w-full h-10 px-4"
                    disabled={isLoading || isSending}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {isSending ? (t("sending") || "Sending...") : (t("sendReminder"))}
                  </Button>
                </div>
              )}
              {onDelete && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("delete") || "Delete"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsModal;