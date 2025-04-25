import * as Notifications from 'expo-notifications';

export default async function showLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: null, // triggers immediately
  });
}
