import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/libs/utils"
import { useLanguage } from "@/contexts/LanguageContext";

export function Toaster() {
  const { toasts } = useToast()
  const { language } = useLanguage();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className={cn("grid gap-1")}>
            {title && <ToastTitle dir={language === "ar" ? "rtl" : "ltr"}>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
