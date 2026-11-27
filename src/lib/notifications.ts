/** Browser Notification API helpers for the dashboard.
 *
 * Shows a native OS/browser notification (the "Google sends a notification
 * from the website" behavior). Permission is requested on first use and is
 * handled gracefully when blocked or unsupported.
 */

export type BrowserNotificationOpts = {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
};

/** Request permission if needed, then show a notification.
 * Resolves to whether the notification was actually shown. */
export async function showBrowserNotification(opts: BrowserNotificationOpts): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;

  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
      return false;
    }
  }

  if (Notification.permission !== "granted") return false;

  new Notification(opts.title, {
    body: opts.body ?? "",
    icon: opts.icon ?? "/favicon.ico",
    tag: opts.tag ?? undefined,
  });
  return true;
}
