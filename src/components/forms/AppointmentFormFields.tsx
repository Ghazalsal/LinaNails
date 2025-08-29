import React, { useMemo, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppointmentType } from "@/api";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { generateTimeOptions, TypesOptions } from "./utils";
import { FormValues } from "../AppointmentForm";

const TIME_OPTIONS = generateTimeOptions();

interface Props {
  control: Control<FormValues>;
  onServiceChange: (value: AppointmentType) => void;
  users: { id?: string; _id?: string; name: string }[];
  userId: string;
}

export const AppointmentFormFields = ({ control, onServiceChange, users }: Props) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const normalizedUsers = useMemo(
    () => users.map(u => ({ id: (u.id ?? u._id) as string, name: u.name })),
    [users]
  );

  return (
    <div className="space-y-4">
      {/* User Select */}
      <FormField
        control={control}
        name="userId"
        render={({ field }) => {
          const selected = normalizedUsers.find(u => u.id === field.value);
          return (
            <FormItem>
              <FormLabel>{t("clientName")}</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full justify-between" role="combobox">
                      {selected ? selected.name : t("selectClient")}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("searchClient")} dir={language === "ar" ? "rtl" : "ltr"} />
                    <CommandList>
                      <CommandEmpty>{t("noClientFound")}</CommandEmpty>
                      <CommandGroup>
                        {normalizedUsers.map(user => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => {
                              field.onChange(user.id);
                              setOpen(false);
                            }}
                            dir={language === "ar" ? "rtl" : "ltr"}
                          >
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Service Select */}
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel dir={language === "ar" ? "rtl" : "ltr"}>{t("service")}</FormLabel>
            <Select value={field.value} onValueChange={val => { field.onChange(val); onServiceChange(val as AppointmentType); }}>
              <FormControl>
                <SelectTrigger dir={language === "ar" ? "rtl" : "ltr"}>
                  <SelectValue placeholder={t("selectService")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TypesOptions.map(s => (
                  <SelectItem key={s.id} value={s.id} dir={language === "ar" ? "rtl" : "ltr"}>
                    {s.name[language]} ({s.duration} {t("minute")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time Select */}
      <FormField
        control={control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("time")}</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger dir={language === "ar" ? "rtl" : "ltr"}>
                  <SelectValue placeholder={t("selectTime")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIME_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} dir={language === "ar" ? "rtl" : "ltr"}>
                    {opt.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("notes")}</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder={t("addNotes")} className="resize-none" dir={language === "ar" ? "rtl" : "ltr"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
