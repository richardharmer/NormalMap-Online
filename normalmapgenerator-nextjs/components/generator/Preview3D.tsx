"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry.js";

interface Preview3DProps {
    normalMap: HTMLCanvasElement | null;
    displacementMap: HTMLCanvasElement | null;
    aoMap: HTMLCanvasElement | null;
    specularMap: HTMLCanvasElement | null;
    diffuseMap?: HTMLCanvasElement | null;
}

type ModelType = 'Cube' | 'Sphere' | 'Plane' | 'Cylinder' | 'Teapot' | 'Custom';

export default function Preview3D({
    normalMap, displacementMap, aoMap, specularMap, diffuseMap,
}: Preview3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const animationRef = useRef<number | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const customModelRef = useRef<THREE.BufferGeometry | null>(null);

    const [model, setModel] = useState<ModelType>('Cube');
    const [autoRotate, setAutoRotate] = useState(true);
    const [showNormal, setShowNormal] = useState(true);
    const [showDisp, setShowDisp] = useState(true); // Default ON
    const [showAO, setShowAO] = useState(true);
    const [showSpec, setShowSpec] = useState(true);
    const [showDiffuse, setShowDiffuse] = useState(false);
    const [showEnv, setShowEnv] = useState(false);
    const [dispScale, setDispScale] = useState(0.3);

    // Initialize scene
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const size = Math.min(container.clientWidth, container.clientHeight) || 300;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        sceneRef.current = scene;

        // Camera - match original (fov 30, z=29)
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100000);
        camera.position.z = 29;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        // Lights - match original
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1.75, 1).multiplyScalar(50);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        // Env Map
        const cubeLoader = new THREE.CubeTextureLoader();
        cubeLoader.setPath('/cubemaps/park/');
        const textureCube = cubeLoader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);
        scene.environment = textureCube;

        // Animation
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            if (meshRef.current && autoRotate) {
                meshRef.current.rotation.x += 0.0015;
                meshRef.current.rotation.y += 0.0015;
            }
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const resize = () => {
            const nSize = Math.min(container.clientWidth, container.clientHeight) || 300;
            camera.aspect = 1;
            camera.updateProjectionMatrix();
            renderer.setSize(nSize, nSize);
        };
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, []);

    // Create Mesh
    const createMesh = useCallback(() => {
        if (!sceneRef.current) return;
        if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
            meshRef.current.geometry.dispose();
            (meshRef.current.material as THREE.Material).dispose();
        }

        let geo: THREE.BufferGeometry;
        if (model === 'Custom' && customModelRef.current) {
            geo = customModelRef.current;
        } else {
            switch (model) {
                case 'Cube': geo = new THREE.BoxGeometry(10, 10, 10, 128, 128, 128); break;
                case 'Sphere': geo = new THREE.SphereGeometry(7, 128, 128); break;
                case 'Plane': geo = new THREE.PlaneGeometry(12, 12, 128, 128); break;
                case 'Cylinder': geo = new THREE.CylinderGeometry(7, 7, 10, 128); break;
                case 'Teapot': geo = new TeapotGeometry(5, 15, true, true, true, true, true); break;
                default: geo = new THREE.BoxGeometry(10, 10, 10, 128, 128, 128);
            }
        }

        // Ensure UV2 for AO
        if (!geo.attributes.uv2 && geo.attributes.uv) geo.setAttribute('uv2', geo.attributes.uv);

        // Standard Phong Material
        const mat = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: 0x444444,
            shininess: 30,
            side: model === 'Plane' ? THREE.DoubleSide : THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (model === 'Plane') {
            mesh.rotation.set(0, 0, 0);
            if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 29);
                cameraRef.current.lookAt(0, 0, 0);
            }
        }

        meshRef.current = mesh;
        sceneRef.current.add(mesh);

    }, [model]);

    useEffect(() => { createMesh(); }, [createMesh]);

    // Update Textures & Material Properties
    useEffect(() => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material as THREE.MeshPhongMaterial;

        // Normal Map
        if (showNormal && normalMap) {
            const tex = new THREE.CanvasTexture(normalMap);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            mat.normalMap = tex;
            mat.normalScale.set(1, 1);
        } else { mat.normalMap = null; }

        // Displacement Map
        if (showDisp && displacementMap) {
            const tex = new THREE.CanvasTexture(displacementMap);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            mat.displacementMap = tex;
            mat.displacementScale = -dispScale;
            mat.displacementBias = 0;
        } else { mat.displacementMap = null; mat.displacementScale = 0; }

        // AO Map
        if (showAO && aoMap) {
            const tex = new THREE.CanvasTexture(aoMap);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            mat.aoMap = tex;
            mat.aoMapIntensity = 1;
        } else { mat.aoMap = null; }

        // Specular Map
        if (showSpec && specularMap) {
            const tex = new THREE.CanvasTexture(specularMap);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            mat.specularMap = tex;
        } else { mat.specularMap = null; }

        // Diffuse Map
        if (showDiffuse && diffuseMap) {
            const tex = new THREE.CanvasTexture(diffuseMap);
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.colorSpace = THREE.SRGBColorSpace;
            mat.map = tex;
        } else { mat.map = null; }

        // Environment Map
        if (showEnv && sceneRef.current?.environment) {
            mat.envMap = sceneRef.current.environment;
            mat.reflectivity = 0.5;
            mat.combine = THREE.MixOperation;
        } else {
            mat.envMap = null;
        }

        mat.needsUpdate = true;
    }, [normalMap, displacementMap, aoMap, specularMap, diffuseMap, showNormal, showDisp, showAO, showSpec, showDiffuse, showEnv, dispScale]);

    // Load Custom Model
    const handleCustomModel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            const loader = new OBJLoader();
            try {
                const group = loader.parse(content);
                group.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        customModelRef.current = child.geometry;
                        setModel('Custom');
                    }
                });
            } catch (err) {
                console.error("Failed to load OBJ", err);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="h-full flex flex-col gap-2">
            {/* 3D Canvas */}
            <div ref={containerRef} className="flex-1 rounded-lg overflow-hidden bg-black min-h-[180px] flex items-center justify-center relative">
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
                    <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900/80 text-zinc-400 rounded border border-zinc-800">{model}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-1.5 text-[10px]">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                    <span className="w-8 text-zinc-500">Model</span>
                    <select value={model} onChange={(e) => setModel(e.target.value as ModelType)}
                        className="flex-1 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] focus:outline-none focus:border-cyan-500">
                        <option value="Cube">Cube</option>
                        <option value="Sphere">Sphere</option>
                        <option value="Plane">Plane</option>
                        <option value="Cylinder">Cylinder</option>
                        <option value="Teapot">Teapot</option>
                        <option value="Custom">Custom...</option>
                    </select>
                    {model === 'Custom' && <input type="file" accept=".obj" onChange={handleCustomModel} className="hidden" id="custom-model-upload" />}
                    {model === 'Custom' && <label htmlFor="custom-model-upload" className="px-1.5 py-0.5 bg-zinc-800 border-zinc-700 border rounded cursor-pointer hover:bg-zinc-700">Load</label>}
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-cyan-500 checked:border-cyan-500" />
                        Rot
                    </label>
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={showDiffuse} onChange={(e) => setShowDiffuse(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-white checked:border-white" />
                        Diff
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={showNormal} onChange={(e) => setShowNormal(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-indigo-500 checked:border-indigo-500" />
                        Norm
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={showAO} onChange={(e) => setShowAO(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-emerald-500 checked:border-emerald-500" />
                        AO
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={showSpec} onChange={(e) => setShowSpec(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-yellow-500 checked:border-yellow-500" />
                        Spec
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white">
                        <input type="checkbox" checked={showEnv} onChange={(e) => setShowEnv(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-blue-400 checked:border-blue-400" />
                        Env
                    </label>
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-1">
                    <label className="flex items-center gap-1 cursor-pointer text-zinc-400 hover:text-white min-w-[36px]">
                        <input type="checkbox" checked={showDisp} onChange={(e) => setShowDisp(e.target.checked)} className="w-3 h-3 rounded border border-zinc-600 bg-zinc-800 appearance-none cursor-pointer checked:bg-orange-500 checked:border-orange-500" />
                        Disp
                    </label>
                    <input type="range" min="-1" max="1" step="0.01" value={dispScale} onChange={(e) => setDispScale(parseFloat(e.target.value))} disabled={!showDisp}
                        className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer disabled:opacity-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full" />
                    <span className="text-zinc-500 w-6 text-right whitespace-nowrap">{dispScale.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
