import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
    title: "Tutorials | How to Use NormalMapGenerator.io",
    description: "Learn how to generate normal maps from photos and textures. Step-by-step tutorials for Unity, Unreal Engine, and Blender workflows.",
    alternates: { canonical: '/tutorials' },
};

const tutorials = [
    {
        title: "Getting Started: From Image to Normal Map",
        difficulty: "Beginner",
        content: (
            <>
                <p>Generating a normal map is simple:</p>
                <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                    <li><strong>Drag & Drop:</strong> Drag your source image (diffuse texture or height map) into the left panel.</li>
                    <li><strong>Preview:</strong> The center panel shows your generated map. The right panel shows a 3D real-time preview.</li>
                    <li><strong>Adjust:</strong> Use the "Normal Settings" in the center column to adjust Strength and Level. Higher strength makes the bumps more visible.</li>
                    <li><strong>Download:</strong> Click the "Download" button to save your normal map as a PNG file.</li>
                </ol>
            </>
        )
    },
    {
        title: "Using in Unity 3D",
        difficulty: "Intermediate",
        content: (
            <>
                <p>Once you have downloaded your maps:</p>
                <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                    <li>Import the normal map image into your Unity project assets.</li>
                    <li>Select the image in Unity inspector and change "Texture Type" to <strong>Normal map</strong>.</li>
                    <li>Click "Apply".</li>
                    <li>Create a new Material (Standard Shader).</li>
                    <li>Drag your normal map into the <strong>Normal Map</strong> slot of the material.</li>
                </ol>
            </>
        )
    },
    {
        title: "Creating Displacement Maps (Height Maps)",
        difficulty: "Advanced",
        content: (
            <>
                <p>Displacement maps physically displace geometry (tessellation) for deeper details.</p>
                <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                    <li>In the generator, click the <strong>Displacement</strong> (or 'Disp') tab in the settings column.</li>
                    <li>Adjust the <strong>Contrast</strong> to separate highs and lows.</li>
                    <li>Check the <strong>Invert</strong> box if you want dark areas to pop out instead of light areas.</li>
                    <li>Download the map and use it in your shader's Height/Displacement slot.</li>
                </ol>
            </>
        )
    },
    {
        title: "Generating Maps from Photos",
        difficulty: "Intermediate",
        content: (
            <>
                <p>If you don't have a texture but just a photo:</p>
                <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                    <li>Switch the input mode to <strong>"4 Photos"</strong> if you have multiple lighting angles, or stick to <strong>"HeightMap"</strong> for a single photo.</li>
                    <li>For single photos, the tool uses an algorithm to estimate height based on brightness.</li>
                    <li>Best results come from photos with even lighting. Avoid strong shadows in the source photo.</li>
                </ol>
            </>
        )
    }
];

export default function TutorialsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <Breadcrumb items={[{ label: 'Tutorials' }]} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Tutorials & Guides</h1>
                    <p className="text-zinc-400">Master the art of texture generation for your games and 3D art.</p>
                </div>

                <div className="grid gap-8">
                    {tutorials.map((tutorial, index) => (
                        <article key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
                                <h2 className="text-xl font-bold text-white">{tutorial.title}</h2>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${tutorial.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {tutorial.difficulty}
                                </span>
                            </div>
                            <div className="p-6 text-zinc-300 leading-relaxed space-y-4">
                                {tutorial.content}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-zinc-400 mb-4">Ready to try it out?</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Go to Generator
                    </Link>
                </div>
            </div>
        </div>
    );
}
