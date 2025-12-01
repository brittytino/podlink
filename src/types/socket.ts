export interface SocketMessage {
  id: string;
  messageText: string;
  imageUrl?: string | null;
  userId: string;
  username: string;
  displayName?: string; // Anonymous name for privacy
  avatarUrl: string | null;
  createdAt: string;
  isCrisisResponse: boolean;
  isAI?: boolean; // Whether this message is from an AI bot
  isDeleted?: boolean;
  reactions?: Array<{ emoji: string; count: number; userIds: string[] }>;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface CrisisAlertEvent {
  alertId: string;
  userId: string;
  username: string;
  message: string | null;
  createdAt: string;
}

export interface UserStatusEvent {
  userId: string;
  username: string;
}
