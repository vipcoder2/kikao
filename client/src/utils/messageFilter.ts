class MessageFilter {
  private badWords: string[];
  private customBadWords: string[];
  private urlRegex: RegExp;

  constructor() {
    this.badWords = [
      'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'cunt', 'whore', 'nigga', 'monkey', 'fat', 'https', 'link', 'https', 'com', 'www'
    ];
    this.customBadWords = [
      'spam', 'scam', 'hack', 'cheat', 'bot'
    ];
    this.urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9.-]+\.[a-z]{2,}\b)/gi;
  }

  // Filter profanity and inappropriate content
  filterMessage(message: string): string {
    let filteredMessage = message;

    // Remove URLs
    if (this.containsUrl(message)) {
      return '';
    }

    // Filter bad words
    [...this.badWords, ...this.customBadWords].forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredMessage = filteredMessage.replace(regex, '*'.repeat(word.length));
    });

    return filteredMessage.trim();
  }

  // Check if message contains URLs
  containsUrl(message: string): boolean {
    return this.urlRegex.test(message);
  }

  // Check if username contains admin-related words
  isValidUsername(username: string): boolean {
    const lowerUsername = username.toLowerCase().trim();

    if (lowerUsername.length < 2 || lowerUsername.length > 20) {
      return false;
    }

    const adminWords = ['admin', 'administrator', 'mod', 'moderator', 'owner', 'support'];
    return !adminWords.some(word => lowerUsername.includes(word));
  }

  // Generate random user color
  generateUserColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A24', '#0984e3', '#6c5ce7', '#a29bfe'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Generate random user avatar emoji
  generateUserAvatar(): string {
    const avatars = [
      '😊', '😎', '🤓', '😄', '😃', '🙂', '😉', '🤗', '😋', '😌',
      '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐢', '🦄'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
}

export const messageFilter = new MessageFilter();