import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6F61',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule a feeding notification
export const scheduleFeedingNotification = async (petName, feedingTime) => {
  const trigger = new Date(feedingTime);
  trigger.setMinutes(trigger.getMinutes() - 5); // 5 minutes before feeding time
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Feeding Time Soon!',
      body: `Time to feed ${petName} in 5 minutes!`,
      data: { type: 'feeding', petName },
    },
    trigger,
  });
};

// Schedule a medication notification
export const scheduleMedicationNotification = async (petName, medicationName, medicationTime) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medication Reminder',
      body: `Time to give ${petName} their ${medicationName}!`,
      data: { type: 'medication', petName, medicationName },
    },
    trigger: medicationTime,
  });
};

// Cancel a notification
export const cancelNotification = async (notificationId) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
