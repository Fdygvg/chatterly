import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
    onSend: (content: string) => void;
    onTypingStart: () => void;
    onTypingStop: () => void;
    onFileSelect?: (file: File) => void;
    disabled?: boolean;
}

export function ChatInput({
    onSend,
    onTypingStart,
    onTypingStop,
    onFileSelect,
    disabled = false,
}: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTyping = useCallback((value: string) => {
        setMessage(value);

        if (!isTyping && value.length > 0) {
            setIsTyping(true);
            onTypingStart();
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTypingStop();
        }, 2000);
    }, [isTyping, onTypingStart, onTypingStop]);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
            setIsTyping(false);
            onTypingStop();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
        e.target.value = '';
    };

    return (
        <div className="p-4 bg-lavender-mist border-t border-lavender-veil">
            <div className="flex items-end gap-2">
                {/* File attachment */}
                <button
                    onClick={handleFileClick}
                    className="p-3 rounded-full hover:bg-lavender-veil transition-colors text-muted-foreground"
                    title="Attach file"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                />

                {/* Message input */}
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className={cn(
                            'w-full px-4 py-3 rounded-2xl resize-none',
                            'bg-white border border-lavender-veil',
                            'focus:outline-none focus:ring-2 focus:ring-medium-slate-blue/50',
                            'placeholder:text-muted-foreground',
                            'max-h-32',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        style={{ minHeight: '48px' }}
                    />
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className={cn(
                        'p-3 rounded-full transition-all duration-200',
                        message.trim() && !disabled
                            ? 'bg-medium-slate-blue text-white hover:bg-soft-periwinkle'
                            : 'bg-lavender-veil text-muted-foreground cursor-not-allowed'
                    )}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
