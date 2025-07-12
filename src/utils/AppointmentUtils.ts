

export const formatTimeForDisplay = (time: string) => {
  // This is a workaround since we can't use hooks directly in utility functions
  // We'll use English AM/PM by default and let components handle translation if needed
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const isPm = hour >= 12;
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minuteStr} ${isPm ? 'PM' : 'AM'}`;
};





