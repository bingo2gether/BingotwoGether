import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

// Ensure keys are present before setting (or handle error gracefully)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        process.env.VAPID_EMAIL || 'mailto:noreply@bingo2gether.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.warn('VAPID Keys not found in environment variables. Notifications will not work.');
}

export class NotificationService {
    /**
     * Send a Push Notification to a specific subscription
     */
    static async sendNotification(subscription: webpush.PushSubscription, payload: any) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify(payload));
            return { success: true };
        } catch (error) {
            console.error('Error sending notification:', error);
            return { success: false, error };
        }
    }

    /**
     * Send notifications to multiple subscriptions
     */
    static async sendBroadcast(subscriptions: webpush.PushSubscription[], payload: any) {
        const promises = subscriptions.map(sub => this.sendNotification(sub, payload));
        return Promise.all(promises);
    }
}
