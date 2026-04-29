
export const AUDIO_FILES = {
  NOTIFICATION: '/audio/notification.wav',
  NEW_ORDER: '/audio/new-order.mp3',
  ORDER_CONFIRMATION: '/audio/order-confirmation.wav',
} as const;

/**
 * Sound playback is disabled by user request.
 */
export function playSound(file: string, loop: boolean = false) {
  return null;
}

export const playNotification = () => {};
export const playNewOrderAlert = () => null;
export const playOrderConfirmation = () => {};
