import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isRtl = document.dir === 'rtl';

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      dir={isRtl ? 'rtl' : 'ltr'}
      position={isRtl ? 'bottom-left' : 'bottom-right'}
      toastOptions={{
        classNames: {
          toast:
            `group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg ${isRtl ? 'text-right' : 'text-left'}`,
          description: `group-[.toast]:text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`,
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
