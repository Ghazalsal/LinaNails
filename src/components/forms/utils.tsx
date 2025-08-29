import { AppointmentType, fetchUsers, ServiceDurations, User } from "@/api";

export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour < 20; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const isPm = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      options.push({
        value: `${formattedHour}:${formattedMinute}`,
        label: {
          en: `${displayHour}:${formattedMinute} ${isPm ? 'PM' : 'AM'}`,
          ar: `${displayHour}:${formattedMinute} ${isPm ? 'مساءً' : 'صباحاً'}`,
        },
      });
    }
  }
  return options;
};

export const TypesOptions = [
  { id: AppointmentType.Manicure, name: { en: "Manicure", ar: "مانيكير" }, duration: ServiceDurations[AppointmentType.Manicure] },
  { id: AppointmentType.Pedicure, name: { en: "Pedicure", ar: "باديكير" }, duration: ServiceDurations[AppointmentType.Pedicure] },
  { id: AppointmentType.BothBasic, name: { en: "Basic Manicure & Pedicure", ar: "مانيكير و باديكير أساسي" }, duration: ServiceDurations[AppointmentType.BothBasic] },
  { id: AppointmentType.BothFull, name: { en: "Full Manicure & Pedicure", ar: "مانيكير و باديكير كامل" }, duration: ServiceDurations[AppointmentType.BothFull] },
  { id: AppointmentType.Eyebrows, name: { en: "Eyebrows", ar: "حواجب" }, duration: ServiceDurations[AppointmentType.Eyebrows] },
  { id: AppointmentType.Lashes, name: { en: "Lashes", ar: "رموش" }, duration: ServiceDurations[AppointmentType.Lashes] },
];

// Cache for users to avoid multiple API calls
let userCache: User[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get users with caching to reduce API calls
 */
export const getCachedUsers = async (): Promise<User[]> => {
  const now = Date.now();
  
  // Return cached users if cache is fresh
  if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return userCache;
  }
  
  try {
    const users = await fetchUsers();
    userCache = users;
    cacheTimestamp = now;
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return cached users even if expired, better than nothing
    return userCache || [];
  }
};

/**
 * Find a user by ID, handling both id and _id properties
 */
export const findUserById = async (userId: string) => {

    const users = await getCachedUsers();
    return users.find(user => (user.id) === userId) ;
  
};

/**
 * Normalize user object to ensure consistent id property
 */
export const normalizeUser = (user: User): User => ({
  ...user,
  id: user.id || '',
});

/**
 * Normalize users array to ensure consistent id properties
 */
export const normalizeUsers = (users: User[]): User[] => {
  return users.map(normalizeUser);
};

/**
 * Clear user cache (useful after create/update/delete operations)
 */
export const clearUserCache = (): void => {
  userCache = null;
  cacheTimestamp = 0;
};

/**
 * Get user display name and phone for UI
 */
export const getUserDisplayInfo = async (userId: string): Promise<{
  name: string;
  phone: string;
  isLoading: false;
} | {
  name: string;
  phone: string;
  isLoading: true;
}> => {
  try {
    const user = await findUserById(userId);
    if (user) {
      return {
        name: user.name || 'Unknown User',
        phone: user.phone || '',
        isLoading: false,
      };
    }
    return {
      name: 'Unknown User',
      phone: '',
      isLoading: false,
    };
  } catch (error) {
    return {
      name: 'Loading...',
      phone: '',
      isLoading: true,
    };
  }
};