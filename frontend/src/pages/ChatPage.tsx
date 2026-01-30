import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Room, Message, roomsApi } from '../services/api';
import { ChatList } from '../components/chat/ChatList';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessagesList } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { cn } from '../lib/utils';

interface TypingUser {
    userId: string;
    username: string;
}

export function ChatPage() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [_isLoading, setIsLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(true);

    // Socket handlers
    const handleNewMessage = useCallback((message: Message) => {
        if (activeRoom && message.room === activeRoom._id) {
            setMessages(prev => [...prev, message]);
        }
        // Update room's last message
        setRooms(prev =>
            prev.map(room =>
                room._id === message.room
                    ? { ...room, lastMessage: message }
                    : room
            )
        );
    }, [activeRoom]);

    const handleTypingStart = useCallback((data: TypingUser) => {
        setTypingUsers(prev => {
            if (prev.some(u => u.userId === data.userId)) return prev;
            return [...prev, data];
        });
    }, []);

    const handleTypingStop = useCallback((userId: string) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== userId));
    }, []);

    const handleUserOnline = useCallback((data: { userId: string; username: string }) => {
        setRooms(prev =>
            prev.map(room => ({
                ...room,
                members: room.members.map(m =>
                    m._id === data.userId ? { ...m, status: 'online' as const } : m
                ),
            }))
        );
    }, []);

    const handleUserOffline = useCallback((data: { userId: string; lastSeen: string }) => {
        setRooms(prev =>
            prev.map(room => ({
                ...room,
                members: room.members.map(m =>
                    m._id === data.userId
                        ? { ...m, status: 'offline' as const, lastSeen: data.lastSeen }
                        : m
                ),
            }))
        );
    }, []);

    const handleMessageStatus = useCallback((data: { messageId: string; status: string }) => {
        setMessages(prev =>
            prev.map(msg =>
                msg._id === data.messageId
                    ? { ...msg, status: data.status as 'sent' | 'delivered' | 'read' }
                    : msg
            )
        );
    }, []);

    const handleMessageReacted = useCallback((data: { messageId: string; reactions: any[] }) => {
        setMessages(prev =>
            prev.map(msg =>
                msg._id === data.messageId
                    ? { ...msg, reactions: data.reactions }
                    : msg
            )
        );
    }, []);

    const handleMessagePinned = useCallback((data: { messageId: string; isPinned: boolean }) => {
        setMessages(prev =>
            prev.map(msg =>
                msg._id === data.messageId
                    ? { ...msg, isPinned: data.isPinned }
                    : msg
            )
        );
    }, []);

    const {
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
        reactToMessage,
        pinMessage,
        joinRoom,
    } = useSocket(
        handleNewMessage,
        handleTypingStart,
        handleTypingStop,
        handleUserOnline,
        handleUserOffline,
        handleMessageStatus,
        handleMessageReacted,
        handleMessagePinned
    );

    // Load rooms on mount
    useEffect(() => {
        async function loadRooms() {
            try {
                const response = await roomsApi.getRooms();
                setRooms(response.data);
            } catch (error) {
                console.error('Failed to load rooms:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadRooms();
    }, []);

    // Load messages when room changes
    useEffect(() => {
        if (!activeRoom) return;

        async function loadMessages() {
            try {
                const response = await roomsApi.getMessages(activeRoom!._id);
                setMessages(response.data.messages);
                joinRoom(activeRoom!._id);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        }
        loadMessages();
        setTypingUsers([]);
    }, [activeRoom, joinRoom]);

    const handleRoomSelect = (room: Room) => {
        setActiveRoom(room);
        setShowSidebar(false);
    };

    const handleSendMessage = (content: string) => {
        if (activeRoom) {
            sendMessage(activeRoom._id, content);
        }
    };

    const handleReact = (messageId: string, emoji: string) => {
        if (activeRoom) {
            reactToMessage(messageId, activeRoom._id, emoji);
        }
    };

    const handlePin = (messageId: string) => {
        if (activeRoom) {
            pinMessage(messageId, activeRoom._id);
        }
    };

    const handleSearch = (query: string) => {
        // TODO: Implement search
        console.log('Search:', query);
    };

    if (!user) return null;

    const isAdmin = activeRoom?.admins.includes(user._id) || false;

    return (
        <div className="flex h-screen bg-background">
            {/* Chat list sidebar */}
            <div
                className={cn(
                    'w-full lg:w-80 lg:border-r lg:border-lavender-veil flex-shrink-0',
                    'lg:block',
                    showSidebar ? 'block' : 'hidden lg:block'
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-lavender-mist border-b border-lavender-veil">
                        <h1 className="text-2xl font-bold text-medium-slate-blue">Chatterly</h1>
                        <p className="text-sm text-muted-foreground">
                            {isConnected ? (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    Connecting...
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Chat list */}
                    <ChatList
                        rooms={rooms}
                        currentUserId={user._id}
                        activeRoomId={activeRoom?._id}
                        onRoomSelect={handleRoomSelect}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {/* Chat area */}
            <div
                className={cn(
                    'flex-1 flex flex-col',
                    !showSidebar ? 'block' : 'hidden lg:flex'
                )}
            >
                {activeRoom ? (
                    <>
                        <ChatHeader
                            room={activeRoom}
                            currentUserId={user._id}
                            typingUsers={typingUsers}
                            onBack={() => setShowSidebar(true)}
                            onProfileClick={() => console.log('Profile clicked')}
                            onSearchClick={() => console.log('Search clicked')}
                            onMenuClick={() => console.log('Menu clicked')}
                        />

                        <div
                            className="flex-1 overflow-hidden"
                            style={activeRoom.wallpaper ? {
                                backgroundImage: `url(${activeRoom.wallpaper})`,
                                backgroundSize: 'cover',
                            } : {
                                background: 'linear-gradient(180deg, #f5efff 0%, #e5d9f2 100%)',
                            }}
                        >
                            <MessagesList
                                messages={messages}
                                currentUserId={user._id}
                                onReact={handleReact}
                                onPin={handlePin}
                                isAdmin={isAdmin}
                                typingUsers={typingUsers}
                            />
                        </div>

                        <ChatInput
                            onSend={handleSendMessage}
                            onTypingStart={() => startTyping(activeRoom._id)}
                            onTypingStop={() => stopTyping(activeRoom._id)}
                            disabled={!isConnected}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-lavender-mist to-lavender-veil">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Welcome to Chatterly
                            </h2>
                            <p className="text-muted-foreground">
                                Select a chat to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
