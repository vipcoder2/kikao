
export interface ChatUser {
  id: string;
  username: string;
  color: string;
  avatar: string;
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userColor: string;
  userAvatar: string;
  content: string;
  type: 'text' | 'gif';
  timestamp: any; // Firebase Timestamp
  gifData?: any;
  replyTo?: {
    id: string;
    username: string;
    content: string;
    type: 'text' | 'gif';
  } | null;
  quote?: {
    id: string;
    username: string;
    content: string;
    type: 'text' | 'gif';
  } | null;
}

export interface TypingUser {
  id: string;
  username: string;
  timestamp: Date;
}
