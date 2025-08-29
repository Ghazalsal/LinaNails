import { useState, useEffect, useCallback } from "react";
import { createUser, fetchAppointmentsByDate, fetchUsers, updateUser, User, BackendAppointment } from "@/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { clearUserCache } from "./forms/utils";

export const useAdminDashboardHook = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { t } = useLanguage();

  const loadAppointments = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const data = await fetchAppointmentsByDate(date);
      setAppointments(data);
      return true;
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({ 
        variant: "destructive", 
        title: t("error") || "Error", 
        description: t("errorLoadingAppointments") || "Error loading appointments"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      return true;
    } catch (error) {
      console.error('Error loading users:', error);
      toast({ 
        variant: "destructive", 
        title: t("error") || "Error", 
        description: t("errorLoadingUsers") || "Error loading users"
      });
      return false;
    }
  }, [toast, t]);

  useEffect(() => {
    loadAppointments(selectedDate);
    loadUsers();
  }, [selectedDate, loadAppointments, loadUsers]);

  const handleSelectDate = (date?: Date) => {
    if (date && !loading) setSelectedDate(date);
  };

  const refreshAppointments = useCallback(async () => {
    const success = await loadAppointments(selectedDate);
    // Also clear user cache to ensure fresh user data
    clearUserCache();
    return success;
  }, [selectedDate, loadAppointments]);

  const onOpenUserModal = () => setIsUserFormOpen(true);
  
  const onCloseUserModal = () => { 
    setIsUserFormOpen(false); 
    setEditingUser(null); 
  };
  
  const onOpenUserList = () => setIsUserListOpen(true);
  const onCloseUserList = () => setIsUserListOpen(false);

  const handleAddUser = async (userData: User | Omit<User, "id">) => {
    try {
      if ("id" in userData && userData.id) {
        // Update existing user
        const updated = await updateUser(userData.id, { 
          name: userData.name, 
          phone: userData.phone 
        });
        toast({ 
          title: t("userUpdated"), 
        });
      } else {
        const newUser = await createUser(userData as Omit<User, "id">);
        toast({ 
          title: t("userAdded"), 
        });
      }
      
      await loadUsers();
      clearUserCache();
      setEditingUser(null);
      onCloseUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({ 
        variant: "destructive", 
        title: t("error") || "Error", 
        description: t("errorSavingUser") || "Error saving user"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
    onCloseUserList();
  };

  return {
    selectedDate,
    appointments,
    users,
    handleSelectDate,
    onOpenUserModal,
    onOpenUserList,
    isUserFormOpen,
    onCloseUserModal,
    isUserListOpen,
    onCloseUserList,
    handleAddUser,
    handleEditUser,
    editingUser,
    loading,
    refreshAppointments,
  };
};