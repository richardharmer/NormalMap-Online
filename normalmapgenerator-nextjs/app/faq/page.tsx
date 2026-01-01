import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
    title: "FAQ - Normal Map & Texture Questions | NormalMapGenerator.io",
    description: "Comprehensive FAQ about Normal Maps, Displacement, AO, Specular maps. Learn how to use them in Unity, Unreal, Blender & Godot.",
    alternates: { canonical: '/faq' },
};

const faqs = [
    // --- General Basic ---
    {
        category: "Basics",
        question: "What is a Normal Map?",
        answer: "A Normal Map is a texture that allows you to simulate high-detail bumps and dents on a low-poly 3D model. It works by storing the surface normal direction in the RGB channels of the image, changing how light reflects off the surface."
    },
    {
        category: "Basics",
        question: "What is the difference between a Normal Map and a Bump Map?",
        answer: "A Bump Map uses grayscale values to indicate height (simpler, older tech), while a Normal Map uses RGB colors to indicate XYZ orientation of the surface normal (modern, more accurate). Normal maps provide much better lighting detail in real-time engines."
    },
    {
        category: "Basics",
        question: "What is a Displacement Map (Height Map)?",
        answer: "A Displacement Map actually modifies the geometry of the mesh (tessellation) based on brightness values. Unlike Normal Maps which are just a lighting trick, Displacement Maps create real silhouettes and depth."
    },
    {
        category: "Basics",
        question: "What is an Ambient Occlusion (AO) Map?",
        answer: "An AO Map simulates the soft shadows that occur in cracks and crevices where light is harder to reach. It adds realism and depth to your texture, usually multiplied over the Albedo/Diffuse map."
    },
    {
        category: "Basics",
        question: "What is a Specular Map?",
        answer: "A Specular Map defines the shininess or reflectivity of a surface. White areas are shiny, black areas are matte. In modern PBR workflows, this is often replaced by 'Roughness' or 'Metallic' maps, but Specular is still used in many shaders."
    },

    // --- Usage & Tool ---
    {
        category: "Tool Usage",
        question: "How do I use this Online Normal Map Generator?",
        answer: "It's simple: 1. Drag and drop your texture (image) into the left panel. 2. The tool instantly generates Normal, Displacement, AO, and Specular maps. 3. Adjust settings like 'Strength' or 'Level' in the center panel. 4. Download your maps."
    },
    {
        category: "Tool Usage",
        question: "Why is this tool better than Photoshop or GIMP plugins?",
        answer: "NormalMapGenerator.io is GPU-accelerated, meaning it runs instantly in your browser without installation. It offers a real-time 3D preview so you can see exactly how the map looks on a 3D model before downloading."
    },
    {
        category: "Tool Usage",
        question: "Is it free for commercial use?",
        answer: "Yes! NormalMapGenerator.io is 100% free for both personal and commercial projects. You don't need to pay or give credit (though we appreciate it!)."
    },
    {
        category: "Tool Usage",
        question: "Are my images uploaded to your server?",
        answer: "No. Your privacy is our priority. All image processing happens locally in your web browser using WebGL. Your files never leave your computer."
    },
    {
        category: "Tool Usage",
        question: "What image formats are supported?",
        answer: "We support all common web image formats including JPG, PNG, WEBP, and BMP. We also support TGA (Targa) files via drag-and-drop."
    },

    // --- Technical & Troubleshooting ---
    {
        category: "Technical",
        question: "My Normal Map looks 'inverted' or weird. Why?",
        answer: "This is usually due to the Green channel direction (Y-axis). OpenGL (Blender, Unity) expects Y+ (Green up), while DirectX (Unreal Engine, 3ds Max) expects Y- (Green down). Use the 'Invert G' checkbox in our tool to switch between them."
    },
    {
        category: "Technical",
        question: "What is the 'Blue' color in a Normal Map?",
        answer: "The blue channel represents the Z-axis (forward/up direction). Since most surface normals points outwards, valid normal maps are predominantly blueish-purple."
    },
    {
        category: "Technical",
        question: "What does the 'Level' slider do?",
        answer: "The 'Level' slider adjusts the detail frequency. A lower level focuses on large shapes, while a higher level picks up fine noise and grain details from the source image."
    },
    {
        category: "Technical",
        question: "Can I generate a Normal Map from a photo of a real object?",
        answer: "Yes! While dedicated scanning hardware is best, our tool uses smart edge detection (Sobel/Scharr filters) to estimate shape from shading in a photo. Make sure your photo is evenly works best."
    },
    {
        category: "Technical",
        question: "Does this tool support batch processing?",
        answer: "Currently, we focus on single-texture processing for maximum quality control. You can quickly drag-and-drop new images one after another as the settings are preserved."
    },

    // --- Engines Integration ---
    {
        category: "Integration",
        question: "How to use the normal map in Unity?",
        answer: "1. Import the texture. 2. Set 'Texture Type' to 'Normal map' in Import Settings. 3. Check 'Create from Grayscale' is OFF (since you already have a normal map). 4. Apply. Uncheck 'Invert G' in our tool for Unity."
    },
    {
        category: "Integration",
        question: "How to use the normal map in Unreal Engine (UE4/UE5)?",
        answer: "Import the texture. Double click it and ensure Compression Settings are 'Normalmap'. IMPORTANT: Unreal uses DirectX format (Y-), so make sure to CHECK 'Invert G' in our generator before downloading."
    },
    {
        category: "Integration",
        question: "How to use in Blender?",
        answer: "In the Shader Editor: Add an 'Image Texture' node with your map. Set Color Space to 'Non-Color'. Connect it to a 'Normal Map' node. Connect that to the 'Normal' input of the BSDF shader. Blender uses OpenGL (Y+), so uncheck 'Invert G'."
    },
    {
        category: "Integration",
        question: "How to use in Godot Engine?",
        answer: "Godot uses OpenGL format (Y+). Import your texture. In your SpatialMaterial, enable 'Normal Map', drag your texture into the slot. No need to invert Green channel."
    },
    {
        category: "Integration",
        question: "Why does my AO map look grainy?",
        answer: "Ensure your source image isn't too noisy. You can try adjusting the 'Blur' setting settings (if available) or pre-blurring your image slightly to get smoother Ambient Occlusion results."
    }
];

export default function FAQPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <Breadcrumb items={[{ label: 'FAQ' }]} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-zinc-400">Everything you need to know about Normal Map generation and workflows.</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded">
                                    {faq.category}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
