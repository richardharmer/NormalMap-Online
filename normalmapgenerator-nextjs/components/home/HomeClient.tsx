"use client";

import { useState } from "react";
import NormalMapGenerator from "@/components/generator/NormalMapGenerator";

export default function HomeClient() {
    const [isHovered, setIsHovered] = useState(false);

    const features = [
        {
            icon: "⚡",
            title: "GPU Accelerated",
            description: "Lightning-fast processing using WebGL and your GPU for instant real-time results.",
        },
        {
            icon: "🎨",
            title: "Multiple Map Types",
            description: "Generate Normal, Displacement, Ambient Occlusion, and Specular maps in one go.",
        },
        {
            icon: "🔒",
            title: "100% Private",
            description: "All processing happens locally in your browser. Your files never leave your device.",
        },
        {
            icon: "🎮",
            title: "Game Engine Ready",
            description: "Optimized presets for Unity, Unreal Engine, Godot, and other popular engines.",
        },
        {
            icon: "📸",
            title: "Photo to Normal Map",
            description: "Create normal maps from regular photos using advanced photogrammetry algorithms.",
        },
        {
            icon: "⚙️",
            title: "Fine-Tune Controls",
            description: "Adjust strength, blur, invert channels, and more with real-time preview.",
        },
    ];

    const stats = [
        { value: "50K+", label: "Active Users", icon: "👥" },
        { value: "1M+", label: "Maps Generated", icon: "🖼️" },
        { value: "<1s", label: "Processing Time", icon: "⚡" },
        { value: "4.9", label: "User Rating", icon: "⭐" },
    ];

    const steps = [
        {
            number: "1",
            title: "Upload Your Texture",
            description: "Drag and drop your height map, texture, or photo. Supports PNG, JPG, TGA, and more.",
        },
        {
            number: "2",
            title: "Adjust Settings",
            description: "Fine-tune strength, blur, and other parameters with real-time preview. Use presets for quick results.",
        },
        {
            number: "3",
            title: "Download & Use",
            description: "Export your normal map and use it directly in Unity, Unreal Engine, or any 3D software.",
        },
    ];

    return (
        <main className="min-h-screen bg-grid">
            {/* Background Decoration */}
            <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="badge mb-8 animate-fadeInUp">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                        <span>GPU Powered • 100% Free • No Upload Required</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fadeInUp delay-100">
                        Normal Map Generator
                        <br />
                        <span className="text-gradient">Online</span> & Free
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fadeInUp delay-200">
                        The best <strong>Normal Map Generator Online</strong> for game developers. Create high-quality normal, displacement, AO, and <strong>specular maps</strong> from photos instantly.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp delay-300">
                        <button
                            onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="btn-primary flex items-center gap-2 text-lg"
                        >
                            Start Generating
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <button className="btn-secondary text-lg">
                            View Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto animate-fadeInUp delay-400">
                        {stats.map((stat, index) => (
                            <div key={index} className="card p-5 text-center">
                                <div className="text-2xl mb-1">{stat.icon}</div>
                                <div className="stat-number text-3xl mb-1">{stat.value}</div>
                                <div className="text-sm text-muted">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-lg text-muted max-w-xl mx-auto">
                            Professional-grade tools to create the best quality normal maps for your projects
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card card-gradient p-6 group"
                            >
                                <div className="icon-box mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Generator Tool Area */}
            <section id="generator" className="py-24 px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Try It Now
                        </h2>
                        <p className="text-lg text-muted">
                            Drag and drop your texture or height map to generate a normal map instantly
                        </p>
                    </div>

                    <NormalMapGenerator />
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted">
                            Three simple steps to create professional normal maps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="card p-8 h-full">
                                    <div className="step-number mb-6">{step.number}</div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{step.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Create Amazing Normal Maps?
                            </h2>
                            <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
                                Join thousands of game developers and 3D artists using our free tool
                            </p>
                            <button
                                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary text-lg"
                            >
                                Get Started for Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
