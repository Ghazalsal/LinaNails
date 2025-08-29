import React from "react";
import DailySchedule from "./DailySchedule";
import LanguageSwitcher from "./LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppointmentCalendar from "./AdminCalendar";
import { UserPlus } from "lucide-react";
import UserForm from "./UserForm";
import { useAdminDashboardHook } from "./useAdminDashboardHook";
import { useLanguage } from "@/contexts/LanguageContext";
import UserListModal from "./UserListModal";

const AdminDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    selectedDate,
    appointments,
    users,
    handleSelectDate,
    onOpenUserModal,
    onOpenUserList,
    loading,
    refreshAppointments,
    isUserFormOpen,
    onCloseUserModal,
    isUserListOpen,
    onCloseUserList,
    handleAddUser,
    handleEditUser,
    editingUser,
  } = useAdminDashboardHook();

  return (
    <div className="container mx-auto p-4" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <img
            src="logo-lina.png"
            alt="Lina Pure Nails Logo"
            className="h-20 sm:h-28 w-auto object-contain"
          />
          <LanguageSwitcher />
        </div>
        <p className="text-gray-600 text-center">{t("dashboardTitle")}</p>
      </header>

      <div
        className={`mb-6 flex flex-col gap-4 ${language === "ar" ? "items-start" : "items-end"
          }`}
      >
        <Button
          onClick={onOpenUserModal}
          className="w-48 bg-salon-gold hover:bg-salon-light-gold text-white"
        >
          <UserPlus
            className={`w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}`}
          />
          {t("addUser")}
        </Button>

        <Button
          onClick={onOpenUserList}
          variant="outline"
          className="w-48 border-salon-gold text-salon-gold hover:bg-salon-light-gold hover:text-white"
        >
          <UserPlus
            className={`w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}`}
          />
          {t("viewUsers")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <AppointmentCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            appointments={appointments}
            loading={loading}
          />

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-serif text-salon-gold">{t("quickStats")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-salon-light-pink p-4 rounded-md">
                  <p className="text-gray-600">{t("todayAppointments")}</p>
                  <p className="text-2xl font-bold">{loading ? "..." : appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <DailySchedule
            date={selectedDate}
            appointments={appointments}
            onAppointmentsChange={refreshAppointments}
          />
        </div>
      </div>

      <UserForm
        isOpen={isUserFormOpen}
        onClose={onCloseUserModal}
        onSubmit={handleAddUser}
        editingUser={editingUser}
      />

      <UserListModal
        isOpen={isUserListOpen}
        onClose={onCloseUserList}
        onEditUser={handleEditUser}
        users={users}
      />
    </div>
  );
};

export default AdminDashboard;
