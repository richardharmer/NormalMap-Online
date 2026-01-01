"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
                            N
                        </div>
                        <span className="font-bold text-lg text-white">NormalMapGenerator<span className="text-cyan-400">.io</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
                        <Link href="/#generator" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Generator</Link>
                        <Link href="/tutorials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Tutorials</Link>
                        <Link href="/faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">FAQ</Link>
                    </div>
                    <button
                        onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-4 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Start Creating
                    </button>
                </div>
            </div>
        </nav>
    );
}
