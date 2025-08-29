/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { cn } from '@/libs/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTimeForDisplay, translateServiceType } from '@/utils/AppointmentUtils';
import { Plus } from 'lucide-react';
import { TimeSlotProps } from './types';
import { findUserById } from '../forms/utils';
import { BackendAppointment, User } from '@/api';

const TimeSlot = ({ 
  time, 
  appointments = [], 
  isPast, 
  onClick, 
  onAppointmentClick, 
  onAddClick 
}: TimeSlotProps) => {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});

  const hasAppointments = appointments.length > 0;
  // Load users for all appointments
  useEffect(() => {
    const loadUsersForAppointments = async () => {
      for (const apt of appointments) {
        if (apt.userId && !users[apt.userId] && !loadingUsers[apt.userId]) {
          setLoadingUsers(prev => ({ ...prev, [apt.userId]: true }));

          try {
            const user = await findUserById(apt.userId);
            setUsers(prev => ({ ...prev, [apt.userId]: user ?? null }));
          } catch (error) {
            console.error('Error loading user for appointment:', apt.id, error);
            setUsers(prev => ({ ...prev, [apt.userId]: null }));
          } finally {
            setLoadingUsers(prev => ({ ...prev, [apt.userId]: false }));
          }
        }
      }
    };

    if (hasAppointments) {
      loadUsersForAppointments();
    }
  }, [appointments, hasAppointments]);

  const getUserName = (apt: BackendAppointment| any) => {
    console.log('Getting user name for appointment:', apt);
    
    // First check if user object is directly on the appointment
    if (apt.user) {
      return apt.user.name ;
    }
    
    // Then check if we have the user in our local state
    if (apt.userId && users[apt.userId]) {
      const user = users[apt.userId];
      return user?.name ;
    }
    
    // Show loading state
    if (apt.userId && loadingUsers[apt.userId]) {
      return t('loading') || 'Loading...';
    }
    
    // Fallback if no user data is available
    return t('userNotFound') || 'User not found';
  };

  return (
    <div
      className={cn(
        "p-3 rounded-md border transition-colors",
        hasAppointments ? "bg-salon-light-pink border-salon-gold" :
          isPast ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 cursor-pointer"
      )}
      onClick={!hasAppointments && !isPast ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">
          {(() => {
            const timeString = formatTimeForDisplay(time);
            return timeString
              .replace('AM', t('AM'))
              .replace('PM', t('PM'));
          })()}
        </span>
        {!hasAppointments && !isPast && (
          <span className="text-sm text-gray-400">{t('available')}</span>
        )}
        {!hasAppointments && isPast && (
          <span className="text-sm text-gray-400">{t('past')}</span>
        )}
      </div>

      {hasAppointments && (
        <div className="space-y-2">
          {appointments.map((apt: BackendAppointment) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-2 bg-white rounded border border-salon-gold cursor-pointer hover:bg-gray-50"
              onClick={() => onAppointmentClick ? onAppointmentClick(apt) : undefined}
            >
              <span className="text-sm">
                {getUserName(apt)} - {translateServiceType(apt.type, language, t)}
              </span>
            </div>
          ))}

          {!isPast && onAddClick && (
            <div
              className="flex items-center justify-center p-2 bg-white rounded border border-dashed border-salon-gold cursor-pointer hover:bg-gray-50 mt-2"
              onClick={onAddClick}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-sm">{t('addAppointment')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;