"use client";

import { useState, useEffect, useCallback } from "react";

interface HistoryEntry {
    id: string;
    timestamp: number;
    thumbnail: string;
    filename: string;
    width: number;
    height: number;
}

interface HistoryPanelProps {
    onLoadHistory: (imageUrl: string) => void;
}

const MAX_HISTORY = 10;

export default function HistoryPanel({ onLoadHistory }: HistoryPanelProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('normalmap_history');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load history:', e);
        }
    }, []);

    // Save history to localStorage
    const saveHistory = useCallback((entries: HistoryEntry[]) => {
        try {
            localStorage.setItem('normalmap_history', JSON.stringify(entries));
            setHistory(entries);
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    }, []);

    // Add current image to history (called from parent)
    const addToHistory = useCallback((imageUrl: string, filename: string, width: number, height: number) => {
        const entry: HistoryEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            thumbnail: imageUrl,
            filename,
            width,
            height,
        };

        const newHistory = [entry, ...history.filter(h => h.thumbnail !== imageUrl)].slice(0, MAX_HISTORY);
        saveHistory(newHistory);
    }, [history, saveHistory]);

    const removeFromHistory = useCallback((id: string) => {
        const newHistory = history.filter(h => h.id !== id);
        saveHistory(newHistory);
    }, [history, saveHistory]);

    const clearHistory = useCallback(() => {
        saveHistory([]);
    }, [saveHistory]);

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Expose addToHistory to parent via ref or callback
    useEffect(() => {
        (window as any).__addToNormalMapHistory = addToHistory;
        return () => {
            delete (window as any).__addToNormalMapHistory;
        };
    }, [addToHistory]);

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors"
            >
                <span>📜</span>
                <span>History ({history.length})</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 z-50 overflow-hidden">
                        <div className="p-3 border-b border-zinc-700 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">Recent Files</h4>
                                <p className="text-xs text-zinc-400">Click to reload</p>
                            </div>
                            <button
                                onClick={clearHistory}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {history.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="p-2 hover:bg-zinc-700 transition-colors flex items-center gap-3 group"
                                >
                                    <button
                                        onClick={() => {
                                            onLoadHistory(entry.thumbnail);
                                            setIsOpen(false);
                                        }}
                                        className="flex-1 flex items-center gap-3"
                                    >
                                        <img
                                            src={entry.thumbnail}
                                            alt={entry.filename}
                                            className="w-12 h-12 rounded object-cover bg-zinc-900"
                                        />
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="text-sm font-medium truncate">{entry.filename || 'Untitled'}</div>
                                            <div className="text-xs text-zinc-400">
                                                {entry.width}×{entry.height} • {formatTime(entry.timestamp)}
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => removeFromHistory(entry.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
