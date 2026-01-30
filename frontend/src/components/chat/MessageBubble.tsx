import { useState, useRef, useEffect } from 'react';
import { Message } from '../../services/api';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    onReact: (emoji: string) => void;
    onPin: () => void;
    isAdmin: boolean;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export function MessageBubble({ message, isOwn, onReact, onPin, isAdmin }: MessageBubbleProps) {
    const [showReactions, setShowReactions] = useState(false);
    const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);

    const handleMouseDown = () => {
        const timer = setTimeout(() => {
            setShowReactions(true);
        }, 500);
        setHoldTimer(timer);
    };

    const handleMouseUp = () => {
        if (holdTimer) {
            clearTimeout(holdTimer);
            setHoldTimer(null);
        }
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return '✓';
            case 'delivered':
                return '✓✓';
            case 'read':
                return <span className="text-medium-slate-blue">✓✓</span>;
            default:
                return '';
        }
    };

    return (
        <div
            className={cn(
                'flex mb-3 relative',
                isOwn ? 'justify-end' : 'justify-start'
            )}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            {/* Avatar for others */}
            {!isOwn && (
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0"
                    style={{ backgroundColor: message.sender.profilePicColor || '#a594f9' }}
                >
                    {message.sender.username.charAt(0).toUpperCase()}
                </div>
            )}

            <div className={cn('max-w-[70%] relative', isOwn && 'order-1')}>
                {/* Pinned indicator */}
                {message.isPinned && (
                    <div className="absolute -top-5 left-0 text-xs text-muted-foreground flex items-center gap-1">
                        <span>📌</span> Pinned
                    </div>
                )}

                {/* Message content */}
                <div
                    className={cn(
                        'px-4 py-2 rounded-2xl shadow-sm',
                        isOwn
                            ? 'bg-medium-slate-blue text-white rounded-br-md'
                            : 'bg-white text-foreground rounded-bl-md',
                        message.type === 'system' && 'bg-lavender-veil/50 text-muted-foreground text-center text-sm italic'
                    )}
                >
                    {/* Sender name for group chats */}
                    {!isOwn && message.type !== 'system' && (
                        <p className="text-xs font-semibold text-soft-periwinkle mb-1">
                            {message.sender.username}
                        </p>
                    )}

                    {/* Content based on type */}
                    {message.type === 'file' ? (
                        <div className="flex items-center gap-2">
                            <span>📎</span>
                            <div>
                                <p className="font-medium">{message.fileName || 'File'}</p>
                                {message.fileSize && (
                                    <p className="text-xs opacity-70">{message.fileSize}</p>
                                )}
                            </div>
                        </div>
                    ) : message.type === 'gif' ? (
                        <img
                            src={message.content}
                            alt="GIF"
                            className="max-w-full rounded-lg"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}

                    {/* Timestamp and status */}
                    <div className={cn(
                        'flex items-center gap-1 mt-1',
                        isOwn ? 'justify-end' : 'justify-start'
                    )}>
                        <span className="text-xs opacity-70">{formatTime(message.createdAt)}</span>
                        {isOwn && <span className="text-xs">{getStatusIcon(message.status)}</span>}
                    </div>
                </div>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                    <div className={cn(
                        'flex flex-wrap gap-1 mt-1',
                        isOwn ? 'justify-end' : 'justify-start'
                    )}>
                        {Object.entries(
                            message.reactions.reduce((acc, r) => {
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                return acc;
                            }, {} as Record<string, number>)
                        ).map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() => onReact(emoji)}
                                className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm shadow-sm hover:bg-white transition-colors"
                            >
                                {emoji} {count > 1 && <span className="text-xs">{count}</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reaction picker */}
                {showReactions && (
                    <div className={cn(
                        'absolute bottom-full mb-2 bg-white rounded-full shadow-lg p-2 flex gap-1 z-10',
                        isOwn ? 'right-0' : 'left-0'
                    )}>
                        {QUICK_REACTIONS.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => {
                                    onReact(emoji);
                                    setShowReactions(false);
                                }}
                                className="w-8 h-8 rounded-full hover:bg-lavender-veil transition-colors flex items-center justify-center"
                            >
                                {emoji}
                            </button>
                        ))}
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    onPin();
                                    setShowReactions(false);
                                }}
                                className="w-8 h-8 rounded-full hover:bg-lavender-veil transition-colors flex items-center justify-center"
                                title="Pin message"
                            >
                                📌
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

interface MessagesListProps {
    messages: Message[];
    currentUserId: string;
    onReact: (messageId: string, emoji: string) => void;
    onPin: (messageId: string) => void;
    isAdmin: boolean;
    typingUsers: Array<{ userId: string; username: string }>;
}

export function MessagesList({
    messages,
    currentUserId,
    onReact,
    onPin,
    isAdmin,
    typingUsers,
}: MessagesListProps) {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map(message => (
                <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender._id === currentUserId}
                    onReact={(emoji) => onReact(message._id, emoji)}
                    onPin={() => onPin(message._id)}
                    isAdmin={isAdmin}
                />
            ))}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>
                        {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </span>
                </div>
            )}

            <div ref={endRef} />
        </div>
    );
}
