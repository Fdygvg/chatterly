// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface User {
    _id: string;
    email: string;
    username: string;
    avatar?: string;
    profilePicColor?: string;
    status: 'online' | 'offline';
    lastSeen?: string;
}

export interface Room {
    _id: string;
    name?: string;
    type: 'private' | 'group' | 'ai';
    members: User[];
    admins: string[];
    wallpaper?: string;
    pinnedMessages: string[];
    lastMessage?: Message;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    sender: User;
    room: string;
    content: string;
    type: 'text' | 'file' | 'gif' | 'system';
    fileUrl?: string;
    fileSize?: string;
    fileName?: string;
    status: 'sent' | 'delivered' | 'read';
    reactions: Array<{ user: User; emoji: string }>;
    isPinned: boolean;
    replyTo?: Message;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    data: User;
    token: string;
    message: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
}

// Helper function for requests
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}

// Auth API
export const authApi = {
    signup: (data: { email: string; password: string; username: string }) =>
        request<AuthResponse>('/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        request<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        request<ApiResponse<User>>('/logout', {
            method: 'POST',
        }),
};

// Rooms API
export const roomsApi = {
    getRooms: () => request<ApiResponse<Room[]>>('/rooms'),

    getRoom: (id: string) => request<ApiResponse<Room>>(`/rooms/${id}`),

    getMessages: (roomId: string, page = 1, limit = 50) =>
        request<ApiResponse<{ messages: Message[]; pagination: any }>>(
            `/rooms/${roomId}/messages?page=${page}&limit=${limit}`
        ),

    createRoom: (data: { type: string; name?: string; members: string[] }) =>
        request<ApiResponse<Room>>('/rooms', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateRoom: (id: string, data: { name?: string; wallpaper?: string }) =>
        request<ApiResponse<Room>>(`/rooms/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    addMember: (roomId: string, userId: string) =>
        request<ApiResponse<Room>>(`/rooms/${roomId}/members`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
        }),

    removeMember: (roomId: string, userId: string) =>
        request<ApiResponse<Room>>(`/rooms/${roomId}/members`, {
            method: 'DELETE',
            body: JSON.stringify({ userId }),
        }),

    searchRooms: (query: string) =>
        request<ApiResponse<Room[]>>(`/rooms/search?q=${encodeURIComponent(query)}`),
};

// Messages API
export const messagesApi = {
    searchAll: (query: string) =>
        request<ApiResponse<any[]>>(`/messages/search?q=${encodeURIComponent(query)}`),

    searchInRoom: (roomId: string, query: string) =>
        request<ApiResponse<Message[]>>(
            `/messages/room/${roomId}/search?q=${encodeURIComponent(query)}`
        ),

    getPinned: (roomId: string) =>
        request<ApiResponse<Message[]>>(`/messages/room/${roomId}/pinned`),

    deleteMessage: (id: string) =>
        request<ApiResponse<void>>(`/messages/${id}`, { method: 'DELETE' }),

    editMessage: (id: string, content: string) =>
        request<ApiResponse<Message>>(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ content }),
        }),
};

// Users API
export const usersApi = {
    searchUsers: (query: string) =>
        request<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`),

    getUser: (id: string) => request<ApiResponse<User>>(`/users/${id}`),
};
