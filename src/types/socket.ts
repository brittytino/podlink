export interface SocketMessage {
  id: string;
  messageText: string;
  userId: string;
  username: string;
  displayName?: string; // Anonymous name for privacy
  avatarUrl: string | null;
  createdAt: string;
  isCrisisResponse: boolean;
  isAI?: boolean; // Whether this message is from an AI bot
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
