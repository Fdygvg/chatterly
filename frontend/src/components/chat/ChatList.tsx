import { Room, User } from '../../services/api';
import { cn } from '../../lib/utils';

interface ChatListItemProps {
    room: Room;
    currentUserId: string;
    isActive: boolean;
    onClick: () => void;
}

function getOtherUser(room: Room, currentUserId: string): User | undefined {
    if (room.type === 'private') {
        return room.members.find(m => m._id !== currentUserId);
    }
    return undefined;
}

function formatLastSeen(date: string): string {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

export function ChatListItem({ room, currentUserId, isActive, onClick }: ChatListItemProps) {
    const otherUser = getOtherUser(room, currentUserId);
    const displayName = room.type === 'private' ? otherUser?.username : room.name;
    const avatarColor = otherUser?.profilePicColor || '#a594f9';
    const isOnline = otherUser?.status === 'online';

    return (
        <div
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
                'hover:bg-lavender-veil/50',
                isActive && 'bg-periwinkle/30 border-l-4 border-medium-slate-blue'
            )}
        >
            {/* Avatar */}
            <div className="relative">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{ backgroundColor: avatarColor }}
                >
                    {room.type === 'group' ? (
                        <span>👥</span>
                    ) : room.type === 'ai' ? (
                        <span>🤖</span>
                    ) : (
                        displayName?.charAt(0).toUpperCase()
                    )}
                </div>
                {/* Online indicator */}
                {room.type === 'private' && (
                    <div
                        className={cn(
                            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                        )}
                    />
                )}
                {/* Group member stack */}
                {room.type === 'group' && room.members.length > 2 && (
                    <div className="absolute -bottom-1 -right-1 bg-medium-slate-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {room.members.length}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-foreground truncate">{displayName}</h3>
                    {room.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                            {formatLastSeen(room.lastMessage.createdAt)}
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage?.content || 'No messages yet'}
                    </p>
                    {room.unreadCount && room.unreadCount > 0 && (
                        <span className="bg-medium-slate-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {room.unreadCount > 9 ? '9+' : room.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ChatListProps {
    rooms: Room[];
    currentUserId: string;
    activeRoomId?: string;
    onRoomSelect: (room: Room) => void;
    onSearch: (query: string) => void;
}

export function ChatList({ rooms, currentUserId, activeRoomId, onRoomSelect, onSearch }: ChatListProps) {
    return (
        <div className="flex flex-col h-full bg-lavender-mist">
            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-full bg-white border border-lavender-veil focus:outline-none focus:ring-2 focus:ring-medium-slate-blue/50"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {rooms.map(room => (
                    <ChatListItem
                        key={room._id}
                        room={room}
                        currentUserId={currentUserId}
                        isActive={room._id === activeRoomId}
                        onClick={() => onRoomSelect(room)}
                    />
                ))}
                {rooms.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No chats yet</p>
                        <p className="text-sm">Start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
