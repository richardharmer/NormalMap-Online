"use client";

import { useState, useCallback } from "react";

interface PresetSelectorProps {
    onSelectPreset: (preset: Preset) => void;
}

export interface Preset {
    name: string;
    description: string;
    engine: string;
    icon: string;
    settings: {
        strength: number;
        level: number;
        invertG: boolean;
        zRange: boolean;
    };
}

const presets: Preset[] = [
    {
        name: "Unity Standard",
        description: "Optimized for Unity's Standard shader",
        engine: "Unity",
        icon: "🎮",
        settings: {
            strength: 2.5,
            level: 7,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "Unreal Engine",
        description: "DirectX-style normal maps for UE4/UE5",
        engine: "Unreal",
        icon: "🔷",
        settings: {
            strength: 2.0,
            level: 6,
            invertG: true, // Unreal uses inverted green channel
            zRange: true,
        },
    },
    {
        name: "Blender",
        description: "OpenGL-style for Blender and Cycles",
        engine: "Blender",
        icon: "🍊",
        settings: {
            strength: 2.5,
            level: 7,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "Godot Engine",
        description: "Optimized for Godot 4.x",
        engine: "Godot",
        icon: "🤖",
        settings: {
            strength: 2.0,
            level: 5,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "Three.js / WebGL",
        description: "For web-based 3D applications",
        engine: "Web",
        icon: "🌐",
        settings: {
            strength: 2.5,
            level: 7,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "High Detail",
        description: "Maximum detail for close-up textures",
        engine: "Custom",
        icon: "🔍",
        settings: {
            strength: 4.0,
            level: 9,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "Subtle",
        description: "Gentle effect for smooth surfaces",
        engine: "Custom",
        icon: "✨",
        settings: {
            strength: 1.0,
            level: 4,
            invertG: false,
            zRange: true,
        },
    },
    {
        name: "Tile/Brick",
        description: "Optimized for architectural textures",
        engine: "Custom",
        icon: "🧱",
        settings: {
            strength: 3.0,
            level: 6,
            invertG: false,
            zRange: true,
        },
    },
];

export default function PresetSelector({ onSelectPreset }: PresetSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

    const handleSelect = useCallback((preset: Preset) => {
        setSelectedPreset(preset);
        onSelectPreset(preset);
        setIsOpen(false);
    }, [onSelectPreset]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded text-sm font-medium transition-colors"
            >
                <span>🎯</span>
                <span>{selectedPreset ? selectedPreset.name : "Engine Presets"}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-72 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 z-50 overflow-hidden">
                        <div className="p-3 border-b border-zinc-700">
                            <h4 className="font-bold text-sm">Engine Presets</h4>
                            <p className="text-xs text-zinc-400">Quick settings for popular game engines</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handleSelect(preset)}
                                    className={`w-full p-3 text-left hover:bg-zinc-700 transition-colors flex items-start gap-3 ${selectedPreset?.name === preset.name ? 'bg-zinc-700' : ''
                                        }`}
                                >
                                    <span className="text-2xl">{preset.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{preset.name}</div>
                                        <div className="text-xs text-zinc-400 truncate">{preset.description}</div>
                                        {preset.settings.invertG && (
                                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">
                                                Inverts Green
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
