import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackendAppointment } from '@/api';
import { formatTimeForDisplay } from '@/utils/AppointmentUtils';

interface WhatsAppTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate: string;
  onSave: (template: string) => void;
  appointment:BackendAppointment
}

const WhatsAppTemplateEditor = ({
  isOpen,
  onClose,
  initialTemplate,
  onSave,
  appointment
}: WhatsAppTemplateEditorProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [template, setTemplate] = useState(initialTemplate);

  useEffect(() => {
    setTemplate(initialTemplate);
  }, [initialTemplate, isOpen]);

  const handleSave = () => {
    onSave(template);
    toast({
      title: t('updated'),
      description: t('messageTemplateUpdated'),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold text-center">
            {t("editMessageTemplate")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="text-sm text-gray-500">
            <p>{t("availableVariables")}:</p>
            <ul className="list-disc list-inside mt-2">
              <li>{'{clientName}'} - {language === "ar" ? "اسم العميل" : "Client name"}</li>
              <li>{'{date}'} - {language === "ar" ? "تاريخ الموعد" : "Appointment date"}</li>
              <li>{'{time}'} - {language === "ar" ? "وقت الموعد" : "Appointment time"}</li>
              <li>{'{service}'} - {language === "ar" ? "نوع الخدمة" : "Service type"}</li>
            </ul>
          </div>

          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            dir="ltr"
          />

          <div className="bg-gray-100 p-3 rounded-md">
             <h3 className="font-medium mb-2">{t("preview")}:</h3>
             <div className="whitespace-pre-wrap text-sm">
               {template
                 .replace('{clientName}', appointment.name || '')
                 .replace('{time}', formatTimeForDisplay(appointment.time))
                 .replace('{service}', appointment.type)}
             </div>
           </div>
        </div>

        <DialogFooter className={language === "ar" ? "flex-row-reverse" : ""}>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("saveTemplate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppTemplateEditor;