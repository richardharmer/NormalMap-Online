import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
    title: "Privacy Policy | NormalMapGenerator.io",
    description: "Privacy Policy for NormalMapGenerator.io. We respect your privacy and process all images locally on your device.",
    alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

                <div className="text-zinc-300">
                    <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

                    <div className="space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
                            <p>
                                At NormalMapGenerator.io, we prioritize your privacy. This Privacy Policy explains how we handle your data when you use our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Data Processing</h2>
                            <p className="mb-2">
                                <strong>Local Processing:</strong> All image processing (generating normal maps, displacement maps, etc.) is performed strictly <strong>locally on your device (client-side)</strong> using your web browser's capabilities (WebGL).
                            </p>
                            <p>
                                <strong>No Uploads:</strong> Your images are NOT uploaded to our servers. We do not store, view, or have access to any images you drag and drop into the generator.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Analytics</h2>
                            <p>
                                We may use anonymous analytics tools (such as Google Analytics) to understand how visitors interact with our site (e.g., page views, session duration). These tools do not collect personally identifiable information (PII).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Cookies</h2>
                            <p>
                                We use essential cookies to ensure the website functions correctly. Analytics services may also use cookies to track anonymous usage statistics.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:contact@normalmapgenerator.io" className="text-cyan-400 hover:text-cyan-300 font-medium">contact@normalmapgenerator.io</a>
                            </p>
                        </section>

                        <p className="text-sm text-zinc-500 pt-4 border-t border-zinc-800">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
