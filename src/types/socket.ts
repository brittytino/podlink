export interface SocketMessage {
  id: string;
  messageText: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
  isCrisisResponse: boolean;
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
