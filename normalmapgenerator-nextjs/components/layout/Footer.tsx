import Link from 'next/link';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-900 bg-zinc-950 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                N
                            </div>
                            <span className="font-bold text-white">NormalMapGenerator.io</span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            The #1 Free Online Normal Map Generator. Create professional normal maps, displacement maps, and AO maps for Unity, Unreal Engine & Blender directly in your browser.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                            <li><Link href="/#generator" className="hover:text-cyan-400 transition-colors">Generator</Link></li>
                            <li><Link href="/tutorials" className="hover:text-cyan-400 transition-colors">Tutorials</Link></li>
                            <li><Link href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">FAQ & Help</Link></li>
                            <li><Link href="/tutorials" className="hover:text-cyan-400 transition-colors">Workflow Guides</Link></li>
                            <li><a href="https://github.com/NormalMapOnline" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                            <li><a href="mailto:contact@normalmapgenerator.io" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-600">
                        © {year} NormalMapGenerator.io. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {/* Social Icons Placeholder */}
                        <a href="#" className="text-zinc-600 hover:text-white transition-colors" aria-label="Twitter">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                        <a href="#" className="text-zinc-600 hover:text-white transition-colors" aria-label="GitHub">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
