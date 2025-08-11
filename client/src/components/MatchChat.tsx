
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, limit, serverTimestamp, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChatMessage, ChatUser } from '../types/chat';
import { messageFilter } from '../utils/messageFilter';
import { Send, Smile, Image, MoreVertical, Reply, Quote, User, MessageSquare, Search } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Lottie from 'lottie-react';

interface MatchChatProps {
  matchId: string;
}

const MatchChat: React.FC<MatchChatProps> = ({ matchId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState<any[]>([]);
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [quotingMessage, setQuotingMessage] = useState<ChatMessage | null>(null);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastMessageRef = useRef<any>(null);

  const GIPHY_API_KEY = 'blTbI6GmDMjQXq1t83YDLLrE42YUDqGe';

  // Initialize user
  useEffect(() => {
    const savedUser = localStorage.getItem(`chatUser_${matchId}`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Show username input overlay
      setShowUsernameInput(true);
    }
  }, [matchId]);

  const handleUsernameSubmit = () => {
    const username = usernameInput.trim();
    if (username && messageFilter.isValidUsername(username)) {
      const newUser: ChatUser = {
        id: `${Date.now()}_${Math.random()}`,
        username: username,
        color: messageFilter.generateUserColor(),
        avatar: messageFilter.generateUserAvatar(),
        joinedAt: new Date()
      };
      setUser(newUser);
      localStorage.setItem(`chatUser_${matchId}`, JSON.stringify(newUser));
      setShowUsernameInput(false);
      setUsernameInput('');
    }
  };

  // Load messages
  useEffect(() => {
    if (!user) return;

    const messagesQuery = query(
      collection(db, `matches/${matchId}/messages`),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];

      setMessages(newMessages.reverse());
      setLoading(false);

      if (newMessages.length > 0) {
        lastMessageRef.current = snapshot.docs[snapshot.docs.length - 1];
      }
    });

    return () => unsubscribe();
  }, [matchId, user]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Search GIFs with debouncing
  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      loadTrendingGifs();
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=24&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  // Load trending GIFs
  const loadTrendingGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    }
  };

  // Load trending GIFs when picker opens
  useEffect(() => {
    if (showGifPicker && gifs.length === 0) {
      loadTrendingGifs();
    }
  }, [showGifPicker]);

  // Send message
  const sendMessage = async (type: 'text' | 'gif' = 'text', content?: string, gifData?: any) => {
    if (!user) return;
    
    const messageContent = content || newMessage.trim();
    if (!messageContent && type === 'text') return;

    const filteredContent = type === 'text' ? messageFilter.filterMessage(messageContent) : messageContent;
    if (!filteredContent && type === 'text') {
      alert('Message contains inappropriate content or links.');
      return;
    }

    try {
      const messageData: Partial<ChatMessage> = {
        userId: user.id,
        username: user.username,
        userColor: user.color,
        userAvatar: user.avatar,
        type,
        content: type === 'text' ? filteredContent : gifData?.images?.fixed_height?.url || '',
        gifData: type === 'gif' ? gifData : null,
        timestamp: serverTimestamp(),
        replyTo: replyingTo ? {
          id: replyingTo.id,
          username: replyingTo.username,
          content: replyingTo.content,
          type: replyingTo.type
        } : null,
        quote: quotingMessage ? {
          id: quotingMessage.id,
          username: quotingMessage.username,
          content: quotingMessage.content,
          type: quotingMessage.type
        } : null
      };

      await addDoc(collection(db, `matches/${matchId}/messages`), messageData);
      
      setNewMessage('');
      setReplyingTo(null);
      setQuotingMessage(null);
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      
      // Focus back to input
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      // In a real app, you'd broadcast typing status to other users
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Welcome animation data (simplified JSON)
  const welcomeAnimationData = {
    v: "5.5.7",
    fr: 29.9700012207031,
    ip: 0,
    op: 60.0000024438501,
    w: 500,
    h: 500,
    nm: "Welcome",
    ddd: 0,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape Layer 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "el",
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.2, 0.7, 1, 1] },
        o: { a: 0, k: 100 }
      }],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }]
  };

  // Username input overlay
  if (showUsernameInput || !user) {
    return (
      <div className="relative flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Blurred background with messages preview */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent filter blur-sm">
          <div className="p-4 space-y-3 opacity-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-blue-400"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Username input overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl border border-gray-200 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Join the Chat</h3>
              <p className="text-gray-600 text-sm">Enter your username to start chatting with other viewers</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUsernameSubmit();
                    }
                  }}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  maxLength={20}
                  autoFocus
                />
              </div>
              
              {usernameInput && !messageFilter.isValidUsername(usernameInput) && (
                <p className="text-red-500 text-xs">
                  Username must be 2-20 characters and cannot contain admin-related words
                </p>
              )}
              
              <button
                onClick={handleUsernameSubmit}
                disabled={!usernameInput.trim() || !messageFilter.isValidUsername(usernameInput)}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Join Chat
              </button>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• No signup required</p>
                <p>• Username stored until you clear cache</p>
                <p>• Be respectful to other users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-gray-800">Match Chat</h3>
          <span className="text-sm text-gray-500">({messages.length} messages)</span>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50/30 to-transparent"
        style={{ maxHeight: '400px' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12">
              <Lottie animationData={welcomeAnimationData} loop />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4">
              <Lottie animationData={welcomeAnimationData} loop />
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Welcome to the match chat!</h4>
            <p className="text-gray-500 text-sm">Be the first to send a message</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 group animate-fadeIn ${
                message.userId === user.id ? 'flex-row-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: message.userColor }}
              >
                {message.userAvatar}
              </div>

              {/* Message Content */}
              <div className={`max-w-[70%] ${message.userId === user.id ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Username and Time */}
                <div className={`flex items-center gap-2 mb-1 ${message.userId === user.id ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-medium" style={{ color: message.userColor }}>
                    {message.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {/* Reply/Quote Context */}
                {(message.replyTo || message.quote) && (
                  <div className="bg-gray-100 border-l-4 border-blue-400 p-2 mb-2 rounded text-xs max-w-full">
                    <span className="font-medium text-blue-600">
                      {message.replyTo ? `Replying to ${message.replyTo.username}:` : `Quoting ${message.quote?.username}:`}
                    </span>
                    <div className="text-gray-600 mt-1">
                      {(message.replyTo?.type || message.quote?.type) === 'gif' ? (
                        <div className="flex items-center gap-2">
                          <Image className="w-3 h-3" />
                          <img 
                            src={message.replyTo?.content || message.quote?.content} 
                            alt="Referenced GIF" 
                            className="max-w-16 max-h-12 rounded object-cover"
                          />
                        </div>
                      ) : (
                        <p className="truncate">
                          {message.replyTo?.content || message.quote?.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    message.userId === user.id
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {message.type === 'text' ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={message.content}
                        alt="GIF"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxWidth: '200px', maxHeight: '150px' }}
                      />
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="p-1 hover:bg-gray-200 rounded text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setQuotingMessage(message)}
                    className="p-1 hover:bg-gray-200 rounded text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    title="Quote"
                  >
                    <Quote className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply/Quote Preview */}
      {(replyingTo || quotingMessage) && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {replyingTo ? <Reply className="w-4 h-4 text-blue-500" /> : <Quote className="w-4 h-4 text-blue-500" />}
              <span className="font-medium text-blue-600">
                {replyingTo ? `Replying to ${replyingTo.username}` : `Quoting ${quotingMessage?.username}`}
              </span>
            </div>
            <button
              onClick={() => {
                setReplyingTo(null);
                setQuotingMessage(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {(replyingTo?.type || quotingMessage?.type) === 'gif' ? (
              <div className="flex items-center gap-2">
                <Image className="w-3 h-3" />
                <span className="truncate">GIF</span>
                <img 
                  src={replyingTo?.content || quotingMessage?.content} 
                  alt="Preview" 
                  className="max-w-8 max-h-6 rounded object-cover"
                />
              </div>
            ) : (
              <p className="truncate">
                {replyingTo?.content || quotingMessage?.content}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-t border-gray-200">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setNewMessage(prev => prev + emojiData.emoji);
              setShowEmojiPicker(false);
              inputRef.current?.focus();
            }}
            width="100%"
            height={300}
          />
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div className="border-t border-gray-200 p-4 bg-gray-50" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search GIFs..."
                value={gifSearchQuery}
                onChange={(e) => setGifSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchGifs(gifSearchQuery);
                  }
                }}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => searchGifs(gifSearchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          {gifs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Loading GIFs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => sendMessage('gif', '', gif)}
                  className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-all duration-200 hover:scale-105 border border-gray-200"
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowGifPicker(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Emojis"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              setShowEmojiPicker(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="GIFs"
          >
            <Image className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              maxLength={500}
            />
          </div>

          <button
            onClick={() => sendMessage()}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full transition-colors duration-200 transform hover:scale-105 active:scale-95"
            title="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchChat;
