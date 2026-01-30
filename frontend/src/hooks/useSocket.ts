import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface TypingUser {
    userId: string;
    username: string;
}

interface UseSocketReturn {
    socket: Socket | null;
    isConnected: boolean;
    sendMessage: (roomId: string, content: string, type?: string) => void;
    startTyping: (roomId: string) => void;
    stopTyping: (roomId: string) => void;
    markAsRead: (messageId: string, roomId: string) => void;
    reactToMessage: (messageId: string, roomId: string, emoji: string) => void;
    pinMessage: (messageId: string, roomId: string) => void;
    joinRoom: (roomId: string) => void;
}

export function useSocket(
    onNewMessage?: (message: Message) => void,
    onTypingStart?: (user: TypingUser) => void,
    onTypingStop?: (userId: string) => void,
    onUserOnline?: (user: { userId: string; username: string }) => void,
    onUserOffline?: (data: { userId: string; lastSeen: string }) => void,
    onMessageStatus?: (data: { messageId: string; status: string }) => void,
    onMessageReacted?: (data: { messageId: string; reactions: any[] }) => void,
    onMessagePinned?: (data: { messageId: string; isPinned: boolean }) => void
): UseSocketReturn {
    const { token, isAuthenticated } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            return;
        }

        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        // Message events
        socket.on('message:new', (message: Message) => {
            onNewMessage?.(message);
        });

        socket.on('message:status', (data: { messageId: string; status: string }) => {
            onMessageStatus?.(data);
        });

        socket.on('message:reacted', (data: { messageId: string; reactions: any[] }) => {
            onMessageReacted?.(data);
        });

        socket.on('message:pinned', (data: { messageId: string; isPinned: boolean }) => {
            onMessagePinned?.(data);
        });

        // Typing events
        socket.on('typing:start', (data: TypingUser) => {
            onTypingStart?.(data);
        });

        socket.on('typing:stop', (data: { userId: string }) => {
            onTypingStop?.(data.userId);
        });

        // User status events
        socket.on('user:online', (data: { userId: string; username: string }) => {
            onUserOnline?.(data);
        });

        socket.on('user:offline', (data: { userId: string; lastSeen: string }) => {
            onUserOffline?.(data);
        });

        // Error handling
        socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated, token]);

    const sendMessage = useCallback((roomId: string, content: string, type = 'text') => {
        socketRef.current?.emit('message:send', { roomId, content, type });
    }, []);

    const startTyping = useCallback((roomId: string) => {
        socketRef.current?.emit('typing:start', roomId);
    }, []);

    const stopTyping = useCallback((roomId: string) => {
        socketRef.current?.emit('typing:stop', roomId);
    }, []);

    const markAsRead = useCallback((messageId: string, roomId: string) => {
        socketRef.current?.emit('message:read', { messageId, roomId });
    }, []);

    const reactToMessage = useCallback((messageId: string, roomId: string, emoji: string) => {
        socketRef.current?.emit('message:react', { messageId, roomId, emoji });
    }, []);

    const pinMessage = useCallback((messageId: string, roomId: string) => {
        socketRef.current?.emit('message:pin', { messageId, roomId });
    }, []);

    const joinRoom = useCallback((roomId: string) => {
        socketRef.current?.emit('room:join', roomId);
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
        markAsRead,
        reactToMessage,
        pinMessage,
        joinRoom,
    };
}
