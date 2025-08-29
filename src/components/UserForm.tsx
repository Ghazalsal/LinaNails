/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@/api'; // Use backend User type

// Validation schema
const userSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  phone: z.string().regex(/^\+972\d{7,9}$/, { message: "Valid Palestinian phone required" }),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: User | Omit<User, 'id'>) => void; // Include id when editing
  editingUser?: User | any;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const { language, t } = useLanguage();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', phone: '+972-' },
  });
console.log({editingUser})
  useEffect(() => {
    if (editingUser) {
      form.reset({ name: editingUser.name, phone: editingUser.phone });
    } else {
      form.reset({ name: '', phone: '+972-' });
    }
  }, [editingUser, form]);

  const handleSubmit = (data: UserFormValues | any ) => {
    if (editingUser) {
      onSubmit({ id: editingUser.id || editingUser?._id, name: data.name, phone: data.phone });
    } else {
      onSubmit({ name: data.name, phone: data.phone });
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-salon-gold text-center">
            {editingUser ? t('editUser') : t('addUser')}
          </DialogTitle>
          <DialogDescription className="text-center">{t('enterUserDetails')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterUserName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input placeholder="+972-59-123-4567" {...field} dir="ltr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className={`flex gap-2 ${language === 'ar' ? 'justify-between' : 'justify-end'}`}>
              <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
              <Button type="submit" className="bg-salon-gold hover:bg-salon-light-gold text-white">
                {editingUser ? t('edit') : t('addUser')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
