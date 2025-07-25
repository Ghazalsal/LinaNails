import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  formatTimeForDisplay,
  translateServiceTypeToArabic,
  translateServiceType,
} from "@/utils/AppointmentUtils";
import { BackendAppointment } from "@/api";
import AppointmentForm from "../AppointmentForm";
import { useLanguage } from "@/contexts/LanguageContext";
// import { sendWhatsAppMessage } from "../../utils/WhatsAppAPI";
import { AppointmentDetailsModalProps } from "./types";

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  date,
  onUpdate,
  onDelete,
  isLoading = false,
}: AppointmentDetailsModalProps) => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Reset edit form when appointment changes
  useEffect(() => {
    if (appointment && isOpen) {
      // If the appointment data changes while modal is open, ensure we're showing the latest data
      setShowEditForm(false);
    }
  }, [appointment, isOpen]);

  // const handleSendWhatsAppReminder = async () => {
  //   if (!appointment) return;

  //   setIsSending(true);
  //   if (!appointment.phone || appointment.phone.trim() === "") {
  //     toast({
  //       title: t("reminderError"),
  //       description: t("missingPhoneNumber"),
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   const serviceInArabic = translateServiceTypeToArabic(appointment.type);

  //   const success = await sendWhatsAppMessage(
  //     appointment.phone,
  //     appointment.name,
  //     date.toLocaleDateString(),
  //     appointment.time,
  //     serviceInArabic
  //   );

  //   if (success) {
  //     setIsSending(false);
  //     toast({
  //       title: t("reminderSent"),
  //       description: t("reminderSentDirectly"),
  //     });
  //   } else {
  //     setIsSending(false);
  //     toast({
  //       title: t("reminderError"),
  //       description: t("whatsappSendError"),
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    if (!appointment || !onDelete) return;
    onDelete(appointment.id.toString());
  };

  const handleUpdateSubmit = (data: Omit<BackendAppointment, "id">) => {
    if (!appointment || !onUpdate) return;
    onUpdate(appointment.id.toString(), data);
    setShowEditForm(false);
  };

  if (!appointment) return null;

  if (showEditForm) {
    return (
      <AppointmentForm
        isOpen={true}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateSubmit}
        date={date}
        preselectedTime={appointment.time}
        initialValues={{
          name: appointment.name,
          type: appointment.type,
          phone: appointment.phone,
          notes: appointment.notes || "",
        }}
        isUpdate={true}
      />
    );
  }

  return (
    <>
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
                <p className="text-lg font-semibold text-gray-800">
                  {appointment.name}
                </p>
              </div>

              <div className="text-start">
                <p className="text-sm font-medium text-gray-500">{t("time")}</p>
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

              <div className="text-start">
                <p className="text-sm font-medium text-gray-500">
                  {t("phoneNumber")}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  <span dir="ltr">{appointment.phone}</span>
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
                className={`flex gap-2 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                {onUpdate && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    {t("edit")}
                  </Button>
                )}

                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("delete")}
                  </Button>
                )}
              </div>

              {/* <div className="w-full">
                {appointment?.phone && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleSendWhatsAppReminder}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm flex items-center justify-center gap-2 w-full h-10 px-4"
                      disabled={isLoading || isSending}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {isSending ? t("Loading...") : t("sendWhatsAppReminder")}
                    </Button>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentDetailsModal;
