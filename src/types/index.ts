import { GoalType, AlertStatus, BadgeType } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  availabilityHours: { start: string; end: string };
  goalType: GoalType;
  goalDescription: string;
  currentStreak: number;
  lastCheckIn: Date | null;
  podId: string | null;
  onboardingComplete: boolean;
}

export interface Pod {
  id: string;
  name: string;
  totalStreak: number;
  members?: User[];
}

export interface CrisisAlert {
  id: string;
  userId: string;
  podId: string;
  message: string | null;
  status: AlertStatus;
  responseCount: number;
  createdAt: Date;
  resolvedAt: Date | null;
  user?: User;
}

export interface PodMessage {
  id: string;
  podId: string;
  userId: string;
  messageText: string;
  isCrisisResponse: boolean;
  alertId: string | null;
  createdAt: Date;
  user?: User;
}

export interface CheckIn {
  id: string;
  userId: string;
  stayedOnTrack: boolean;
  date: Date;
}

export interface CrisisToolkitItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  orderPosition: number;
}

export interface Achievement {
  id: string;
  podId: string | null;
  userId: string | null;
  badgeType: BadgeType;
  earnedAt: Date;
}
