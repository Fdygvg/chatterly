import { Room, User } from '../../services/api';
import { cn } from '../../lib/utils';

interface ChatHeaderProps {
    room: Room;
    currentUserId: string;
    typingUsers: Array<{ userId: string; username: string }>;
    onBack?: () => void;
    onProfileClick: () => void;
    onSearchClick: () => void;
    onMenuClick: () => void;
}

function getOtherUser(room: Room, currentUserId: string): User | undefined {
    if (room.type === 'private') {
        return room.members.find(m => m._id !== currentUserId);
    }
    return undefined;
}

function formatLastSeen(date?: string): string {
    if (!date) return '';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'last seen just now';
    if (diffMins < 60) return `last seen ${diffMins}m ago`;
    if (diffMins < 1440) return `last seen ${Math.floor(diffMins / 60)}h ago`;
    return `last seen ${Math.floor(diffMins / 1440)}d ago`;
}

export function ChatHeader({
    room,
    currentUserId,
    typingUsers,
    onBack,
    onProfileClick,
    onSearchClick,
    onMenuClick,
}: ChatHeaderProps) {
    const otherUser = getOtherUser(room, currentUserId);
    const displayName = room.type === 'private' ? otherUser?.username : room.name;
    const avatarColor = otherUser?.profilePicColor || '#a594f9';
    const isOnline = otherUser?.status === 'online';

    // Determine status text with animations
    const getStatusContent = () => {
        if (typingUsers.length > 0) {
            return (
                <span className="flex items-center gap-1 text-soft-periwinkle animate-pulse">
                    <span>typing</span>
                    <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-soft-periwinkle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                </span>
            );
        }

        if (room.type === 'private') {
            if (isOnline) {
                return <span className="text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    online
                </span>;
            }
            return <span className="text-muted-foreground">{formatLastSeen(otherUser?.lastSeen)}</span>;
        }

        // Group chat
        return (
            <span className="text-muted-foreground">
                {room.members.length} members
            </span>
        );
    };

    return (
        <div
            className="flex items-center justify-between px-4 py-3 bg-lavender-mist border-b border-lavender-veil"
            style={otherUser?.profilePicColor ? {
                background: `linear-gradient(135deg, ${avatarColor}15 0%, transparent 50%)`
            } : {}}
        >
            {/* Left section */}
            <div className="flex items-center gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-lavender-veil transition-colors lg:hidden"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Avatar */}
                <button onClick={onProfileClick} className="relative">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {room.type === 'group' ? (
                            // Mini avatar stack for groups
                            <div className="relative w-full h-full">
                                {room.members.slice(0, 3).map((member, i) => (
                                    <div
                                        key={member._id}
                                        className="absolute w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
                                        style={{
                                            backgroundColor: member.profilePicColor || '#a594f9',
                                            left: `${i * 8}px`,
                                            zIndex: 3 - i,
                                        }}
                                    >
                                        {member.username.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                            </div>
                        ) : room.type === 'ai' ? (
                            <span>🤖</span>
                        ) : (
                            displayName?.charAt(0).toUpperCase()
                        )}
                    </div>
                    {room.type === 'private' && (
                        <div
                            className={cn(
                                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                                isOnline ? 'bg-green-500' : 'bg-gray-400'
                            )}
                        />
                    )}
                </button>

                {/* Name and status */}
                <button onClick={onProfileClick} className="text-left">
                    <h2 className="font-semibold text-foreground">{displayName}</h2>
                    <p className="text-xs">{getStatusContent()}</p>
                </button>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
                {/* Video call (coming soon) */}
                <button
                    onClick={() => alert('Video calls coming soon!')}
                    className="p-2 rounded-full hover:bg-lavender-veil transition-colors text-muted-foreground"
                    title="Video call (Coming soon)"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* Voice call (coming soon) */}
                <button
                    onClick={() => alert('Voice calls coming soon!')}
                    className="p-2 rounded-full hover:bg-lavender-veil transition-colors text-muted-foreground"
                    title="Voice call (Coming soon)"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </button>

                {/* Search */}
                <button
                    onClick={onSearchClick}
                    className="p-2 rounded-full hover:bg-lavender-veil transition-colors text-muted-foreground"
                    title="Search in chat"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* Menu */}
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-full hover:bg-lavender-veil transition-colors text-muted-foreground"
                    title="More options"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
