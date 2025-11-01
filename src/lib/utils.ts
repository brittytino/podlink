import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-purple-500';
  if (streak >= 14) return 'text-blue-500';
  if (streak >= 7) return 'text-green-500';
  if (streak >= 3) return 'text-yellow-500';
  return 'text-gray-500';
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '💎';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '⭐';
  return '🌱';
}
