"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const Preview3D = dynamic(() => import("./Preview3D"), { ssr: false });

// Types
interface NormalSettings { strength: number; level: number; blur: number; invertR: boolean; invertG: boolean; invertH: boolean; type: 'sobel' | 'scharr'; zRange: boolean; }
interface DispSettings { contrast: number; blur: number; invert: boolean; }
interface AOSettings { strength: number; mean: number; range: number; blur: number; invert: boolean; }
interface SpecSettings { strength: number; mean: number; range: number; falloff: 'none' | 'linear' | 'square'; }
type MapType = 'normal' | 'displacement' | 'ao' | 'specular';
type InputMode = 'heightmap' | 'photos';

const PRESETS = [
    { name: 'Unity', strength: 2.5, level: 7, invertG: false },
    { name: 'Unreal', strength: 2.5, level: 7, invertG: true },
    { name: 'Blender', strength: 2.0, level: 6, invertG: false },
    { name: 'Godot', strength: 2.5, level: 7, invertG: false },
];

const defaultNormal: NormalSettings = { strength: 2.5, level: 7, blur: 0, invertR: false, invertG: false, invertH: false, type: 'sobel', zRange: true };
const defaultDisp: DispSettings = { contrast: -0.5, blur: 0, invert: false };
const defaultAO: AOSettings = { strength: 0.5, mean: 1, range: 1, blur: 0, invert: false };
const defaultSpec: SpecSettings = { strength: 1, mean: 1, range: 1, falloff: 'linear' };

// GPU Normal Map Shader (from original)
const NormalMapShader = {
    uniforms: {
        type: { value: 0 },
        invertR: { value: 1.0 },
        invertG: { value: 1.0 },
        invertH: { value: 1.0 },
        dz: { value: 0.0 },
        dimensions: { value: new THREE.Vector3(0, 0, 0) },
        tHeightMap: { value: null as THREE.Texture | null },
        heightOffset: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec2 step;
        uniform vec3 dimensions;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            step = vec2(-1.0 / dimensions.x, -1.0 / dimensions.y);
            vUv = uv;
        }`,
    fragmentShader: `
        uniform vec3 dimensions;
        varying vec2 vUv;
        varying vec2 step;
        uniform float dz;
        uniform float invertR;
        uniform float invertG;
        uniform float invertH;
        uniform int type;
        uniform sampler2D tHeightMap;
        uniform int heightOffset;
        
        void main(void) {
            vec2 tlv = vec2(vUv.x - step.x, vUv.y + step.y);
            vec2 lv  = vec2(vUv.x - step.x, vUv.y);
            vec2 blv = vec2(vUv.x - step.x, vUv.y - step.y);
            vec2 tv  = vec2(vUv.x, vUv.y + step.y);
            vec2 bv  = vec2(vUv.x, vUv.y - step.y);
            vec2 trv = vec2(vUv.x + step.x, vUv.y + step.y);
            vec2 rv  = vec2(vUv.x + step.x, vUv.y);
            vec2 brv = vec2(vUv.x + step.x, vUv.y - step.y);
            
            tlv = vec2(tlv.x >= 0.0 ? tlv.x : (1.0 + tlv.x), tlv.y >= 0.0 ? tlv.y : (1.0 + tlv.y));
            tlv = vec2(tlv.x < 1.0 ? tlv.x : (tlv.x - 1.0), tlv.y < 1.0 ? tlv.y : (tlv.y - 1.0));
            lv = vec2(lv.x >= 0.0 ? lv.x : (1.0 + lv.x), lv.y >= 0.0 ? lv.y : (1.0 + lv.y));
            lv = vec2(lv.x < 1.0 ? lv.x : (lv.x - 1.0), lv.y < 1.0 ? lv.y : (lv.y - 1.0));
            blv = vec2(blv.x >= 0.0 ? blv.x : (1.0 + blv.x), blv.y >= 0.0 ? blv.y : (1.0 + blv.y));
            blv = vec2(blv.x < 1.0 ? blv.x : (blv.x - 1.0), blv.y < 1.0 ? blv.y : (blv.y - 1.0));
            tv = vec2(tv.x >= 0.0 ? tv.x : (1.0 + tv.x), tv.y >= 0.0 ? tv.y : (1.0 + tv.y));
            tv = vec2(tv.x < 1.0 ? tv.x : (tv.x - 1.0), tv.y < 1.0 ? tv.y : (tv.y - 1.0));
            bv = vec2(bv.x >= 0.0 ? bv.x : (1.0 + bv.x), bv.y >= 0.0 ? bv.y : (1.0 + bv.y));
            bv = vec2(bv.x < 1.0 ? bv.x : (bv.x - 1.0), bv.y < 1.0 ? bv.y : (bv.y - 1.0));
            trv = vec2(trv.x >= 0.0 ? trv.x : (1.0 + trv.x), trv.y >= 0.0 ? trv.y : (1.0 + trv.y));
            trv = vec2(trv.x < 1.0 ? trv.x : (trv.x - 1.0), trv.y < 1.0 ? trv.y : (trv.y - 1.0));
            rv = vec2(rv.x >= 0.0 ? rv.x : (1.0 + rv.x), rv.y >= 0.0 ? rv.y : (1.0 + rv.y));
            rv = vec2(rv.x < 1.0 ? rv.x : (rv.x - 1.0), rv.y < 1.0 ? rv.y : (rv.y - 1.0));
            brv = vec2(brv.x >= 0.0 ? brv.x : (1.0 + brv.x), brv.y >= 0.0 ? brv.y : (1.0 + brv.y));
            brv = vec2(brv.x < 1.0 ? brv.x : (brv.x - 1.0), brv.y < 1.0 ? brv.y : (brv.y - 1.0));
            
            float tl = abs(texture2D(tHeightMap, tlv).r);
            float l = abs(texture2D(tHeightMap, lv).r);
            float bl = abs(texture2D(tHeightMap, blv).r);
            float t = abs(texture2D(tHeightMap, tv).r);
            float b = abs(texture2D(tHeightMap, bv).r);
            float tr = abs(texture2D(tHeightMap, trv).r);
            float r = abs(texture2D(tHeightMap, rv).r);
            float br = abs(texture2D(tHeightMap, brv).r);
            
            float dx = 0.0, dy = 0.0;
            if (type == 0) {
                dx = tl + l * 2.0 + bl - tr - r * 2.0 - br;
                dy = tl + t * 2.0 + tr - bl - b * 2.0 - br;
            } else {
                dx = tl * 3.0 + l * 10.0 + bl * 3.0 - tr * 3.0 - r * 10.0 - br * 3.0;
                dy = tl * 3.0 + t * 10.0 + tr * 3.0 - bl * 3.0 - b * 10.0 - br * 3.0;
            }
            
            vec4 normal = vec4(normalize(vec3(dx * invertR * invertH * 255.0, dy * invertG * invertH * 255.0, dz)), texture2D(tHeightMap, vUv).a);
            gl_FragColor = (heightOffset == 0) ? vec4(normal.xy * 0.5 + 0.5, normal.zw) : vec4(normal.xyz * 0.5 + 0.5, normal.w);
        }`
};

// GPU Normal Map Generator
function genNormalMapGPU(heightImage: HTMLImageElement, s: NormalSettings): HTMLCanvasElement {
    const w = heightImage.naturalWidth || heightImage.width;
    const h = heightImage.naturalHeight || heightImage.height;

    // Create offscreen canvas for result
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    // Create scene and camera
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    const scene = new THREE.Scene();

    // Create texture from height image
    const texture = new THREE.Texture(heightImage);
    texture.needsUpdate = true;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = texture.magFilter = THREE.NearestFilter;

    // Create shader material with original shader
    const uniforms = THREE.UniformsUtils.clone(NormalMapShader.uniforms);
    uniforms.tHeightMap.value = texture;
    uniforms.dimensions.value = new THREE.Vector3(w, h, 0);
    uniforms.dz.value = 1.0 / s.strength * (1.0 + Math.pow(2.0, s.level));
    uniforms.invertR.value = s.invertR ? -1.0 : 1.0;
    uniforms.invertG.value = s.invertG ? -1.0 : 1.0;
    uniforms.invertH.value = s.invertH ? -1.0 : 1.0;
    uniforms.type.value = s.type === 'sobel' ? 0 : 1;
    uniforms.heightOffset.value = s.zRange ? 0 : 1;

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: NormalMapShader.vertexShader,
        fragmentShader: NormalMapShader.fragmentShader,
        transparent: true
    });

    // Create mesh
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Render
    renderer.render(scene, camera);

    // Cleanup
    geometry.dispose();
    material.dispose();
    texture.dispose();
    renderer.dispose();

    return canvas;
}

// CPU-based map generators for Displacement, AO, Specular
function genDispMap(src: HTMLCanvasElement, s: DispSettings): HTMLCanvasElement {
    const ctx = src.getContext('2d')!;
    const { width: w, height: h } = src;
    const img = ctx.getImageData(0, 0, w, h);
    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const oc = out.getContext('2d')!;
    const od = oc.createImageData(w, h);
    const cv = s.contrast * 255, f = (259 * (cv + 255)) / (255 * (259 - cv));
    for (let i = 0; i < img.data.length; i += 4) {
        let g = img.data[i] * 0.299 + img.data[i + 1] * 0.587 + img.data[i + 2] * 0.114;
        if (s.invert) g = 255 - g;
        g = Math.min(255, Math.max(0, f * (g - 128) + 128));
        od.data[i] = od.data[i + 1] = od.data[i + 2] = g; od.data[i + 3] = 255;
    }
    oc.putImageData(od, 0, 0);
    return out;
}

function genAOMap(src: HTMLCanvasElement, s: AOSettings): HTMLCanvasElement {
    const ctx = src.getContext('2d')!;
    const { width: w, height: h } = src;
    const img = ctx.getImageData(0, 0, w, h);
    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const oc = out.getContext('2d')!;
    const od = oc.createImageData(w, h);
    const mean = s.mean * 255, range = s.range * 255;
    for (let i = 0; i < img.data.length; i += 4) {
        let v = img.data[i] * 0.299 + img.data[i + 1] * 0.587 + img.data[i + 2] * 0.114;
        const d = (range - Math.abs(v - mean)) / range;
        v = d > 0 ? Math.sqrt(d) : 0;
        v = v * (1 - s.strength);
        v = s.invert ? v : (1 - v);
        od.data[i] = od.data[i + 1] = od.data[i + 2] = Math.min(255, Math.max(0, v * 255)); od.data[i + 3] = 255;
    }
    oc.putImageData(od, 0, 0);
    return out;
}

function genSpecMap(src: HTMLCanvasElement, s: SpecSettings): HTMLCanvasElement {
    const ctx = src.getContext('2d')!;
    const { width: w, height: h } = src;
    const img = ctx.getImageData(0, 0, w, h);
    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const oc = out.getContext('2d')!;
    const od = oc.createImageData(w, h);
    const mean = s.mean * 255, range = s.range * 255;
    for (let i = 0; i < img.data.length; i += 4) {
        let v = img.data[i] * 0.299 + img.data[i + 1] * 0.587 + img.data[i + 2] * 0.114;
        const d = (range - Math.abs(v - mean)) / range;
        if (s.falloff === 'none') v = d > 0 ? 1 : 0;
        else if (s.falloff === 'linear') v = d > 0 ? d : 0;
        else v = d > 0 ? Math.sqrt(d) : 0;
        v = v * 255 * s.strength;
        od.data[i] = od.data[i + 1] = od.data[i + 2] = Math.min(255, Math.max(0, v)); od.data[i + 3] = 255;
    }
    oc.putImageData(od, 0, 0);
    return out;
}

// UI Components
const Slider = ({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-2 h-7">
        <span className="w-16 text-[11px] text-zinc-400 shrink-0">{label}</span>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-zinc-700 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full" />
        <input type="number" value={value} step={step} onChange={(e) => onChange(parseFloat(e.target.value) || min)}
            className="w-12 px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-center text-[10px] focus:border-cyan-500 focus:outline-none" />
    </div>
);

const Check = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-1 cursor-pointer text-[11px] text-zinc-400 hover:text-white">
        <div onClick={() => onChange(!checked)} className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-zinc-600'}`}>
            {checked && <span className="text-[8px] text-white">✓</span>}
        </div>
        {label}
    </label>
);

// Main Component
export default function NormalMapGenerator() {
    const [inputMode, setInputMode] = useState<InputMode>('heightmap');
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
    const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
    const [imageInfo, setImageInfo] = useState<{ w: number; h: number } | null>(null);
    const [normalMap, setNormalMap] = useState<HTMLCanvasElement | null>(null);
    const [dispMap, setDispMap] = useState<HTMLCanvasElement | null>(null);
    const [aoMap, setAoMap] = useState<HTMLCanvasElement | null>(null);
    const [specMap, setSpecMap] = useState<HTMLCanvasElement | null>(null);
    const [normalS, setNormalS] = useState(defaultNormal);
    const [dispS, setDispS] = useState(defaultDisp);
    const [aoS, setAoS] = useState(defaultAO);
    const [specS, setSpecS] = useState(defaultSpec);
    const [activeMap, setActiveMap] = useState<MapType>('normal');
    const [enabled, setEnabled] = useState({ normal: true, displacement: true, ao: true, specular: true });
    const [preset, setPreset] = useState('Unity');
    const [isDragging, setIsDragging] = useState(false);
    const [filename, setFilename] = useState('texture');
    const fileRef = useRef<HTMLInputElement>(null);

    // Load default heightmap
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setSourceImage(img);
            setSourceUrl('/standard_height.png');
            setImageInfo({ w: img.naturalWidth, h: img.naturalHeight });
            // Create canvas copy for other maps
            const c = document.createElement('canvas');
            c.width = img.naturalWidth; c.height = img.naturalHeight;
            c.getContext('2d')?.drawImage(img, 0, 0);
            setSourceCanvas(c);
        };
        img.src = '/standard_height.png';
    }, []);

    // Generate Normal Map with GPU
    useEffect(() => {
        if (inputMode === 'heightmap' && sourceImage && enabled.normal) {
            console.log('Generating Normal Map with GPU...');
            try {
                const nm = genNormalMapGPU(sourceImage, normalS);
                setNormalMap(nm);
                console.log('Normal Map generated:', nm.width, 'x', nm.height);
            } catch (e) {
                console.error('Error generating normal map:', e);
            }
        }
    }, [sourceImage, normalS, enabled.normal, inputMode]);

    // Generate other maps with CPU
    useEffect(() => {
        if (inputMode === 'heightmap' && sourceCanvas) {
            if (enabled.displacement) setDispMap(genDispMap(sourceCanvas, dispS));
            if (enabled.ao) setAoMap(genAOMap(sourceCanvas, aoS));
            if (enabled.specular) setSpecMap(genSpecMap(sourceCanvas, specS));
        }
    }, [sourceCanvas, dispS, aoS, specS, enabled, inputMode]);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setSourceImage(img);
                setSourceUrl(e.target?.result as string);
                setImageInfo({ w: img.naturalWidth, h: img.naturalHeight });
                const c = document.createElement('canvas');
                c.width = img.naturalWidth; c.height = img.naturalHeight;
                c.getContext('2d')?.drawImage(img, 0, 0);
                setSourceCanvas(c);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    const applyPreset = (name: string) => {
        const p = PRESETS.find(x => x.name === name);
        if (p) { setPreset(name); setNormalS(prev => ({ ...prev, strength: p.strength, level: p.level, invertG: p.invertG })); }
    };

    const download = (c: HTMLCanvasElement, name: string) => { const a = document.createElement('a'); a.download = `${name}.png`; a.href = c.toDataURL('image/png'); a.click(); };
    const downloadCurrent = () => { const m = { normal: normalMap, displacement: dispMap, ao: aoMap, specular: specMap }; if (m[activeMap]) download(m[activeMap]!, `${filename}_${activeMap}`); };
    const downloadAll = () => {
        if (enabled.normal && normalMap) download(normalMap, `${filename}_normal`);
        if (enabled.displacement && dispMap) download(dispMap, `${filename}_displacement`);
        if (enabled.ao && aoMap) download(aoMap, `${filename}_ao`);
        if (enabled.specular && specMap) download(specMap, `${filename}_specular`);
    };

    const mapBg: Record<MapType, string> = { normal: 'linear-gradient(135deg,#6366f1,#8b5cf6)', displacement: '#111', ao: '#111', specular: '#111' };

    return (
        <div className="w-full h-[560px] bg-gradient-to-br from-[#0d0d15] to-[#08080c] rounded-2xl overflow-hidden border border-zinc-800/50 shadow-2xl flex flex-col">
            {/* TOOLBAR */}
            <div className="h-11 bg-black/40 border-b border-zinc-800/50 flex items-center px-4 gap-3 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider">PRESETS</span>
                </div>
                <div className="flex bg-zinc-900/60 rounded-lg p-0.5">
                    {PRESETS.map((p) => (
                        <button key={p.name} onClick={() => applyPreset(p.name)}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${preset === p.name ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'text-zinc-500 hover:text-white'}`}>
                            {p.name}
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <div className="flex gap-1.5 text-[10px]">
                    {(['normal', 'displacement', 'ao', 'specular'] as MapType[]).map((t) => (
                        <span key={t} onClick={() => setEnabled({ ...enabled, [t]: !enabled[t] })}
                            className={`px-2 py-0.5 rounded cursor-pointer transition-all ${enabled[t] ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>
                            {t === 'ao' ? 'AO' : t.charAt(0).toUpperCase() + t.slice(1, 4)}
                        </span>
                    ))}
                </div>
            </div>

            {/* MAIN - 3 Equal Columns */}
            <div className="flex-1 grid grid-cols-3 gap-3 p-3 min-h-0">
                {/* COL 1: Source + Settings */}
                <div className="flex flex-col gap-2 min-h-0">
                    {/* Mode Toggle */}
                    <div className="flex bg-zinc-900/50 rounded-lg p-0.5 shrink-0">
                        <button onClick={() => setInputMode('heightmap')}
                            className={`flex-1 py-1 rounded text-[10px] font-medium ${inputMode === 'heightmap' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                            🖼 HeightMap
                        </button>
                        <button onClick={() => setInputMode('photos')}
                            className={`flex-1 py-1 rounded text-[10px] font-medium ${inputMode === 'photos' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                            📷 4 Photos
                        </button>
                    </div>

                    {/* Source */}
                    <div className="bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-2 flex-1 flex flex-col min-h-0">
                        <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onClick={() => fileRef.current?.click()}
                            className={`flex-1 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${isDragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                            {sourceUrl ? <img src={sourceUrl} alt="Source" className="max-w-full max-h-full object-contain" /> : <span className="text-zinc-600 text-xs">Drop or Click</span>}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                        {imageInfo && <div className="text-[10px] text-zinc-600 text-center mt-1">{imageInfo.w}×{imageInfo.h}</div>}
                    </div>

                    {/* Settings */}
                    <div className="bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-2 shrink-0">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-semibold text-cyan-500 uppercase">{activeMap} Settings</span>
                            <button onClick={() => { if (activeMap === 'normal') setNormalS(defaultNormal); else if (activeMap === 'displacement') setDispS(defaultDisp); else if (activeMap === 'ao') setAoS(defaultAO); else setSpecS(defaultSpec); }}
                                className="text-[9px] text-zinc-500 hover:text-cyan-400">Reset</button>
                        </div>
                        <div className="space-y-0.5">
                            {activeMap === 'normal' && (
                                <>
                                    <Slider label="Strength" value={normalS.strength} min={0.1} max={5} step={0.1} onChange={(v) => setNormalS({ ...normalS, strength: v })} />
                                    <Slider label="Level" value={normalS.level} min={0} max={10} step={1} onChange={(v) => setNormalS({ ...normalS, level: v })} />
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-[10px] text-zinc-500">Filter:</span>
                                        <select value={normalS.type} onChange={(e) => setNormalS({ ...normalS, type: e.target.value as any })}
                                            className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-[10px]">{['sobel', 'scharr'].map(t => <option key={t}>{t}</option>)}</select>
                                        <span className="text-[10px] text-zinc-500 ml-1">Invert:</span>
                                        <Check label="R" checked={normalS.invertR} onChange={(v) => setNormalS({ ...normalS, invertR: v })} />
                                        <Check label="G" checked={normalS.invertG} onChange={(v) => setNormalS({ ...normalS, invertG: v })} />
                                        <Check label="H" checked={normalS.invertH} onChange={(v) => setNormalS({ ...normalS, invertH: v })} />
                                    </div>
                                    <Check label="Z Range: -1 to +1" checked={normalS.zRange} onChange={(v) => setNormalS({ ...normalS, zRange: v })} />
                                </>
                            )}
                            {activeMap === 'displacement' && (
                                <>
                                    <Slider label="Contrast" value={dispS.contrast} min={-1} max={1} step={0.1} onChange={(v) => setDispS({ ...dispS, contrast: v })} />
                                    <Check label="Invert" checked={dispS.invert} onChange={(v) => setDispS({ ...dispS, invert: v })} />
                                </>
                            )}
                            {activeMap === 'ao' && (
                                <>
                                    <Slider label="Strength" value={aoS.strength} min={0} max={2} step={0.1} onChange={(v) => setAoS({ ...aoS, strength: v })} />
                                    <Slider label="Mean" value={aoS.mean} min={0} max={2} step={0.1} onChange={(v) => setAoS({ ...aoS, mean: v })} />
                                    <Slider label="Range" value={aoS.range} min={0} max={2} step={0.1} onChange={(v) => setAoS({ ...aoS, range: v })} />
                                    <Check label="Invert" checked={aoS.invert} onChange={(v) => setAoS({ ...aoS, invert: v })} />
                                </>
                            )}
                            {activeMap === 'specular' && (
                                <>
                                    <Slider label="Strength" value={specS.strength} min={0} max={3} step={0.1} onChange={(v) => setSpecS({ ...specS, strength: v })} />
                                    <Slider label="Mean" value={specS.mean} min={0} max={2} step={0.1} onChange={(v) => setSpecS({ ...specS, mean: v })} />
                                    <Slider label="Range" value={specS.range} min={0} max={2} step={0.1} onChange={(v) => setSpecS({ ...specS, range: v })} />
                                    <div className="flex items-center gap-2"><span className="text-[10px] text-zinc-500">Falloff:</span>
                                        <select value={specS.falloff} onChange={(e) => setSpecS({ ...specS, falloff: e.target.value as any })}
                                            className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-[10px]">{['none', 'linear', 'square'].map(t => <option key={t}>{t}</option>)}</select>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 2: Preview */}
                <div className="flex flex-col gap-2 min-h-0">
                    {/* Tabs */}
                    <div className="flex gap-1 shrink-0">
                        {(['normal', 'displacement', 'ao', 'specular'] as MapType[]).filter(m => enabled[m]).map((t) => (
                            <button key={t} onClick={() => setActiveMap(t)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeMap === t ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg' : 'bg-zinc-800/50 text-zinc-500 hover:text-white'}`}>
                                {t === 'ao' ? 'AO' : t === 'displacement' ? 'Disp' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-0" style={{ background: mapBg[activeMap] }}>
                        {(() => {
                            const map = { normal: normalMap, displacement: dispMap, ao: aoMap, specular: specMap }[activeMap];
                            if (map) {
                                try {
                                    return <img src={map.toDataURL()} alt={activeMap} className="max-w-full max-h-full object-contain" />;
                                } catch (e) {
                                    return <span className="text-red-500">Error rendering</span>;
                                }
                            }
                            return <span className="text-zinc-600 animate-pulse">Processing...</span>;
                        })()}
                    </div>

                    {/* Download */}
                    <div className="flex gap-1.5 shrink-0">
                        <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="filename"
                            className="flex-1 px-2 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-[11px] focus:border-cyan-500 focus:outline-none" />
                        <button onClick={downloadCurrent} className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-[11px] font-semibold rounded-lg">Download</button>
                        <button onClick={downloadAll} className="px-2 py-1.5 bg-zinc-800 text-zinc-300 text-[11px] rounded-lg border border-zinc-700">All</button>
                    </div>
                </div>

                {/* COL 3: 3D Preview */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-2 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <span className="text-[11px] font-semibold text-zinc-400">3D Preview</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-500 rounded">GPU</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Preview3D normalMap={normalMap} displacementMap={dispMap} aoMap={aoMap} specularMap={specMap} diffuseMap={sourceCanvas} />
                    </div>
                </div>
            </div>
        </div>
    );
}
